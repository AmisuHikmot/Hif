import { requireStaff } from "@/lib/admin/guard"
import { createAdminClient } from "@/lib/supabase/admin"
import ConsoleShell from "@/components/admin/console/console-shell"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { approveApplication, declineApplication, updateSchool } from "@/lib/schools/admin-actions"

export const metadata = { title: "Schools | Admin" }
export const dynamic = "force-dynamic"

export default async function SchoolsPage() {
  await requireStaff("/admin/schools")
  const db = createAdminClient()
  const [{ data: apps }, { data: orgs }] = await Promise.all([
    db.from("school_applications").select("*").eq("status", "new").order("created_at"),
    db.from("organizations").select("*").order("created_at", { ascending: false }),
  ])
  const counts = new Map<string, number>()
  for (const o of orgs ?? []) {
    const { count } = await db.from("org_members").select("user_id", { count: "exact", head: true }).eq("org_id", o.id).eq("role", "student").is("ended_at", null)
    counts.set(o.id, count ?? 0)
  }
  return (
    <ConsoleShell title="Schools" intro="Applications from Islamiyya and other schools. Check the registration number before approving. Approving creates the school and emails its first admin.">
      <h2 className="text-xl font-semibold">Applications ({apps?.length ?? 0})</h2>
      {(apps ?? []).map((a) => (
        <div key={a.id} className="space-y-2 rounded-lg border p-4">
          <div className="font-medium">{a.school_name} <span className="text-sm font-normal text-muted-foreground">· {a.state ?? "state not given"}</span></div>
          <div className="text-sm text-muted-foreground">
            {a.proprietor_name} · {a.email}{a.phone ? ` · ${a.phone}` : ""} · registration: {a.registration_no ?? "none given"} · about {a.pupils_estimate ?? "?"} pupils
          </div>
          {a.notes && <p className="text-sm">{a.notes}</p>}
          <div className="flex flex-wrap gap-2">
            <form action={approveApplication} className="flex gap-2">
              <input type="hidden" name="id" value={a.id} />
              <Input name="seats" type="number" defaultValue={50} className="w-24" aria-label="Seats" />
              <Button type="submit">Approve</Button>
            </form>
            <form action={declineApplication}>
              <input type="hidden" name="id" value={a.id} />
              <Button type="submit" variant="outline">Decline</Button>
            </form>
          </div>
        </div>
      ))}
      <h2 className="text-xl font-semibold">Schools ({orgs?.length ?? 0})</h2>
      {(orgs ?? []).map((o) => (
        <form key={o.id} action={updateSchool} className="flex flex-wrap items-center gap-2 rounded-lg border p-3">
          <input type="hidden" name="id" value={o.id} />
          <div className="mr-auto">
            <div className="font-medium">{o.name}</div>
            <div className="text-sm text-muted-foreground">{counts.get(o.id)} pupils · pilot ends {o.pilot_ends ?? "—"} · {o.contact_email}</div>
          </div>
          <Input name="seats" type="number" defaultValue={o.seats} className="w-24" aria-label="Seats" />
          <select name="status" defaultValue={o.status} className="rounded-md border bg-background px-3 py-2 text-sm">
            <option value="active">active</option>
            <option value="suspended">suspended</option>
          </select>
          <Button type="submit" size="sm" variant="outline">Save</Button>
        </form>
      ))}
    </ConsoleShell>
  )
}
