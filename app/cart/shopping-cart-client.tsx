"use client"

import { useEffect, useState, useCallback } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react"
import {
  getCart,
  removeFromCart,
  updateCartItemQuantity,
  clearCart,
  formatPrice,
  getCartItemCount,
} from "@/lib/shop"
import type { CartItem } from "@/lib/shop"

export function ShoppingCartClient() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Load cart from localStorage
  useEffect(() => {
    const cart = getCart()
    setCartItems(cart)
    setIsLoading(false)

    // Listen for cart updates
    const handleCartUpdate = (event: Event) => {
      const customEvent = event as CustomEvent
      setCartItems(customEvent.detail)
    }

    window.addEventListener("cart-updated", handleCartUpdate)
    return () => window.removeEventListener("cart-updated", handleCartUpdate)
  }, [])

  const handleRemove = useCallback((productId: string) => {
    removeFromCart(productId)
  }, [])

  const handleQuantityChange = useCallback((productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      handleRemove(productId)
    } else {
      updateCartItemQuantity(productId, newQuantity)
    }
  }, [handleRemove])

  const hasPhysical = cartItems.some((item) => item.productType === "physical")
  const shippingFee = hasPhysical ? 1500 : 0
  const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
  const total = subtotal + shippingFee

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (cartItems.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-muted-foreground p-12 text-center">
        <ShoppingBag className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
        <h2 className="mb-2 text-xl font-semibold">Your cart is empty</h2>
        <p className="mb-6 text-muted-foreground">Start shopping to add items to your cart</p>
        <Button asChild>
          <Link href="/shop">Continue Shopping</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      {/* Cart Items */}
      <div className="lg:col-span-2 space-y-4">
        {cartItems.map((item) => (
          <Card key={item.productId} className="p-4">
            <div className="flex gap-4">
              {/* Product Image */}
              <div className="relative h-24 w-24 shrink-0 rounded bg-muted">
                {item.image_url ? (
                  <Image
                    src={item.image_url}
                    alt={item.productName}
                    fill
                    className="object-cover rounded"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
                    No Image
                  </div>
                )}
              </div>

              {/* Product Details */}
              <div className="flex flex-1 flex-col justify-between">
                <div>
                  <h3 className="font-semibold">{item.productName}</h3>
                  <p className="text-sm text-muted-foreground capitalize">{item.productType}</p>
                </div>

                <div className="flex items-center justify-between">
                  <span className="font-semibold">{formatPrice(item.price)}</span>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <Input
                      type="number"
                      min={1}
                      value={item.quantity}
                      onChange={(e) =>
                        handleQuantityChange(item.productId, parseInt(e.target.value) || 1)
                      }
                      className="h-8 w-12 text-center"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Remove Button */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemove(item.productId)}
                    className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Line Total */}
            <div className="mt-4 flex justify-end border-t pt-4">
              <div className="flex gap-4">
                <span className="text-muted-foreground">
                  {item.quantity} × {formatPrice(item.price)}
                </span>
                <span className="font-semibold">{formatPrice(item.price * item.quantity)}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Order Summary */}
      <div>
        <Card className="sticky top-4 p-6">
          <h3 className="mb-4 text-lg font-semibold">Order Summary</h3>

          <div className="space-y-3 text-sm">
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

            <Separator />

            <div className="flex justify-between text-base font-semibold">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            <Button asChild className="w-full">
              <Link href="/checkout">Proceed to Checkout</Link>
            </Button>

            <Button variant="outline" asChild className="w-full">
              <Link href="/shop">Continue Shopping</Link>
            </Button>
          </div>

          <div className="mt-4 space-y-2 border-t pt-4 text-xs text-muted-foreground">
            <p>✓ Secure checkout</p>
            <p>✓ Powered by Paystack</p>
            {hasPhysical && <p>✓ Free shipping for digital-only orders</p>}
          </div>
        </Card>
      </div>
    </div>
  )
}
