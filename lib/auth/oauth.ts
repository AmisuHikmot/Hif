import { supabase } from "@/lib/supabase/client"

export type OAuthProvider = "google" | "apple" | "facebook"

/**
 * Sign in with OAuth provider
 * Handles Google, Apple, and Facebook authentication
 * Automatically redirects to callback page on success
 */
export async function signInWithOAuth(provider: OAuthProvider, next?: string) {
  try {
    console.log("[v0] Initiating OAuth sign in with provider:", provider)

    // Validate provider
    const validProviders: OAuthProvider[] = ["google", "apple", "facebook"]
    if (!validProviders.includes(provider)) {
      throw new Error(`Invalid OAuth provider: ${provider}`)
    }

    // Get redirect URL with fallback
    const redirectUrl = getOAuthRedirectUrl(next)
    console.log("[v0] OAuth redirect URL:", redirectUrl)

    // Initiate OAuth flow
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: provider as any,
      options: {
        redirectTo: redirectUrl,
        // Scopes for Google OAuth
        scopes: provider === "google" ? "openid email profile" : undefined,
      },
    })

    if (error) {
      console.error("[v0] OAuth sign in error:", error.message, error)
      return { error }
    }

    if (data?.url) {
      console.log("[v0] OAuth sign in initiated successfully, redirecting to OAuth provider")
      // The browser will handle the redirect automatically
      // OAuth flow will redirect back to callback page after user authenticates
      return { error: null }
    } else {
      console.warn("[v0] OAuth initiated but no redirect URL returned")
      return { error: null }
    }
  } catch (err) {
    console.error("[v0] Unexpected OAuth error:", err)
    const error = err instanceof Error ? err : new Error("OAuth sign in failed")
    return { error }
  }
}

/** Where the provider sends the user back to; the server route finishes sign-in. */
function getOAuthRedirectUrl(next?: string): string {
  const base =
    (typeof window !== "undefined" ? window.location.origin : "") || process.env.NEXT_PUBLIC_SITE_URL || ""
  if (!base) throw new Error("Unable to determine OAuth redirect URL")
  const url = new URL("/auth/callback", base)
  if (next) url.searchParams.set("next", next)
  return url.toString()
}
