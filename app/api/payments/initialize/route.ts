import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { initializePaystackPayment, savePaystackTransaction } from "@/lib/paystack"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { amount, email, donorName, purpose } = body

    console.log("[v0] Payment initialize request:", { amount, email, donorName, purpose })

    // Validate required fields
    if (!amount || amount <= 0) {
      console.error("[v0] Invalid amount:", amount)
      return NextResponse.json({ error: "Invalid amount. Amount must be greater than 0" }, { status: 400 })
    }

    if (!email || !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      console.error("[v0] Invalid email:", email)
      return NextResponse.json({ error: "Invalid email address. Please provide a valid email" }, { status: 400 })
    }

    if (!donorName || donorName.trim() === "") {
      console.error("[v0] Missing donor name")
      return NextResponse.json({ error: "Donor name is required" }, { status: 400 })
    }

    // Check Paystack secret key
    if (!process.env.PAYSTACK_SECRET_KEY) {
      console.error("[v0] PAYSTACK_SECRET_KEY not configured")
      return NextResponse.json({ error: "Payment service is not properly configured" }, { status: 500 })
    }

    const supabase = await createClient()

    // Get the current user (optional - for logged in users)
    let userId: string | null = null
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      userId = user?.id || null
    } catch (authError) {
      console.log("[v0] Auth check skipped (anonymous donation allowed)")
    }

    // Create donation record
    console.log("[v0] Creating donation record...")
    const { data: donation, error: donationError } = await supabase
      .from("donations")
      .insert({
        user_id: userId,
        amount,
        currency: "NGN",
        donor_name: donorName,
        donor_email: email,
        message: purpose || "General Donation",
        payment_status: "pending",
      })
      .select()
      .single()

    if (donationError || !donation) {
      console.error("[v0] Donation creation error:", donationError)
      return NextResponse.json({ error: "Failed to create donation record. Please try again." }, { status: 500 })
    }

    console.log("[v0] Donation created:", donation.id)

    // Generate unique reference for this transaction
    const reference = `${donation.id}-${Date.now()}`

    // Initialize Paystack payment
    console.log("[v0] Initializing Paystack payment...")
    let paystackResponse: any
    try {
      paystackResponse = await initializePaystackPayment({
        email,
        amount,
        reference,
        metadata: {
          donation_id: donation.id,
          donor_name: donorName,
          purpose: purpose || "General Donation",
        },
      })
    } catch (paystackError) {
      console.error("[v0] Paystack initialization error:", paystackError)
      return NextResponse.json(
        { error: "Failed to initialize payment. Please check your connection and try again." },
        { status: 500 },
      )
    }

    if (!paystackResponse.status) {
      console.error("[v0] Paystack response status false:", paystackResponse)
      return NextResponse.json(
        {
          error: paystackResponse.message || "Failed to initialize payment with Paystack",
        },
        { status: 500 },
      )
    }

    // Save transaction record
    console.log("[v0] Saving transaction record...")
    try {
      await savePaystackTransaction(
        donation.id,
        reference,
        amount,
        "pending",
        paystackResponse.data.authorization_url,
        paystackResponse.data.access_code,
      )
    } catch (txError) {
      console.error("[v0] Transaction save error:", txError)
      // Don't fail here - transaction can be created later
    }

    console.log("[v0] Payment initialized successfully:", reference)
    return NextResponse.json({
      success: true,
      donation_id: donation.id,
      authorization_url: paystackResponse.data.authorization_url,
      access_code: paystackResponse.data.access_code,
      reference: paystackResponse.data.reference,
    })
  } catch (error) {
    console.error("[v0] Payment initialization error:", error)
    const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred"
    return NextResponse.json({ error: `Failed to initialize payment: ${errorMessage}` }, { status: 500 })
  }
}
