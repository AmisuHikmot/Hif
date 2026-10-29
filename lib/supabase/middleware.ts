import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options))
        },
      },
    },
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Protected routes
  const protectedPaths = ["/dashboard", "/admin"]
  const isProtectedPath = protectedPaths.some((path) => request.nextUrl.pathname.startsWith(path))

  if (isProtectedPath && !user) {
    const url = request.nextUrl.clone()
    url.pathname = "/auth/login"
    url.searchParams.set("redirect", request.nextUrl.pathname)
    return NextResponse.redirect(url)
  }

  if (request.nextUrl.pathname.startsWith("/admin") && user) {
    try {
      const { data: profileData } = await supabase.from("profiles").select("role, is_admin").eq("id", user.id).single()

      if (profileData?.role !== "admin" && profileData?.role !== "super_admin" && !profileData?.is_admin) {
        const url = request.nextUrl.clone()
        url.pathname = "/dashboard"
        return NextResponse.redirect(url)
      }

      // Admins must have passed a two-step check (Supabase MFA, aal2). Set
      // ADMIN_MFA_REQUIRED=false to switch this off in an emergency.
      if (process.env.ADMIN_MFA_REQUIRED !== "false") {
        const { data: aal } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel()
        if (aal && aal.currentLevel !== "aal2") {
          const url = request.nextUrl.clone()
          url.pathname = "/auth/mfa"
          url.search = ""
          url.searchParams.set("redirect", request.nextUrl.pathname)
          return NextResponse.redirect(url)
        }
      }
    } catch (error) {
      // If profile lookup fails, redirect to dashboard (user exists but profile may not be fully created yet)
      console.error("Error checking admin role:", error)
      const url = request.nextUrl.clone()
      url.pathname = "/dashboard"
      return NextResponse.redirect(url)
    }
  }

  // Admin API routes: same two-step requirement, answered with JSON instead of a redirect.
  if (request.nextUrl.pathname.startsWith("/api/admin") && process.env.ADMIN_MFA_REQUIRED !== "false") {
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    const { data: aal } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel()
    if (aal && aal.currentLevel !== "aal2") {
      return NextResponse.json({ error: "Two-step verification required" }, { status: 403 })
    }
  }

  return supabaseResponse
}
