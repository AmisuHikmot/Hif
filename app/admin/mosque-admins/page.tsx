import { requireStaff } from "@/lib/admin/guard"
import { createAdminClient } from "@/lib/supabase/admin"
import ConsoleShell from "@/components/admin/console/console-shell"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { addMosqueAdmin, removeMosqueAdmin } from "@/lib/mosque-admin/actions"

export const metadata = { title: "Mosque admins | Admin" }
export const dynamic = "force-dynamic"

export default async function MosqueAdminsPage({ searchParams }: { searchParams: Promise<{ q?: string; id?: string }> }) {
  await requireStaff("/admin/mosque-admins")
  const { q, id } = await searchParams
  const db = createAdminClient()
  let list = db.from("mosques").select("id, name, city, state").order("name").limit(20)
  if (q) list = list.ilike("name", `%${q.replace(/[%_,()]/g, " ")}%`)
  const { data: mosques } = await list

  let detail: React.ReactNode = null
  if (id) {
    const [{ data: m }, { data: admins }] = await Promise.all([
      db.from("mosques").select("id, name, city").eq("id", id).single(),
      db.from("mosque_admins").select("user_id, created_at").eq("mosque_id", id),
    ])
    const ids = (admins ?? []).map((a) => a.user_id)
    const { data: people } = ids.length
      ? await db.from("profiles").select("id, first_name, last_name, email").in("id", ids)
      : { data: [] as { id: string; first_name: string | null; last_name: string | null; email: string | null }[] }
    detail = (
      <div className="space-y-4 rounded-lg border p-4">
        <h2 className="text-xl font-semibold">{m?.name} <span className="text-sm text-muted-foreground">{m?.city}</span></h2>
        <form action={addMosqueAdmin} className="flex gap-2">
          <input type="hidden" name="mosque_id" value={id} />
          <Input name="email" type="email" placeholder="Their HIF account email" required />
          <Button type="submit">Make mosque admin</Button>
        </form>
        {(people ?? []).map((p) => (
          <form action={removeMosqueAdmin} key={p.id} className="flex items-center justify-between border-t pt-2 text-sm">
            <input type="hidden" name="mosque_id" value={id} />
            <input type="hidden" name="user_id" value={p.id} />
            <span>{[p.first_name, p.last_name].filter(Boolean).join(" ") || "Unnamed"} · {p.email}</span>
            <Button size="sm" variant="ghost" type="submit">Remove</Button>
          </form>
        ))}
        <p className="text-sm text-muted-foreground">They manage this mosque at /mosque-admin.</p>
      </div>
    )
  }

  return (
    <ConsoleShell title="Mosque admins" intro="Give a trusted person at a mosque the right to keep its iqama times, announcements and prayer timetable up to date. They can change only their own mosque.">
      <form className="flex gap-2"><Input name="q" defaultValue={q} placeholder="Search mosques by name" /><Button type="submit">Search</Button></form>
      <ul className="divide-y rounded-lg border">
        {(mosques ?? []).map((m) => (
          <li key={m.id}><a className="block px-3 py-2 hover:bg-muted" href={`/admin/mosque-admins?id=${m.id}${q ? `&q=${encodeURIComponent(q)}` : ""}`}>{m.name} <span className="text-sm text-muted-foreground">{[m.city, m.state].filter(Boolean).join(", ")}</span></a></li>
        ))}
      </ul>
      {detail}
    </ConsoleShell>
  )
}
