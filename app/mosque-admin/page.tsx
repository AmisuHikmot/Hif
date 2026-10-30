import { requireMosqueAdmin } from "@/lib/mosque-admin/guard"
import { createAdminClient } from "@/lib/supabase/admin"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  clearMosqueTimetable,
  importMosqueTimetable,
  postMosqueAnnouncement,
  removeMosqueAnnouncement,
  saveMosqueIqama,
} from "@/lib/mosque-admin/actions"

export const metadata = { title: "Mosque dashboard | HIF" }
export const dynamic = "force-dynamic"

const PRAYERS = ["fajr", "dhuhr", "asr", "maghrib", "isha", "jumuah"]

export default async function MosqueAdminPage({ searchParams }: { searchParams: Promise<{ id?: string }> }) {
  const ctx = await requireMosqueAdmin("/mosque-admin")
  const { id: wanted } = await searchParams
  const db = createAdminClient()

  const { data: mine } = ctx.staff && ctx.mosqueIds.length === 0
    ? { data: [] as { id: string; name: string; city: string | null }[] }
    : await db.from("mosques").select("id, name, city").in("id", ctx.mosqueIds).order("name")
  const mosques = mine ?? []
  const id = ctx.staff ? wanted ?? mosques[0]?.id : mosques.find((m) => m.id === wanted)?.id ?? mosques[0]?.id

  if (!id) {
    return (
      <div className="container mx-auto max-w-3xl px-4 py-10">
        <h1 className="text-3xl font-bold">Mosque dashboard</h1>
        <p className="mt-4 text-muted-foreground">
          {ctx.staff
            ? "Open this page with ?id=<mosque id>, or use Admin → Mosques to pick one."
            : "No mosque is linked to your account yet."}
        </p>
      </div>
    )
  }

  const today = new Date().toISOString().slice(0, 10)
  const [{ data: m }, { data: iqama }, { data: news }, { data: days }] = await Promise.all([
    db.from("mosques").select("id, name, city, state").eq("id", id).single(),
    db.from("mosque_iqama").select("prayer, iqama_time").eq("mosque_id", id),
    db.from("mosque_announcements").select("id, title, body, ends_at").eq("mosque_id", id).order("starts_at", { ascending: false }).limit(20),
    db.from("mosque_timetable").select("day, fajr, sunrise, dhuhr, asr, maghrib, isha").eq("mosque_id", id).gte("day", today).order("day").limit(60),
  ])
  const times = new Map((iqama ?? []).map((r) => [r.prayer, String(r.iqama_time).slice(0, 5)]))
  const hm = (v: unknown) => (v ? String(v).slice(0, 5) : "–")
  const lastDay = days && days.length ? days[days.length - 1].day : null
  const active = (news ?? []).filter((n) => !n.ends_at || new Date(n.ends_at) > new Date())

  return (
    <div className="container mx-auto max-w-4xl space-y-8 px-4 py-10">
      <header>
        <h1 className="text-3xl font-bold">{m?.name}</h1>
        <p className="text-muted-foreground">{[m?.city, m?.state].filter(Boolean).join(", ")} · Mosque dashboard</p>
        {mosques.length > 1 && (
          <nav className="mt-3 flex flex-wrap gap-2 text-sm">
            {mosques.map((x) => (
              <a key={x.id} className={`rounded border px-2 py-1 ${x.id === id ? "bg-muted font-medium" : ""}`} href={`/mosque-admin?id=${x.id}`}>
                {x.name}
              </a>
            ))}
          </nav>
        )}
      </header>

      <section className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-lg border p-4">
          <div className="text-2xl font-semibold">{times.size} of 6</div>
          <div className="text-sm text-muted-foreground">iqama times set</div>
        </div>
        <div className="rounded-lg border p-4">
          <div className="text-2xl font-semibold">{lastDay ?? "None"}</div>
          <div className="text-sm text-muted-foreground">
            {lastDay ? `timetable published through (${days!.length} days ahead)` : "timetable published"}
          </div>
        </div>
        <div className="rounded-lg border p-4">
          <div className="text-2xl font-semibold">{active.length}</div>
          <div className="text-sm text-muted-foreground">announcements showing</div>
        </div>
      </section>
      <p className="text-sm text-muted-foreground">
        Phones show these to people who follow your mosque. HIF does not track who follows, so no follower count is shown.
      </p>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Iqama times</h2>
        <p className="text-sm text-muted-foreground">Fixed daily times. Jumu’ah is shown on Fridays in place of Dhuhr.</p>
        <div className="grid gap-2 md:grid-cols-2">
          {PRAYERS.map((p) => (
            <form action={saveMosqueIqama} key={p} className="flex items-center gap-2">
              <input type="hidden" name="mosque_id" value={id} />
              <input type="hidden" name="prayer" value={p} />
              <span className="w-20 capitalize">{p}</span>
              <Input type="time" name="iqama_time" defaultValue={times.get(p) ?? ""} required />
              <Button size="sm" type="submit">Save</Button>
            </form>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Prayer timetable</h2>
        <p className="text-sm text-muted-foreground">
          Paste one day per line: <code>date, fajr, sunrise, dhuhr, asr, maghrib, isha</code>, for example{" "}
          <code>2026-03-10,05:10,06:25,13:05,16:20,18:42,19:55</code>. Times are 24-hour. Sunrise may be left empty. People who
          switch on “Use my mosque’s own timetable” see these times on the days you publish; other days are calculated.
        </p>
        <form action={importMosqueTimetable} className="space-y-2">
          <input type="hidden" name="mosque_id" value={id} />
          <Textarea name="csv" rows={8} className="font-mono text-xs" placeholder="2026-03-10,05:10,06:25,13:05,16:20,18:42,19:55" required />
          <Button type="submit">Publish these days</Button>
        </form>
        {days && days.length > 0 && (
          <div className="overflow-x-auto rounded-lg border">
            <table className="w-full text-sm">
              <thead className="bg-muted text-left">
                <tr>{["Day", "Fajr", "Sunrise", "Dhuhr", "Asr", "Maghrib", "Isha"].map((h) => <th key={h} className="px-3 py-2">{h}</th>)}</tr>
              </thead>
              <tbody>
                {days.slice(0, 14).map((d) => (
                  <tr key={d.day} className="border-t">
                    <td className="px-3 py-1.5">{d.day}</td>
                    <td className="px-3">{hm(d.fajr)}</td><td className="px-3">{hm(d.sunrise)}</td><td className="px-3">{hm(d.dhuhr)}</td>
                    <td className="px-3">{hm(d.asr)}</td><td className="px-3">{hm(d.maghrib)}</td><td className="px-3">{hm(d.isha)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {lastDay && (
          <form action={clearMosqueTimetable}>
            <input type="hidden" name="mosque_id" value={id} />
            <Button type="submit" variant="outline" size="sm">Remove every published day</Button>
          </form>
        )}
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Announcements</h2>
        <form action={postMosqueAnnouncement} className="grid gap-2">
          <input type="hidden" name="mosque_id" value={id} />
          <Input name="title" placeholder="Announcement" required />
          <Input name="body" placeholder="Details (optional)" />
          <label className="text-sm text-muted-foreground">Stop showing after (optional)</label>
          <Input name="ends_at" type="datetime-local" />
          <Button type="submit">Post announcement</Button>
        </form>
        {(news ?? []).map((n) => (
          <form action={removeMosqueAnnouncement} key={n.id} className="flex items-center justify-between border-t pt-2 text-sm">
            <input type="hidden" name="mosque_id" value={id} />
            <input type="hidden" name="id" value={n.id} />
            <span>{n.title}{n.body ? ` — ${n.body}` : ""}</span>
            <Button size="sm" variant="ghost" type="submit">Remove</Button>
          </form>
        ))}
      </section>
    </div>
  )
}
