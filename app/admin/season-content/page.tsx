import { requireStaff } from "@/lib/admin/guard"
import { createAdminClient } from "@/lib/supabase/admin"
import ConsoleShell from "@/components/admin/console/console-shell"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  addEidGround, addSeasonContent, deleteEidGround, deleteSeasonContent,
  saveTafsirLive, setEidGroundPublished, setSeasonStatus,
} from "@/lib/seasons/actions"

export const metadata = { title: "Seasons | Admin" }
export const dynamic = "force-dynamic"

const KINDS: Record<string, string> = {
  ramadan_day: "Daily Ramadan dua and reflection (give the day, 1 to 30)",
  laylat_dua: "Laylat al-Qadr dua",
  itikaf: "I'tikaf checklist item",
  takbir: "Takbir (Eid)",
  dhul_hijjah: "Dhul Hijjah adhkar (first ten days)",
  eid_greeting: "Eid greeting image",
  tafsir_recording: "Ramadan Tafsir recording (give the surah number)",
}

export default async function SeasonContentPage({ searchParams }: { searchParams: Promise<{ kind?: string }> }) {
  await requireStaff("/admin/season-content")
  const sp = await searchParams
  const db = createAdminClient()
  const kind = sp.kind && KINDS[sp.kind] ? sp.kind : ""
  let q = db.from("season_content").select("*").order("kind").order("day", { nullsFirst: false }).order("sort").limit(300)
  if (kind) q = q.eq("kind", kind)
  const [{ data: items, error }, { data: grounds }, { data: cfg }] = await Promise.all([
    q,
    db.from("eid_grounds").select("*").order("state").order("name").limit(300),
    db.from("app_config").select("value").eq("key", "tafsir_live").maybeSingle(),
  ])
  const live = (cfg?.value ?? {}) as { video_id?: string; title?: string; schedule?: string; time?: string }

  return (
    <ConsoleShell title="Seasons" intro="Ramadan, Eid and Dhul Hijjah content. Anything you add stays pending; the app shows it only after you approve it. Enter only text the Shariah Board has approved.">
      {error && (
        <p className="rounded-lg border border-destructive p-3 text-sm">
          Could not read season_content ({error.message}). Run db/35_season_content.sql in the Supabase SQL editor first.
        </p>
      )}

      <form action={saveTafsirLive} className="grid gap-2 rounded-lg border p-4 sm:grid-cols-2">
        <h2 className="font-medium sm:col-span-2">HIF Ramadan Tafsir live</h2>
        <p className="text-sm text-muted-foreground sm:col-span-2">
          Paste the YouTube live or video link. The app plays it in privacy mode. Clear the link and save to remove the section.
        </p>
        <Input name="video" placeholder="https://www.youtube.com/live/…" defaultValue={live.video_id ?? ""} />
        <Input name="title" placeholder="Title" defaultValue={live.title ?? ""} />
        <Input name="schedule" placeholder="Schedule, e.g. Every night after Taraweeh" defaultValue={live.schedule ?? ""} />
        <Input name="time" placeholder="Start time for reminders, 24-hour, e.g. 21:30" defaultValue={live.time ?? ""} />
        <Button type="submit" className="sm:col-span-2">Save</Button>
      </form>

      <form action={addSeasonContent} className="grid gap-2 rounded-lg border p-4 sm:grid-cols-2">
        <h2 className="font-medium sm:col-span-2">Add content</h2>
        <select name="kind" required className="rounded border px-2 py-2 sm:col-span-2">
          {Object.entries(KINDS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
        <Input name="title" placeholder="Title" />
        <Input name="source" placeholder="Source (book, hadith number…)" />
        <Input name="day" type="number" min={1} max={30} placeholder="Ramadan day (daily dua only)" />
        <Input name="surah" type="number" min={1} max={114} placeholder="Surah number (recordings only)" />
        <select name="madhab" className="rounded border px-2 py-2">
          <option value="">All madhhabs</option>
          <option value="maliki">Maliki</option>
          <option value="hanafi">Hanafi</option>
          <option value="shafii">Shafi&apos;i</option>
          <option value="hanbali">Hanbali</option>
        </select>
        <Input name="sort" type="number" placeholder="Order (0, 1, 2…)" />
        <Textarea name="arabic" placeholder="Arabic" dir="rtl" rows={3} className="sm:col-span-2" />
        <Textarea name="body" placeholder="Meaning, reflection or checklist wording" rows={4} className="sm:col-span-2" />
        <Input name="url" placeholder="Recording link (https://…)" />
        <Input name="image_url" placeholder="Greeting image link (https://…)" />
        <Button type="submit" className="sm:col-span-2">Save as pending</Button>
      </form>

      <form className="flex flex-wrap gap-2">
        <select name="kind" defaultValue={kind} className="rounded border px-2 py-1">
          <option value="">All kinds</option>
          {Object.entries(KINDS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
        <Button type="submit" variant="outline">Show</Button>
      </form>
      <div className="grid gap-2">
        {(items ?? []).map((i) => (
          <div key={i.id} className="rounded-lg border p-3 text-sm">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <strong>
                {i.kind}{i.day ? ` · day ${i.day}` : ""}{i.surah ? ` · surah ${i.surah}` : ""}{i.madhab ? ` · ${i.madhab}` : ""}{i.title ? ` · ${i.title}` : ""}
              </strong>
              <span className="text-xs text-muted-foreground">{i.review_status}</span>
            </div>
            {i.arabic && <p dir="rtl" className="mt-1 text-base">{i.arabic}</p>}
            {i.body && <p className="mt-1 whitespace-pre-wrap">{i.body}</p>}
            <div className="mt-2 flex gap-2">
              {["approved", "pending", "rejected"].filter((s) => s !== i.review_status).map((s) => (
                <form key={s} action={setSeasonStatus}>
                  <input type="hidden" name="id" value={i.id} />
                  <input type="hidden" name="status" value={s} />
                  <Button type="submit" size="sm" variant="outline">{s === "approved" ? "Approve" : s === "pending" ? "Back to pending" : "Reject"}</Button>
                </form>
              ))}
              <form action={deleteSeasonContent}>
                <input type="hidden" name="id" value={i.id} />
                <Button type="submit" size="sm" variant="ghost">Delete</Button>
              </form>
            </div>
          </div>
        ))}
        {(items ?? []).length === 0 && <p className="text-sm text-muted-foreground">Nothing added yet.</p>}
      </div>

      <form action={addEidGround} className="grid gap-2 rounded-lg border p-4 sm:grid-cols-2">
        <h2 className="font-medium sm:col-span-2">Eid grounds by state</h2>
        <Input name="state" placeholder="State, e.g. Kano" required />
        <Input name="name" placeholder="Eid ground name" required />
        <Input name="address" placeholder="Address" className="sm:col-span-2" />
        <Input name="prayer_time" placeholder="Prayer time, 08:30" />
        <Input name="year" type="number" placeholder="Hijri year, e.g. 1448" />
        <select name="eid" className="rounded border px-2 py-2">
          <option value="fitr">Eid al-Fitr</option>
          <option value="adha">Eid al-Adha</option>
        </select>
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="publish" /> Publish now</label>
        <Button type="submit" className="sm:col-span-2">Add ground</Button>
      </form>
      <div className="grid gap-2">
        {(grounds ?? []).map((g) => (
          <div key={g.id} className="flex flex-wrap items-center justify-between gap-2 rounded-lg border p-3 text-sm">
            <span>{g.state} · {g.name}{g.prayer_time ? ` · ${g.prayer_time}` : ""} · {g.eid}{g.year ? ` ${g.year}` : ""} · {g.published ? "published" : "hidden"}</span>
            <span className="flex gap-2">
              <form action={setEidGroundPublished}>
                <input type="hidden" name="id" value={g.id} />
                <input type="hidden" name="published" value={String(!g.published)} />
                <Button type="submit" size="sm" variant="outline">{g.published ? "Hide" : "Publish"}</Button>
              </form>
              <form action={deleteEidGround}>
                <input type="hidden" name="id" value={g.id} />
                <Button type="submit" size="sm" variant="ghost">Delete</Button>
              </form>
            </span>
          </div>
        ))}
      </div>
    </ConsoleShell>
  )
}
