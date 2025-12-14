"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { createClient } from "@/lib/supabase/client"
import { Loader2 } from "lucide-react"

export default function NewsletterSignup() {
  const [email, setEmail] = useState("")
  const [firstName, setFirstName] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const supabase = createClient()
      const { error } = await supabase.from("newsletters").insert({
        email,
        first_name: firstName || null,
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
        setFirstName("")
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
    <section className="bg-emerald-50 py-16 dark:bg-emerald-950/20 md:py-24">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl">
            Stay Connected
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
            Subscribe to our newsletter to receive updates on our activities, events, and publications.
          </p>
          <form onSubmit={handleSubmit} className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Input
              type="text"
              placeholder="Your name (optional)"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="max-w-xs flex-1"
            />
            <Input
              type="email"
              placeholder="Your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="max-w-md flex-1"
              required
            />
            <Button type="submit" className="w-full sm:w-auto" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Subscribing...
                </>
              ) : (
                "Subscribe"
              )}
            </Button>
          </form>
          <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </div>
      </div>
    </section>
  )
}
