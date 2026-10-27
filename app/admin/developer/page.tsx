import { requireStaff } from "@/lib/admin/guard"
import { createAdminClient } from "@/lib/supabase/admin"
import ConsoleShell from "@/components/admin/console/console-shell"
import { Button } from "@/components/ui/button"
import { setAppTier, suspendApp } from "@/lib/developers/admin-actions"

export const metadata = { title: "Developers | Admin" }
export const dynamic = "force-dynamic"

export default async function DeveloperPage() {
  await requireStaff("/admin/developer")
  const { data: apps } = await createAdminClient().from("oauth_apps").select("*").order("created_at", { ascending: false }).limit(100)
  return (
    <ConsoleShell
      title="Developer console"
      intro="Partner apps that sign in with HIF ID. Check the privacy policy, redirect addresses and scopes before raising an app above Basic. Suspending removes the app from the sign-in service at once."
    >
      {(apps ?? []).length === 0 && <p className="text-muted-foreground">No apps registered yet.</p>}
      {(apps ?? []).map((a) => (
        <div key={a.id} className="space-y-2 rounded-lg border p-4">
          <div className="font-medium">{a.name} <span className="text-sm font-normal text-muted-foreground">· {a.tier} · {a.status}</span></div>
          <div className="text-sm text-muted-foreground">
            {a.support_email} · <a className="underline" href={a.privacy_url ?? "#"} target="_blank" rel="noreferrer">privacy</a>
            {a.homepage_url && <> · <a className="underline" href={a.homepage_url} target="_blank" rel="noreferrer">site</a></>} · scopes: {a.scopes}
          </div>
          <div className="font-mono text-xs break-all">{a.redirect_uris.join("  ")}</div>
          <div className="flex flex-wrap gap-2">
            <form action={setAppTier} className="flex gap-2">
              <input type="hidden" name="id" value={a.id} />
              <select name="tier" defaultValue={a.tier} className="rounded-md border bg-background px-3 py-2 text-sm">
                {["sandbox", "basic", "verified", "trusted"].map((t) => <option key={t}>{t}</option>)}
              </select>
              <Button type="submit" size="sm" variant="outline">Set tier</Button>
            </form>
            {a.status !== "suspended" && (
              <form action={suspendApp}>
                <input type="hidden" name="id" value={a.id} />
                <Button type="submit" size="sm" variant="outline">Suspend</Button>
              </form>
            )}
          </div>
        </div>
      ))}
    </ConsoleShell>
  )
}
