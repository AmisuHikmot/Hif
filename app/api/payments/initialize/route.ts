import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { initializePaystackPayment, savePaystackTransaction } from "@/lib/paystack"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { amount, email, donorName, purpose } = body

    console.log("[v0] Payment initialize request:", { amount, email, donorName, purpose })

    if (!amount || typeof amount !== "number" || amount <= 0) {
      console.error("[v0] Invalid amount:", amount)
      return NextResponse.json({ error: "Invalid amount. Amount must be a number greater than 0" }, { status: 400 })
    }

    if (!email || !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      console.error("[v0] Invalid email:", email)
      return NextResponse.json(
        { error: "Invalid email address. Please provide a valid email format (e.g., user@example.com)" },
        { status: 400 },
      )
    }

    if (!donorName || typeof donorName !== "string" || donorName.trim().length === 0) {
      console.error("[v0] Invalid donor name:", donorName)
      return NextResponse.json({ error: "Donor name is required and must be a non-empty string" }, { status: 400 })
    }

    if (!process.env.PAYSTACK_SECRET_KEY) {
      console.error("[v0] PAYSTACK_SECRET_KEY not configured in environment")
      return NextResponse.json(
        { error: "Payment service is not properly configured. Please contact support." },
        { status: 500 },
      )
    }

    const supabase = await createClient()

    let userId: string | null = null
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      userId = user?.id || null
      console.log("[v0] User authenticated:", userId || "anonymous")
    } catch (authError) {
      console.log(
        "[v0] Auth check skipped - allowing anonymous donation:",
        authError instanceof Error ? authError.message : String(authError),
      )
    }

    // Create donation record with detailed error handling
    console.log("[v0] Creating donation record...")

    // Use service role client to bypass RLS issues
    const serviceRoleClient = createClient()

    const { data: donation, error: donationError } = await (await serviceRoleClient)
      .from("donations")
      .insert({
        user_id: userId,
        amount: Math.round(amount), // Ensure integer amount in kobo
        currency: "NGN",
        donor_name: donorName.trim(),
        donor_email: email.toLowerCase().trim(),
        message: purpose?.trim() || "General Donation",
        payment_status: "pending",
        created_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (donationError) {
      console.error("[v0] Donation creation error:", {
        code: donationError.code,
        message: donationError.message,
        details: donationError.details,
      })
      return NextResponse.json(
        {
          error: "Failed to create donation record. This may be a temporary issue. Please try again.",
          code: donationError.code,
        },
        { status: 500 },
      )
    }

    if (!donation?.id) {
      console.error("[v0] Donation created but no ID returned")
      return NextResponse.json({ error: "Donation record created but missing ID" }, { status: 500 })
    }

    console.log("[v0] Donation created successfully:", donation.id)

    // Generate unique reference for this transaction
    const reference = `hif-${donation.id.slice(0, 8)}-${Date.now()}`

    console.log("[v0] Initializing Paystack payment with amount:", amount, "kobo")
    let paystackResponse: any
    try {
      paystackResponse = await initializePaystackPayment({
        email: email.toLowerCase().trim(),
        amount: Math.round(amount), // Ensure integer for Paystack
        reference,
        metadata: {
          donation_id: donation.id,
          donor_name: donorName.trim(),
          purpose: purpose?.trim() || "General Donation",
          timestamp: new Date().toISOString(),
        },
      })
      console.log("[v0] Paystack response received:", {
        status: paystackResponse.status,
        ref: paystackResponse.data?.reference,
      })
    } catch (paystackError) {
      console.error("[v0] Paystack initialization error:", {
        message: paystackError instanceof Error ? paystackError.message : String(paystackError),
        stack: paystackError instanceof Error ? paystackError.stack : undefined,
      })
      return NextResponse.json(
        {
          error: "Failed to initialize payment with Paystack. Please check your internet connection and try again.",
          details: process.env.NODE_ENV === "development" ? String(paystackError) : undefined,
        },
        { status: 500 },
      )
    }

    if (!paystackResponse?.status) {
      console.error("[v0] Paystack returned non-success status:", paystackResponse)
      return NextResponse.json(
        {
          error: paystackResponse?.message || "Paystack payment initialization failed. Please try again.",
        },
        { status: 500 },
      )
    }

    if (!paystackResponse?.data?.authorization_url) {
      console.error("[v0] Paystack missing authorization_url:", paystackResponse.data)
      return NextResponse.json({ error: "Invalid Paystack response: missing authorization URL" }, { status: 500 })
    }

    console.log("[v0] Saving transaction record...")
    try {
      await savePaystackTransaction(
        donation.id,
        paystackResponse.data.reference || reference,
        amount,
        "pending",
        paystackResponse.data.authorization_url,
        paystackResponse.data.access_code || "",
      )
      console.log("[v0] Transaction record saved")
    } catch (txError) {
      // Log but don't fail - user can still proceed to payment
      console.warn(
        "[v0] Transaction record save failed (non-critical):",
        txError instanceof Error ? txError.message : String(txError),
      )
    }

    console.log("[v0] Payment initialized successfully for donation:", donation.id)
    return NextResponse.json({
      success: true,
      donation_id: donation.id,
      authorization_url: paystackResponse.data.authorization_url,
      access_code: paystackResponse.data.access_code,
      reference: paystackResponse.data.reference || reference,
    })
  } catch (error) {
    console.error("[v0] Unexpected error in payment initialization:", {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    })
    return NextResponse.json(
      {
        error: "An unexpected error occurred while initializing payment. Please try again.",
        details: process.env.NODE_ENV === "development" ? String(error) : undefined,
      },
      { status: 500 },
    )
  }
}
