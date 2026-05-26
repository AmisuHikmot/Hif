"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/contexts/auth-context"
import { createClient } from "@/lib/supabase/client"
import { Loader2, CheckCircle } from "lucide-react"

interface EventRegistrationButtonProps {
  eventId: string
  isPast: boolean
  spotsLeft: number | null
}

export default function EventRegistrationButton({ eventId, isPast, spotsLeft }: EventRegistrationButtonProps) {
  const { isAuthenticated, user } = useAuth()
  const { toast } = useToast()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isRegistered, setIsRegistered] = useState(false)

  const checkRegistration = async () => {
    if (!user) return

    const supabase = createClient()
    const { data } = await supabase
      .from("event_registrations")
      .select("id")
      .eq("event_id", eventId)
      .eq("user_id", user.id)
      .single()

    if (data) {
      setIsRegistered(true)
    }
  }

  // Check registration status on mount
  useState(() => {
    if (user) {
      checkRegistration()
    }
  })

  const handleRegister = async () => {
    if (!isAuthenticated) {
      router.push(`/auth/login?redirect=/events/${eventId}`)
      return
    }

    setIsLoading(true)

    try {
      const supabase = createClient()

      // Check if already registered
      const { data: existing } = await supabase
        .from("event_registrations")
        .select("id")
        .eq("event_id", eventId)
        .eq("user_id", user!.id)
        .single()

      if (existing) {
        toast({
          title: "Already Registered",
          description: "You are already registered for this event.",
        })
        setIsRegistered(true)
        return
      }

      // Register for event
      const { error } = await supabase.from("event_registrations").insert({
        event_id: eventId,
        user_id: user!.id,
        registration_date: new Date().toISOString(),
        attendance_status: "registered",
      })

      if (error) throw error

      // Update attendee count
      await supabase.rpc("increment_attendee_count", { event_id: eventId })

      setIsRegistered(true)
      toast({
        title: "Registration Successful!",
        description: "You have been registered for this event. Check your email for confirmation.",
      })
    } catch (error) {
      toast({
        title: "Registration Failed",
        description: "There was an error registering for this event. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancelRegistration = async () => {
    setIsLoading(true)

    try {
      const supabase = createClient()

      const { error } = await supabase
        .from("event_registrations")
        .delete()
        .eq("event_id", eventId)
        .eq("user_id", user!.id)

      if (error) throw error

      setIsRegistered(false)
      toast({
        title: "Registration Cancelled",
        description: "Your registration has been cancelled.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to cancel registration. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isPast) {
    return (
      <Button className="w-full" disabled>
        Event Ended
      </Button>
    )
  }

  if (spotsLeft !== null && spotsLeft <= 0) {
    return (
      <Button className="w-full" disabled>
        Event Full
      </Button>
    )
  }

  if (isRegistered) {
    return (
      <div className="space-y-2">
        <Button className="w-full bg-transparent" variant="outline" disabled>
          <CheckCircle className="mr-2 h-4 w-4 text-emerald-600" />
          Registered
        </Button>
        <Button
          variant="ghost"
          className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
          onClick={handleCancelRegistration}
          disabled={isLoading}
        >
          Cancel Registration
        </Button>
      </div>
    )
  }

  return (
    <Button className="w-full" onClick={handleRegister} disabled={isLoading}>
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Registering...
        </>
      ) : isAuthenticated ? (
        "Register for Event"
      ) : (
        "Login to Register"
      )}
    </Button>
  )
}
