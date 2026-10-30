import { requireStaff } from "@/lib/admin/guard"
import { createAdminClient } from "@/lib/supabase/admin"
import ConsoleShell from "@/components/admin/console/console-shell"

export const metadata = { title: "Late adhan reports | Admin" }
export const dynamic = "force-dynamic"

export default async function AlarmReportsPage() {
  await requireStaff("/admin/alarm-reports")
  const { data, error } = await createAdminClient()
    .from("alarm_reports")
    .select("manufacturer, model, android, exact_allowed, late_bucket")
    .order("created_at", { ascending: false })
    .limit(2000)
  const groups = new Map<string, { n: number; bad: number; noExact: number; android: Set<number> }>()
  for (const r of data ?? []) {
    const k = `${r.manufacturer} ${r.model}`
    const g = groups.get(k) ?? { n: 0, bad: 0, noExact: 0, android: new Set<number>() }
    g.n++
    if (r.late_bucket === "over15" || r.late_bucket === "never") g.bad++
    if (r.exact_allowed === false) g.noExact++
    if (r.android) g.android.add(r.android)
    groups.set(k, g)
  }
  const rows = [...groups.entries()].sort((a, b) => b[1].n - a[1].n)
  return (
    <ConsoleShell title="Late adhan reports" intro="Sent by people who chose to report a late adhan. Only the phone maker and model, Android version, and whether exact alarms were allowed. Use it to keep the reliable-adhan guide current for the phones that struggle most.">
      {error && <p className="rounded-lg border border-destructive p-3 text-sm">Could not read reports ({error.message}). Run db/33_alarm_reports.sql first.</p>}
      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full text-sm">
          <thead className="bg-muted text-left">
            <tr>{["Phone", "Reports", "Over 15 min or missed", "Exact alarms off", "Android"].map((h) => <th key={h} className="px-3 py-2">{h}</th>)}</tr>
          </thead>
          <tbody>
            {rows.map(([k, g]) => (
              <tr key={k} className="border-t">
                <td className="px-3 py-1.5">{k}</td><td className="px-3">{g.n}</td><td className="px-3">{g.bad}</td>
                <td className="px-3">{g.noExact}</td><td className="px-3">{[...g.android].sort().join(", ")}</td>
              </tr>
            ))}
            {rows.length === 0 && <tr><td className="px-3 py-3 text-muted-foreground" colSpan={5}>No reports yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </ConsoleShell>
  )
}
