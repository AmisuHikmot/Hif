import { requireStaff } from "@/lib/admin/guard"
import { createAdminClient } from "@/lib/supabase/admin"
import ConsoleShell from "@/components/admin/console/console-shell"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { deleteHijriMonth, saveHijriMonth } from "@/lib/admin/actions"

export const metadata = { title: "Hijri override | Admin" }
export const dynamic = "force-dynamic"

const MONTHS = ["Muharram","Safar","Rabi al-Awwal","Rabi al-Thani","Jumada al-Awwal","Jumada al-Thani","Rajab","Shaban","Ramadan","Shawwal","Dhul Qadah","Dhul Hijjah"]

export default async function HijriPage() {
  await requireStaff("/admin/hijri")
  const { data } = await createAdminClient()
    .from("hijri_month_starts")
    .select("*")
    .order("hijri_year", { ascending: false })
    .order("hijri_month", { ascending: false })
    .limit(36)
  return (
    <ConsoleShell
      title="Hijri override"
      intro="When Nigeria’s moon-sighting committee announces a month, record its first day here. Published rows replace the calculated dates in the app from that day on."
    >
      <form action={saveHijriMonth} className="grid gap-2 rounded-lg border p-4 md:grid-cols-5">
        <Input name="hijri_year" type="number" placeholder="Hijri year (e.g. 1448)" required />
        <select name="hijri_month" className="rounded-md border bg-background px-3 py-2 text-sm" required>
          {MONTHS.map((m, i) => <option key={m} value={i + 1}>{i + 1}. {m}</option>)}
        </select>
        <Input name="starts_on" type="date" required />
        <Input name="source" placeholder="Source (announcement)" />
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="publish" /> Publish</label>
        <Button type="submit" className="md:col-span-5">Save</Button>
      </form>
      <table className="w-full text-sm">
        <thead><tr className="text-left text-muted-foreground"><th>Month</th><th>Starts</th><th>Source</th><th>Status</th><th /></tr></thead>
        <tbody>
          {(data ?? []).map((r) => (
            <tr key={r.id} className="border-t">
              <td className="py-2">{MONTHS[r.hijri_month - 1]} {r.hijri_year}</td>
              <td>{r.starts_on}</td>
              <td>{r.source ?? "—"}</td>
              <td>{r.published ? "Published" : "Draft"}</td>
              <td>
                <form action={deleteHijriMonth}>
                  <input type="hidden" name="id" value={r.id} />
                  <Button size="sm" variant="ghost" type="submit">Delete</Button>
                </form>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </ConsoleShell>
  )
}
