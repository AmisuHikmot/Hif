import { type NextRequest, NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const membershipId = searchParams.get("membershipId")?.trim()
  const email = searchParams.get("email")?.trim().toLowerCase()

  if (!membershipId || !email) {
    return NextResponse.json({ error: "Membership ID and email are required" }, { status: 400 })
  }

  const supabase = createAdminClient()
  const { data } = await supabase
    .from("membership_applications")
    .select("membership_id, first_name, last_name, email, membership_type, membership_status, payment_status, expires_at")
    .eq("membership_id", membershipId)
    .eq("email", email)
    .maybeSingle()

  if (!data) {
    return NextResponse.json({ error: "Membership not found" }, { status: 404 })
  }

  return NextResponse.json({ membership: data })
}
