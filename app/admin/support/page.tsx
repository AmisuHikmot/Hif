import { requireStaff } from "@/lib/admin/guard"
import { createAdminClient } from "@/lib/supabase/admin"
import ConsoleShell from "@/components/admin/console/console-shell"
import { Button } from "@/components/ui/button"
import { setSubmissionStatus } from "@/lib/admin/actions"

export const metadata = { title: "Support | Admin" }
export const dynamic = "force-dynamic"

export default async function SupportPage() {
  await requireStaff("/admin/support")
  const { data } = await createAdminClient()
    .from("contact_submissions")
    .select("id, first_name, last_name, email, subject, message, status, created_at")
    .order("created_at", { ascending: false })
    .limit(100)
  return (
    <ConsoleShell title="Support" intro="Messages from the website and the app: feedback, scholarship and consultation requests, guardian approvals and error reports.">
      {(data ?? []).map((m) => (
        <details key={m.id} className="rounded-lg border p-3" open={m.status === "pending"}>
          <summary className="flex cursor-pointer justify-between gap-4">
            <span className="font-medium">{m.subject}</span>
            <span className="text-sm text-muted-foreground">{m.first_name} {m.last_name} · {new Date(m.created_at).toLocaleDateString("en-NG")} · {m.status}</span>
          </summary>
          <p className="mt-3 whitespace-pre-wrap text-sm">{m.message}</p>
          <div className="mt-3 flex gap-2">
            <a className="underline text-sm" href={`mailto:${m.email}?subject=Re: ${encodeURIComponent(m.subject)}`}>Reply by email ({m.email})</a>
            {["read", "replied", "archived"].map((s) => (
              <form action={setSubmissionStatus} key={s}>
                <input type="hidden" name="id" value={m.id} />
                <input type="hidden" name="status" value={s} />
                <Button size="sm" variant="outline" type="submit">Mark {s}</Button>
              </form>
            ))}
          </div>
        </details>
      ))}
      {(data ?? []).length === 0 && <p className="text-muted-foreground">No messages.</p>}
    </ConsoleShell>
  )
}
