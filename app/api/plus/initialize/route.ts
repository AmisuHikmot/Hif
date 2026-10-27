import { type NextRequest, NextResponse } from "next/server"
import { randomBytes } from "node:crypto"
import { createAdminClient } from "@/lib/supabase/admin"
import { initializePaystackPayment } from "@/lib/paystack"
import { PLUS_PLANS, isPlusPlan } from "@/lib/plus/plans"

/** Starts a Plus payment for the signed-in person. The app sends its access token. */
export async function POST(request: NextRequest) {
  try {
    const { plan } = await request.json()
    if (!isPlusPlan(plan)) return NextResponse.json({ error: "Unknown plan" }, { status: 400 })
    const bearer = request.headers.get("authorization")?.match(/^Bearer (.+)$/i)?.[1]
    if (!bearer) return NextResponse.json({ error: "Sign in to buy Plus" }, { status: 401 })
    const db = createAdminClient()
    const {
      data: { user },
    } = await db.auth.getUser(bearer)
    if (!user?.email) return NextResponse.json({ error: "Sign in to buy Plus" }, { status: 401 })

    const reference = `plus_${Date.now()}_${randomBytes(4).toString("hex")}`
    const res = await initializePaystackPayment({
      email: user.email,
      amount: PLUS_PLANS[plan].naira,
      reference,
      metadata: { type: "plus", plan, user_id: user.id },
    })
    return NextResponse.json({ reference, authorization_url: res.data.authorization_url })
  } catch (e) {
    console.error("[plus] initialize:", e instanceof Error ? e.message : e)
    return NextResponse.json({ error: "Could not start the payment." }, { status: 500 })
  }
}
