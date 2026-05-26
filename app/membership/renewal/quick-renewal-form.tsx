"use client"

import type React from "react"
import { useState } from "react"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function QuickRenewalForm() {
  const [membershipId, setMembershipId] = useState("")
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState("")

  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    setIsLoading(true)
    setError("")
    setResult(null)

    try {
      const params = new URLSearchParams({ membershipId, email })
      const response = await fetch(`/api/membership/check?${params.toString()}`)
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || "Membership not found")
      setResult(data.membership)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to check membership")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="membershipId">Membership ID *</Label>
        <Input id="membershipId" value={membershipId} onChange={(e) => setMembershipId(e.target.value)} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email Address *</Label>
        <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </div>
      <Button type="submit" disabled={isLoading} className="w-full bg-emerald-600 text-white hover:bg-emerald-700">
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Check Membership Status
      </Button>
      {error && <p className="rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      {result && (
        <div className="rounded-md border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-900">
          <p className="font-semibold">{result.first_name} {result.last_name}</p>
          <p>Status: {result.membership_status}</p>
          <p>Payment: {result.payment_status}</p>
          {result.expires_at && <p>Expires: {new Date(result.expires_at).toLocaleDateString("en-NG")}</p>}
        </div>
      )}
    </form>
  )
}
