"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/components/ui/use-toast"
import { createClient } from "@/lib/supabase/client"
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

  const [formData, setFormData] = useState({
    donorName: profile ? `${profile.first_name} ${profile.last_name}` : "",
    donorEmail: user?.email || "",
    donorPhone: profile?.phone || "",
    purpose: "",
    isAnonymous: false,
  })

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

    try {
      const supabase = createClient()
      const { error: donationError } = await supabase.from("donations").insert({
        user_id: user?.id || null,
        amount: finalAmount,
        currency: "NGN",
        donation_type: donationType,
        donor_name: formData.isAnonymous ? "Anonymous" : formData.donorName,
        donor_email: formData.donorEmail,
        donor_phone: formData.donorPhone || null,
        message: formData.purpose || null,
        is_anonymous: formData.isAnonymous,
        payment_status: "pending",
        payment_method: "card",
      })

      if (donationError) throw donationError

      setIsSuccess(true)
      toast({
        title: "Donation recorded!",
        description: "Thank you for your generous donation. You will receive a confirmation email shortly.",
      })
    } catch (err) {
      setError("Failed to process donation. Please try again.")
      toast({
        title: "Error",
        description: "Failed to process donation. Please try again.",
        variant: "destructive",
      })
    } finally {
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
            <CardDescription>Your information will be kept private</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="card">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="card">Card</TabsTrigger>
                <TabsTrigger value="bank">Bank Transfer</TabsTrigger>
                <TabsTrigger value="mobile">Mobile Money</TabsTrigger>
              </TabsList>
              <TabsContent value="card" className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="card-number">Card Number</Label>
                  <Input id="card-number" placeholder="1234 5678 9012 3456" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expiry">Expiry Date</Label>
                    <Input id="expiry" placeholder="MM/YY" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cvv">CVV</Label>
                    <Input id="cvv" placeholder="123" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="card-name">Name on Card</Label>
                  <Input id="card-name" placeholder="John Doe" />
                </div>
              </TabsContent>
              <TabsContent value="bank" className="pt-4">
                <div className="rounded-md bg-muted p-4">
                  <p className="font-medium">Bank Transfer Details</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Account Name: Hamduk Islamic Foundation
                    <br />
                    Account Number: 0123456789
                    <br />
                    Bank: Sample Bank
                    <br />
                    Reference: Your Name + Donation
                  </p>
                  <p className="text-sm mt-4">
                    Please send a confirmation email to donations@hamdukislamicfoundation.org after making the transfer.
                  </p>
                </div>
              </TabsContent>
              <TabsContent value="mobile" className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="phone-number">Phone Number</Label>
                  <Input id="phone-number" placeholder="+234 XXX XXX XXXX" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="provider">Mobile Money Provider</Label>
                  <select
                    id="provider"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="">Select provider</option>
                    <option value="mtn">MTN Mobile Money</option>
                    <option value="airtel">Airtel Money</option>
                    <option value="glo">Glo Mobile Money</option>
                    <option value="9mobile">9Mobile Money</option>
                  </select>
                </div>
              </TabsContent>
            </Tabs>

            <Separator className="my-4" />

            <div className="space-y-4">
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
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isProcessing}>
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Complete Donation"
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </form>
  )
}
