"use server"

import { revalidatePath } from "next/cache"
import { assertStaff } from "@/lib/admin/guard"
import { createAdminClient } from "@/lib/supabase/admin"

const KINDS = ["reciter", "tafsir_audio"]
const text = (f: FormData, k: string) => String(f.get(k) ?? "").trim() || null
const int = (f: FormData, k: string) => {
  const v = Number(f.get(k))
  return Number.isInteger(v) && v > 0 ? v : null
}
const https = (v: string | null, what: string) => {
  if (v && !/^https:\/\//i.test(v)) throw new Error(`${what} must start with https://`)
}

/** Adds Quran content. It is saved as pending; it reaches phones only once approved. */
export async function addQuranContent(formData: FormData) {
  await assertStaff()
  const kind = String(formData.get("kind"))
  if (!KINDS.includes(kind)) throw new Error("Choose a kind.")
  const title = text(formData, "title")
  if (!title) throw new Error("Give it a title.")
  const url = text(formData, "url")
  https(url, "The link")
  const riwaya = text(formData, "riwaya")
  if (riwaya && !["hafs", "warsh"].includes(riwaya)) throw new Error("Unknown riwaya.")
  const surah = int(formData, "surah")
  const from = int(formData, "ayah_from")
  const to = int(formData, "ayah_to")
  if (kind === "reciter") {
    if (!url || !/\{s3\}|\{s\}|\{g\}/.test(url) || !/\{a3\}|\{a\}|\{g\}/.test(url))
      throw new Error("A reciter's link needs {s3} and {a3} (or {s} and {a}, or {g}) where the surah and verse numbers go.")
    if (!riwaya) throw new Error("Say whether the reciter is Hafs or Warsh.")
  }
  if (kind === "tafsir_audio") {
    if (!url) throw new Error("A recording needs its link.")
    if (!surah || surah > 114) throw new Error("A recording needs a surah number, 1 to 114.")
    if (to && from && to < from) throw new Error("The last verse comes before the first.")
  }
  const { error } = await createAdminClient().from("quran_content").insert({
    kind,
    title,
    credit: text(formData, "credit"),
    source: text(formData, "source"),
    lang: text(formData, "lang"),
    riwaya,
    url,
    surah,
    ayah_from: from,
    ayah_to: to,
    sort: int(formData, "sort") ?? 0,
  })
  if (error) throw new Error(error.message)
  revalidatePath("/admin/quran-content")
}

export async function setQuranContentStatus(formData: FormData) {
  await assertStaff()
  const status = String(formData.get("status"))
  if (!["pending", "approved", "rejected"].includes(status)) throw new Error("Bad request")
  const { error } = await createAdminClient().from("quran_content").update({ review_status: status }).eq("id", String(formData.get("id")))
  if (error) throw new Error(error.message)
  revalidatePath("/admin/quran-content")
}

export async function deleteQuranContent(formData: FormData) {
  await assertStaff()
  const { error } = await createAdminClient().from("quran_content").delete().eq("id", String(formData.get("id")))
  if (error) throw new Error(error.message)
  revalidatePath("/admin/quran-content")
}

const HADITH_LANGS = ["ha", "yo", "ff", "fr", "en"]

/** Saves a hadith translation. It goes back to pending until the Shariah Board approves it. */
export async function saveHadithTranslation(formData: FormData) {
  await assertStaff()
  const lang = String(formData.get("lang"))
  if (!HADITH_LANGS.includes(lang)) throw new Error("Unknown language.")
  const translation = text(formData, "translation")
  const hadithId = String(formData.get("hadith_id"))
  const db = createAdminClient()
  if (!translation) {
    const { error } = await db.from("hadith_translations").delete().eq("hadith_id", hadithId).eq("lang", lang)
    if (error) throw new Error(error.message)
  } else {
    const { error } = await db.from("hadith_translations").upsert({
      hadith_id: hadithId,
      lang,
      translation,
      explanation: text(formData, "explanation"),
      translator: text(formData, "translator"),
      review_status: "pending",
      updated_at: new Date().toISOString(),
    })
    if (error) throw new Error(error.message)
  }
  revalidatePath("/admin/hadith-translations")
}

export async function setHadithTranslationStatus(formData: FormData) {
  await assertStaff()
  const status = String(formData.get("status"))
  if (!["pending", "approved", "rejected"].includes(status)) throw new Error("Bad request")
  const { error } = await createAdminClient()
    .from("hadith_translations")
    .update({ review_status: status })
    .eq("hadith_id", String(formData.get("hadith_id")))
    .eq("lang", String(formData.get("lang")))
  if (error) throw new Error(error.message)
  revalidatePath("/admin/hadith-translations")
}
