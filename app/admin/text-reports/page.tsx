import { requireStaff } from "@/lib/admin/guard"
import { createAdminClient } from "@/lib/supabase/admin"
import ConsoleShell from "@/components/admin/console/console-shell"
import { Button } from "@/components/ui/button"
import { resolveTextReport } from "@/lib/seasons/actions"

export const metadata = { title: "Text reports | Admin" }
export const dynamic = "force-dynamic"

export default async function TextReportsPage({ searchParams }: { searchParams: Promise<{ show?: string }> }) {
  await requireStaff("/admin/text-reports")
  const sp = await searchParams
  const all = sp.show === "all"
  let q = createAdminClient().from("text_reports").select("*").order("created_at", { ascending: false }).limit(200)
  if (!all) q = q.eq("status", "open")
  const { data, error } = await q
  const hoursOld = (d: string) => Math.floor((Date.now() - new Date(d).getTime()) / 3600000)
  return (
    <ConsoleShell title="Quran and hadith reports" intro="Mistakes reported from the app. Look at new reports within 2 hours; fix or withdraw the text within 24 hours.">
      {error && (
        <p className="rounded-lg border border-destructive p-3 text-sm">
          Could not read text_reports ({error.message}). Run db/37_text_reports.sql in the Supabase SQL editor first.
        </p>
      )}
      <p className="text-sm">
        <a className="underline" href={all ? "/admin/text-reports" : "/admin/text-reports?show=all"}>{all ? "Show open only" : "Show all"}</a>
      </p>
      <div className="grid gap-2">
        {(data ?? []).map((r) => (
          <div key={r.id} className="rounded-lg border p-3 text-sm">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <strong>{r.kind} · {r.reference}</strong>
              <span className="text-xs text-muted-foreground">
                {r.status}{r.status === "open" && hoursOld(r.created_at) >= 2 ? ` · ${hoursOld(r.created_at)} h old` : ""}
              </span>
            </div>
            {r.note && <p className="mt-1 whitespace-pre-wrap">{r.note}</p>}
            <div className="mt-2 flex gap-2">
              {["fixed", "withdrawn", "open"].filter((s) => s !== r.status).map((s) => (
                <form key={s} action={resolveTextReport}>
                  <input type="hidden" name="id" value={r.id} />
                  <input type="hidden" name="status" value={s} />
                  <Button type="submit" size="sm" variant="outline">{s === "open" ? "Reopen" : s === "fixed" ? "Mark fixed" : "Text withdrawn"}</Button>
                </form>
              ))}
            </div>
          </div>
        ))}
        {(data ?? []).length === 0 && <p className="text-sm text-muted-foreground">No reports.</p>}
      </div>
    </ConsoleShell>
  )
}
