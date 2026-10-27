import { type NextRequest, NextResponse } from "next/server"
import { verifyPaystackPayment } from "@/lib/paystack"
import { grantPlus } from "@/lib/plus/grant"

/** The app calls this when the person returns from Paystack; the webhook does the same job. */
export async function POST(request: NextRequest) {
  try {
    const { reference } = await request.json()
    if (typeof reference !== "string" || !reference.startsWith("plus_")) {
      return NextResponse.json({ success: false }, { status: 400 })
    }
    const v = await verifyPaystackPayment(reference)
    const d = v?.data
    if (d?.status !== "success" || d?.metadata?.type !== "plus") return NextResponse.json({ success: false })
    const r = await grantPlus(String(d.metadata.user_id), String(d.metadata.plan), reference, Math.floor(d.amount / 100))
    return NextResponse.json({ success: true, validTo: r.validTo ?? null })
  } catch (e) {
    console.error("[plus] verify:", e instanceof Error ? e.message : e)
    return NextResponse.json({ success: false }, { status: 500 })
  }
}
