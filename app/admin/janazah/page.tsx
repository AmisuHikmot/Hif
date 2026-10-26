import { requireStaff } from "@/lib/admin/guard"
import { createAdminClient } from "@/lib/supabase/admin"
import ConsoleShell from "@/components/admin/console/console-shell"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { saveJanazah, setJanazahPublished } from "@/lib/admin/actions"

export const metadata = { title: "Janazah | Admin" }
export const dynamic = "force-dynamic"

export default async function JanazahPage() {
  await requireStaff("/admin/janazah")
  const { data } = await createAdminClient().from("janazah_notices").select("*").order("prayer_at", { ascending: false }).limit(30)
  return (
    <ConsoleShell title="Janazah notices" intro="Funeral prayer notices. A notice stops showing three hours after the prayer. Keep to the name, place and time.">
      <form action={saveJanazah} className="grid gap-2 rounded-lg border p-4 md:grid-cols-2">
        <Input name="title" placeholder="Name (e.g. Alhaji …)" required />
        <Input name="place" placeholder="Place" required />
        <Input name="prayer_at" type="datetime-local" required />
        <Input name="note" placeholder="Note (optional, 500 characters)" maxLength={500} />
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="publish" /> Publish now</label>
        <Button type="submit">Save notice</Button>
      </form>
      {(data ?? []).map((n) => (
        <div key={n.id} className="flex items-center justify-between rounded-lg border p-3">
          <div><div className="font-medium">{n.title}</div><div className="text-sm text-muted-foreground">{n.place} · {new Date(n.prayer_at).toLocaleString("en-NG")} · {n.published ? "published" : "draft"}</div></div>
          <form action={setJanazahPublished}>
            <input type="hidden" name="id" value={n.id} />
            <input type="hidden" name="published" value={String(!n.published)} />
            <Button size="sm" variant="outline" type="submit">{n.published ? "Unpublish" : "Publish"}</Button>
          </form>
        </div>
      ))}
    </ConsoleShell>
  )
}
