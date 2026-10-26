import { getStaffId } from "@/lib/auth/staff"
import { createAdminClient } from "@/lib/supabase/admin"

const cell = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`

export async function GET() {
  if (!(await getStaffId())) return new Response("Forbidden", { status: 403 })
  const { data } = await createAdminClient()
    .from("donations")
    .select("created_at, donor_name, amount, project_name, payment_reference, payment_status")
    .eq("payment_status", "completed")
    .order("created_at", { ascending: false })
  const rows = [["Date", "Donor", "Naira", "Project", "Reference"], ...(data ?? []).map((d) => [d.created_at, d.donor_name, d.amount, d.project_name, d.payment_reference])]
  return new Response(rows.map((r) => r.map(cell).join(",")).join("\n"), {
    headers: { "content-type": "text/csv", "content-disposition": 'attachment; filename="hif-gifts.csv"' },
  })
}
