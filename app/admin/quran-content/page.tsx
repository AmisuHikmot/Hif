import { requireStaff } from "@/lib/admin/guard"
import { createAdminClient } from "@/lib/supabase/admin"
import ConsoleShell from "@/components/admin/console/console-shell"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { addQuranContent, deleteQuranContent, setQuranContentStatus } from "@/lib/quran/actions"

export const metadata = { title: "Quran content | Admin" }
export const dynamic = "force-dynamic"

const KINDS: Record<string, string> = {
  reciter: "Reciter (Warsh, Nigerian qurra, or any Hafs reciter with ayah-by-ayah audio)",
  tafsir_audio: "HIF tafsir recording (one recording for a surah or a run of verses)",
}

export default async function QuranContentPage({ searchParams }: { searchParams: Promise<{ kind?: string }> }) {
  await requireStaff("/admin/quran-content")
  const sp = await searchParams
  const kind = sp.kind && KINDS[sp.kind] ? sp.kind : ""
  const db = createAdminClient()
  let q = db.from("quran_content").select("*").order("kind").order("sort").order("created_at", { ascending: false }).limit(300)
  if (kind) q = q.eq("kind", kind)
  const { data: items, error } = await q

  return (
    <ConsoleShell
      title="Quran content"
      intro="Reciters and HIF tafsir recordings. Hausa, Yoruba, Fulfulde and French hadith go under Hadith translations. Nothing here is built into the app: add it, approve it, and phones pick it up within hours. Anything you add stays pending until you approve it. Enter only material the Shariah Board has cleared and you have the right to use."
    >
      {error && (
        <p className="rounded-lg border border-destructive p-3 text-sm">
          Could not read quran_content ({error.message}). Run db/38_quran_content.sql in the Supabase SQL editor first.
        </p>
      )}

      <form action={addQuranContent} className="grid gap-2 rounded-lg border p-4 sm:grid-cols-2">
        <h2 className="font-medium sm:col-span-2">Add content</h2>
        <select name="kind" required className="rounded border px-2 py-2 sm:col-span-2">
          {Object.entries(KINDS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
        <Input name="title" placeholder="Title or reciter's name" required />
        <Input name="credit" placeholder="Credit (reciter, translator, grader…)" />
        <Input name="source" placeholder="Source (publisher, site…)" />
        <Input name="lang" placeholder="Language code: ha, yo, ff, en, fr, ar" />
        <Input name="url" placeholder="Link (https://…). Reciter: https://host/path/{s3}{a3}.mp3" className="sm:col-span-2" />
        <select name="riwaya" className="rounded border px-2 py-2">
          <option value="">Riwaya (reciters)</option>
          <option value="hafs">Hafs</option>
          <option value="warsh">Warsh</option>
        </select>
        <Input name="sort" type="number" placeholder="Order (0, 1, 2…)" />
        <Input name="surah" type="number" min={1} max={114} placeholder="Surah (recordings)" />
        <div className="grid grid-cols-2 gap-2">
          <Input name="ayah_from" type="number" min={1} placeholder="From verse" />
          <Input name="ayah_to" type="number" min={1} placeholder="To verse" />
        </div>
        <p className="text-xs text-muted-foreground sm:col-span-2">
          Reciter links: {"{s3}"} and {"{a3}"} are the surah and verse numbers with zeros in front (001, 007). {"{s}"} and {"{a}"} have none. {"{g}"} is the verse number counted across the whole Quran (1 to 6236). The audio must be one file per verse, numbered the way the riwaya&apos;s text is numbered.
        </p>
        <Button type="submit" className="sm:col-span-2">Save as pending</Button>
      </form>

      <form className="flex flex-wrap gap-2">
        <select name="kind" defaultValue={kind} className="rounded border px-2 py-1">
          <option value="">All kinds</option>
          {Object.entries(KINDS).map(([k, v]) => <option key={k} value={k}>{k}</option>)}
        </select>
        <Button type="submit" variant="outline">Show</Button>
      </form>

      <div className="grid gap-2">
        {(items ?? []).map((i) => (
          <div key={i.id} className="rounded-lg border p-3 text-sm">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <strong>
                {i.kind} · {i.title}
                {i.riwaya ? ` · ${i.riwaya}` : ""}
                {i.lang ? ` · ${i.lang}` : ""}
                {i.surah ? ` · surah ${i.surah}${i.ayah_from ? `:${i.ayah_from}${i.ayah_to ? `-${i.ayah_to}` : ""}` : ""}` : ""}
              </strong>
              <span className="text-xs text-muted-foreground">{i.review_status}</span>
            </div>
            {i.url && <p className="mt-1 break-all text-xs text-muted-foreground">{i.url}</p>}
            <div className="mt-2 flex gap-2">
              {["approved", "pending", "rejected"].filter((s) => s !== i.review_status).map((s) => (
                <form key={s} action={setQuranContentStatus}>
                  <input type="hidden" name="id" value={i.id} />
                  <input type="hidden" name="status" value={s} />
                  <Button type="submit" size="sm" variant="outline">{s === "approved" ? "Approve" : s === "pending" ? "Back to pending" : "Reject"}</Button>
                </form>
              ))}
              <form action={deleteQuranContent}>
                <input type="hidden" name="id" value={i.id} />
                <Button type="submit" size="sm" variant="ghost">Delete</Button>
              </form>
            </div>
          </div>
        ))}
        {(items ?? []).length === 0 && <p className="text-sm text-muted-foreground">Nothing added yet.</p>}
      </div>
    </ConsoleShell>
  )
}
