import { NextResponse, type NextRequest } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { createClient } from "@/lib/supabase/server"
import { safeNext } from "@/lib/auth/redirect"
import { VERCEL_COOKIE, VERCEL_TOKEN, VERCEL_USERINFO, vercelConfigured, vercelRedirectUri } from "@/lib/auth/vercel"

/**
 * Finishes "Sign in with Vercel". The Vercel account's verified email is
 * matched to a HIF account (created on first use), and a normal cookie
 * session is started for it.
 */
export async function GET(req: NextRequest) {
  const fail = (reason: string) => {
    const res = NextResponse.redirect(new URL(`/auth/login?error=${reason}`, req.url))
    res.cookies.delete({ name: VERCEL_COOKIE, path: "/api/auth/vercel" })
    return res
  }

  if (!vercelConfigured()) return fail("vercel_not_configured")

  const params = req.nextUrl.searchParams
  let saved: { state: string; verifier: string; next: string } | null = null
  try {
    saved = JSON.parse(req.cookies.get(VERCEL_COOKIE)?.value ?? "null")
  } catch {
    saved = null
  }
  const code = params.get("code")
  if (!saved || !code || params.get("state") !== saved.state) return fail("vercel_failed")

  try {
    const tokenRes = await fetch(VERCEL_TOKEN, {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: vercelRedirectUri(req),
        client_id: process.env.VERCEL_CLIENT_ID!,
        client_secret: process.env.VERCEL_CLIENT_SECRET!,
        code_verifier: saved.verifier,
      }),
    })
    if (!tokenRes.ok) return fail("vercel_failed")
    const { access_token } = (await tokenRes.json()) as { access_token?: string }
    if (!access_token) return fail("vercel_failed")

    const infoRes = await fetch(VERCEL_USERINFO, { headers: { authorization: `Bearer ${access_token}` } })
    if (!infoRes.ok) return fail("vercel_failed")
    const info = (await infoRes.json()) as { email?: string; email_verified?: boolean; name?: string }

    // Matching by email is only safe when Vercel vouches for the address.
    if (!info.email || info.email_verified !== true) return fail("vercel_no_email")
    const email = info.email.toLowerCase()

    // generateLink creates the account on first sign-in and returns a one-time token.
    const { data: link, error: linkError } = await createAdminClient().auth.admin.generateLink({
      type: "magiclink",
      email,
      options: { data: { full_name: info.name ?? null } },
    })
    const tokenHash = link?.properties?.hashed_token
    if (linkError || !tokenHash) return fail("vercel_failed")

    const supabase = await createClient()
    const { error: otpError } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type: "magiclink" })
    if (otpError) return fail("vercel_failed")

    const res = NextResponse.redirect(new URL(safeNext(saved.next), req.url))
    res.cookies.delete({ name: VERCEL_COOKIE, path: "/api/auth/vercel" })
    return res
  } catch (err) {
    console.error("vercel sign-in:", err)
    return fail("vercel_failed")
  }
}
