import Link from "next/link"
import { redirect } from "next/navigation"
import SchoolShell from "@/components/schools/school-shell"
import RegisterAppForm from "@/components/schools/register-app-form"
import SecretButton from "@/components/schools/secret-button"
import { Button } from "@/components/ui/button"
import { currentUserId } from "@/lib/schools/guard"
import { createAdminClient } from "@/lib/supabase/admin"
import { deleteApp } from "@/lib/developers/actions"

export const metadata = { title: "Developers | HIF ID" }
export const dynamic = "force-dynamic"

const TIER_TEXT: Record<string, string> = {
  sandbox: "Sandbox",
  basic: "Basic: up to 100 users, shown as “Not yet verified by HIF”",
  verified: "Verified",
  trusted: "Trusted",
}

export default async function DevelopersPage() {
  const userId = await currentUserId()
  if (!userId) redirect("/auth/login?redirect=/developers")
  const { data: apps } = await createAdminClient().from("oauth_apps").select("*").eq("owner_id", userId).order("created_at", { ascending: false })
  return (
    <SchoolShell
      title="Sign in with HIF ID"
      intro="Let people sign in to your app or school system with their HIF ID. Standard OpenID Connect with PKCE, so any OIDC library works."
    >
      <Button asChild variant="outline"><Link href="/developers/docs">Read the guide</Link></Button>
      <h2 className="text-xl font-semibold">Your apps</h2>
      {(apps ?? []).length === 0 && <p className="text-muted-foreground">You have not registered an app yet.</p>}
      {(apps ?? []).map((a) => (
        <div key={a.id} className="space-y-2 rounded-lg border p-4">
          <div className="font-medium">{a.name} <span className="text-sm font-normal text-muted-foreground">· {TIER_TEXT[a.tier] ?? a.tier}{a.status === "suspended" ? " · suspended" : ""}</span></div>
          <div className="font-mono text-xs break-all">Client ID: {a.client_id}</div>
          <div className="text-xs text-muted-foreground">Scopes: {a.scopes} · {a.redirect_uris.length} redirect URI(s)</div>
          <div className="flex flex-wrap items-start gap-2">
            <SecretButton clientId={a.client_id} />
            <form action={deleteApp}>
              <input type="hidden" name="client_id" value={a.client_id} />
              <Button size="sm" variant="outline" type="submit">Delete</Button>
            </form>
          </div>
        </div>
      ))}
      <h2 className="text-xl font-semibold">Register an app</h2>
      <RegisterAppForm />
    </SchoolShell>
  )
}
