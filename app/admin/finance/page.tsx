import { requireStaff } from "@/lib/admin/guard"
import { createAdminClient } from "@/lib/supabase/admin"
import ConsoleShell from "@/components/admin/console/console-shell"

export const metadata = { title: "Finance | Admin" }
export const dynamic = "force-dynamic"

const naira = (n: number) => `₦${Math.round(n).toLocaleString("en-NG")}`

export default async function FinancePage() {
  await requireStaff("/admin/finance")
  const db = createAdminClient()
  const [{ data: donations }, { data: txns }, { data: hooks }] = await Promise.all([
    db.from("donations").select("id, amount, payment_status, payment_reference, created_at, donor_name, project_name").order("created_at", { ascending: false }).limit(500),
    db.from("paystack_transactions").select("reference, amount_kobo, status, paid_at, donation_id").order("created_at", { ascending: false }).limit(500),
    db.from("paystack_webhooks").select("id, reference, event_type, processed, created_at").eq("processed", false).order("created_at", { ascending: false }).limit(20),
  ])

  const done = (donations ?? []).filter((d) => d.payment_status === "completed")
  const total = done.reduce((s, d) => s + (d.amount ?? 0), 0)
  const pending = (donations ?? []).filter((d) => d.payment_status !== "completed")

  // Reconciliation: Paystack says paid, donation does not (or amounts differ).
  const byRef = new Map((donations ?? []).map((d) => [d.payment_reference, d]))
  const mismatches = (txns ?? []).flatMap((t) => {
    if (t.status !== "success") return []
    const d = byRef.get(t.reference)
    if (!d) return [{ ref: t.reference, why: "Paid on Paystack, no donation row", paystack: t.amount_kobo / 100, ours: null as number | null }]
    if (d.payment_status !== "completed") return [{ ref: t.reference, why: "Paid on Paystack, donation not completed", paystack: t.amount_kobo / 100, ours: d.amount as number }]
    if (Math.round((d.amount ?? 0) * 100) !== Number(t.amount_kobo)) return [{ ref: t.reference, why: "Amounts differ", paystack: t.amount_kobo / 100, ours: d.amount as number }]
    return []
  })

  const perProject = new Map<string, number>()
  for (const d of done) perProject.set(d.project_name ?? "General", (perProject.get(d.project_name ?? "General") ?? 0) + (d.amount ?? 0))

  return (
    <ConsoleShell title="Finance" intro="Completed gifts, what is waiting, and anything Paystack and the donations table disagree on. Amounts are whole naira.">
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border p-4"><div className="text-sm text-muted-foreground">Completed (last 500)</div><div className="text-2xl font-bold">{naira(total)}</div></div>
        <div className="rounded-lg border p-4"><div className="text-sm text-muted-foreground">Not completed</div><div className="text-2xl font-bold">{pending.length}</div></div>
        <div className="rounded-lg border p-4"><div className="text-sm text-muted-foreground">Needs reconciling</div><div className="text-2xl font-bold">{mismatches.length}</div></div>
      </div>

      <section>
        <h2 className="mb-2 text-xl font-semibold">Needs reconciling</h2>
        {mismatches.length === 0 ? <p className="text-muted-foreground">Everything matches.</p> : (
          <table className="w-full text-sm"><thead><tr className="text-left text-muted-foreground"><th>Reference</th><th>Problem</th><th>Paystack</th><th>Ours</th></tr></thead>
            <tbody>{mismatches.map((m) => <tr key={m.ref} className="border-t"><td className="py-2 font-mono text-xs">{m.ref}</td><td>{m.why}</td><td>{naira(m.paystack)}</td><td>{m.ours === null ? "—" : naira(m.ours)}</td></tr>)}</tbody></table>
        )}
      </section>

      <section>
        <h2 className="mb-2 text-xl font-semibold">By project</h2>
        <table className="w-full text-sm"><tbody>
          {[...perProject.entries()].sort((a, b) => b[1] - a[1]).map(([p, v]) => <tr key={p} className="border-t"><td className="py-2">{p}</td><td className="text-right">{naira(v)}</td></tr>)}
        </tbody></table>
      </section>

      <section>
        <h2 className="mb-2 text-xl font-semibold">Unprocessed webhooks</h2>
        {(hooks ?? []).length === 0 ? <p className="text-muted-foreground">None.</p> : (
          <ul className="text-sm">{hooks!.map((h) => <li key={h.id} className="border-t py-1">{h.event_type} · <span className="font-mono text-xs">{h.reference}</span> · {h.created_at}</li>)}</ul>
        )}
      </section>

      <a className="underline" href="/admin/finance/export">Download completed gifts (CSV)</a>
    </ConsoleShell>
  )
}
