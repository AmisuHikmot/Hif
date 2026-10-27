import { createAdminClient } from "@/lib/supabase/admin"
import { PLUS_PLANS, isPlusPlan } from "@/lib/plus/plans"

/**
 * Grants one paid period of Plus. Safe to call twice for the same payment
 * (webhook and app verify both do): the reference is unique. A new period
 * starts when the current one ends, so paying early loses nothing.
 */
export async function grantPlus(userId: string, plan: string, reference: string, paidNaira: number) {
  if (!isPlusPlan(plan)) throw new Error("Unknown plan")
  const p = PLUS_PLANS[plan]
  if (paidNaira < p.naira) throw new Error("Amount paid is below the plan price")
  const db = createAdminClient()

  const { data: dup } = await db.from("entitlements").select("id").eq("reference", reference).maybeSingle()
  if (dup) return { already: true }

  const { data: cur } = await db
    .from("entitlements")
    .select("valid_to")
    .eq("user_id", userId)
    .eq("entitlement", "plus")
    .is("revoked_at", null)
    .gt("valid_to", new Date().toISOString())
    .order("valid_to", { ascending: false })
    .limit(1)
    .maybeSingle()
  const start = cur ? new Date(cur.valid_to) : new Date()
  const end = new Date(start.getTime() + p.days * 86400000)
  const { error } = await db.from("entitlements").insert({
    user_id: userId,
    plan,
    valid_from: start.toISOString(),
    valid_to: end.toISOString(),
    reference,
  })
  if (error && error.code !== "23505") throw new Error(error.message)
  return { already: false, validTo: end.toISOString() }
}
