"use server"

import { revalidatePath } from "next/cache"
import { assertStaff } from "@/lib/admin/guard"
import { createAdminClient } from "@/lib/supabase/admin"

const KINDS = ["ramadan_day", "laylat_dua", "itikaf", "takbir", "dhul_hijjah", "eid_greeting", "tafsir_recording", "qurbani"]
const MADHABS = ["maliki", "hanafi", "shafii", "hanbali"]
const text = (f: FormData, k: string) => String(f.get(k) ?? "").trim() || null
const int = (f: FormData, k: string) => {
  const v = Number(f.get(k))
  return Number.isInteger(v) && v > 0 ? v : null
}

/** Adds a piece of seasonal content. It is saved as pending; it reaches phones only once approved. */
export async function addSeasonContent(formData: FormData) {
  await assertStaff()
  const kind = String(formData.get("kind"))
  if (!KINDS.includes(kind)) throw new Error("Choose a kind.")
  const madhab = text(formData, "madhab")
  if (madhab && !MADHABS.includes(madhab)) throw new Error("Unknown madhab.")
  const day = int(formData, "day")
  const surah = int(formData, "surah")
  if (kind === "ramadan_day" && (!day || day > 30)) throw new Error("A daily dua needs a Ramadan day, 1 to 30.")
  if (kind === "tafsir_recording" && (!surah || surah > 114)) throw new Error("A recording needs a surah number, 1 to 114.")
  for (const k of ["url", "image_url"]) {
    const v = text(formData, k)
    if (v && !/^https:\/\//i.test(v)) throw new Error("Links must start with https://")
  }
  const { error } = await createAdminClient().from("season_content").insert({
    kind,
    day,
    madhab,
    surah,
    title: text(formData, "title"),
    arabic: text(formData, "arabic"),
    body: text(formData, "body"),
    source: text(formData, "source"),
    url: text(formData, "url"),
    image_url: text(formData, "image_url"),
    sort: int(formData, "sort") ?? 0,
  })
  if (error) throw new Error(error.message)
  revalidatePath("/admin/season-content")
}

export async function setSeasonStatus(formData: FormData) {
  await assertStaff()
  const status = String(formData.get("status"))
  if (!["pending", "approved", "rejected"].includes(status)) throw new Error("Bad request")
  const { error } = await createAdminClient().from("season_content").update({ review_status: status }).eq("id", String(formData.get("id")))
  if (error) throw new Error(error.message)
  revalidatePath("/admin/season-content")
}

export async function deleteSeasonContent(formData: FormData) {
  await assertStaff()
  const { error } = await createAdminClient().from("season_content").delete().eq("id", String(formData.get("id")))
  if (error) throw new Error(error.message)
  revalidatePath("/admin/season-content")
}

/** Ramadan Tafsir live: a YouTube video id (or live stream id) and a plain-words schedule. Empty removes it. */
export async function saveTafsirLive(formData: FormData) {
  await assertStaff()
  const raw = String(formData.get("video") ?? "").trim()
  const db = createAdminClient()
  if (!raw) {
    const { error } = await db.from("app_config").delete().eq("key", "tafsir_live")
    if (error) throw new Error(error.message)
  } else {
    // Accept a full YouTube link or just the id.
    const m = /(?:v=|youtu\.be\/|live\/|embed\/)([A-Za-z0-9_-]{11})/.exec(raw)
    const id = m ? m[1] : /^[A-Za-z0-9_-]{11}$/.test(raw) ? raw : null
    if (!id) throw new Error("Paste a YouTube link or the 11-character video id.")
    const time = text(formData, "time")
    if (time && !/^([01]\d|2[0-3]):[0-5]\d$/.test(time)) throw new Error("Time must look like 21:30.")
    const { error } = await db.from("app_config").upsert({
      key: "tafsir_live",
      value: { video_id: id, title: text(formData, "title"), schedule: text(formData, "schedule"), time },
      updated_at: new Date().toISOString(),
    })
    if (error) throw new Error(error.message)
  }
  revalidatePath("/admin/season-content")
}

export async function addEidGround(formData: FormData) {
  await assertStaff()
  const time = text(formData, "prayer_time")
  if (time && !/^[0-2][0-9]:[0-5][0-9]$/.test(time)) throw new Error("Time must look like 08:30.")
  const { error } = await createAdminClient().from("eid_grounds").insert({
    state: String(formData.get("state") ?? "").trim(),
    name: String(formData.get("name") ?? "").trim(),
    address: text(formData, "address"),
    prayer_time: time,
    eid: formData.get("eid") === "adha" ? "adha" : "fitr",
    year: int(formData, "year"),
    published: formData.get("publish") === "on",
  })
  if (error) throw new Error(error.message)
  revalidatePath("/admin/season-content")
}

export async function setEidGroundPublished(formData: FormData) {
  await assertStaff()
  const { error } = await createAdminClient().from("eid_grounds").update({ published: formData.get("published") === "true" }).eq("id", String(formData.get("id")))
  if (error) throw new Error(error.message)
  revalidatePath("/admin/season-content")
}

export async function deleteEidGround(formData: FormData) {
  await assertStaff()
  const { error } = await createAdminClient().from("eid_grounds").delete().eq("id", String(formData.get("id")))
  if (error) throw new Error(error.message)
  revalidatePath("/admin/season-content")
}
