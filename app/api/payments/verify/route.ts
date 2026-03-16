import { type NextRequest, NextResponse } from "next/server"
import { verifyPaystackPayment, updatePaystackTransaction } from "@/lib/paystack"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { reference, access_code } = body

    if (!reference) {
      return NextResponse.json({ error: "Reference is required" }, { status: 400 })
    }

    console.log("[v0] Verifying payment with reference:", reference)

    let paystackData: any
    try {
      const result = await verifyPaystackPayment(reference)
      paystackData = result.data
      console.log("[v0] Paystack verification response status:", paystackData?.status)
    } catch (error) {
      console.error("[v0] Paystack verification failed:", error instanceof Error ? error.message : String(error))
      return NextResponse.json(
        {
          success: false,
          message: "Failed to verify payment with Paystack. Please contact support if the issue persists.",
        },
        { status: 500 },
      )
    }

    if (!paystackData) {
      return NextResponse.json(
        {
          success: false,
          message: "No payment data found for this reference",
        },
        { status: 404 },
      )
    }

    const isPaymentSuccessful = paystackData.status === "success"
    console.log("[v0] Payment status:", paystackData.status, "- Success:", isPaymentSuccessful)

    if (!isPaymentSuccessful) {
      console.log("[v0] Payment not successful - status:", paystackData.status)
      try {
        await updatePaystackTransaction(reference, paystackData.status || "failed", paystackData.paid_at)
      } catch (updateError) {
        console.warn("[v0] Failed to update transaction status:", updateError)
      }

      return NextResponse.json({
        success: false,
        message: `Payment status: ${paystackData.status || "failed"}. Please try again or contact support.`,
        status: paystackData.status,
      })
    }

    try {
      await updatePaystackTransaction(reference, "success", paystackData.paid_at)
      console.log("[v0] Transaction status updated to success")
    } catch (updateError) {
      console.error("[v0] Failed to update transaction:", updateError)
      // Don't fail the verification if transaction update fails
    }

    const supabase = await createClient()
    const transactionType = paystackData.metadata?.type || "donation"
    const donationId = paystackData.metadata?.donation_id
    const orderId = paystackData.metadata?.orderId

    if (transactionType === "donation" && donationId) {
      console.log("[v0] Updating donation record for:", donationId)

      const { error: donationUpdateError } = await supabase
        .from("donations")
        .update({
          payment_status: "completed",
          updated_at: new Date().toISOString(),
        })
        .eq("id", donationId)

      if (donationUpdateError) {
        console.error("[v0] Failed to update donation status:", donationUpdateError)
      } else {
        console.log("[v0] Donation status updated to completed")
      }

      const { data: donationRecord } = await supabase
        .from("donations")
        .select("project_id, amount")
        .eq("id", donationId)
        .single()

      if (donationRecord?.project_id) {
        console.log("[v0] Updating project amount_raised for project:", donationRecord.project_id)
        const { error: projectUpdateError } = await supabase.rpc("increment_project_raised", {
          project_id: donationRecord.project_id,
          amount: donationRecord.amount,
        })

        if (projectUpdateError) {
          console.warn("[v0] Failed to update project amount_raised:", projectUpdateError)
        } else {
          console.log("[v0] Project amount_raised updated successfully")
        }
      }
    }

    const responseData: any = {
      success: true,
      message: transactionType === "shop_order" 
        ? "Payment verified successfully! Your order is being processed." 
        : "Payment verified successfully! Your donation has been received.",
      amount: paystackData.amount / 100, // Convert kobo back to NGN
      reference,
      status: "success",
      type: transactionType,
    }

    if (donationId) {
      responseData.donationId = donationId
    }

    if (orderId) {
      responseData.orderId = orderId
    }

    return NextResponse.json(responseData)
  } catch (error) {
    console.error("[v0] Unexpected error in payment verification:", error)
    return NextResponse.json(
      {
        success: false,
        message: "An unexpected error occurred while verifying your payment. Please contact support.",
      },
      { status: 500 },
    )
  }
}
