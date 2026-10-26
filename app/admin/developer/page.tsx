import { requireStaff } from "@/lib/admin/guard"
import ConsoleShell from "@/components/admin/console/console-shell"

export const metadata = { title: "Developers | Admin" }

export default async function DeveloperPage() {
  await requireStaff("/admin/developer")
  return (
    <ConsoleShell title="Developer console" intro="Partner apps that sign in with HIF ID.">
      <div className="rounded-lg border p-6">
        <p>Phase 3. Registering partner apps, client secrets, scopes and consent screens arrive with the partner OAuth programme.</p>
        <p className="mt-2 text-sm text-muted-foreground">Every partner is reviewed first: scopes such as hifz.progress.read are for signed partners only.</p>
      </div>
    </ConsoleShell>
  )
}
