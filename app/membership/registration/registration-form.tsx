"use client"

import type React from "react"
import { useState } from "react"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"

const fees: Record<string, string> = {
  regular: "₦10,000",
  associate: "₦8,000",
  youth: "₦5,000",
}

export function RegistrationForm() {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    gender: "male",
    address: "",
    city: "",
    state: "",
    postalCode: "",
    country: "nigeria",
    membershipType: "regular",
    skills: "",
    referralSource: "",
    termsAccepted: false,
    communicationsOptIn: false,
  })
  const [interests, setInterests] = useState<string[]>([])

  const setField = (field: string, value: string | boolean) => setForm((current) => ({ ...current, [field]: value }))
  const toggleInterest = (interest: string, checked: boolean) => {
    setInterests((current) => (checked ? [...current, interest] : current.filter((item) => item !== interest)))
  }

  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/membership/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, interests }),
      })
      const data = await response.json()

      if (!response.ok) throw new Error(data.error || "Registration failed")
      if (!data.authorizationUrl) throw new Error("Payment could not be initialized")

      window.location.href = data.authorizationUrl
    } catch (error) {
      toast({
        title: "Registration failed",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="border-emerald-200 dark:border-emerald-900">
      <CardHeader className="bg-emerald-50 dark:bg-emerald-900/20">
        <CardTitle className="text-2xl text-emerald-900 dark:text-emerald-500">Registration Form</CardTitle>
        <CardDescription>Payment is required before membership is activated.</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={submit} className="space-y-8">
          <section>
            <h3 className="mb-4 text-lg font-semibold text-emerald-800 dark:text-emerald-400">Personal Information</h3>
            <div className="grid gap-6 md:grid-cols-2">
              <Field id="firstName" label="First Name *" value={form.firstName} onChange={setField} required />
              <Field id="lastName" label="Last Name *" value={form.lastName} onChange={setField} required />
              <Field id="email" label="Email Address *" type="email" value={form.email} onChange={setField} required />
              <Field id="phone" label="Phone Number *" value={form.phone} onChange={setField} required />
              <Field id="dateOfBirth" label="Date of Birth" type="date" value={form.dateOfBirth} onChange={setField} />
              <div className="space-y-2">
                <Label>Gender</Label>
                <RadioGroup value={form.gender} onValueChange={(value) => setField("gender", value)} className="flex gap-4">
                  {["male", "female", "other"].map((gender) => (
                    <div key={gender} className="flex items-center space-x-2">
                      <RadioGroupItem value={gender} id={gender} />
                      <Label htmlFor={gender} className="capitalize">{gender}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            </div>
          </section>

          <section>
            <h3 className="mb-4 text-lg font-semibold text-emerald-800 dark:text-emerald-400">Address Information</h3>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="address">Street Address *</Label>
                <Input id="address" value={form.address} onChange={(e) => setField("address", e.target.value)} required />
              </div>
              <Field id="city" label="City/Town *" value={form.city} onChange={setField} required />
              <Field id="state" label="State *" value={form.state} onChange={setField} required />
              <Field id="postalCode" label="Postal Code" value={form.postalCode} onChange={setField} />
              <div className="space-y-2">
                <Label>Country</Label>
                <Select value={form.country} onValueChange={(value) => setField("country", value)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="nigeria">Nigeria</SelectItem>
                    <SelectItem value="ghana">Ghana</SelectItem>
                    <SelectItem value="cameroon">Cameroon</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </section>

          <section>
            <h3 className="mb-4 text-lg font-semibold text-emerald-800 dark:text-emerald-400">Membership Information</h3>
            <RadioGroup value={form.membershipType} onValueChange={(value) => setField("membershipType", value)} className="space-y-3">
              {[
                ["regular", "Regular Membership", "For adult Muslims (18+ years)."],
                ["associate", "Associate Membership", "For supporters of the foundation's objectives."],
                ["youth", "Youth Membership", "For young Muslims between 13-17 years."],
              ].map(([value, label, description]) => (
                <div key={value} className="flex items-start space-x-2 rounded-md border p-3">
                  <RadioGroupItem value={value} id={value} className="mt-1" />
                  <div className="flex-1">
                    <Label htmlFor={value} className="font-medium">{label}</Label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
                  </div>
                  <span className="font-semibold text-emerald-700">{fees[value]}</span>
                </div>
              ))}
            </RadioGroup>

            <div className="mt-6 space-y-2">
              <Label>Areas of Interest</Label>
              <div className="grid gap-3 md:grid-cols-2">
                {["Islamic Education", "Youth Programs", "Da'wah Activities", "Charity", "Community Development", "Media & Publications"].map((interest) => (
                  <label key={interest} className="flex items-center space-x-2">
                    <Checkbox onCheckedChange={(checked) => toggleInterest(interest, checked === true)} />
                    <span>{interest}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="mt-6 space-y-2">
              <Label htmlFor="skills">Skills & Expertise</Label>
              <Textarea id="skills" value={form.skills} onChange={(e) => setField("skills", e.target.value)} />
            </div>
          </section>

          <section className="space-y-4">
            <label className="flex items-start space-x-2">
              <Checkbox checked={form.termsAccepted} onCheckedChange={(checked) => setField("termsAccepted", checked === true)} required />
              <span className="text-sm">I agree to abide by the constitution, bylaws, and code of conduct of the Hamduk Islamic Foundation.</span>
            </label>
            <label className="flex items-start space-x-2">
              <Checkbox checked={form.communicationsOptIn} onCheckedChange={(checked) => setField("communicationsOptIn", checked === true)} />
              <span className="text-sm">I consent to receive membership communications by email or SMS.</span>
            </label>
          </section>

          <Button type="submit" disabled={isSubmitting} className="w-full bg-emerald-600 text-white hover:bg-emerald-700">
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Proceed to Payment
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

function Field({
  id,
  label,
  value,
  onChange,
  type = "text",
  required,
}: {
  id: string
  label: string
  value: string
  onChange: (field: string, value: string) => void
  type?: string
  required?: boolean
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} type={type} value={value} onChange={(e) => onChange(id, e.target.value)} required={required} />
    </div>
  )
}
