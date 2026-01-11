"use client"

import type React from "react"
import { useRouter, usePathname } from "next/navigation"
import { useEffect } from "react"
import { Toaster } from "@/components/ui/toaster"
import { useAuth } from "@/contexts/auth-context"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const { isAuthenticated, isLoading } = useAuth()

  useEffect(() => {
    // Only redirect if we're done loading and user is not authenticated
    if (!isLoading && !isAuthenticated) {
      console.log("[v0] User not authenticated, redirecting to login")
      router.push("/auth/login?redirect=" + encodeURIComponent(pathname))
    }
  }, [isAuthenticated, isLoading, router, pathname])

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-emerald-200 border-t-emerald-600"></div>
          <p className="mt-2 text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  // Don't render anything while checking auth, this prevents flash
  if (!isAuthenticated) {
    return null
  }

  return (
    <>
      {children}
      <Toaster />
    </>
  )
}
