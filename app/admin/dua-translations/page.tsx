import { requireStaff } from "@/lib/admin/guard"
import { createAdminClient } from "@/lib/supabase/admin"
import ConsoleShell from "@/components/admin/console/console-shell"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { saveDuaTranslation, setDuaTranslationStatus } from "@/lib/mosque-admin/actions"

export const metadata = { title: "Dua translations | Admin" }
export const dynamic = "force-dynamic"

const LANGS = [
  { code: "ha", name: "Hausa" },
  { code: "yo", name: "Yoruba" },
  { code: "fr", name: "French" },
]

export default async function DuaTranslationsPage({ searchParams }: { searchParams: Promise<{ cat?: string; lang?: string }> }) {
  await requireStaff("/admin/dua-translations")
  const sp = await searchParams
  const lang = LANGS.some((l) => l.code === sp.lang) ? sp.lang! : "ha"
  const db = createAdminClient()
  const { data: cats } = await db.from("adhkar_categories").select("id, title_en").order("position")
  const cat = Number(sp.cat) || cats?.[0]?.id
  const { data: items } = cat
    ? await db.from("adhkar_items").select("id, arabic, english, position").eq("category_id", cat).order("position")
    : { data: [] as { id: string; arabic: string; english: string | null; position: number }[] }
  const ids = (items ?? []).map((i) => i.id)
  const { data: existing } = ids.length
    ? await db.from("adhkar_translations").select("item_id, body, review_status").eq("lang", lang).in("item_id", ids)
    : { data: [] as { item_id: string; body: string; review_status: string }[] }
  const byItem = new Map((existing ?? []).map((t) => [t.item_id, t]))

  return (
    <ConsoleShell title="Dua translations" intro="Add or correct Hausa, Yoruba and French translations of the duas. Every save goes back to “pending” until the Shariah Board approves it. Quran verses inside a dua should use the approved translation of that verse.">
      <form className="flex flex-wrap gap-2">
        <select name="cat" defaultValue={cat} className="rounded border px-2 py-1">
          {(cats ?? []).map((c) => <option key={c.id} value={c.id}>{c.title_en}</option>)}
        </select>
        <select name="lang" defaultValue={lang} className="rounded border px-2 py-1">
          {LANGS.map((l) => <option key={l.code} value={l.code}>{l.name}</option>)}
        </select>
        <Button type="submit">Show</Button>
      </form>
      {(items ?? []).map((it) => {
        const t = byItem.get(it.id)
        return (
          <div key={it.id} className="space-y-2 rounded-lg border p-4">
            <p dir="rtl" className="text-lg leading-loose">{it.arabic}</p>
            {it.english && <p className="text-sm text-muted-foreground">{it.english}</p>}
            <form action={saveDuaTranslation} className="space-y-2">
              <input type="hidden" name="item_id" value={it.id} />
              <input type="hidden" name="lang" value={lang} />
              <Textarea name="body" rows={3} defaultValue={t?.body ?? ""} placeholder={`Translation in ${LANGS.find((l) => l.code === lang)?.name}`} />
              <div className="flex items-center gap-2">
                <Button size="sm" type="submit">Save</Button>
                {t && <span className="text-xs text-muted-foreground">{t.review_status}</span>}
              </div>
            </form>
            {t && t.review_status !== "approved" && (
              <form action={setDuaTranslationStatus}>
                <input type="hidden" name="item_id" value={it.id} />
                <input type="hidden" name="lang" value={lang} />
                <input type="hidden" name="status" value="approved" />
                <Button size="sm" variant="outline" type="submit">Approve</Button>
              </form>
            )}
          </div>
        )
      })}
    </ConsoleShell>
  )
}
