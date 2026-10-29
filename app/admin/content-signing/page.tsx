import { requireStaff } from "@/lib/admin/guard"
import { createAdminClient } from "@/lib/supabase/admin"
import ConsoleShell from "@/components/admin/console/console-shell"
import { Button } from "@/components/ui/button"
import { signApprovedHadith } from "@/lib/content-signing/actions"

export const metadata = { title: "Content signing | Admin" }
export const dynamic = "force-dynamic"

async function run() {
  "use server"
  await signApprovedHadith()
}

export default async function ContentSigningPage() {
  await requireStaff("/admin/content-signing")
  const db = createAdminClient()
  const [approved, signed, pending] = await Promise.all([
    db.from("hadith").select("id", { count: "exact", head: true }).eq("review_status", "approved"),
    db.from("hadith").select("id", { count: "exact", head: true }).not("signature", "is", null),
    db.from("hadith").select("id", { count: "exact", head: true }).neq("review_status", "approved"),
  ])
  const ready = !!process.env.CONTENT_SIGNING_KEY
  return (
    <ConsoleShell
      title="Content signing"
      intro="After the Shariah Board approves hadith, sign them here. The app checks each signature against HIF's public key and refuses to show any text that was changed after signing. A signature proves the text is exactly what was approved; it does not replace the board's review."
    >
      <div className="space-y-3 rounded-lg border p-4 text-sm">
        <p>Approved hadith: {approved.count ?? 0}</p>
        <p>With a signature: {signed.count ?? 0}</p>
        <p>Not yet approved (never signed): {pending.count ?? 0}</p>
        {!ready && <p className="text-destructive">CONTENT_SIGNING_KEY is not set on the server, so signing is switched off.</p>}
        <form action={run}>
          <Button type="submit" disabled={!ready}>
            Sign all approved hadith
          </Button>
        </form>
        <p className="text-muted-foreground">Edit a hadith after signing? Run this again so its signature matches the new text.</p>
      </div>
    </ConsoleShell>
  )
}
