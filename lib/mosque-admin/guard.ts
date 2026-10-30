import { redirect } from "next/navigation"
import { getStaffId } from "@/lib/auth/staff"
import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"

export type MosqueAdminContext = { userId: string; staff: boolean; mosqueIds: string[] }

/** Who the caller is: HIF staff, or a mosque admin for specific mosques. */
export async function getMosqueAdminContext(): Promise<MosqueAdminContext | null> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null
  const staff = (await getStaffId()) !== null
  const { data } = await createAdminClient().from("mosque_admins").select("mosque_id").eq("user_id", user.id)
  const mosqueIds = (data ?? []).map((r) => r.mosque_id as string)
  if (!staff && mosqueIds.length === 0) return null
  return { userId: user.id, staff, mosqueIds }
}

/** For the dashboard page: send anyone else to sign in. */
export async function requireMosqueAdmin(path: string): Promise<MosqueAdminContext> {
  const ctx = await getMosqueAdminContext()
  if (!ctx) redirect(`/auth/login?redirect=${encodeURIComponent(path)}`)
  return ctx
}

/** For server actions: the caller may change this mosque, or this throws. */
export async function assertCanEditMosque(mosqueId: string): Promise<string> {
  const ctx = await getMosqueAdminContext()
  if (!ctx || !(ctx.staff || ctx.mosqueIds.includes(mosqueId))) throw new Error("Not allowed for this mosque")
  return ctx.userId
}
