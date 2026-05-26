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

        // Get the session that was just established
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession()

        if (sessionError) {
          console.error("[v0] Session error:", sessionError.message)
          router.push("/auth/login?error=session_error")
          return
        }

        if (!session) {
          console.error("[v0] No session found after OAuth callback")
          router.push("/auth/login?error=no_session")
          return
        }

        console.log("[v0] Session established, user ID:", session.user.id)

        // Give the database trigger a moment to create the profile
        // (usually happens instantly, but just to be safe)
        await new Promise((resolve) => setTimeout(resolve, 500))

        // Verify profile exists (trigger should have created it)
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("id, email, role")
          .eq("id", session.user.id)
          .single()

        if (profileError || !profile) {
          console.error("[v0] Profile not found:", profileError?.message)
          // Profile doesn't exist - this shouldn't happen with our trigger
          // but if it does, just continue - dashboard will handle it gracefully
          console.warn("[v0] Profile missing but continuing to dashboard")
        } else {
          console.log("[v0] Profile verified:", profile.email)
        }

        console.log("[v0] Redirecting to dashboard")
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
        <p className="mt-4 text-muted-foreground">Completing sign in...</p>
      </div>
    </main>
  )
}
