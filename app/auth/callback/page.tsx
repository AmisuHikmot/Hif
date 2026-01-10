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
        // Get current session from Supabase
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession()

        if (error || !session) {
          console.error("No active session found:", error)
          router.push("/auth/login?error=callback_error")
          return
        }

        // Session exists, redirect to dashboard
        router.push("/dashboard")
      } catch (err) {
        console.error("Auth callback error:", err)
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
