import { createAdminClient } from "@/lib/supabase/admin"

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY
const PAYSTACK_PUBLIC_KEY = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY

function getPaystackSecretKey() {
  if (!PAYSTACK_SECRET_KEY) {
    throw new Error("PAYSTACK_SECRET_KEY is not configured")
  }
  return PAYSTACK_SECRET_KEY
}

export async function initializePaystackPayment(params: {
  email: string
  amount: number // in NGN (will be converted to kobo)
  reference: string
  metadata?: Record<string, any>
}) {
  const amountInKobo = params.amount * 100
  const secretKey = getPaystackSecretKey()

  const response = await fetch("https://api.paystack.co/transaction/initialize", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secretKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: params.email,
      amount: amountInKobo,
      reference: params.reference,
      metadata: params.metadata || {},
    }),
  })

  if (!response.ok) {
    let errorDetails = "Unknown error"
    try {
      const errorData = await response.json()
      errorDetails = errorData.message || errorData.error || JSON.stringify(errorData)
    } catch {
      errorDetails = `HTTP ${response.status}: ${response.statusText}`
    }
    console.error("Paystack API error:", {
      status: response.status,
      statusText: response.statusText,
      details: errorDetails,
    })
    throw new Error(`Paystack API error: ${errorDetails}`)
  }

  return response.json()
}

export async function verifyPaystackPayment(reference: string) {
  const secretKey = getPaystackSecretKey()

  const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${secretKey}`,
    },
  })

  if (!response.ok) {
    let errorDetails = "Unknown error"
    try {
      const errorData = await response.json()
      errorDetails = errorData.message || errorData.error || JSON.stringify(errorData)
    } catch {
      errorDetails = `HTTP ${response.status}: ${response.statusText}`
    }
    console.error("Paystack verification error:", {
      status: response.status,
      statusText: response.statusText,
      details: errorDetails,
    })
    throw new Error(`Paystack verification error: ${errorDetails}`)
  }

  return response.json()
}

export async function savePaystackTransaction(
  donationId: string,
  reference: string,
  amount: number,
  status: string,
  authorizationUrl?: string,
  accessCode?: string,
) {
  const supabase = createAdminClient()

  const { error } = await supabase.from("paystack_transactions").insert({
    donation_id: donationId,
    reference,
    amount_kobo: amount * 100,
    status,
    authorization_url: authorizationUrl,
    access_code: accessCode,
  })

  if (error) throw error
}

export async function updatePaystackTransaction(reference: string, status: string, paidAt?: string) {
  const supabase = createAdminClient()

  const { error } = await supabase
    .from("paystack_transactions")
    .update({
      status,
      paid_at: paidAt || null,
      updated_at: new Date().toISOString(),
    })
    .eq("reference", reference)

  if (error) throw error
}

/**
 * Marks a donation completed and adds it to its project's total, exactly once.
 * The status change is a single conditional UPDATE, so when the verify route
 * and the Paystack webhook both run for the same payment, only one of them
 * claims the row and adds to the project total.
 */
export async function completeDonation(donationId: string): Promise<{ alreadyCompleted: boolean }> {
  const supabase = createAdminClient()

  const { data: claimed, error } = await supabase
    .from("donations")
    .update({ payment_status: "completed", updated_at: new Date().toISOString() })
    .eq("id", donationId)
    .in("payment_status", ["pending", "failed"])
    .select("project_id, amount")

  if (error) throw error

  const donation = claimed?.[0]
  if (!donation) return { alreadyCompleted: true }

  if (donation.project_id) {
    const { error: projectError } = await supabase.rpc("increment_project_raised", {
      project_id: donation.project_id,
      amount: donation.amount,
    })
    if (projectError) {
      console.warn("Failed to update project amount_raised:", projectError)
    }
  }

  return { alreadyCompleted: false }
}

export async function getPaystackPublicKey() {
  return PAYSTACK_PUBLIC_KEY
}

// Shop-specific functions
export async function initializeShopPayment(params: {
  email: string
  amount: number // in NGN (will be converted to kobo)
  reference: string
  customer_name: string
  customer_phone: string
  orderId: string
}) {
  const amountInKobo = params.amount * 100
  const secretKey = getPaystackSecretKey()

  const response = await fetch("https://api.paystack.co/transaction/initialize", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secretKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: params.email,
      amount: amountInKobo,
      reference: params.reference,
      metadata: {
        type: "shop_order",
        orderId: params.orderId,
        customerName: params.customer_name,
        customerPhone: params.customer_phone,
      },
    }),
  })

  if (!response.ok) {
    let errorDetails = "Unknown error"
    try {
      const errorData = await response.json()
      errorDetails = errorData.message || errorData.error || JSON.stringify(errorData)
    } catch {
      errorDetails = `HTTP ${response.status}: ${response.statusText}`
    }
    console.error("Paystack API error:", {
      status: response.status,
      statusText: response.statusText,
      details: errorDetails,
    })
    throw new Error(`Paystack API error: ${errorDetails}`)
  }

  return response.json()
}

export async function saveShopOrder(
  orderId: string,
  reference: string,
  amount: number,
  status: string,
  authorizationUrl?: string,
  accessCode?: string,
) {
  const supabase = createAdminClient()

  // Update order with Paystack reference and metadata
  const { error } = await supabase
    .from("shop_orders_enhanced")
    .update({
      reference,
      metadata: {
        paystack_access_code: accessCode,
        authorization_url: authorizationUrl,
      },
    })
    .eq("id", orderId)

  if (error) throw error
}
