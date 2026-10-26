import { requireStaff } from "@/lib/admin/guard"
import { createAdminClient } from "@/lib/supabase/admin"
import ConsoleShell from "@/components/admin/console/console-shell"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { addAnnouncement, deleteAnnouncement, saveIqama } from "@/lib/admin/actions"

export const metadata = { title: "Mosques | Admin" }
export const dynamic = "force-dynamic"

const PRAYERS = ["fajr", "dhuhr", "asr", "maghrib", "isha", "jumuah"]

export default async function MosquesConsole({ searchParams }: { searchParams: Promise<{ q?: string; id?: string }> }) {
  await requireStaff("/admin/mosques")
  const { q, id } = await searchParams
  const db = createAdminClient()
  let list = db.from("mosques").select("id, name, city, state, status").order("name").limit(30)
  if (q) list = list.ilike("name", `%${q.replace(/[%_,()]/g, " ")}%`)
  const { data: mosques } = await list

  let detail: React.ReactNode = null
  if (id) {
    const [{ data: m }, { data: iqama }, { data: news }] = await Promise.all([
      db.from("mosques").select("id, name, city").eq("id", id).single(),
      db.from("mosque_iqama").select("prayer, iqama_time").eq("mosque_id", id),
      db.from("mosque_announcements").select("id, title, body, ends_at").eq("mosque_id", id).order("starts_at", { ascending: false }),
    ])
    const times = new Map((iqama ?? []).map((r) => [r.prayer, String(r.iqama_time).slice(0, 5)]))
    detail = (
      <div className="space-y-4 rounded-lg border p-4">
        <h2 className="text-xl font-semibold">{m?.name} <span className="text-sm text-muted-foreground">{m?.city}</span></h2>
        <div className="grid gap-2 md:grid-cols-2">
          {PRAYERS.map((p) => (
            <form action={saveIqama} key={p} className="flex items-center gap-2">
              <input type="hidden" name="mosque_id" value={id} />
              <input type="hidden" name="prayer" value={p} />
              <span className="w-20 capitalize">{p}</span>
              <Input type="time" name="iqama_time" defaultValue={times.get(p) ?? ""} required />
              <Button size="sm" type="submit">Save</Button>
            </form>
          ))}
        </div>
        <form action={addAnnouncement} className="grid gap-2">
          <input type="hidden" name="mosque_id" value={id} />
          <Input name="title" placeholder="Announcement" required />
          <Input name="body" placeholder="Details (optional)" />
          <Input name="ends_at" type="datetime-local" />
          <Button type="submit">Post announcement</Button>
        </form>
        {(news ?? []).map((n) => (
          <form action={deleteAnnouncement} key={n.id} className="flex items-center justify-between border-t pt-2 text-sm">
            <input type="hidden" name="id" value={n.id} />
            <span>{n.title}{n.body ? ` — ${n.body}` : ""}</span>
            <Button size="sm" variant="ghost" type="submit">Remove</Button>
          </form>
        ))}
      </div>
    )
  }

  return (
    <ConsoleShell title="Mosque console" intro="Set iqama times and post announcements. They appear on the mosque’s page in the app.">
      <form className="flex gap-2"><Input name="q" defaultValue={q} placeholder="Search mosques by name" /><Button type="submit">Search</Button></form>
      <ul className="divide-y rounded-lg border">
        {(mosques ?? []).map((m) => (
          <li key={m.id}><a className="block px-3 py-2 hover:bg-muted" href={`/admin/mosques?id=${m.id}${q ? `&q=${encodeURIComponent(q)}` : ""}`}>{m.name} <span className="text-sm text-muted-foreground">{[m.city, m.state].filter(Boolean).join(", ")} · {m.status}</span></a></li>
        ))}
      </ul>
      {detail}
    </ConsoleShell>
  )
}
