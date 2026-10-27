"use server"

import { randomBytes } from "node:crypto"
import { revalidatePath } from "next/cache"
import { assertStaff } from "@/lib/admin/guard"
import { createAdminClient } from "@/lib/supabase/admin"

const slugify = (s: string) =>
  s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 40)

/** HIF staff approve an application: the school is created, the proprietor becomes its admin. */
export async function approveApplication(formData: FormData) {
  const staff = await assertStaff()
  const db = createAdminClient()
  const id = String(formData.get("id"))
  const seats = Math.max(1, Math.min(100000, Number(formData.get("seats")) || 50))
  const { data: app } = await db.from("school_applications").select("*").eq("id", id).single()
  if (!app || app.status !== "new") throw new Error("Application not found or already handled")

  const { data: org, error } = await db
    .from("organizations")
    .insert({
      name: app.school_name,
      slug: `${slugify(app.school_name)}-${randomBytes(2).toString("hex")}`,
      state: app.state,
      registration_no: app.registration_no,
      contact_email: app.email,
      status: "active",
      seats,
      pilot_ends: new Date(Date.now() + 120 * 86400000).toISOString().slice(0, 10), // one term, plus margin
    })
    .select("id")
    .single()
  if (error || !org) throw new Error(error?.message ?? "Could not create the school")

  const { data: existing } = await db.from("profiles").select("id").ilike("email", app.email).limit(1).maybeSingle()
  let adminId = existing?.id as string | undefined
  if (!adminId) {
    const site = process.env.NEXT_PUBLIC_SITE_URL ?? ""
    const { data, error: inviteError } = await db.auth.admin.inviteUserByEmail(app.email, {
      data: { full_name: app.proprietor_name },
      redirectTo: `${site}/auth/callback?next=/schools`,
    })
    if (inviteError || !data.user) throw new Error("School created, but the invitation email failed: " + (inviteError?.message ?? ""))
    adminId = data.user.id
  }
  await db.from("org_members").upsert({ org_id: org.id, user_id: adminId, role: "school_admin", ended_at: null })
  await db.from("school_applications").update({ status: "approved", reviewed_by: staff }).eq("id", id)
  revalidatePath("/admin/schools")
}

export async function declineApplication(formData: FormData) {
  const staff = await assertStaff()
  await createAdminClient()
    .from("school_applications")
    .update({ status: "declined", reviewed_by: staff })
    .eq("id", String(formData.get("id")))
    .eq("status", "new")
  revalidatePath("/admin/schools")
}

export async function updateSchool(formData: FormData) {
  await assertStaff()
  const status = String(formData.get("status"))
  if (!["active", "suspended"].includes(status)) throw new Error("Bad status")
  await createAdminClient()
    .from("organizations")
    .update({ status, seats: Math.max(0, Number(formData.get("seats")) || 0) })
    .eq("id", String(formData.get("id")))
  revalidatePath("/admin/schools")
}
