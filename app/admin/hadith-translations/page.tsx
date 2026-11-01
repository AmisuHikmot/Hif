import { requireStaff } from "@/lib/admin/guard"
import { createAdminClient } from "@/lib/supabase/admin"
import ConsoleShell from "@/components/admin/console/console-shell"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { saveHadithTranslation, setHadithTranslationStatus } from "@/lib/quran/actions"

export const metadata = { title: "Hadith translations | Admin" }
export const dynamic = "force-dynamic"

const LANGS = [
  { code: "ha", name: "Hausa" },
  { code: "yo", name: "Yoruba" },
  { code: "ff", name: "Fulfulde" },
  { code: "fr", name: "French" },
  { code: "en", name: "English" },
]
const PAGE = 25

type Row = { id: string; collection: string; number: string; arabic: string; translation: string | null; topic: string | null }

export default async function HadithTranslationsPage({
  searchParams,
}: {
  searchParams: Promise<{ collection?: string; topic?: string; lang?: string; page?: string; todo?: string }>
}) {
  await requireStaff("/admin/hadith-translations")
  const sp = await searchParams
  const lang = LANGS.some((l) => l.code === sp.lang) ? sp.lang! : "ha"
  const page = Math.max(0, Number(sp.page) || 0)
  const db = createAdminClient()

  const { data: meta } = await db.from("hadith").select("collection, topic").limit(5000)
  const collections = [...new Set((meta ?? []).map((m) => m.collection as string).filter(Boolean))].sort()
  const collection = sp.collection && collections.includes(sp.collection) ? sp.collection : collections[0] ?? ""
  const topics = [
    ...new Set(
      (meta ?? []).filter((m) => m.collection === collection).map((m) => m.topic as string | null).filter((t): t is string => !!t),
    ),
  ].sort()

  let q = db.from("hadith").select("id, collection, number, arabic, translation, topic").eq("collection", collection).order("number").range(page * PAGE, page * PAGE + PAGE - 1)
  if (sp.topic) q = q.eq("topic", sp.topic)
  const { data: rows, error } = collection ? await q : { data: [] as Row[], error: null }
  const ids = (rows ?? []).map((r) => r.id)
  const { data: existing } = ids.length
    ? await db.from("hadith_translations").select("hadith_id, translation, explanation, translator, review_status").eq("lang", lang).in("hadith_id", ids)
    : { data: [] as { hadith_id: string; translation: string; explanation: string | null; translator: string | null; review_status: string }[] }
  const byId = new Map((existing ?? []).map((t) => [t.hadith_id, t]))
  const name = LANGS.find((l) => l.code === lang)?.name

  const link = (p: number) =>
    `?collection=${encodeURIComponent(collection)}&lang=${lang}${sp.topic ? `&topic=${encodeURIComponent(sp.topic)}` : ""}&page=${p}`

  return (
    <ConsoleShell
      title="Hadith translations"
      intro="Add or correct Hausa, Yoruba, Fulfulde, French and English translations of the hadith, with the explanation. Every save goes back to “pending”; the app shows a pending translation with an “awaiting review” note until the Shariah Board approves it."
    >
      {error && (
        <p className="rounded-lg border border-destructive p-3 text-sm">
          Could not read the hadith ({error.message}). Run db/38_quran_content.sql in the Supabase SQL editor first.
        </p>
      )}
      <form className="flex flex-wrap gap-2">
        <select name="collection" defaultValue={collection} className="rounded border px-2 py-1">
          {collections.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select name="topic" defaultValue={sp.topic ?? ""} className="rounded border px-2 py-1">
          <option value="">All topics</option>
          {topics.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
        <select name="lang" defaultValue={lang} className="rounded border px-2 py-1">
          {LANGS.map((l) => <option key={l.code} value={l.code}>{l.name}</option>)}
        </select>
        <Button type="submit">Show</Button>
      </form>

      {(rows ?? []).map((h) => {
        const t = byId.get(h.id)
        return (
          <div key={h.id} className="space-y-2 rounded-lg border p-4">
            <p className="text-xs text-muted-foreground">{h.collection} · {h.number}{h.topic ? ` · ${h.topic}` : ""}</p>
            <p dir="rtl" className="text-lg leading-loose">{h.arabic}</p>
            {h.translation && <p className="text-sm text-muted-foreground">{h.translation}</p>}
            <form action={saveHadithTranslation} className="space-y-2">
              <input type="hidden" name="hadith_id" value={h.id} />
              <input type="hidden" name="lang" value={lang} />
              <Textarea name="translation" rows={3} defaultValue={t?.translation ?? ""} placeholder={`Translation in ${name}`} />
              <Textarea name="explanation" rows={3} defaultValue={t?.explanation ?? ""} placeholder={`Explanation in ${name} (shown folded)`} />
              <Input name="translator" defaultValue={t?.translator ?? ""} placeholder="Translator" />
              <div className="flex items-center gap-2">
                <Button size="sm" type="submit">Save</Button>
                {t && <span className="text-xs text-muted-foreground">{t.review_status}</span>}
              </div>
            </form>
            {t && t.review_status !== "approved" && (
              <form action={setHadithTranslationStatus}>
                <input type="hidden" name="hadith_id" value={h.id} />
                <input type="hidden" name="lang" value={lang} />
                <input type="hidden" name="status" value="approved" />
                <Button size="sm" variant="outline" type="submit">Approve</Button>
              </form>
            )}
          </div>
        )
      })}
      <div className="flex gap-2">
        {page > 0 && <a className="rounded border px-3 py-1 text-sm" href={link(page - 1)}>Previous</a>}
        {(rows ?? []).length === PAGE && <a className="rounded border px-3 py-1 text-sm" href={link(page + 1)}>Next</a>}
      </div>
    </ConsoleShell>
  )
}
