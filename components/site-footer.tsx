// ... existing imports ...
"use client"

import { Button } from "@/components/ui/button"

import type React from "react"

import { useState } from "react"
import { useToast } from "@/components/ui/use-toast"
import { createClient } from "@/lib/supabase/client"

export function SiteFooter() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const supabase = createClient()
      const { error } = await supabase.from("newsletters").insert({
        email,
        is_active: true,
        subscription_date: new Date().toISOString(),
      })

      if (error) {
        if (error.code === "23505") {
          toast({
            title: "Already subscribed",
            description: "This email is already subscribed to our newsletter.",
            variant: "destructive",
          })
        } else {
          throw error
        }
      } else {
        toast({
          title: "Subscribed successfully!",
          description: "Thank you for subscribing to our newsletter.",
        })
        setEmail("")
      }
    } catch (error) {
      toast({
        title: "Subscription failed",
        description: "There was an error subscribing. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* ... existing footer content ... */}
      <div>
        <h4 className="mb-4 text-md font-semibold text-white">Newsletter</h4>
        <p className="mb-4">Subscribe to our newsletter to receive updates on our activities and events.</p>
        <form onSubmit={handleNewsletterSubmit} className="space-y-2">
          <input
            type="email"
            placeholder="Your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            required
          />
          <Button type="submit" disabled={isLoading} className="w-full bg-emerald-600 hover:bg-emerald-700">
            {isLoading ? "Subscribing..." : "Subscribe"}
          </Button>
        </form>
      </div>
    </footer>
  )
}
