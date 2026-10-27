"use server"

import { revalidatePath } from "next/cache"
import { assertStaff } from "@/lib/admin/guard"
import { createAdminClient } from "@/lib/supabase/admin"

export async function publishRelease(formData: FormData) {
  await assertStaff()
  const url = String(formData.get("apk_url") ?? "").trim()
  if (!url.startsWith("https://")) throw new Error("The APK link must start with https://")
  const build = Number(formData.get("build"))
  if (!Number.isInteger(build) || build < 1) throw new Error("Build must be a whole number")
  const sha = String(formData.get("sha256") ?? "").trim().toLowerCase()
  if (sha && !/^[0-9a-f]{64}$/.test(sha)) throw new Error("SHA-256 must be 64 hex characters")
  const { error } = await createAdminClient().from("app_releases").insert({
    version_name: String(formData.get("version_name") ?? "").trim().slice(0, 30),
    build,
    apk_url: url,
    sha256: sha || null,
    size_mb: Number(formData.get("size_mb")) || null,
    notes: String(formData.get("notes") ?? "").trim().slice(0, 1000) || null,
  })
  if (error) throw new Error(error.message)
  revalidatePath("/app")
  revalidatePath("/admin/releases")
}

export async function setReleasePublished(formData: FormData) {
  await assertStaff()
  await createAdminClient()
    .from("app_releases")
    .update({ published: formData.get("published") === "true" })
    .eq("id", String(formData.get("id")))
  revalidatePath("/app")
  revalidatePath("/admin/releases")
}
