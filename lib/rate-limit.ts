import { NextResponse, type NextRequest } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"

export function clientIp(req: NextRequest | Request) {
  const h = req.headers
  return h.get("x-forwarded-for")?.split(",")[0].trim() || h.get("x-real-ip") || "unknown"
}

/**
 * Returns a 429 response when the caller is over the limit, otherwise null.
 * Backed by the `rate_limit_hit` SQL function (db/21). If the limiter itself
 * fails (e.g. SQL not yet applied) the request is allowed through.
 */
export async function rateLimit(req: NextRequest | Request, name: string, max: number, windowSeconds: number) {
  return rateLimitKey(`${name}:${clientIp(req)}`, max, windowSeconds)
}

/** Same as [rateLimit] but for an explicit key, such as a user id. */
export async function rateLimitKey(key: string, max: number, windowSeconds: number) {
  try {
    const { data, error } = await createAdminClient().rpc("rate_limit_hit", {
      p_key: key,
      p_max: max,
      p_window_seconds: windowSeconds,
    })
    if (error || data !== false) return null
    return NextResponse.json(
      { error: "Too many requests. Please wait a moment and try again." },
      { status: 429, headers: { "Retry-After": String(windowSeconds) } },
    )
  } catch {
    return null
  }
}
