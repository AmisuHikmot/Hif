import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { initializePaystackPayment, savePaystackTransaction } from "@/lib/paystack"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { amount, email, donorName, purpose } = body

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 })
    }

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    const supabase = await createClient()

    // Get the current user
    const {
      data: { user },
    } = await supabase.auth.getUser()

    // Create donation record
    const { data: donation, error: donationError } = await supabase
      .from("donations")
      .insert({
        user_id: user?.id || null,
        amount,
        currency: "NGN",
        donor_name: donorName,
        donor_email: email,
        message: purpose,
        payment_status: "pending",
      })
      .select()
      .single()

    if (donationError || !donation) {
      return NextResponse.json({ error: "Failed to create donation" }, { status: 500 })
    }

    // Generate unique reference for this transaction
    const reference = `${donation.id}-${Date.now()}`

    // Initialize Paystack payment
    const paystackResponse = await initializePaystackPayment({
      email,
      amount,
      reference,
      metadata: {
        donation_id: donation.id,
        donor_name: donorName,
        purpose,
      },
    })

    if (!paystackResponse.status) {
      return NextResponse.json({ error: "Failed to initialize payment" }, { status: 500 })
    }

    // Save transaction record
    await savePaystackTransaction(
      donation.id,
      reference,
      amount,
      "pending",
      paystackResponse.data.authorization_url,
      paystackResponse.data.access_code,
    )

    return NextResponse.json({
      success: true,
      donation_id: donation.id,
      authorization_url: paystackResponse.data.authorization_url,
      access_code: paystackResponse.data.access_code,
      reference: paystackResponse.data.reference,
    })
  } catch (error) {
    console.error("Payment initialization error:", error)
    return NextResponse.json({ error: "Failed to initialize payment" }, { status: 500 })
  }
}
