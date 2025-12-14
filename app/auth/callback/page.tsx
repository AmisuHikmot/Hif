"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Loader2 } from "lucide-react"

export default function AuthCallbackPage() {
  const router = useRouter()

  useEffect(() => {
    const handleCallback = async () => {
      const supabase = createClient()

      // Handle the OAuth callback or email confirmation
      const { error } = await supabase.auth.exchangeCodeForSession(window.location.href)

      if (error) {
        console.error("Auth callback error:", error)
        router.push("/auth/login?error=callback_error")
      } else {
        router.push("/dashboard")
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
