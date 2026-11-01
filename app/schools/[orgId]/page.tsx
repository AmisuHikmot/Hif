import Link from "next/link"
import SchoolShell from "@/components/schools/school-shell"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { requireOrgRole } from "@/lib/schools/guard"
import { createAdminClient } from "@/lib/supabase/admin"
import { createClass } from "@/lib/schools/actions"
import { saveRecitationSettings } from "@/lib/schools/recitations"

export const dynamic = "force-dynamic"

export default async function SchoolDashboard({ params }: { params: Promise<{ orgId: string }> }) {
  const { orgId } = await params
  const { userId, role, org } = await requireOrgRole(orgId, ["school_admin", "teacher"], `/schools/${orgId}`)
  const db = createAdminClient()
  const [{ data: classes }, { count: pupils }, { count: teachers }, { data: mine }] = await Promise.all([
    db.from("classes").select("id, name, level, term").eq("org_id", orgId).order("name"),
    db.from("org_members").select("user_id", { count: "exact", head: true }).eq("org_id", orgId).eq("role", "student").is("ended_at", null),
    db.from("org_members").select("user_id", { count: "exact", head: true }).eq("org_id", orgId).eq("role", "teacher").is("ended_at", null),
    db.from("class_members").select("class_id").eq("user_id", userId).eq("role", "teacher").is("ended_at", null),
  ])
  const mineIds = new Set((mine ?? []).map((m) => m.class_id))
  const visible = (classes ?? []).filter((c) => role === "school_admin" || mineIds.has(c.id))
  return (
    <SchoolShell
      title={org.name}
      crumbs={[{ href: "/schools", label: "Schools" }]}
      intro={role === "school_admin" ? "School admin" : "Teacher"}
    >
      <div className="grid gap-3 sm:grid-cols-3">
        <Stat label="Pupils / seats" value={`${pupils ?? 0} / ${org.seats}`} />
        <Stat label="Teachers" value={String(teachers ?? 0)} />
        <Stat label="Pilot ends" value={org.pilot_ends ? new Date(org.pilot_ends).toLocaleDateString("en-NG") : "—"} />
      </div>

      {role === "school_admin" && (
        <div className="flex flex-wrap gap-2">
          <Button asChild><Link href={`/schools/${orgId}/roster`}>Import the roster</Link></Button>
        </div>
      )}

      {role === "school_admin" && (
        <form action={saveRecitationSettings} className="grid gap-2 rounded-lg border p-4 sm:grid-cols-3">
          <input type="hidden" name="org_id" value={orgId} />
          <div className="sm:col-span-3">
            <h2 className="text-lg font-semibold">Recitation recordings</h2>
            <p className="text-sm text-muted-foreground">How long a pupil’s recording is kept after the teacher grades it, and who may hear it.</p>
          </div>
          <label className="text-sm">
            Delete after (days, 30 to 180)
            <Input name="recording_days" type="number" min={30} max={180} defaultValue={org.recording_days ?? 90} required />
          </label>
          <label className="flex items-center gap-2 text-sm sm:col-span-2">
            <input type="checkbox" name="guardians_hear" defaultChecked={!!org.guardians_hear_recordings} />
            Guardians may hear their child’s recordings (they always see grades and comments)
          </label>
          <Button type="submit" className="w-fit">Save</Button>
        </form>
      )}

      <h2 className="text-xl font-semibold">Classes</h2>
      {visible.length === 0 && <p className="text-muted-foreground">No classes yet. Import a roster or add a class.</p>}
      <div className="grid gap-3 sm:grid-cols-2">
        {visible.map((c) => (
          <Link key={c.id} href={`/schools/${orgId}/classes/${c.id}`} className="rounded-lg border p-4 hover:bg-muted">
            <div className="font-medium">{c.name}</div>
            <div className="text-sm text-muted-foreground">{[c.level, c.term].filter(Boolean).join(" · ") || "Open"}</div>
          </Link>
        ))}
      </div>

      {role === "school_admin" && (
        <form action={createClass} className="grid gap-2 rounded-lg border p-4 sm:grid-cols-4">
          <input type="hidden" name="org_id" value={orgId} />
          <Input name="name" placeholder="Class name" required />
          <Input name="level" placeholder="Level (optional)" />
          <Input name="term" placeholder="Term (optional)" />
          <Button type="submit">Add class</Button>
        </form>
      )}
    </SchoolShell>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border p-4">
      <div className="text-sm text-muted-foreground">{label}</div>
      <div className="text-2xl font-semibold">{value}</div>
    </div>
  )
}
