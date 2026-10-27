"use server"

import { revalidatePath } from "next/cache"
import { assertStaff } from "@/lib/admin/guard"
import { createAdminClient } from "@/lib/supabase/admin"

export async function setAppTier(formData: FormData) {
  await assertStaff()
  const tier = String(formData.get("tier"))
  if (!["sandbox", "basic", "verified", "trusted"].includes(tier)) throw new Error("Bad tier")
  await createAdminClient().from("oauth_apps").update({ tier }).eq("id", String(formData.get("id")))
  revalidatePath("/admin/developer")
}

/** Abuse: the client is removed from the sign-in service at once, which ends its access. */
export async function suspendApp(formData: FormData) {
  await assertStaff()
  const db = createAdminClient()
  const id = String(formData.get("id"))
  const { data: app } = await db.from("oauth_apps").select("client_id").eq("id", id).single()
  if (app?.client_id) await db.auth.admin.oauth.deleteClient(app.client_id)
  await db.from("oauth_apps").update({ status: "suspended" }).eq("id", id)
  revalidatePath("/admin/developer")
}
