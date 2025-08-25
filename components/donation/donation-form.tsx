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
import { useToast } from "@/components/ui/use-toast"

export default function DonationForm() {
  const [donationType, setDonationType] = useState("one-time")
  const [amount, setAmount] = useState("")
  const [customAmount, setCustomAmount] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const { toast } = useToast()

  const handleAmountSelect = (value: string) => {
    setAmount(value)
    setCustomAmount("")
  }

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomAmount(e.target.value)
    setAmount("custom")
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)

    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false)
      toast({
        title: "Donation Successful",
        description: "Thank you for your generous donation to Hamduk Islamic Foundation.",
      })
    }, 2000)
  }

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Donation Options</CardTitle>
          <CardDescription>Choose how you would like to support us</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
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
                  className="w-full"
                  onClick={() => handleAmountSelect(value)}
                >
                  ₦{Number.parseInt(value).toLocaleString()}
                </Button>
              ))}
              <Button
                type="button"
                variant={amount === "custom" ? "default" : "outline"}
                className="w-full"
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
                />
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="purpose">Purpose (Optional)</Label>
            <Textarea id="purpose" placeholder="What would you like your donation to support?" />
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

          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input id="email" type="email" placeholder="Your email address" />
            <p className="text-xs text-muted-foreground">We'll send your donation receipt to this email</p>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full" onClick={handleSubmit} disabled={isProcessing}>
            {isProcessing ? "Processing..." : "Complete Donation"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
