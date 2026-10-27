import { notFound, redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"

export type OrgRole = "school_admin" | "teacher" | "student" | "guardian"

export async function currentUserId(): Promise<string | null> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user?.id ?? null
}

/** Everything the signed-in person belongs to. Roles come from our own table, not from the browser. */
export async function myMemberships(userId: string) {
  const { data } = await createAdminClient()
    .from("org_members")
    .select("org_id, role, organizations(id, name, status, seats)")
    .eq("user_id", userId)
    .is("ended_at", null)
  return data ?? []
}

/**
 * For console pages: the person must hold one of [roles] in the organisation and
 * the organisation must be active. Others are sent to sign in or get a 404.
 */
export async function requireOrgRole(orgId: string, roles: OrgRole[], path: string) {
  const userId = await currentUserId()
  if (!userId) redirect(`/auth/login?redirect=${encodeURIComponent(path)}`)
  const db = createAdminClient()
  const { data: member } = await db
    .from("org_members")
    .select("role")
    .eq("org_id", orgId)
    .eq("user_id", userId)
    .is("ended_at", null)
    .in("role", roles)
    .limit(1)
    .maybeSingle()
  if (!member) notFound()
  const { data: org } = await db.from("organizations").select("*").eq("id", orgId).single()
  if (!org || org.status !== "active") notFound()
  return { userId, role: member.role as OrgRole, org }
}

/** Server actions: same check, but throws. */
export async function assertOrgRole(orgId: string, roles: OrgRole[]) {
  const userId = await currentUserId()
  if (!userId) throw new Error("Sign in first")
  const db = createAdminClient()
  const { data: member } = await db
    .from("org_members")
    .select("role")
    .eq("org_id", orgId)
    .eq("user_id", userId)
    .is("ended_at", null)
    .in("role", roles)
    .limit(1)
    .maybeSingle()
  if (!member) throw new Error("Not allowed")
  const { data: org } = await db.from("organizations").select("status, seats").eq("id", orgId).single()
  if (!org || org.status !== "active") throw new Error("This school is not active")
  return { userId, role: member.role as OrgRole, seats: org.seats as number }
}

/** A teacher may act on their own classes; a school admin on every class of the school. */
export async function assertClassAccess(classId: string) {
  const db = createAdminClient()
  const { data: cls } = await db.from("classes").select("id, org_id, name").eq("id", classId).single()
  if (!cls) throw new Error("Class not found")
  const { userId, role } = await assertOrgRole(cls.org_id, ["school_admin", "teacher"])
  if (role === "teacher") {
    const { data: m } = await db
      .from("class_members")
      .select("user_id")
      .eq("class_id", classId)
      .eq("user_id", userId)
      .eq("role", "teacher")
      .is("ended_at", null)
      .maybeSingle()
    if (!m) throw new Error("You do not teach this class")
  }
  return { userId, orgId: cls.org_id as string, className: cls.name as string }
}
