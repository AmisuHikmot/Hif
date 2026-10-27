import { NextResponse, type NextRequest } from "next/server"
import type { EmailOtpType } from "@supabase/supabase-js"
import { createClient } from "@/lib/supabase/server"
import { safeNext } from "@/lib/auth/redirect"

/**
 * Where OAuth, email confirmation and password-reset links land.
 * Exchanges the one-time code for a cookie session, then moves on.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl
  const rawNext = searchParams.get("next")
  // Password reset goes to its own page, which is under /auth.
  const next = rawNext === "/auth/reset-password" ? rawNext : safeNext(rawNext)
  const fail = (reason: string) => NextResponse.redirect(`${origin}/auth/login?error=${reason}`)

  const providerError = searchParams.get("error_description") || searchParams.get("error")
  if (providerError) return fail("oauth_denied")

  const supabase = await createClient()
  const code = searchParams.get("code")
  const tokenHash = searchParams.get("token_hash")
  const type = searchParams.get("type") as EmailOtpType | null

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (error) return fail("session_error")
  } else if (tokenHash && type) {
    const { error } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type })
    if (error) return fail("link_expired")
  } else {
    return fail("no_session")
  }

  return NextResponse.redirect(`${origin}${next}`)
}
