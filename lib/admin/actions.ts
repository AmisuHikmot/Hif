"use server"

import { revalidatePath } from "next/cache"
import { assertStaff } from "@/lib/admin/guard"
import { createAdminClient } from "@/lib/supabase/admin"

const REVIEWABLE = {
  adhkar_categories: "id",
  adhkar_items: "id",
  hadith: "id",
  courses: "id",
} as const
type Reviewable = keyof typeof REVIEWABLE
const STATUSES = ["pending", "approved", "rejected"]

/** CON-02: approve, reject or send back a piece of religious content. */
export async function setReviewStatus(formData: FormData) {
  await assertStaff()
  const table = String(formData.get("table")) as Reviewable
  const status = String(formData.get("status"))
  const id = String(formData.get("id"))
  if (!(table in REVIEWABLE) || !STATUSES.includes(status)) throw new Error("Bad request")
  const db = createAdminClient()
  if (table === "adhkar_categories") {
    // Approving a category approves its items too (same as review_adhkar_category).
    await db.from("adhkar_items").update({ review_status: status }).eq("category_id", Number(id))
  }
  const { error } = await db.from(table).update({ review_status: status }).eq(REVIEWABLE[table], id)
  if (error) throw new Error(error.message)
  revalidatePath("/admin/studio")
}

/** Edit a hadith's text. The database sends an approved hadith back to pending. */
export async function saveHadith(formData: FormData) {
  await assertStaff()
  const db = createAdminClient()
  const { error } = await db
    .from("hadith")
    .update({
      arabic: String(formData.get("arabic") ?? ""),
      translation: String(formData.get("translation") ?? ""),
      narrator: String(formData.get("narrator") ?? "") || null,
      grade: String(formData.get("grade") ?? "") || null,
    })
    .eq("id", String(formData.get("id")))
  if (error) throw new Error(error.message)
  revalidatePath("/admin/studio")
}

/** CON-03: record or publish an announced start of a Hijri month. */
export async function saveHijriMonth(formData: FormData) {
  const staff = await assertStaff()
  const publish = formData.get("publish") === "on"
  const db = createAdminClient()
  const { error } = await db.from("hijri_month_starts").upsert(
    {
      hijri_year: Number(formData.get("hijri_year")),
      hijri_month: Number(formData.get("hijri_month")),
      starts_on: String(formData.get("starts_on")),
      source: String(formData.get("source") ?? "") || null,
      published: publish,
      published_by: publish ? staff : null,
      published_at: publish ? new Date().toISOString() : null,
    },
    { onConflict: "hijri_year,hijri_month" },
  )
  if (error) throw new Error(error.message)
  revalidatePath("/admin/hijri")
}

export async function deleteHijriMonth(formData: FormData) {
  await assertStaff()
  await createAdminClient().from("hijri_month_starts").delete().eq("id", String(formData.get("id")))
  revalidatePath("/admin/hijri")
}

/** CON-11: accept or reject a public mosque suggestion. */
export async function reviewSuggestion(formData: FormData) {
  const staff = await assertStaff()
  const id = String(formData.get("id"))
  const accept = formData.get("decision") === "accept"
  const db = createAdminClient()
  const { data: s } = await db.from("mosque_suggestions").select("*").eq("id", id).eq("status", "pending").single()
  if (!s) throw new Error("Already reviewed")
  if (accept) {
    if (s.kind === "new") {
      await db.from("mosques").insert({
        name: String(s.name).trim(),
        address: s.address,
        city: s.city,
        state: s.state,
        latitude: s.latitude,
        longitude: s.longitude,
        phone: s.phone,
        source: "community",
        status: "unverified",
      })
    } else if (s.kind === "closed") {
      await db.from("mosques").update({ status: "hidden" }).eq("id", s.mosque_id)
    } else {
      const patch: Record<string, unknown> = {}
      for (const k of ["name", "address", "city", "state", "phone", "latitude", "longitude"]) {
        if (s[k] !== null && s[k] !== "") patch[k] = s[k]
      }
      await db.from("mosques").update(patch).eq("id", s.mosque_id)
    }
  }
  await db
    .from("mosque_suggestions")
    .update({ status: accept ? "accepted" : "rejected", reviewed_by: staff, reviewed_at: new Date().toISOString() })
    .eq("id", id)
  revalidatePath("/admin/moderation")
}

/** CON-08: a mosque's iqama time for one prayer. */
export async function saveIqama(formData: FormData) {
  await assertStaff()
  const { error } = await createAdminClient().from("mosque_iqama").upsert({
    mosque_id: String(formData.get("mosque_id")),
    prayer: String(formData.get("prayer")),
    iqama_time: String(formData.get("iqama_time")),
  })
  if (error) throw new Error(error.message)
  revalidatePath("/admin/mosques")
}

export async function addAnnouncement(formData: FormData) {
  await assertStaff()
  const { error } = await createAdminClient().from("mosque_announcements").insert({
    mosque_id: String(formData.get("mosque_id")),
    title: String(formData.get("title")),
    body: String(formData.get("body") ?? "") || null,
    ends_at: String(formData.get("ends_at") ?? "") || null,
  })
  if (error) throw new Error(error.message)
  revalidatePath("/admin/mosques")
}

export async function deleteAnnouncement(formData: FormData) {
  await assertStaff()
  await createAdminClient().from("mosque_announcements").delete().eq("id", String(formData.get("id")))
  revalidatePath("/admin/mosques")
}

/** Janazah notice: publish a funeral prayer notice. */
export async function saveJanazah(formData: FormData) {
  const staff = await assertStaff()
  const prayerAt = String(formData.get("prayer_at"))
  const expires = new Date(new Date(prayerAt).getTime() + 3 * 3600 * 1000).toISOString()
  const { error } = await createAdminClient().from("janazah_notices").insert({
    title: String(formData.get("title")),
    place: String(formData.get("place")),
    prayer_at: new Date(prayerAt).toISOString(),
    note: String(formData.get("note") ?? "") || null,
    published: formData.get("publish") === "on",
    expires_at: expires,
    created_by: staff,
  })
  if (error) throw new Error(error.message)
  revalidatePath("/admin/janazah")
}

export async function setJanazahPublished(formData: FormData) {
  await assertStaff()
  await createAdminClient()
    .from("janazah_notices")
    .update({ published: formData.get("published") === "true" })
    .eq("id", String(formData.get("id")))
  revalidatePath("/admin/janazah")
}

/** Mark a support message as handled. */
export async function setSubmissionStatus(formData: FormData) {
  await assertStaff()
  await createAdminClient()
    .from("contact_submissions")
    .update({ status: String(formData.get("status")) })
    .eq("id", String(formData.get("id")))
  revalidatePath("/admin/support")
}

/** Seed a course (CON-01): a title and summary, left pending for review. */
export async function addCourse(formData: FormData) {
  await assertStaff()
  const { error } = await createAdminClient().from("courses").insert({
    title: String(formData.get("title")),
    summary: String(formData.get("summary") ?? "") || null,
    category: String(formData.get("category")),
    level: String(formData.get("level")),
    is_published: formData.get("publish") === "on",
  })
  if (error) throw new Error(error.message)
  revalidatePath("/admin/studio")
}

export async function setCoursePublished(formData: FormData) {
  await assertStaff()
  await createAdminClient()
    .from("courses")
    .update({ is_published: formData.get("published") === "true" })
    .eq("id", String(formData.get("id")))
  revalidatePath("/admin/studio")
}
