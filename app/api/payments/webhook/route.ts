import { type NextRequest, NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { updatePaystackTransaction } from "@/lib/paystack"
import { sendOrderConfirmationEmail, sendDigitalDownloadEmail, sendMembershipConfirmationEmail } from "@/lib/email/send-email"
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
    const supabase = createAdminClient()

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
      if (metadata?.type === "membership_registration") {
        const expiresAt = new Date()
        expiresAt.setFullYear(expiresAt.getFullYear() + 1)

        const { data: application, error: applicationError } = await supabase
          .from("membership_applications")
          .update({
            payment_status: "paid",
            membership_status: "active",
            paid_at: new Date().toISOString(),
            expires_at: expiresAt.toISOString().split("T")[0],
            updated_at: new Date().toISOString(),
          })
          .eq("payment_reference", reference)
          .select("*")
          .single()

        if (!applicationError && application) {
          await supabase.from("memberships").upsert(
            {
              membership_id: application.membership_id,
              payment_reference: reference,
              membership_type: application.membership_type,
              status: "active",
              start_date: new Date().toISOString().split("T")[0],
              end_date: expiresAt.toISOString().split("T")[0],
              branch_id: application.branch_id,
              membership_fee: application.amount,
              payment_status: "paid",
              renewal_date: expiresAt.toISOString().split("T")[0],
              notes: `Membership registration for ${application.first_name} ${application.last_name}`,
              application_data: application,
              last_renewed_at: new Date().toISOString(),
            },
            { onConflict: "membership_id" },
          )

          await sendMembershipConfirmationEmail(
            application.email,
            `${application.first_name} ${application.last_name}`,
            application.membership_id,
            application.membership_type,
            expiresAt.toISOString(),
          )
        }
      } else if (metadata?.type === "shop_order") {
        // Fetch order details before updating
        const { data: orderData } = await supabase
          .from("shop_orders_enhanced")
          .select("id, user_id, customer_email, customer_name, total, has_digital, promo_code_id")
          .eq("reference", reference)
          .single()

        // Handle shop order payment
        const { error: orderError } = await supabase
          .from("shop_orders_enhanced")
          .update({
            payment_status: "paid",
            payment_confirmed_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq("reference", reference)

        if (!orderError) {
          // If a promo code was used, increment its usage
          if (orderData?.promo_code_id) {
            await supabase.rpc("shop_increment_promo_usage", {
              p_promo_id: orderData.promo_code_id,
            })
          }

          // Fetch order items for email and digital-only delivery flow
          const { data: orderItems } = await supabase
            .from("shop_order_items_enhanced")
            .select("product_name, quantity, unit_price, product_type")
            .eq("order_id", orderData?.id)

          const isDigitalOnly = Boolean(orderItems?.length) && orderItems!.every((item: any) => item.product_type === "digital")

          if (isDigitalOnly) {
            await supabase
              .from("shop_orders_enhanced")
              .update({
                order_status: "delivered",
                delivered_at: new Date().toISOString(),
                status_note: "Digital order completed. Downloads are available.",
                updated_at: new Date().toISOString(),
              })
              .eq("reference", reference)
          }

          // Send order confirmation email
          if (orderData && orderItems) {
            await sendOrderConfirmationEmail(
              orderData.customer_email,
              orderData.customer_name,
              reference,
              orderData.total,
              orderItems.map((item: any) => ({
                productName: item.product_name,
                quantity: item.quantity,
                unitPrice: item.unit_price,
              })),
              orderData.has_digital
            )
          }

          // If order has digital products, fetch and send download links
          if (orderData?.has_digital) {
            const { data: downloads } = await supabase
              .from("shop_digital_downloads")
              .select("id, shop_products_enhanced:product_id(name), download_token")
              .eq("order_id", orderData.id)

            if (downloads && downloads.length > 0) {
              for (const download of downloads) {
                const product = (download as any).shop_products_enhanced
                const downloadLink = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/shop/download?token=${(download as any).download_token}`
                await sendDigitalDownloadEmail(
                  orderData.customer_email,
                  orderData.customer_name,
                  product?.name || "Your Digital Product",
                  downloadLink
                )
              }
            }
          }

          // Log activity
          await supabase.rpc("log_activity", {
            p_user_id: orderData?.user_id || null,
            p_action: "shop_order_paid",
            p_entity_type: "shop_order",
            p_entity_id: orderData?.id || null,
            p_details: {
              description: `Shop order payment completed (${reference})`,
              reference,
              amount: event.data.amount / 100,
              orderId: metadata.orderId,
            },
          })
        }
      } else {
        // Handle donation payment (existing logic)
        // Update transaction
        await updatePaystackTransaction(reference, "success", event.data.paid_at)

        // Log activity
        await supabase.rpc("log_activity", {
          p_user_id: null,
          p_action: "donation_completed",
          p_entity_type: "donation",
          p_entity_id: null,
          p_details: {
            description: `Donation payment completed via Paystack (${reference})`,
            reference,
            amount: event.data.amount / 100,
          },
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
