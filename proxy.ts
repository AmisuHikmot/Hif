import { updateSession } from "@/lib/supabase/middleware"
import type { NextRequest } from "next/server"

export async function proxy(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  // Only paths that read the session; the rest of the public site skips the auth round-trip.
  matcher: ["/dashboard/:path*", "/admin/:path*", "/schools/:path*", "/developers/:path*", "/oauth/:path*", "/auth/:path*"],
}
