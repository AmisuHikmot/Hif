import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"

/**
 * POST /api/account/delete   body: { confirm: "DELETE" }
 *
 * Permanently deletes the signed-in person's account (website cookie or the
 * mobile app's Bearer token). Personal rows are removed; donation and order
 * records are kept for the books but stripped of anything that names the
 * person. Idempotent: if a step fails the sign-in account is left in place so
 * the request can simply be repeated.
 */

// Rows that only matter to the person: removed outright.
const PERSONAL: Array<[table: string, column: string]> = [
  ["azkar_completions", "user_id"],
  ["chat_messages", "user_id"],
  ["dua_wall", "user_id"],
  ["event_registrations", "user_id"],
  ["habit_tracking", "user_id"],
  ["membership", "user_id"],
  ["memberships", "user_id"],
  ["notifications", "user_id"],
  ["prayer_logs", "user_id"],
  ["prayer_times", "user_id"],
  ["quran_bookmarks", "user_id"],
  ["quran_progress", "user_id"],
  ["reward_points", "user_id"],
  ["saved_content", "user_id"],
  ["scholar_bookings", "user_id"],
  ["subscriptions", "user_id"],
  ["tasbeeh_logs", "user_id"],
  ["testimonials", "user_id"],
  ["user_achievements", "user_id"],
  ["user_badges", "user_id"],
  ["user_challenges", "user_id"],
  ["user_journals", "user_id"],
  ["user_logs", "user_id"],
  ["user_ramadan_tracking", "user_id"],
  ["volunteers", "user_id"],
  ["activity_log", "user_id"],
  ["activity_logs", "user_id"],
  ["search_analytics", "user_id"],
]

// Content that outlives the person: keep it, drop the link to them.
const DETACH: Array<[table: string, column: string]> = [
  ["events", "created_by"],
  ["events", "organizer_id"],
  ["announcements", "created_by"],
  ["media", "created_by"],
  ["publications", "author_id"],
  ["group_chats", "creator_id"],
  ["contact_submissions", "replied_by"],
  ["questions", "user_id"],
  ["shop_orders", "user_id"],
]

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null)
  if (!body || body.confirm !== "DELETE") {
    return NextResponse.json({ error: 'Send { "confirm": "DELETE" } to delete your account.' }, { status: 400 })
  }

  const admin = createAdminClient()
  const bearer = request.headers.get("authorization")?.match(/^Bearer (.+)$/i)?.[1]
  const {
    data: { user },
  } = bearer ? await admin.auth.getUser(bearer) : await (await createClient()).auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { data: profile } = await admin.from("profiles").select("role, is_admin").eq("id", user.id).maybeSingle()
  if (profile && (profile.is_admin || profile.role === "admin" || profile.role === "super_admin")) {
    return NextResponse.json(
      { error: "Staff accounts are removed by another administrator so the audit trail stays intact." },
      { status: 403 },
    )
  }

  // Exact matches only: ilike would treat "_" and "%" in an address as wildcards
  // and could reach someone else's rows.
  const emails = user.email ? [...new Set([user.email, user.email.toLowerCase()])] : []

  // A paid order that has not arrived still needs its delivery details.
  const byUser = await admin
    .from("shop_orders_enhanced")
    .select("reference")
    .eq("payment_status", "paid")
    .not("order_status", "in", "(delivered,cancelled)")
    .eq("user_id", user.id)
    .limit(1)
  const byEmail = emails.length
    ? await admin
        .from("shop_orders_enhanced")
        .select("reference")
        .eq("payment_status", "paid")
        .not("order_status", "in", "(delivered,cancelled)")
        .in("customer_email", emails)
        .limit(1)
    : { data: [] as unknown[] }
  if ((byUser.data?.length ?? 0) > 0 || (byEmail.data?.length ?? 0) > 0) {
    return NextResponse.json(
      { error: "You have an order on its way. Please delete your account after it arrives." },
      { status: 409 },
    )
  }

  const fail = (step: string, message: string) => {
    console.error(`[account-delete] ${step}: ${message}`)
    return NextResponse.json({ error: "We could not finish deleting your account. Please try again." }, { status: 500 })
  }

  for (const [table, column] of PERSONAL) {
    const { error } = await admin.from(table).delete().eq(column, user.id)
    if (error) return fail(`delete ${table}`, error.message)
  }

  for (const [table, column] of DETACH) {
    const { error } = await admin.from(table).update({ [column]: null }).eq(column, user.id)
    if (error) return fail(`detach ${table}`, error.message)
  }

  // Money records stay for the books, without the person's details.
  const donorBlank = { user_id: null, donor_name: "Deleted donor", donor_email: null, donor_phone: null, message: null }
  const byId = await admin.from("donations").update(donorBlank).eq("user_id", user.id)
  if (byId.error) return fail("anonymise donations", byId.error.message)
  if (emails.length) {
    const guest = await admin.from("donations").update(donorBlank).in("donor_email", emails)
    if (guest.error) return fail("anonymise guest donations", guest.error.message)
  }

  const orderBlank = {
    user_id: null,
    customer_name: "Deleted customer",
    customer_email: "deleted@hif.invalid",
    customer_phone: null,
    delivery_address: null,
  }
  const ordersById = await admin.from("shop_orders_enhanced").update(orderBlank).eq("user_id", user.id)
  if (ordersById.error) return fail("anonymise orders", ordersById.error.message)
  if (emails.length) {
    const guestOrders = await admin.from("shop_orders_enhanced").update(orderBlank).in("customer_email", emails)
    if (guestOrders.error) return fail("anonymise guest orders", guestOrders.error.message)
  }

  // Membership applications and mailing lists are keyed by email.
  if (emails.length) {
    for (const [table, column] of [
      ["membership_applications", "email"],
      ["newsletter_subscribers", "email"],
      ["newsletters", "email"],
    ] as const) {
      const { error } = await admin.from(table).delete().in(column, emails)
      if (error) return fail(`delete ${table}`, error.message)
    }
  }

  // Removing the sign-in account also removes the profile and 2FA rows.
  const { error: authError } = await admin.auth.admin.deleteUser(user.id)
  if (authError) return fail("delete auth user", authError.message)

  return NextResponse.json({ deleted: true })
}
