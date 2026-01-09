import { createClient } from "@/lib/supabase/server"

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY
const PAYSTACK_PUBLIC_KEY = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY

if (!PAYSTACK_SECRET_KEY) {
  throw new Error("PAYSTACK_SECRET_KEY is not configured")
}

export async function initializePaystackPayment(params: {
  email: string
  amount: number // in NGN (will be converted to kobo)
  reference: string
  metadata?: Record<string, any>
}) {
  const amountInKobo = params.amount * 100

  const response = await fetch("https://api.paystack.co/transaction/initialize", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
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
    throw new Error("Failed to initialize Paystack payment")
  }

  return response.json()
}

export async function verifyPaystackPayment(reference: string) {
  const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
    },
  })

  if (!response.ok) {
    throw new Error("Failed to verify Paystack payment")
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
  const supabase = await createClient()

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
  const supabase = await createClient()

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

export async function getPaystackPublicKey() {
  return PAYSTACK_PUBLIC_KEY
}
