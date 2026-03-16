"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { AlertCircle, Loader2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { getCart, formatPrice, clearCart } from "@/lib/shop"
import type { CartItem } from "@/lib/shop"

interface FormData {
  fullName: string
  email: string
  phone: string
  address: string
}

interface PromoCode {
  id: string
  discountType: "percentage" | "fixed"
  discountValue: number
}

export function CheckoutClient() {
  const router = useRouter()
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    phone: "",
    address: "",
  })
  const [promoCode, setPromoCode] = useState("")
  const [appliedPromo, setAppliedPromo, ] = useState<PromoCode | null>(null)
  const [promoError, setPromoError] = useState("")
  const [isValidatingPromo, setIsValidatingPromo] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [errors, setErrors] = useState<Partial<FormData>>({})
  const [error, setError] = useState("")

  // Load cart
  useEffect(() => {
    const cart = getCart()
    if (cart.length === 0) {
      router.push("/cart")
    }
    setCartItems(cart)
  }, [router])

  // Calculate totals
  const hasPhysical = cartItems.some((item) => item.productType === "physical")
  const shippingFee = hasPhysical ? 1500 : 0
  const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0)

  const discountAmount = appliedPromo
    ? appliedPromo.discountType === "percentage"
      ? (subtotal * appliedPromo.discountValue) / 100
      : appliedPromo.discountValue
    : 0

  const total = Math.max(0, subtotal + shippingFee - discountAmount)

  // Validate promo code
  const handleApplyPromo = useCallback(async () => {
    if (!promoCode.trim()) {
      setPromoError("Please enter a promo code")
      return
    }

    setIsValidatingPromo(true)
    setPromoError("")

    try {
      const response = await fetch("/api/shop/validate-promo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: promoCode }),
      })

      const data = await response.json()

      if (!response.ok) {
        setPromoError(data.error || "Invalid promo code")
        setAppliedPromo(null)
        return
      }

      setAppliedPromo({
        id: data.id,
        discountType: data.discountType,
        discountValue: data.discountValue,
      })
      setPromoError("")
    } catch (err) {
      setPromoError("Failed to validate promo code. Please try again.")
      setAppliedPromo(null)
    } finally {
      setIsValidatingPromo(false)
    }
  }, [promoCode])

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {}

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required"
    }
    if (!formData.email.trim() || !/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Valid email is required"
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required"
    }
    if (hasPhysical && !formData.address.trim()) {
      newErrors.address = "Delivery address is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle checkout
  const handleCheckout = useCallback(async () => {
    if (!validateForm()) {
      return
    }

    setIsProcessing(true)
    setError("")

    try {
      const response = await fetch("/api/shop/orders/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cartItems.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
          })),
          customerName: formData.fullName,
          customerEmail: formData.email,
          customerPhone: formData.phone,
          deliveryAddress: hasPhysical ? formData.address : null,
          promoCodeId: appliedPromo?.id,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Failed to initialize payment")
        return
      }

      // Clear cart and redirect to Paystack
      clearCart()

      if (data.authorizationUrl) {
        // Redirect to Paystack payment page
        window.location.href = data.authorizationUrl
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred. Please try again.")
    } finally {
      setIsProcessing(false)
    }
  }, [cartItems, formData, appliedPromo, hasPhysical, validateForm])

  if (cartItems.length === 0) {
    return null
  }

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      {/* Checkout Form */}
      <div className="lg:col-span-2 space-y-6">
        {/* Error Alert */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Customer Information */}
        <Card className="p-6">
          <h3 className="mb-4 text-lg font-semibold">Customer Information</h3>
          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium">Full Name *</label>
              <Input
                placeholder="John Doe"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className={errors.fullName ? "border-destructive" : ""}
              />
              {errors.fullName && (
                <p className="mt-1 text-xs text-destructive">{errors.fullName}</p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">Email *</label>
              <Input
                type="email"
                placeholder="john@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className={errors.email ? "border-destructive" : ""}
              />
              {errors.email && (
                <p className="mt-1 text-xs text-destructive">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">Phone Number *</label>
              <Input
                type="tel"
                placeholder="+234 800 000 0000"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className={errors.phone ? "border-destructive" : ""}
              />
              {errors.phone && (
                <p className="mt-1 text-xs text-destructive">{errors.phone}</p>
              )}
            </div>

            {hasPhysical && (
              <div>
                <label className="mb-2 block text-sm font-medium">Delivery Address *</label>
                <textarea
                  placeholder="Enter your delivery address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className={`min-h-24 w-full rounded-md border bg-background px-3 py-2 text-sm ${
                    errors.address ? "border-destructive" : "border-input"
                  }`}
                />
                {errors.address && (
                  <p className="mt-1 text-xs text-destructive">{errors.address}</p>
                )}
              </div>
            )}
          </div>
        </Card>

        {/* Promo Code */}
        <Card className="p-6">
          <h3 className="mb-4 text-lg font-semibold">Promo Code</h3>
          <div className="space-y-3">
            <div className="flex gap-2">
              <Input
                placeholder="Enter promo code"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                disabled={isValidatingPromo || !!appliedPromo}
              />
              <Button
                variant="outline"
                onClick={handleApplyPromo}
                disabled={isValidatingPromo || !!appliedPromo}
              >
                {isValidatingPromo ? <Loader2 className="h-4 w-4 animate-spin" /> : "Apply"}
              </Button>
            </div>

            {appliedPromo && (
              <div className="rounded-lg bg-green-50 p-3 text-sm text-green-800">
                ✓ Promo code applied successfully! Discount: {formatPrice(discountAmount)}
              </div>
            )}

            {promoError && (
              <div className="text-xs text-destructive">{promoError}</div>
            )}
          </div>
        </Card>
      </div>

      {/* Order Summary */}
      <div>
        <Card className="sticky top-4 p-6 space-y-4">
          <h3 className="text-lg font-semibold">Order Summary</h3>

          {/* Items List */}
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {cartItems.map((item) => (
              <div key={item.productId} className="flex gap-3 rounded bg-muted p-2">
                <div className="relative h-12 w-12 shrink-0 rounded overflow-hidden">
                  {item.image_url ? (
                    <Image
                      src={item.image_url}
                      alt={item.productName}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="h-full w-full bg-muted-foreground/20" />
                  )}
                </div>
                <div className="flex-1 text-xs">
                  <p className="line-clamp-1 font-semibold">{item.productName}</p>
                  <p className="text-muted-foreground">
                    {item.quantity} × {formatPrice(item.price)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <Separator />

          {/* Totals */}
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>

            {hasPhysical && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span>{formatPrice(shippingFee)}</span>
              </div>
            )}

            {appliedPromo && (
              <div className="flex justify-between text-green-600">
                <span>Discount</span>
                <span>-{formatPrice(discountAmount)}</span>
              </div>
            )}

            <Separator />

            <div className="flex justify-between text-base font-semibold">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>
          </div>

          {/* Checkout Button */}
          <Button
            onClick={handleCheckout}
            disabled={isProcessing}
            className="w-full"
            size="lg"
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              `Pay with Paystack - ${formatPrice(total)}`
            )}
          </Button>

          <Button variant="outline" asChild className="w-full">
            <Link href="/cart">Back to Cart</Link>
          </Button>

          <div className="pt-4 border-t text-xs text-muted-foreground space-y-1">
            <p>✓ Secure Paystack payment</p>
            <p>✓ 256-bit SSL encryption</p>
            <p>✓ Your data is protected</p>
          </div>
        </Card>
      </div>
    </div>
  )
}
