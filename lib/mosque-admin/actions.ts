"use server"

import { revalidatePath } from "next/cache"
import { assertStaff } from "@/lib/admin/guard"
import { createAdminClient } from "@/lib/supabase/admin"
import { assertCanEditMosque } from "./guard"

const PRAYERS = ["fajr", "dhuhr", "asr", "maghrib", "isha", "jumuah"]
const TIME = /^([01]?\d|2[0-3]):[0-5]\d$/

function mosqueId(formData: FormData) {
  const id = String(formData.get("mosque_id") ?? "")
  if (!/^[0-9a-f-]{36}$/i.test(id)) throw new Error("Bad mosque")
  return id
}

export async function saveMosqueIqama(formData: FormData) {
  const id = mosqueId(formData)
  await assertCanEditMosque(id)
  const prayer = String(formData.get("prayer"))
  const time = String(formData.get("iqama_time"))
  if (!PRAYERS.includes(prayer) || !TIME.test(time)) throw new Error("Check the prayer and time")
  const { error } = await createAdminClient()
    .from("mosque_iqama")
    .upsert({ mosque_id: id, prayer, iqama_time: time })
  if (error) throw new Error(error.message)
  revalidatePath("/mosque-admin")
}

export async function postMosqueAnnouncement(formData: FormData) {
  const id = mosqueId(formData)
  await assertCanEditMosque(id)
  const title = String(formData.get("title") ?? "").trim().slice(0, 140)
  if (!title) throw new Error("Write the announcement")
  const { error } = await createAdminClient()
    .from("mosque_announcements")
    .insert({
      mosque_id: id,
      title,
      body: String(formData.get("body") ?? "").trim().slice(0, 1000) || null,
      ends_at: String(formData.get("ends_at") ?? "") || null,
    })
  if (error) throw new Error(error.message)
  revalidatePath("/mosque-admin")
}

export async function removeMosqueAnnouncement(formData: FormData) {
  const id = mosqueId(formData)
  await assertCanEditMosque(id)
  await createAdminClient()
    .from("mosque_announcements")
    .delete()
    .eq("id", String(formData.get("id")))
    .eq("mosque_id", id)
  revalidatePath("/mosque-admin")
}

/**
 * Timetable as pasted text, one day per line:
 *   2026-03-10,05:10,06:25,13:05,16:20,18:42,19:55
 * (date, fajr, sunrise, dhuhr, asr, maghrib, isha). Sunrise may be left empty.
 * A header line is ignored. At most 400 days at a time.
 */
export async function importMosqueTimetable(formData: FormData) {
  const id = mosqueId(formData)
  await assertCanEditMosque(id)
  const rows: Record<string, string | null>[] = []
  const bad: string[] = []
  for (const raw of String(formData.get("csv") ?? "").split(/\r?\n/)) {
    const line = raw.trim()
    if (!line || /^date/i.test(line)) continue
    const p = line.split(/[,;\t]/).map((x) => x.trim())
    const ok =
      p.length >= 7 &&
      /^\d{4}-\d{2}-\d{2}$/.test(p[0]) &&
      [p[1], p[3], p[4], p[5], p[6]].every((t) => TIME.test(t)) &&
      (p[2] === "" || TIME.test(p[2]))
    if (!ok) {
      bad.push(line)
      continue
    }
    rows.push({
      mosque_id: id,
      day: p[0],
      fajr: p[1],
      sunrise: p[2] || null,
      dhuhr: p[3],
      asr: p[4],
      maghrib: p[5],
      isha: p[6],
    })
  }
  if (bad.length) throw new Error(`Line not understood: "${bad[0]}" (${bad.length} in all). Nothing was saved.`)
  if (rows.length === 0 || rows.length > 400) throw new Error("Paste between 1 and 400 days.")
  const { error } = await createAdminClient().from("mosque_timetable").upsert(rows)
  if (error) throw new Error(error.message)
  revalidatePath("/mosque-admin")
}

export async function clearMosqueTimetable(formData: FormData) {
  const id = mosqueId(formData)
  await assertCanEditMosque(id)
  await createAdminClient().from("mosque_timetable").delete().eq("mosque_id", id)
  revalidatePath("/mosque-admin")
}

/** Staff only: make someone (by their HIF account email) admin of a mosque. */
export async function addMosqueAdmin(formData: FormData) {
  const staffId = await assertStaff()
  const id = mosqueId(formData)
  const email = String(formData.get("email") ?? "").trim().toLowerCase()
  const db = createAdminClient()
  const { data: p } = await db.from("profiles").select("id").ilike("email", email).maybeSingle()
  if (!p) throw new Error("No HIF account has that email. Ask them to sign up first.")
  const { error } = await db.from("mosque_admins").upsert({ mosque_id: id, user_id: p.id, added_by: staffId })
  if (error) throw new Error(error.message)
  revalidatePath("/admin/mosque-admins")
}

export async function removeMosqueAdmin(formData: FormData) {
  await assertStaff()
  await createAdminClient()
    .from("mosque_admins")
    .delete()
    .eq("mosque_id", mosqueId(formData))
    .eq("user_id", String(formData.get("user_id")))
  revalidatePath("/admin/mosque-admins")
}

/** Staff only: save one dua's translation (Hausa, Yoruba or French). */
export async function saveDuaTranslation(formData: FormData) {
  const staffId = await assertStaff()
  const itemId = String(formData.get("item_id") ?? "")
  const lang = String(formData.get("lang") ?? "")
  const body = String(formData.get("body") ?? "").trim()
  if (!/^[0-9a-f-]{36}$/i.test(itemId) || !["ha", "yo", "fr"].includes(lang)) throw new Error("Bad request")
  const db = createAdminClient()
  if (!body) {
    await db.from("adhkar_translations").delete().eq("item_id", itemId).eq("lang", lang)
  } else {
    // Any edit goes back to pending until the board approves it again.
    const { error } = await db.from("adhkar_translations").upsert({
      item_id: itemId,
      lang,
      body: body.slice(0, 4000),
      review_status: "pending",
      translator: String(formData.get("translator") ?? "").trim().slice(0, 80) || staffId,
      updated_at: new Date().toISOString(),
    })
    if (error) throw new Error(error.message)
  }
  revalidatePath("/admin/dua-translations")
}

export async function setDuaTranslationStatus(formData: FormData) {
  await assertStaff()
  const status = String(formData.get("status"))
  if (!["pending", "approved", "rejected"].includes(status)) throw new Error("Bad request")
  await createAdminClient()
    .from("adhkar_translations")
    .update({ review_status: status })
    .eq("item_id", String(formData.get("item_id")))
    .eq("lang", String(formData.get("lang")))
  revalidatePath("/admin/dua-translations")
}
