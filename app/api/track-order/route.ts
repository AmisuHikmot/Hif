import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

// ── Rate limiting (simple in-memory, resets on cold start) ─────
const rateLimit = new Map<string, { count: number; resetAt: number }>()

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const windowMs = 60_000 // 1 minute
  const maxRequests = 10

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

    const supabase = await createClient()

    // ── Search by reference ──────────────────────────────────

    if (reference) {
      const { data: order, error: orderError } = await supabase
        .from("shop_orders_enhanced")
        .select(`
          id,
          reference,
          customer_name,
          customer_email,
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

    if (email) {
      const { data: orders, error: ordersError } = await supabase
        .from("shop_orders_enhanced")
        .select(`
          id,
          reference,
          customer_name,
          customer_email,
          total,
          payment_status,
          order_status,
          created_at,
          shop_order_items_enhanced (
            id,
            product_name,
            product_type,
            quantity
          )
        `)
        .eq("customer_email", email)
        .order("created_at", { ascending: false })

      if (ordersError) {
        console.error("[track-order] Orders lookup error:", ordersError)
        return NextResponse.json(
          { error: "Failed to retrieve orders" },
          { status: 400 }
        )
      }

      // Return same "not found" message regardless of whether
      // email exists — prevents email enumeration
      if (!orders || orders.length === 0) {
        return NextResponse.json(
          { error: "No orders found for this email address" },
          { status: 404 }
        )
      }

      return NextResponse.json({ orders })
    }

  } catch (error) {
    console.error("[track-order] Unexpected error:", error)
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    )
  }
}
