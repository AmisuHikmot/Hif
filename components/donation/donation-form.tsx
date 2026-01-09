"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/contexts/auth-context"
import { Loader2, CheckCircle } from "lucide-react"

export default function DonationForm() {
  const { user, profile } = useAuth()
  const { toast } = useToast()

  const [donationType, setDonationType] = useState("one-time")
  const [amount, setAmount] = useState("")
  const [customAmount, setCustomAmount] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [paystackLoaded, setPaystackLoaded] = useState(false)

  const [formData, setFormData] = useState({
    donorName: profile ? `${profile.first_name} ${profile.last_name}` : "",
    donorEmail: user?.email || "",
    donorPhone: profile?.phone || "",
    purpose: "",
    isAnonymous: false,
  })

  useEffect(() => {
    const script = document.createElement("script")
    script.src = "https://js.paystack.co/v1/inline.js"
    script.onload = () => setPaystackLoaded(true)
    document.body.appendChild(script)
  }, [])

  const handleAmountSelect = (value: string) => {
    setAmount(value)
    setCustomAmount("")
  }

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomAmount(e.target.value)
    setAmount("custom")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)
    setError(null)

    const finalAmount = amount === "custom" ? Number.parseFloat(customAmount) : Number.parseFloat(amount)

    if (!finalAmount || finalAmount <= 0) {
      setError("Please select or enter a valid donation amount")
      setIsProcessing(false)
      return
    }

    if (!formData.donorEmail) {
      setError("Email address is required")
      setIsProcessing(false)
      return
    }

    try {
      const initResponse = await fetch("/api/payments/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: finalAmount,
          email: formData.donorEmail,
          donorName: formData.isAnonymous ? "Anonymous" : formData.donorName,
          purpose: formData.purpose,
        }),
      })

      if (!initResponse.ok) {
        throw new Error("Failed to initialize payment")
      }

      const initData = await initResponse.json()

      const handler = (window as any).PaystackPop.setup({
        key: (window as any).NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
        email: formData.donorEmail,
        amount: finalAmount * 100,
        ref: initData.reference,
        onClose: () => {
          toast({
            title: "Payment Cancelled",
            description: "You have cancelled the payment",
          })
          setIsProcessing(false)
        },
        onSuccess: async (message: any) => {
          const verifyResponse = await fetch(`/api/payments/verify?reference=${initData.reference}`)

          if (verifyResponse.ok) {
            const verifyData = await verifyResponse.json()

            if (verifyData.success) {
              setIsSuccess(true)
              toast({
                title: "Donation Successful!",
                description: "Thank you for your generous donation.",
              })
            } else {
              setError("Payment verification failed. Please contact support.")
              toast({
                title: "Verification Failed",
                description: "Could not verify your payment",
                variant: "destructive",
              })
            }
          }

          setIsProcessing(false)
        },
      })

      handler.openIframe()
    } catch (err) {
      setError("Failed to process donation. Please try again.")
      console.error("Donation error:", err)
      toast({
        title: "Error",
        description: "Failed to process donation. Please try again.",
        variant: "destructive",
      })
      setIsProcessing(false)
    }
  }

  if (isSuccess) {
    return (
      <Card className="col-span-2">
        <CardContent className="py-12 text-center">
          <CheckCircle className="mx-auto h-16 w-16 text-emerald-600 mb-4" />
          <h3 className="text-2xl font-bold mb-2">Thank You for Your Donation!</h3>
          <p className="text-muted-foreground mb-6">
            Your generosity helps us continue our mission. A confirmation email will be sent to {formData.donorEmail}.
          </p>
          <Button onClick={() => setIsSuccess(false)}>Make Another Donation</Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Donation Options</CardTitle>
            <CardDescription>Choose how you would like to support us</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <RadioGroup defaultValue="one-time" onValueChange={setDonationType} value={donationType}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="one-time" id="one-time" />
                <Label htmlFor="one-time">One-time Donation</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="monthly" id="monthly" />
                <Label htmlFor="monthly">Monthly Donation</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="annual" id="annual" />
                <Label htmlFor="annual">Annual Donation</Label>
              </div>
            </RadioGroup>

            <div className="space-y-2">
              <Label htmlFor="amount">Donation Amount</Label>
              <div className="grid grid-cols-3 gap-2">
                {["5000", "10000", "20000", "50000", "100000"].map((value) => (
                  <Button
                    key={value}
                    type="button"
                    variant={amount === value ? "default" : "outline"}
                    className={`w-full ${amount !== value ? "bg-transparent" : ""}`}
                    onClick={() => handleAmountSelect(value)}
                  >
                    ₦{Number.parseInt(value).toLocaleString()}
                  </Button>
                ))}
                <Button
                  type="button"
                  variant={amount === "custom" ? "default" : "outline"}
                  className={`w-full ${amount !== "custom" ? "bg-transparent" : ""}`}
                  onClick={() => setAmount("custom")}
                >
                  Other
                </Button>
              </div>
              {amount === "custom" && (
                <div className="mt-2">
                  <Input
                    id="custom-amount"
                    type="number"
                    placeholder="Enter custom amount"
                    value={customAmount}
                    onChange={handleCustomAmountChange}
                    min="100"
                  />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="purpose">Purpose (Optional)</Label>
              <Textarea
                id="purpose"
                placeholder="What would you like your donation to support?"
                value={formData.purpose}
                onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="anonymous"
                checked={formData.isAnonymous}
                onChange={(e) => setFormData({ ...formData, isAnonymous: e.target.checked })}
                className="rounded border-gray-300"
              />
              <Label htmlFor="anonymous" className="text-sm">
                Make this donation anonymous
              </Label>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payment Information</CardTitle>
            <CardDescription>Powered by Paystack</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                We use Paystack to securely process your donation. Your card information is encrypted and never stored
                on our servers.
              </p>
            </div>

            <Separator />

            <div className="space-y-2">
              <Label htmlFor="donor-name">Full Name</Label>
              <Input
                id="donor-name"
                placeholder="Your full name"
                value={formData.donorName}
                onChange={(e) => setFormData({ ...formData, donorName: e.target.value })}
                required={!formData.isAnonymous}
                disabled={formData.isAnonymous}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="Your email address"
                value={formData.donorEmail}
                onChange={(e) => setFormData({ ...formData, donorEmail: e.target.value })}
                required
              />
              <p className="text-xs text-muted-foreground">We'll send your donation receipt to this email</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="donor-phone">Phone (Optional)</Label>
              <Input
                id="donor-phone"
                type="tel"
                placeholder="+234 XXX XXX XXXX"
                value={formData.donorPhone}
                onChange={(e) => setFormData({ ...formData, donorPhone: e.target.value })}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isProcessing || !paystackLoaded}>
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : !paystackLoaded ? (
                "Loading Payment Gateway..."
              ) : (
                "Donate with Paystack"
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </form>
  )
}
