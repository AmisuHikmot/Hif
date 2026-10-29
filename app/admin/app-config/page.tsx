import { requireStaff } from "@/lib/admin/guard"
import { createAdminClient } from "@/lib/supabase/admin"
import ConsoleShell from "@/components/admin/console/console-shell"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { SWITCHABLE_MODULES, saveLayout, saveModules } from "@/lib/app-config/actions"

export const metadata = { title: "App settings | Admin" }
export const dynamic = "force-dynamic"

export default async function AppConfigPage() {
  await requireStaff("/admin/app-config")
  const { data: rows, error } = await createAdminClient().from("app_config").select("key,value")
  const byKey = Object.fromEntries((rows ?? []).map((r) => [r.key, r.value]))
  const off = (byKey.modules ?? {}) as Record<string, boolean>
  const layout = byKey.home_layout ? JSON.stringify(byKey.home_layout, null, 2) : ""
  return (
    <ConsoleShell title="App settings" intro="Changes reach phones the next time the app refreshes (within about six hours). No app update is needed. Leave everything as it is to use what is built into the app.">
      {error && (
        <p className="rounded-lg border border-destructive p-3 text-sm">
          Could not read app_config ({error.message}). Run db/27_app_config.sql in the Supabase SQL editor first.
        </p>
      )}
      <form action={saveModules} className="grid gap-2 rounded-lg border p-4 sm:grid-cols-2">
        <h2 className="font-medium sm:col-span-2">Switch things off in More</h2>
        <p className="text-sm text-muted-foreground sm:col-span-2">
          Tick an item to hide it. Language, preferences, backup, account, help and about always stay.
        </p>
        {SWITCHABLE_MODULES.map((id) => (
          <label key={id} className="flex items-center gap-2 text-sm">
            <input type="checkbox" name={`off_${id}`} defaultChecked={off[id] === false} />
            {id}
          </label>
        ))}
        <Button type="submit" className="sm:col-span-2">Save</Button>
      </form>
      <form action={saveLayout} className="grid gap-2 rounded-lg border p-4">
        <h2 className="font-medium">Today screen layout</h2>
        <p className="text-sm text-muted-foreground">
          JSON with a &quot;sections&quot; list (each has an &quot;id&quot;, a &quot;type&quot; and optional &quot;params&quot; and &quot;visible_if&quot;). The prayer card always stays first. Clear the box and save to go back to the built-in layout.
        </p>
        <Textarea name="layout" defaultValue={layout} rows={16} className="font-mono text-xs" />
        <Button type="submit">Save layout</Button>
      </form>
    </ConsoleShell>
  )
}
