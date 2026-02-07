"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase/client"
import { Loader2 } from "lucide-react"

export default function AuthCallbackPage() {
  const router = useRouter()
  const [sessionChecked, setSessionChecked] = useState(false)

  useEffect(() => {
    let mounted = true
    let retryCount = 0
    const maxRetries = 10

    const handleCallback = async () => {
      try {
        console.log("[v0] Auth callback started, processing OAuth redirect...")

        // Wait for Supabase to exchange the OAuth code for a session
        // The `onAuthStateChange` listener fires when the session is established
        const {
          data: { subscription },
        } = supabase.auth.onAuthStateChange(async (_event, session) => {
          if (!mounted) return

          console.log("[v0] Auth state changed, event:", _event, "has session:", !!session)

          if (session?.user) {
            console.log("[v0] Session found, user ID:", session.user.id)

            // The profile should already be created by the database trigger during user creation
            // We just verify it exists, if not the trigger may have failed silently
            let profileReady = false
            let profileCheckRetries = 0
            const maxProfileChecks = 5

            // Poll for profile existence (trigger might need a moment)
            while (!profileReady && profileCheckRetries < maxProfileChecks && mounted) {
              const { data: existingProfile, error: profileError } = await supabase
                .from("profiles")
                .select("id")
                .eq("id", session.user.id)
                .maybeSingle()

              if (existingProfile) {
                console.log("[v0] Profile found for user:", session.user.id)
                profileReady = true
              } else if (profileCheckRetries < maxProfileChecks - 1) {
                profileCheckRetries++
                console.log(`[v0] Profile not yet available, checking again... (${profileCheckRetries}/${maxProfileChecks - 1})`)
                // Wait a bit before retrying
                await new Promise((resolve) => setTimeout(resolve, 500))
              } else {
                // If profile still doesn't exist after retries, create it manually
                console.warn("[v0] Profile trigger may have failed, creating profile manually")

                // Extract user metadata from OAuth provider
                const userMetadata = session.user.user_metadata || {}
                const fullName = userMetadata.full_name || userMetadata.name || ""
                const [firstName, ...lastNameParts] = fullName.split(" ")
                const lastName = lastNameParts.join(" ")

                // Create profile for OAuth user
                const { error: createProfileError } = await supabase.from("profiles").insert({
                  id: session.user.id,
                  email: session.user.email || "",
                  first_name: firstName || null,
                  last_name: lastName || null,
                  avatar_url: userMetadata.avatar_url || null,
                  role: "user",
                  is_active: true,
                })

                if (createProfileError) {
                  console.error("[v0] Profile creation error:", createProfileError.message)
                  // Don't fail - user is still authenticated
                } else {
                  console.log("[v0] Profile created successfully for OAuth user")
                  profileReady = true
                }
              }
            }

            console.log("[v0] Auth callback successful, redirecting to dashboard")
            if (mounted) {
              // Unsubscribe from auth state changes before redirecting
              subscription?.unsubscribe()
              router.push("/dashboard")
            }
          }
        })

        // Fallback: If session is not established within 5 seconds, check manually
        const fallbackTimeout = setTimeout(async () => {
          if (!sessionChecked && mounted && retryCount < maxRetries) {
            retryCount++
            console.log(`[v0] Checking session manually (attempt ${retryCount}/${maxRetries})...`)

            const {
              data: { session },
              error,
            } = await supabase.auth.getSession()

            if (session?.user && mounted) {
              console.log("[v0] Session found on manual check, user ID:", session.user.id)
              setSessionChecked(true)
              subscription?.unsubscribe()
              router.push("/dashboard")
            } else if (retryCount >= maxRetries && mounted) {
              console.error("[v0] Session not established after retries")
              subscription?.unsubscribe()
              router.push("/auth/login?error=callback_timeout")
            }
          }
        }, 2000)

        return () => {
          clearTimeout(fallbackTimeout)
          subscription?.unsubscribe()
        }
      } catch (err) {
        console.error("[v0] Auth callback error:", err)
        if (mounted) {
          router.push("/auth/login?error=callback_error")
        }
      }
    }

    handleCallback()

    return () => {
      mounted = false
    }
  }, [router, sessionChecked])

  return (
    <main className="container mx-auto flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
      <div className="text-center">
        <Loader2 className="mx-auto h-8 w-8 animate-spin text-emerald-600" />
        <p className="mt-4 text-muted-foreground">Verifying your account...</p>
      </div>
    </main>
  )
}
