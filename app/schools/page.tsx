import Link from "next/link"
import { redirect } from "next/navigation"
import SchoolShell from "@/components/schools/school-shell"
import { currentUserId, myMemberships } from "@/lib/schools/guard"

export const metadata = { title: "My schools | HIF" }
export const dynamic = "force-dynamic"

export default async function SchoolsHome() {
  const userId = await currentUserId()
  if (!userId) redirect("/auth/login?redirect=/schools")
  const memberships = (await myMemberships(userId)).filter((m) => m.role === "school_admin" || m.role === "teacher")
  const orgs = new Map<string, { id: string; name: string; role: string }>()
  for (const m of memberships) {
    const o = m.organizations as unknown as { id: string; name: string; status: string } | null
    if (o && o.status === "active") orgs.set(o.id, { id: o.id, name: o.name, role: m.role })
  }
  return (
    <SchoolShell title="My schools">
      {orgs.size === 0 ? (
        <div className="rounded-lg border p-6">
          <p>You are not part of a school on HIF yet.</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Teachers: ask your school admin to add you in the roster. Schools: <Link className="underline" href="/schools/apply">apply here</Link>.
          </p>
        </div>
      ) : (
        [...orgs.values()].map((o) => (
          <Link key={o.id} href={`/schools/${o.id}`} className="block rounded-lg border p-4 hover:bg-muted">
            <div className="font-medium">{o.name}</div>
            <div className="text-sm text-muted-foreground">{o.role === "school_admin" ? "School admin" : "Teacher"}</div>
          </Link>
        ))
      )}
    </SchoolShell>
  )
}
