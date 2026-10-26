import Link from "next/link"
import { requireStaff } from "@/lib/admin/guard"
import { createAdminClient } from "@/lib/supabase/admin"
import ConsoleShell from "@/components/admin/console/console-shell"
import { ReviewButtons, StatusBadge } from "@/components/admin/console/review-buttons"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { addCourse, saveHadith, setCoursePublished } from "@/lib/admin/actions"

export const metadata = { title: "Content Studio | Admin" }
export const dynamic = "force-dynamic"

const TABS = [
  ["adhkar", "Adhkar"],
  ["hadith", "Hadith"],
  ["courses", "Courses"],
] as const

export default async function StudioPage({ searchParams }: { searchParams: Promise<{ tab?: string; status?: string; page?: string }> }) {
  await requireStaff("/admin/studio")
  const sp = await searchParams
  const tab = sp.tab ?? "adhkar"
  const status = sp.status ?? "pending"
  const page = Math.max(0, Number(sp.page ?? 0))
  const db = createAdminClient()

  const counts: Record<string, Record<string, number>> = {}
  for (const [t, table] of [["adhkar", "adhkar_categories"], ["hadith", "hadith"], ["courses", "courses"]] as const) {
    counts[t] = {}
    for (const s of ["pending", "approved", "rejected"]) {
      const { count } = await db.from(table).select("*", { count: "exact", head: true }).eq("review_status", s)
      counts[t][s] = count ?? 0
    }
  }

  const q = (t: string, s: string, p = 0) => `/admin/studio?tab=${t}&status=${s}&page=${p}`
  const PAGE = 25

  let body: React.ReactNode = null
  if (tab === "adhkar") {
    const { data } = await db
      .from("adhkar_categories")
      .select("id, title_en, review_status")
      .eq("review_status", status)
      .order("id")
      .range(page * PAGE, page * PAGE + PAGE - 1)
    body = (data ?? []).map((c) => (
      <div key={c.id} className="flex items-center justify-between gap-4 rounded-lg border p-3">
        <div>
          <div className="font-medium">{c.title_en}</div>
          <StatusBadge status={c.review_status} />
        </div>
        <ReviewButtons table="adhkar_categories" id={c.id} status={c.review_status} />
      </div>
    ))
  } else if (tab === "hadith") {
    const { data } = await db
      .from("hadith")
      .select("id, collection, number, arabic, translation, narrator, grade, review_status")
      .eq("review_status", status)
      .order("collection")
      .order("number")
      .range(page * PAGE, page * PAGE + PAGE - 1)
    body = (data ?? []).map((h) => (
      <details key={h.id} className="rounded-lg border p-3">
        <summary className="flex cursor-pointer items-center justify-between gap-4">
          <span className="font-medium">
            {h.collection} {h.number} <StatusBadge status={h.review_status} />
          </span>
          <span className="line-clamp-1 text-sm text-muted-foreground">{h.translation}</span>
        </summary>
        <form action={saveHadith} className="mt-3 space-y-2">
          <input type="hidden" name="id" value={h.id} />
          <Textarea name="arabic" defaultValue={h.arabic ?? ""} dir="rtl" rows={3} />
          <Textarea name="translation" defaultValue={h.translation ?? ""} rows={4} />
          <div className="flex gap-2">
            <Input name="narrator" defaultValue={h.narrator ?? ""} placeholder="Narrator" />
            <Input name="grade" defaultValue={h.grade ?? ""} placeholder="Grade" />
          </div>
          <p className="text-xs text-muted-foreground">Saving an edit sends an approved hadith back to pending.</p>
          <Button type="submit" size="sm">Save edit</Button>
        </form>
        <div className="mt-3">
          <ReviewButtons table="hadith" id={h.id} status={h.review_status} />
        </div>
      </details>
    ))
  } else {
    const { data } = await db
      .from("courses")
      .select("id, title, category, level, review_status, is_published")
      .eq("review_status", status)
      .order("created_at", { ascending: false })
      .range(page * PAGE, page * PAGE + PAGE - 1)
    body = (
      <>
        <form action={addCourse} className="grid gap-2 rounded-lg border p-3 md:grid-cols-2">
          <Input name="title" placeholder="Course title" required />
          <Input name="summary" placeholder="One-line summary" />
          <select name="category" className="rounded-md border bg-background px-3 py-2 text-sm">
            {["general", "quran", "arabic", "fiqh", "seerah", "aqidah", "jamb", "waec", "neco"].map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
          <select name="level" className="rounded-md border bg-background px-3 py-2 text-sm">
            {["beginner", "intermediate", "advanced"].map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" name="publish" /> Show in the app now (marked awaiting review)
          </label>
          <Button type="submit">Add course</Button>
        </form>
        {(data ?? []).map((c) => (
          <div key={c.id} className="flex items-center justify-between gap-4 rounded-lg border p-3">
            <div>
              <div className="font-medium">{c.title}</div>
              <div className="text-xs text-muted-foreground">
                {c.category} · {c.level} · {c.is_published ? "in the app" : "hidden"}
              </div>
              <StatusBadge status={c.review_status} />
            </div>
            <div className="flex flex-col gap-1">
              <ReviewButtons table="courses" id={c.id} status={c.review_status} />
              <form action={setCoursePublished}>
                <input type="hidden" name="id" value={c.id} />
                <input type="hidden" name="published" value={String(!c.is_published)} />
                <Button size="sm" variant="ghost" type="submit">{c.is_published ? "Hide" : "Show in app"}</Button>
              </form>
            </div>
          </div>
        ))}
      </>
    )
  }

  return (
    <ConsoleShell
      title="Content Studio"
      intro="Review religious content before it shows without the “awaiting board review” label. Only the Shariah Board approves."
    >
      <div className="flex flex-wrap gap-2">
        {TABS.map(([t, label]) => (
          <Link key={t} href={q(t, "pending")} className={`rounded-md border px-3 py-1.5 text-sm ${tab === t ? "bg-emerald-100 font-medium" : ""}`}>
            {label} · {counts[t].pending} pending
          </Link>
        ))}
      </div>
      <div className="flex gap-2 text-sm">
        {["pending", "approved", "rejected"].map((s) => (
          <Link key={s} href={q(tab, s)} className={`rounded-full px-3 py-1 ${status === s ? "bg-foreground text-background" : "border"}`}>
            {s} ({counts[tab][s]})
          </Link>
        ))}
      </div>
      <div className="space-y-2">{body}</div>
      <div className="flex gap-2">
        {page > 0 && <Link className="underline" href={q(tab, status, page - 1)}>Previous</Link>}
        {counts[tab][status] > (page + 1) * PAGE && <Link className="underline" href={q(tab, status, page + 1)}>Next</Link>}
      </div>
    </ConsoleShell>
  )
}
