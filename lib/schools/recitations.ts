"use server"

import { revalidatePath } from "next/cache"
import { createAdminClient } from "@/lib/supabase/admin"
import { assertClassAccess, assertOrgRole } from "./guard"

const GRADES = ["excellent", "good", "repeat"] as const
const TYPES = ["wrong", "missed", "tajweed"] as const
const RULES = ["madd", "ghunnah", "qalqalah", "idgham", "ikhfa", "makharij"] as const

export type Mark = { ayah: number; word: number; type: (typeof TYPES)[number]; rule?: string; note?: string }

const BUCKET = "recitations"

/** The submission, checked to belong to a class this person teaches (or administers). */
async function loadSubmission(id: string) {
  const db = createAdminClient()
  const { data: sub } = await db.from("recitation_submissions").select("id, class_id, student_id, from_ayah, to_ayah").eq("id", id).single()
  if (!sub) throw new Error("Submission not found")
  const access = await assertClassAccess(sub.class_id as string)
  return { db, sub, ...access }
}

function parseMarks(raw: string, from: number, to: number): Mark[] {
  let list: unknown
  try {
    list = JSON.parse(raw || "[]")
  } catch {
    throw new Error("The marks could not be read")
  }
  if (!Array.isArray(list) || list.length > 500) throw new Error("Too many marks")
  return list.map((m) => {
    const x = m as Partial<Mark>
    const ayah = Number(x.ayah)
    const word = Number(x.word)
    if (!Number.isInteger(ayah) || ayah < from || ayah > to) throw new Error(`Ayah ${x.ayah} is outside the range`)
    if (!Number.isInteger(word) || word < 1 || word > 300) throw new Error("Word number must be 1 or more")
    if (!TYPES.includes(x.type as Mark["type"])) throw new Error("Bad mark type")
    if (x.type === "tajweed" && !RULES.includes(x.rule as (typeof RULES)[number])) throw new Error("Choose a tajweed rule")
    return {
      ayah,
      word,
      type: x.type as Mark["type"],
      ...(x.type === "tajweed" ? { rule: x.rule } : {}),
      ...(x.note ? { note: String(x.note).slice(0, 500) } : {}),
    }
  })
}

export async function gradeSubmission(formData: FormData) {
  const id = String(formData.get("id") ?? "")
  const grade = String(formData.get("grade") ?? "")
  if (!GRADES.includes(grade as (typeof GRADES)[number])) throw new Error("Choose a grade")
  const { db, sub, userId, orgId } = await loadSubmission(id)
  const marks = parseMarks(String(formData.get("marks") ?? "[]"), sub.from_ayah as number, sub.to_ayah as number)
  const { data: org } = await db.from("organizations").select("recording_days").eq("id", orgId).single()
  const gradedAt = new Date()
  const deleteAfter = new Date(gradedAt.getTime() + ((org?.recording_days as number) ?? 90) * 86_400_000)
  const { error } = await db
    .from("recitation_submissions")
    .update({
      status: "graded",
      grade,
      comment: String(formData.get("comment") ?? "").trim().slice(0, 2000) || null,
      marks,
      graded_by: userId,
      graded_at: gradedAt.toISOString(),
      delete_after: deleteAfter.toISOString(),
    })
    .eq("id", id)
  if (error) throw new Error(error.message)
  revalidatePath(`/schools/${orgId}/classes/${sub.class_id}/recitations`)
}

/** Step 1 of a spoken reply: a one-time upload address, in the teacher's own folder. */
export async function startReplyUpload(submissionId: string): Promise<{ path: string; token: string }> {
  const { db, userId } = await loadSubmission(submissionId)
  const path = `replies/${userId}/${submissionId}-${Date.now()}.webm`
  const { data, error } = await db.storage.from(BUCKET).createSignedUploadUrl(path)
  if (error || !data) throw new Error("Could not start the upload")
  return { path, token: data.token }
}

/** Step 2: the recording is up; attach it (2 minutes at most). */
export async function attachReply(submissionId: string, path: string, seconds: number) {
  const { db, userId, sub, orgId } = await loadSubmission(submissionId)
  if (!path.startsWith(`replies/${userId}/`)) throw new Error("Bad path")
  const secs = Math.round(seconds)
  if (!(secs >= 1 && secs <= 120)) throw new Error("A reply can be up to 2 minutes")
  const { error } = await db.from("recitation_submissions").update({ reply_path: path, reply_duration_s: secs }).eq("id", submissionId)
  if (error) throw new Error(error.message)
  revalidatePath(`/schools/${orgId}/classes/${sub.class_id}/recitations`)
}

/** School admin: how long recordings are kept after grading, and whether guardians may hear them. */
export async function saveRecitationSettings(formData: FormData) {
  const orgId = String(formData.get("org_id") ?? "")
  await assertOrgRole(orgId, ["school_admin"])
  const days = Number(formData.get("recording_days"))
  if (!Number.isInteger(days) || days < 30 || days > 180) throw new Error("Choose 30 to 180 days")
  const { error } = await createAdminClient()
    .from("organizations")
    .update({ recording_days: days, guardians_hear_recordings: formData.get("guardians_hear") === "on" })
    .eq("id", orgId)
  if (error) throw new Error(error.message)
  revalidatePath(`/schools/${orgId}`)
}
