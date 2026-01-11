import { supabase } from "@/lib/supabase/client"

export type OAuthProvider = "google" | "apple" | "facebook"

export async function signInWithOAuth(provider: OAuthProvider) {
  try {
    console.log("[v0] Initiating OAuth sign in with provider:", provider)

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: provider as any,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) {
      console.error("[v0] OAuth sign in error:", error)
      return { error }
    }

    console.log("[v0] OAuth sign in initiated successfully")
    return { error: null }
  } catch (err) {
    console.error("[v0] Unexpected OAuth error:", err)
    const error = err instanceof Error ? err : new Error("OAuth sign in failed")
    return { error }
  }
}
