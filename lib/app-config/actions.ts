"use server"

import { revalidatePath } from "next/cache"
import { assertStaff } from "@/lib/admin/guard"
import { createAdminClient } from "@/lib/supabase/admin"

/** Switchable More items. Core items (language, preferences, backup, account, help, about) are kept on by the app. */
export const SWITCHABLE_MODULES = [
  "assistant", "stories", "school", "hadith", "hifz", "plus", "giving", "ramadan", "fasting",
  "adhkar", "volunteer", "notifications", "zakat", "events", "branches", "membership",
  "market", "inbox", "mosques", "halal", "family", "study", "services",
] as const

export async function saveModules(formData: FormData) {
  await assertStaff()
  const value: Record<string, boolean> = {}
  for (const id of SWITCHABLE_MODULES) {
    // The form lists what is switched off.
    if (formData.get(`off_${id}`) === "on") value[id] = false
  }
  const { error } = await createAdminClient()
    .from("app_config")
    .upsert({ key: "modules", value, updated_at: new Date().toISOString() })
  if (error) throw new Error(error.message)
  revalidatePath("/admin/app-config")
}

/** The Shariah Board's zakat al-fitr value for the year, in naira per person. */
export async function saveFitr(formData: FormData) {
  await assertStaff()
  const naira = Number(formData.get("naira"))
  const year = Number(formData.get("year"))
  const db = createAdminClient()
  if (!formData.get("naira")) {
    const { error } = await db.from("app_config").delete().eq("key", "fitr")
    if (error) throw new Error(error.message)
  } else {
    if (!Number.isFinite(naira) || naira <= 0 || naira > 1000000) throw new Error("Enter the naira value per person.")
    const { error } = await db.from("app_config").upsert({
      key: "fitr",
      // Whole kobo, so the app never rounds money.
      value: { per_person_kobo: Math.round(naira * 100), year: Number.isInteger(year) && year > 1400 ? year : null },
      updated_at: new Date().toISOString(),
    })
    if (error) throw new Error(error.message)
  }
  revalidatePath("/admin/app-config")
}

export async function saveLayout(formData: FormData) {
  await assertStaff()
  const raw = String(formData.get("layout") ?? "").trim()
  const db = createAdminClient()
  if (!raw) {
    // Empty means: use the layout built into the app.
    const { error } = await db.from("app_config").delete().eq("key", "home_layout")
    if (error) throw new Error(error.message)
  } else {
    let parsed: unknown
    try {
      parsed = JSON.parse(raw)
    } catch {
      throw new Error("That is not valid JSON.")
    }
    const sections = (parsed as { sections?: unknown })?.sections
    if (!Array.isArray(sections) || sections.length === 0 || sections.length > 40) {
      throw new Error('The layout needs a "sections" list of 1 to 40 items.')
    }
    for (const s of sections) {
      if (typeof s !== "object" || s === null || typeof (s as { id?: unknown }).id !== "string") {
        throw new Error('Every section needs a text "id".')
      }
    }
    const { error } = await db
      .from("app_config")
      .upsert({ key: "home_layout", value: parsed as object, updated_at: new Date().toISOString() })
    if (error) throw new Error(error.message)
  }
  revalidatePath("/admin/app-config")
}
