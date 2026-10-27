import { createHash, randomBytes } from "node:crypto"
import { NextResponse, type NextRequest } from "next/server"
import { safeNext } from "@/lib/auth/redirect"
import { VERCEL_AUTHORIZE, VERCEL_COOKIE, vercelConfigured, vercelRedirectUri } from "@/lib/auth/vercel"

/** Starts "Sign in with Vercel": OAuth 2.0 authorization code with PKCE. */
export async function GET(req: NextRequest) {
  if (!vercelConfigured()) {
    return NextResponse.redirect(new URL("/auth/login?error=vercel_not_configured", req.url))
  }

  const state = randomBytes(24).toString("base64url")
  const nonce = randomBytes(24).toString("base64url")
  const verifier = randomBytes(48).toString("base64url")
  const challenge = createHash("sha256").update(verifier).digest("base64url")
  const next = safeNext(req.nextUrl.searchParams.get("next"))

  const url = new URL(VERCEL_AUTHORIZE)
  url.searchParams.set("client_id", process.env.VERCEL_CLIENT_ID!)
  url.searchParams.set("redirect_uri", vercelRedirectUri(req))
  url.searchParams.set("response_type", "code")
  url.searchParams.set("scope", "openid email profile")
  url.searchParams.set("state", state)
  url.searchParams.set("nonce", nonce)
  url.searchParams.set("code_challenge", challenge)
  url.searchParams.set("code_challenge_method", "S256")

  const res = NextResponse.redirect(url)
  res.cookies.set(VERCEL_COOKIE, JSON.stringify({ state, nonce, verifier, next }), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/api/auth/vercel",
    maxAge: 600,
  })
  return res
}
