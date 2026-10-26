import { requireStaff } from "@/lib/admin/guard"
import { createAdminClient } from "@/lib/supabase/admin"
import ConsoleShell from "@/components/admin/console/console-shell"
import { Button } from "@/components/ui/button"
import { reviewSuggestion } from "@/lib/admin/actions"

export const metadata = { title: "Moderation | Admin" }
export const dynamic = "force-dynamic"

export default async function ModerationPage() {
  await requireStaff("/admin/moderation")
  const { data } = await createAdminClient()
    .from("mosque_suggestions")
    .select("id, kind, name, address, city, state, phone, note, latitude, longitude, mosque_id, created_at, mosques(name)")
    .eq("status", "pending")
    .order("created_at")
    .limit(100)
  return (
    <ConsoleShell title="Moderation" intro="Suggestions from the public to add, correct or close a mosque. Nothing changes until you accept.">
      {(data ?? []).map((s) => {
        const target = Array.isArray(s.mosques) ? s.mosques[0]?.name : (s.mosques as { name: string } | null)?.name
        return (
          <div key={s.id} className="rounded-lg border p-3">
            <div className="font-medium">
              {s.kind === "new" ? "Add" : s.kind === "closed" ? "Report closed" : "Correct"}: {s.name ?? target}
            </div>
            <div className="text-sm text-muted-foreground">
              {[s.address, s.city, s.state, s.phone].filter(Boolean).join(" · ")}
              {s.latitude !== null && s.longitude !== null && (
                <> · <a className="underline" target="_blank" rel="noreferrer" href={`https://www.openstreetmap.org/?mlat=${s.latitude}&mlon=${s.longitude}#map=17/${s.latitude}/${s.longitude}`}>map</a></>
              )}
            </div>
            {s.note && <p className="mt-1 text-sm">“{s.note}”</p>}
            <div className="mt-2 flex gap-2">
              {["accept", "reject"].map((d) => (
                <form action={reviewSuggestion} key={d}>
                  <input type="hidden" name="id" value={s.id} />
                  <input type="hidden" name="decision" value={d} />
                  <Button size="sm" variant={d === "accept" ? "default" : "outline"} type="submit">{d === "accept" ? "Accept" : "Reject"}</Button>
                </form>
              ))}
            </div>
          </div>
        )
      })}
      {(data ?? []).length === 0 && <p className="text-muted-foreground">Nothing waiting.</p>}
    </ConsoleShell>
  )
}
