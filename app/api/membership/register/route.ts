import { type NextRequest, NextResponse } from "next/server"
import crypto from "crypto"
import { createAdminClient } from "@/lib/supabase/admin"
import { initializePaystackPayment } from "@/lib/paystack"

const MEMBERSHIP_FEES: Record<string, number> = {
  regular: 10000,
  associate: 8000,
  youth: 5000,
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const required = ["firstName", "lastName", "email", "phone", "address", "city", "state", "membershipType"]
    const missing = required.filter((field) => !body[field])

    if (missing.length) {
      return NextResponse.json({ error: `Missing required fields: ${missing.join(", ")}` }, { status: 400 })
    }

    if (!body.termsAccepted) {
      return NextResponse.json({ error: "You must accept the membership terms" }, { status: 400 })
    }

    const amount = MEMBERSHIP_FEES[body.membershipType]
    if (!amount) {
      return NextResponse.json({ error: "Invalid membership type" }, { status: 400 })
    }

    const supabase = createAdminClient()
    const membershipId = `HIF-${new Date().getFullYear()}-${crypto.randomBytes(3).toString("hex").toUpperCase()}`
    const reference = `hif_mem_${Date.now()}_${crypto.randomBytes(4).toString("hex")}`

    const { data: application, error } = await supabase
      .from("membership_applications")
      .insert({
        membership_id: membershipId,
        payment_reference: reference,
        first_name: body.firstName,
        last_name: body.lastName,
        email: String(body.email).toLowerCase().trim(),
        phone: body.phone,
        date_of_birth: body.dateOfBirth || null,
        gender: body.gender || null,
        address: body.address,
        city: body.city,
        state: body.state,
        postal_code: body.postalCode || null,
        country: body.country || "nigeria",
        membership_type: body.membershipType,
        branch_id: body.branchId || null,
        interests: body.interests || [],
        skills: body.skills || null,
        referral_source: body.referralSource || null,
        communications_opt_in: Boolean(body.communicationsOptIn),
        amount,
      })
      .select("id")
      .single()

    if (error || !application) {
      console.error("[membership] application insert failed:", error)
      return NextResponse.json({ error: "Failed to save membership application" }, { status: 500 })
    }

    const payment = await initializePaystackPayment({
      email: String(body.email).toLowerCase().trim(),
      amount,
      reference,
      metadata: {
        type: "membership_registration",
        applicationId: application.id,
        membershipId,
        membershipType: body.membershipType,
        name: `${body.firstName} ${body.lastName}`,
      },
    })

    return NextResponse.json({
      membershipId,
      reference,
      amount,
      authorizationUrl: payment.data?.authorization_url,
      accessCode: payment.data?.access_code,
    })
  } catch (error) {
    console.error("[membership] register error:", error)
    return NextResponse.json({ error: "Failed to start membership registration" }, { status: 500 })
  }
}
