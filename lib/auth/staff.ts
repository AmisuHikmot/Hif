import { createClient } from "@/lib/supabase/server"

/**
 * Returns the signed-in staff member's id, or null if the caller is signed out
 * or not an admin. Uses the caller's own session (their own profiles row is
 * readable under RLS); data work should then use the admin client.
 */
export async function getStaffId(): Promise<string | null> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return null

  const { data: profile } = await supabase.from("profiles").select("role, is_admin").eq("id", user.id).single()
  const isStaff = profile && (profile.role === "admin" || profile.role === "super_admin" || profile.is_admin === true)
  return isStaff ? user.id : null
}
