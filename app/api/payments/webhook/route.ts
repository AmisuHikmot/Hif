import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { updatePaystackTransaction } from "@/lib/paystack"
import crypto from "crypto"

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY

export async function POST(request: NextRequest) {
  try {
    // Verify Paystack webhook signature
    const signature = request.headers.get("x-paystack-signature")
    const body = await request.text()

    if (!signature) {
      return NextResponse.json({ error: "No signature provided" }, { status: 400 })
    }

    // Verify the signature
    const hash = crypto
      .createHmac("sha512", PAYSTACK_SECRET_KEY || "")
      .update(body)
      .digest("hex")

    if (hash !== signature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 403 })
    }

    const event = JSON.parse(body)
    const supabase = await createClient()

    // Log webhook
    await supabase.from("paystack_webhooks").insert({
      reference: event.data?.reference,
      event_type: event.event,
      payload: event.data,
    })

    // Handle charge.success event
    if (event.event === "charge.success") {
      const { reference, status, metadata } = event.data

      // Check transaction type
      if (metadata?.type === "shop_order") {
        // Handle shop order payment
        const { error: orderError } = await supabase
          .from("shop_orders_enhanced")
          .update({
            payment_status: "paid",
            updated_at: new Date().toISOString(),
          })
          .eq("reference", reference)

        if (!orderError) {
          // If a promo code was used, increment its usage
          const { data: orderData } = await supabase
            .from("shop_orders_enhanced")
            .select("promo_code_id")
            .eq("reference", reference)
            .single()

          if (orderData?.promo_code_id) {
            await supabase.rpc("shop_increment_promo_usage", {
              p_promo_id: orderData.promo_code_id,
            })
          }

          // Log activity
          await supabase.from("activity_logs").insert({
            action: "shop_order_paid",
            description: `Shop order payment completed (${reference})`,
            metadata: { reference, amount: event.data.amount / 100, orderId: metadata.orderId },
          })
        }
      } else {
        // Handle donation payment (existing logic)
        // Update transaction
        await updatePaystackTransaction(reference, "success", event.data.paid_at)

        // Log activity
        await supabase.from("activity_logs").insert({
          action: "donation_completed",
          description: `Donation payment completed via Paystack (${reference})`,
          metadata: { reference, amount: event.data.amount / 100 },
        })
      }
    }

    // Handle charge.failed event
    if (event.event === "charge.failed") {
      const { reference } = event.data
      await updatePaystackTransaction(reference, "failed")
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Webhook error:", error)
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 })
  }
}
