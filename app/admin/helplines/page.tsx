import { requireStaff } from "@/lib/admin/guard"
import { createAdminClient } from "@/lib/supabase/admin"
import ConsoleShell from "@/components/admin/console/console-shell"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { saveHelpline, setHelplineActive } from "@/lib/admin/actions"

export const metadata = { title: "Helplines | Admin" }
export const dynamic = "force-dynamic"

export default async function HelplinesAdmin() {
  await requireStaff("/admin/helplines")
  const { data } = await createAdminClient().from("helplines").select("*").order("name")
  return (
    <ConsoleShell title="Helplines" intro="Call each number and check who answers before ticking “verified”. Only verified, active numbers show in the app.">
      <form action={saveHelpline} className="grid gap-2 rounded-lg border p-4 md:grid-cols-2">
        <Input name="name" placeholder="Name of the service" required />
        <Input name="phone" placeholder="Phone number" required />
        <Input name="description" placeholder="What it is for, when it is open" />
        <Input name="source" placeholder="Source (official page)" />
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="verified" /> I called it and it is correct</label>
        <Button type="submit">Add</Button>
      </form>
      {(data ?? []).map((h) => (
        <div key={h.id} className="flex items-center justify-between rounded-lg border p-3">
          <div>
            <div className="font-medium">{h.name} · {h.phone}</div>
            <div className="text-sm text-muted-foreground">{h.description} {h.verified_on ? `· verified ${h.verified_on}` : "· NOT verified (hidden)"}</div>
          </div>
          <form action={setHelplineActive}>
            <input type="hidden" name="id" value={h.id} />
            <input type="hidden" name="active" value={String(!h.is_active)} />
            <Button size="sm" variant="outline" type="submit">{h.is_active ? "Hide" : "Show"}</Button>
          </form>
        </div>
      ))}
    </ConsoleShell>
  )
}
