import { NextRequest, NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { sendEmail } from "@/lib/email/send-email"

// ── Rate limiting (simple in-memory, resets on cold start) ─────
const rateLimit = new Map<string, { count: number; resetAt: number }>()

function checkRateLimit(ip: string, maxRequests = 10): boolean {
  const now = Date.now()
  const windowMs = 60_000 // 1 minute

  const entry = rateLimit.get(ip)
  if (!entry || now > entry.resetAt) {
    rateLimit.set(ip, { count: 1, resetAt: now + windowMs })
    return true
  }
  if (entry.count >= maxRequests) return false
  entry.count++
  return true
}

function getClientIp(request: NextRequest): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown"
  )
}

// ── Address masking — only return City, State ──────────────────
function maskAddress(address: string | null | undefined): string {
  if (!address) return ""
  const parts = address.split(",").map((p) => p.trim()).filter(Boolean)
  if (parts.length === 0) return ""
  if (parts.length === 1) return parts[0]
  return `${parts[parts.length - 2]}, ${parts[parts.length - 1]}`
}

// ── GET /api/track-order ───────────────────────────────────────

export async function GET(request: NextRequest) {
  try {
    // Rate limit check
    const ip = getClientIp(request)
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: "Too many requests. Please wait a moment and try again." },
        { status: 429 }
      )
    }

    const { searchParams } = new URL(request.url)
    const reference = searchParams.get("reference")?.trim()
    const email     = searchParams.get("email")?.trim()

    if (!reference && !email) {
      return NextResponse.json(
        { error: "Either reference or email is required" },
        { status: 400 }
      )
    }

    const supabase = createAdminClient()

    // ── Search by reference ──────────────────────────────────

    if (reference) {
      const { data: order, error: orderError } = await supabase
        .from("shop_orders_enhanced")
        .select(`
          id,
          reference,
          customer_name,
          customer_email,
          customer_phone,
          delivery_address,
          total,
          subtotal,
          shipping_fee,
          discount_amount,
          payment_status,
          order_status,
          status_note,
          has_digital,
          estimated_delivery_date,
          created_at,
          payment_confirmed_at,
          processing_at,
          ready_for_dispatch_at,
          out_for_delivery_at,
          delivered_at,
          cancelled_at,
          cancellation_reason,
          shop_order_items_enhanced (
            id,
            product_id,
            product_name,
            product_type,
            quantity,
            unit_price,
            subtotal,
            shop_products_enhanced (
              image_url
            ),
            shop_digital_downloads (
              download_token,
              expires_at,
              download_count,
              max_downloads
            )
          ),
          order_status_history (
            id,
            status,
            note,
            changed_at
          )
        `)
        .eq("reference", reference)
        .single()

      if (orderError || !order) {
        console.error("[track-order] Order lookup error:", orderError)
        return NextResponse.json(
          { error: "Order not found" },
          { status: 404 }
        )
      }

      // Flatten digital download fields onto each item
      // and attach image_url from the product join
      const normalizedItems = (order.shop_order_items_enhanced ?? []).map((item: any) => {
        const download = item.shop_digital_downloads?.[0] ?? null
        const product  = item.shop_products_enhanced ?? null
        return {
          id:             item.id,
          product_id:     item.product_id,
          product_name:   item.product_name,
          product_type:   item.product_type,
          quantity:       item.quantity,
          unit_price:     item.unit_price,
          subtotal:       item.subtotal,
          image_url:      product?.image_url ?? null,
          // Flattened from shop_digital_downloads
          download_token: download?.download_token ?? null,
          expires_at:     download?.expires_at     ?? null,
          download_count: download?.download_count ?? null,
          max_downloads:  download?.max_downloads  ?? null,
        }
      })

      // Sort status history — most recent first
      const sortedHistory = (order.order_status_history ?? []).sort(
        (a: any, b: any) =>
          new Date(b.changed_at).getTime() - new Date(a.changed_at).getTime()
      )

      const normalizedOrder = {
        ...order,
        // Mask full address — only expose City, State
        delivery_address:          maskAddress(order.delivery_address),
        shop_order_items_enhanced: normalizedItems,
        order_status_history:      sortedHistory,
      }

      return NextResponse.json({ order: normalizedOrder })
    }

    // ── Search by email ──────────────────────────────────────
    //
    // References are emailed to the address, not returned. Returning them
    // would let anyone who knows an address read its orders, and a reference
    // is enough to see delivery details and download links.

    if (email) {
      const normalized = email.toLowerCase()
      const message = "If there are orders for this address, we have emailed their references to it."

      // Limit per address as well as per IP, so one inbox cannot be flooded.
      if (!checkRateLimit(`email:${normalized}`, 3)) {
        return NextResponse.json({ message })
      }

      const { data: orders } = await supabase
        .from("shop_orders_enhanced")
        .select("reference, total, order_status, created_at")
        .ilike("customer_email", normalized)
        .order("created_at", { ascending: false })
        .limit(10)

      if (orders && orders.length > 0) {
        const rows = orders
          .map(
            (o) =>
              `<li><strong>${o.reference}</strong> &mdash; ${new Date(o.created_at).toDateString()} &mdash; ${o.order_status}</li>`
          )
          .join("")
        await sendEmail(
          normalized,
          "Your HIF order references",
          `<p>Assalamu alaikum,</p><p>Here are your recent HIF orders. Enter a reference on the track-order page to see its status.</p><ul>${rows}</ul><p>If you did not ask for this, you can ignore this email.</p>`
        )
      }

      // Same answer whether or not the address has orders, so addresses
      // cannot be probed.
      return NextResponse.json({ message })
    }

  } catch (error) {
    console.error("[track-order] Unexpected error:", error)
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    )
  }
}
