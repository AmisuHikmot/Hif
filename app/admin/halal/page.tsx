import { requireStaff } from "@/lib/admin/guard"
import { createAdminClient } from "@/lib/supabase/admin"
import ConsoleShell from "@/components/admin/console/console-shell"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { publishPlace, declineSuggestion, hidePlace } from "@/lib/halal/actions"

export const metadata = { title: "Halal places | Admin" }
export const dynamic = "force-dynamic"

export default async function HalalAdminPage() {
  await requireStaff("/admin/halal")
  const db = createAdminClient()
  const [{ data: sugg }, { data: places, count }] = await Promise.all([
    db.from("halal_place_suggestions").select("*").eq("status", "new").order("created_at"),
    db.from("halal_places").select("id,name,kind,city,source,status", { count: "exact" }).neq("status", "hidden").order("created_at", { ascending: false }).limit(50),
  ])
  return (
    <ConsoleShell title="Halal places" intro="People suggest places from the app. Check each one, find its coordinates on a map (right-click, copy), and list it. HIF does not certify the place; the app says so.">
      <h2 className="text-xl font-semibold">Suggestions ({sugg?.length ?? 0})</h2>
      {(sugg ?? []).map((s) => (
        <div key={s.id} className="space-y-2 rounded-lg border p-4">
          <div className="text-sm text-muted-foreground">
            {s.kind} · {[s.address, s.city, s.state].filter(Boolean).join(", ") || "no address"}
          </div>
          {s.note && <p className="text-sm">{s.note}</p>}
          <form action={publishPlace} className="flex flex-wrap items-center gap-2">
            <input type="hidden" name="id" value={s.id} />
            <input type="hidden" name="kind" value={s.kind} />
            <Input name="name" defaultValue={s.name} className="w-60" aria-label="Name" />
            <Input name="latitude" placeholder="Latitude" className="w-32" required />
            <Input name="longitude" placeholder="Longitude" className="w-32" required />
            <Button type="submit">List it</Button>
          </form>
          <form action={declineSuggestion}>
            <input type="hidden" name="id" value={s.id} />
            <Button type="submit" variant="outline" size="sm">Decline</Button>
          </form>
        </div>
      ))}
      <h2 className="text-xl font-semibold">Listed ({count ?? 0})</h2>
      {(places ?? []).map((p) => (
        <form key={p.id} action={hidePlace} className="flex items-center gap-2 rounded-lg border p-3">
          <input type="hidden" name="id" value={p.id} />
          <div className="mr-auto text-sm">
            <span className="font-medium">{p.name}</span> · {p.kind} · {p.city ?? "—"} · {p.source}/{p.status}
          </div>
          <Button type="submit" size="sm" variant="outline">Hide</Button>
        </form>
      ))}
    </ConsoleShell>
  )
}
