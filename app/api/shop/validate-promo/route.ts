import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json()

    if (!code || typeof code !== "string") {
      return NextResponse.json({ error: "Promo code is required" }, { status: 400 })
    }

    const supabase = await createClient()

    // Call the promo validation function
    const { data, error } = await supabase
      .rpc("shop_validate_promo_code", { p_code: code.toUpperCase() })

    if (error) {
      console.error("[v0] Promo validation error:", error)
      return NextResponse.json({ error: "Failed to validate promo code" }, { status: 500 })
    }

    if (!data || data.length === 0) {
      return NextResponse.json(
        { error: "Promo code not found", valid: false },
        { status: 404 }
      )
    }

    const promo = data[0]

    if (!promo.is_valid) {
      return NextResponse.json(
        {
          valid: false,
          error: promo.error_message,
        },
        { status: 400 }
      )
    }

    return NextResponse.json({
      valid: true,
      id: promo.id,
      code: promo.code,
      discountType: promo.discount_type,
      discountValue: parseFloat(promo.discount_value),
    })
  } catch (error) {
    console.error("[v0] Promo validation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
