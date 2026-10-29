"use server"

import { revalidatePath } from "next/cache"
import { assertStaff } from "@/lib/admin/guard"
import { createAdminClient } from "@/lib/supabase/admin"
import { hadithMessage, signText } from "./sign"

/** Signs every board-approved hadith. Rerunnable: a changed text is re-signed. */
export async function signApprovedHadith() {
  await assertStaff()
  const db = createAdminClient()
  const { data, error } = await db
    .from("hadith")
    .select("id, collection, number, arabic, translation")
    .eq("review_status", "approved")
    .limit(10000)
  if (error) throw new Error(error.message)
  let signed = 0
  for (const h of data ?? []) {
    const sig = signText(hadithMessage(String(h.collection), String(h.number), h.arabic ?? "", h.translation ?? ""))
    const { error: e } = await db.from("hadith").update({ signature: sig, signed_at: new Date().toISOString() }).eq("id", h.id)
    if (e) throw new Error(e.message)
    signed++
  }
  revalidatePath("/admin/content-signing")
  return signed
}
