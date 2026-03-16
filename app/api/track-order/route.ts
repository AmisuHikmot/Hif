import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const reference = searchParams.get("reference")
    const email = searchParams.get("email")

    if (!reference && !email) {
      return NextResponse.json(
        { error: "Either reference or email is required" },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // If searching by reference
    if (reference) {
      const { data: order, error: orderError } = await supabase
        .from("shop_orders_enhanced")
        .select(
          `
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
          shop_order_items_enhanced:shop_order_items_enhanced(*),
          order_status_history:order_status_history(*)
        `
        )
        .eq("reference", reference)
        .order("created_at", { ascending: false })
        .single()

      if (orderError || !order) {
        console.error("[v0] Order lookup error:", orderError)
        return NextResponse.json(
          { error: "Order not found", orders: [] },
          { status: 404 }
        )
      }

      return NextResponse.json({ order })
    }

    // If searching by email
    if (email) {
      const { data: orders, error: ordersError } = await supabase
        .from("shop_orders_enhanced")
        .select(
          `
          id,
          reference,
          customer_name,
          customer_email,
          total,
          payment_status,
          order_status,
          created_at,
          shop_order_items_enhanced:shop_order_items_enhanced(product_name)
        `
        )
        .eq("customer_email", email)
        .order("created_at", { ascending: false })

      if (ordersError) {
        console.error("[v0] Orders lookup error:", ordersError)
        return NextResponse.json(
          { error: "Failed to retrieve orders", orders: [] },
          { status: 400 }
        )
      }

      if (!orders || orders.length === 0) {
        return NextResponse.json(
          { error: "No orders found for this email", orders: [] },
          { status: 404 }
        )
      }

      return NextResponse.json({ orders, email })
    }
  } catch (error) {
    console.error("[v0] Track order API error:", error)
    return NextResponse.json(
      { error: "Internal server error", orders: [] },
      { status: 500 }
    )
  }
}
