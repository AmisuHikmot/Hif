"use server"

import { revalidatePath } from "next/cache"
import { assertStaff } from "@/lib/admin/guard"
import { createAdminClient } from "@/lib/supabase/admin"

const KINDS = ["restaurant", "cafe", "butcher", "grocery", "other"]

/** Staff list a suggested place. They must give coordinates; the app sorts by distance. */
export async function publishPlace(formData: FormData) {
  const staff = await assertStaff()
  const db = createAdminClient()
  const id = String(formData.get("id"))
  const lat = Number(formData.get("latitude"))
  const lon = Number(formData.get("longitude"))
  if (!Number.isFinite(lat) || !Number.isFinite(lon) || Math.abs(lat) > 90 || Math.abs(lon) > 180) {
    throw new Error("Enter valid coordinates, e.g. 6.5244 and 3.3792")
  }
  const kind = String(formData.get("kind"))
  const { data: s } = await db.from("halal_place_suggestions").select("*").eq("id", id).single()
  if (!s || s.status !== "new") throw new Error("Suggestion not found or already handled")
  const { error } = await db.from("halal_places").insert({
    name: String(formData.get("name") || s.name).slice(0, 200),
    kind: KINDS.includes(kind) ? kind : "restaurant",
    address: s.address,
    city: s.city,
    state: s.state,
    latitude: lat,
    longitude: lon,
    source: "community",
    source_id: s.id,
    attribution: "Suggested by an HIF App user, checked by HIF",
    status: "verified",
  })
  if (error) throw new Error(error.message)
  await db.from("halal_place_suggestions").update({ status: "accepted" }).eq("id", id)
  revalidatePath("/admin/halal")
}

export async function declineSuggestion(formData: FormData) {
  await assertStaff()
  await createAdminClient().from("halal_place_suggestions").update({ status: "declined" }).eq("id", String(formData.get("id")))
  revalidatePath("/admin/halal")
}

export async function hidePlace(formData: FormData) {
  await assertStaff()
  await createAdminClient().from("halal_places").update({ status: "hidden" }).eq("id", String(formData.get("id")))
  revalidatePath("/admin/halal")
}
