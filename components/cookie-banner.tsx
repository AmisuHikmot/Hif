"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Check if user has already accepted cookies
    const cookieConsent = localStorage.getItem("cookie-consent")
    if (!cookieConsent) {
      setIsVisible(true)
    }
  }, [])

  const handleAccept = () => {
    localStorage.setItem("cookie-consent", "accepted")
    setIsVisible(false)
  }

  const handleDecline = () => {
    localStorage.setItem("cookie-consent", "declined")
    setIsVisible(false)
  }

  if (!isVisible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-gray-900 text-white p-4 md:p-6 border-t border-gray-800">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex-1">
            <p className="text-sm md:text-base mb-2">
              We use cookies to enhance your experience and analyze our traffic. By continuing to use our site, you
              consent to our use of cookies.
            </p>
            <p className="text-xs text-gray-400">
              Read our{" "}
              <Link href="/cookie-policy" className="underline hover:text-emerald-400">
                Cookie Policy
              </Link>
              ,{" "}
              <Link href="/privacy" className="underline hover:text-emerald-400">
                Privacy Policy
              </Link>
              , and{" "}
              <Link href="/terms" className="underline hover:text-emerald-400">
                Terms of Service
              </Link>
            </p>
          </div>
          <div className="flex gap-2 flex-shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={handleDecline}
              className="border-gray-600 text-gray-300 hover:bg-gray-800 bg-transparent"
            >
              Decline
            </Button>
            <Button size="sm" onClick={handleAccept} className="bg-emerald-600 hover:bg-emerald-700">
              Accept All
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
