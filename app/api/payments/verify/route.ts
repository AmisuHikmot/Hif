import { type NextRequest, NextResponse } from "next/server"
import { verifyPaystackPayment, updatePaystackTransaction } from "@/lib/paystack"

export async function GET(request: NextRequest) {
  try {
    const reference = request.nextUrl.searchParams.get("reference")

    if (!reference) {
      return NextResponse.json({ error: "Reference is required" }, { status: 400 })
    }

    const result = await verifyPaystackPayment(reference)

    if (result.status && result.data.status === "success") {
      // Update transaction status
      await updatePaystackTransaction(reference, "success", result.data.paid_at)

      return NextResponse.json({
        success: true,
        message: "Payment verified successfully",
        data: result.data,
      })
    }

    return NextResponse.json({
      success: false,
      message: "Payment verification failed",
      data: result.data,
    })
  } catch (error) {
    console.error("Payment verification error:", error)
    return NextResponse.json({ error: "Failed to verify payment" }, { status: 500 })
  }
}
