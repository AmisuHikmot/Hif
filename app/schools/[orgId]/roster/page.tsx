import SchoolShell from "@/components/schools/school-shell"
import RosterImport from "@/components/schools/roster-import"
import { requireOrgRole } from "@/lib/schools/guard"

export const dynamic = "force-dynamic"

export default async function RosterPage({ params }: { params: Promise<{ orgId: string }> }) {
  const { orgId } = await params
  const { org } = await requireOrgRole(orgId, ["school_admin"], `/schools/${orgId}/roster`)
  return (
    <SchoolShell
      title="Import the roster"
      crumbs={[{ href: "/schools", label: "Schools" }, { href: `/schools/${orgId}`, label: org.name }]}
    >
      <RosterImport orgId={orgId} />
    </SchoolShell>
  )
}
