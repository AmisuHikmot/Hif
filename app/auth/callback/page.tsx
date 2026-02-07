"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase/client"
import { Loader2 } from "lucide-react"

export default function AuthCallbackPage() {
  const router = useRouter()

  useEffect(() => {
    const handleCallback = async () => {
      try {
        console.log("[v0] Auth callback started, processing OAuth redirect...")

        // Get current session from Supabase
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession()

        if (error) {
          console.error("[v0] Session retrieval error:", error.message)
          router.push("/auth/login?error=session_error")
          return
        }

        if (!session?.user) {
          console.error("[v0] No active session found after OAuth callback")
          router.push("/auth/login?error=no_session")
          return
        }

        console.log("[v0] Session found, user ID:", session.user.id)

        // Check if profile exists, create if needed for OAuth users
        const { data: existingProfile, error: profileError } = await supabase
          .from("profiles")
          .select("id")
          .eq("id", session.user.id)
          .maybeSingle()

        if (profileError && profileError.code !== "PGRST116") {
          console.error("[v0] Profile check error:", profileError)
          // Continue anyway, profile might exist
        }

        if (!existingProfile) {
          console.log("[v0] Creating profile for OAuth user:", session.user.id)

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
            console.warn("[v0] Profile creation error (may already exist):", createProfileError.message)
            // Don't fail here - profile might already exist via trigger
          } else {
            console.log("[v0] Profile created successfully for OAuth user")
          }
        } else {
          console.log("[v0] Profile already exists for user:", session.user.id)
        }

        console.log("[v0] Auth callback successful, redirecting to dashboard")
        router.push("/dashboard")
      } catch (err) {
        console.error("[v0] Auth callback error:", err)
        router.push("/auth/login?error=callback_error")
      }
    }

    handleCallback()
  }, [router])

  return (
    <main className="container mx-auto flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
      <div className="text-center">
        <Loader2 className="mx-auto h-8 w-8 animate-spin text-emerald-600" />
        <p className="mt-4 text-muted-foreground">Verifying your account...</p>
      </div>
    </main>
  )
}
