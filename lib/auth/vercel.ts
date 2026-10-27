import type { NextRequest } from "next/server"

export const VERCEL_AUTHORIZE = "https://vercel.com/oauth/authorize"
export const VERCEL_TOKEN = "https://api.vercel.com/login/oauth/token"
export const VERCEL_USERINFO = "https://api.vercel.com/login/oauth/userinfo"
export const VERCEL_COOKIE = "hif_vercel_oauth"

export function vercelConfigured() {
  return !!process.env.VERCEL_CLIENT_ID && !!process.env.VERCEL_CLIENT_SECRET
}

/** The exact URL registered as the redirect URI in the Vercel app. */
export function vercelRedirectUri(req: NextRequest) {
  const base = process.env.NEXT_PUBLIC_SITE_URL || req.nextUrl.origin
  return `${base.replace(/\/$/, "")}/api/auth/vercel/callback`
}
