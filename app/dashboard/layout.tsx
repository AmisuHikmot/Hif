"use client"

import type React from "react"
import { useRouter, usePathname } from "next/navigation"
import { useEffect, useState } from "react"
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
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted || isLoading) {
      return
    }

    // If not authenticated and loading is done, redirect to login
    if (!isAuthenticated) {
      console.log("[v0] User not authenticated, redirecting to login from:", pathname)
      router.push("/auth/login?redirect=" + encodeURIComponent(pathname))
    }
  }, [isAuthenticated, isLoading, mounted, router, pathname])

  // Show loading state while checking authentication
  if (!mounted || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-emerald-200 border-t-emerald-600"></div>
          <p className="mt-2 text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  // Don't render anything while not authenticated, this prevents flash
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
