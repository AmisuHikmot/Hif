import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { initializeShopPayment } from "@/lib/paystack"
import crypto from "crypto"

interface OrderItem {
  productId: string
  quantity: number
}

interface OrderRequest {
  items: OrderItem[]
  customerName: string
  customerEmail: string
  customerPhone: string
  deliveryAddress: string
  promoCodeId?: string
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body: OrderRequest = await request.json()

    // Validate request
    if (!body.items || body.items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 })
    }

    if (!body.customerEmail || !body.customerName || !body.customerPhone) {
      return NextResponse.json(
        { error: "Missing customer information" },
        { status: 400 }
      )
    }

    // Generate order reference
    const reference = `shop_${Date.now()}_${crypto.randomBytes(4).toString("hex")}`

    // Fetch product details
    const { data: products, error: productsError } = await supabase
      .from("shop_products_enhanced")
      .select("id, name, price, stock, type")
      .in("id", body.items.map((i) => i.productId))

    if (productsError || !products) {
      return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
    }

    // Validate stock and calculate subtotal
    let subtotal = 0
    let hasDigital = false
    const orderItems: any[] = []

    for (const item of body.items) {
      const product = products.find((p) => p.id === item.productId)

      if (!product) {
        return NextResponse.json(
          { error: `Product not found: ${item.productId}` },
          { status: 404 }
        )
      }

      if (product.type === "physical" && product.stock < item.quantity) {
        return NextResponse.json(
          {
            error: `Insufficient stock for ${product.name}. Available: ${product.stock}`,
          },
          { status: 400 }
        )
      }

      const lineTotal = product.price * item.quantity
      subtotal += lineTotal

      if (product.type === "digital") {
        hasDigital = true
      }

      orderItems.push({
        productId: item.productId,
        productName: product.name,
        productType: product.type,
        quantity: item.quantity,
        unitPrice: product.price,
        subtotal: lineTotal,
      })
    }

    // Calculate discount if promo code provided
    let discountAmount = 0
    let promoCodeId = null

    if (body.promoCodeId) {
      const { data: promoData, error: promoError } = await supabase
        .from("shop_promo_codes")
        .select("id, discount_type, discount_value, max_uses, used_count")
        .eq("id", body.promoCodeId)
        .single()

      if (!promoError && promoData) {
        // Validate promo
        if (promoData.discount_type === "percentage") {
          discountAmount = (subtotal * promoData.discount_value) / 100
        } else {
          discountAmount = promoData.discount_value
        }
        promoCodeId = promoData.id
      }
    }

    // Calculate shipping
    const shippingFee = hasDigital && orderItems.every((i) => i.productType === "digital") ? 0 : 1500

    // Calculate total
    const total = Math.max(0, subtotal + shippingFee - discountAmount)

    // Create order in database
    const { data: orderData, error: orderError } = await supabase
      .from("shop_orders_enhanced")
      .insert({
        reference,
        customer_name: body.customerName,
        customer_email: body.customerEmail,
        customer_phone: body.customerPhone,
        delivery_address: body.deliveryAddress || null,
        subtotal,
        shipping_fee: shippingFee,
        discount_amount: discountAmount,
        total,
        promo_code_id: promoCodeId,
        payment_status: "pending",
        order_status: "processing",
        has_digital: hasDigital,
        metadata: {
          items_count: body.items.length,
          created_from: "checkout",
        },
      })
      .select("id")
      .single()

    if (orderError || !orderData) {
      console.error("[v0] Failed to create order:", orderError)
      return NextResponse.json({ error: "Failed to create order" }, { status: 500 })
    }

    // Insert order items
    const { error: itemsError } = await supabase
      .from("shop_order_items_enhanced")
      .insert(
        orderItems.map((item) => ({
          order_id: orderData.id,
          product_id: item.productId,
          product_name: item.productName,
          product_type: item.productType,
          quantity: item.quantity,
          unit_price: item.unitPrice,
          subtotal: item.subtotal,
        }))
      )

    if (itemsError) {
      console.error("[v0] Failed to insert order items:", itemsError)
      // Clean up order
      await supabase.from("shop_orders_enhanced").delete().eq("id", orderData.id)
      return NextResponse.json({ error: "Failed to create order items" }, { status: 500 })
    }

    // Initialize Paystack payment
    const paystackResponse = await initializeShopPayment({
      email: body.customerEmail,
      amount: total,
      reference,
      customer_name: body.customerName,
      customer_phone: body.customerPhone,
      orderId: orderData.id,
    })

    if (!paystackResponse.data || !paystackResponse.data.authorization_url) {
      console.error("[v0] Paystack initialization failed:", paystackResponse)
      return NextResponse.json(
        { error: "Failed to initialize payment" },
        { status: 500 }
      )
    }

    return NextResponse.json({
      orderId: orderData.id,
      reference,
      total,
      authorizationUrl: paystackResponse.data.authorization_url,
      accessCode: paystackResponse.data.access_code,
    })
  } catch (error) {
    console.error("[v0] Order initialization error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
