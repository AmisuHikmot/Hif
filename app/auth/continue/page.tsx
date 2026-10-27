import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"

export const dynamic = "force-dynamic"

/** Where sign-in lands by default: staff go to the console, everyone else to their dashboard. */
export default async function ContinuePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect("/auth/login")

  const { data: profile } = await supabase.from("profiles").select("role, is_admin").eq("id", user.id).maybeSingle()
  const isStaff = profile && (profile.role === "admin" || profile.role === "super_admin" || profile.is_admin === true)
  redirect(isStaff ? "/admin" : "/dashboard")
}
