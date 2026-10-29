import { redirect } from "next/navigation"
import Link from "next/link"
import { Download, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import DashboardNav from "@/components/dashboard/dashboard-nav"

export const dynamic = "force-dynamic"
export const metadata = { title: "HIF App | Dashboard" }

const PLAN_LABEL: Record<string, string> = { monthly: "Monthly", yearly: "Yearly", pass: "7-day pass", grant: "Granted" }

const fmt = (d: string) => new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })

export default async function DashboardAppPage() {
  const supabase = await createClient()
  const { data: auth } = await supabase.auth.getUser()
  if (!auth.user) redirect("/auth/login?redirect=/dashboard/app")

  const now = new Date().toISOString()
  const [{ data: ents }, { data: release }] = await Promise.all([
    supabase
      .from("entitlements")
      .select("plan, valid_to, source, created_at")
      .eq("user_id", auth.user.id)
      .is("revoked_at", null)
      .order("valid_to", { ascending: false })
      .limit(10),
    createAdminClient()
      .from("app_releases")
      .select("version_name, apk_url, size_mb")
      .eq("published", true)
      .order("build", { ascending: false })
      .limit(1)
      .maybeSingle(),
  ])

  const active = (ents ?? []).find((e) => e.valid_to > now)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid gap-8 md:grid-cols-[240px_1fr]">
        <DashboardNav />
        <main className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">HIF App</h1>
        <p className="text-muted-foreground">Your app download and Plus membership.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-emerald-700" /> HIF Plus
            {active ? <Badge>Active</Badge> : <Badge variant="secondary">Not active</Badge>}
          </CardTitle>
          <CardDescription>
            {active
              ? `${PLAN_LABEL[active.plan] ?? active.plan} plan, valid until ${fmt(active.valid_to)}. It does not renew by itself.`
              : "Worship features are always free. Plus adds extras such as unlimited recitation checks. Buy it inside the app."}
          </CardDescription>
        </CardHeader>
        {(ents ?? []).length > 0 && (
          <CardContent>
            <p className="mb-2 text-sm font-medium">History</p>
            <ul className="space-y-1 text-sm text-muted-foreground">
              {ents!.map((e, i) => (
                <li key={i}>
                  {PLAN_LABEL[e.plan] ?? e.plan}: until {fmt(e.valid_to)}
                </li>
              ))}
            </ul>
          </CardContent>
        )}
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Download for Android</CardTitle>
          <CardDescription>
            {release ? `Version ${release.version_name}${release.size_mb ? ` · ${release.size_mb} MB` : ""}` : "The first download is almost ready."}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          {release && (
            <Button asChild>
              <a href={release.apk_url}>
                <Download className="mr-2 h-4 w-4" /> Download the APK
              </a>
            </Button>
          )}
          <Button asChild variant="outline">
            <Link href="/app">Install instructions</Link>
          </Button>
        </CardContent>
      </Card>
        </main>
      </div>
    </div>
  )
}
