"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, Loader2 } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"

export default function PaymentCallbackPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [status, setStatus] = useState<"loading" | "success" | "failed">("loading")
  const [message, setMessage] = useState("")
  const [donationId, setDonationId] = useState<string | null>(null)

  useEffect(() => {
    const verifyPayment = async () => {
      const reference = searchParams.get("reference")
      const access_code = searchParams.get("access_code")

      if (!reference) {
        setStatus("failed")
        setMessage("No payment reference found")
        return
      }

      try {
        const response = await fetch("/api/payments/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ reference, access_code }),
        })

        const data = await response.json()

        if (data.success) {
          setStatus("success")
          setMessage("Payment verified successfully! Your donation has been received.")
          setDonationId(data.donationId)

          // Log the activity
          const supabase = createClient()
          await supabase.from("activity_log").insert({
            user_id: data.userId || null,
            action_type: "donation_payment_verified",
            description: `Payment verified for donation: ${data.donationId}`,
            metadata: {
              reference,
              amount: data.amount,
            },
          })
        } else {
          setStatus("failed")
          setMessage(data.message || "Payment verification failed")
        }
      } catch (error) {
        setStatus("failed")
        setMessage("An error occurred while verifying payment. Please contact support.")
        console.error(error)
      }
    }

    verifyPayment()
  }, [searchParams])

  return (
    <main className="container mx-auto px-4 py-12">
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Payment Status</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center text-center space-y-6">
            {status === "loading" && (
              <>
                <Loader2 className="h-12 w-12 text-emerald-600 animate-spin" />
                <p className="text-gray-600">Verifying your payment...</p>
              </>
            )}

            {status === "success" && (
              <>
                <CheckCircle className="h-12 w-12 text-green-600" />
                <div>
                  <h2 className="text-lg font-bold text-green-600 mb-2">Payment Successful</h2>
                  <p className="text-gray-700 mb-4">{message}</p>
                  {donationId && (
                    <p className="text-sm text-gray-500 mb-4">
                      Donation ID: <span className="font-mono">{donationId}</span>
                    </p>
                  )}
                </div>
                <div className="space-y-2 w-full">
                  <Button asChild className="w-full bg-emerald-600 hover:bg-emerald-700">
                    <Link href="/dashboard/donations">View Donation History</Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full bg-transparent">
                    <Link href="/">Return Home</Link>
                  </Button>
                </div>
              </>
            )}

            {status === "failed" && (
              <>
                <XCircle className="h-12 w-12 text-red-600" />
                <div>
                  <h2 className="text-lg font-bold text-red-600 mb-2">Payment Failed</h2>
                  <p className="text-gray-700 mb-4">{message}</p>
                </div>
                <div className="space-y-2 w-full">
                  <Button asChild className="w-full bg-emerald-600 hover:bg-emerald-700">
                    <Link href="/donate">Try Again</Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full bg-transparent">
                    <Link href="/contact-us">Contact Support</Link>
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
