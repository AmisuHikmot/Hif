import { requireStaff } from "@/lib/admin/guard"
import { createAdminClient } from "@/lib/supabase/admin"
import ConsoleShell from "@/components/admin/console/console-shell"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { publishRelease, setReleasePublished } from "@/lib/releases/actions"

export const metadata = { title: "App releases | Admin" }
export const dynamic = "force-dynamic"

export default async function ReleasesPage() {
  await requireStaff("/admin/releases")
  const { data: rows } = await createAdminClient().from("app_releases").select("*").order("build", { ascending: false })
  return (
    <ConsoleShell title="App releases" intro="Upload the signed APK somewhere public (for example a GitHub release), then add it here. The download page at /app and the in-app update notice use the newest published build. Get the SHA-256 with: shasum -a 256 app-release.apk">
      <form action={publishRelease} className="grid gap-2 rounded-lg border p-4 sm:grid-cols-2">
        <Input name="version_name" placeholder="Version, e.g. 1.0.1" required />
        <Input name="build" type="number" placeholder="Build number (from pubspec +N)" required />
        <Input name="apk_url" placeholder="https:// link to the APK" className="sm:col-span-2" required />
        <Input name="sha256" placeholder="SHA-256 (64 hex characters)" className="sm:col-span-2" />
        <Input name="size_mb" type="number" step="0.1" placeholder="Size in MB" />
        <Input name="notes" placeholder="What changed (one or two lines)" />
        <Button type="submit" className="sm:col-span-2">Publish release</Button>
      </form>
      {(rows ?? []).map((r) => (
        <form key={r.id} action={setReleasePublished} className="flex items-center gap-2 rounded-lg border p-3">
          <input type="hidden" name="id" value={r.id} />
          <input type="hidden" name="published" value={String(!r.published)} />
          <div className="mr-auto text-sm">
            <span className="font-medium">{r.version_name}</span> (build {r.build}) · {r.published ? "published" : "hidden"}
          </div>
          <Button type="submit" size="sm" variant="outline">{r.published ? "Hide" : "Show"}</Button>
        </form>
      ))}
    </ConsoleShell>
  )
}
