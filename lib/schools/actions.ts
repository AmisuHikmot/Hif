"use server"

import { revalidatePath } from "next/cache"
import { createAdminClient } from "@/lib/supabase/admin"
import { assertClassAccess, assertOrgRole } from "./guard"
import { makePassphrase, makeUsername, parseRoster, pupilEmail, rosterKey, type RosterRow } from "./roster"

type Db = ReturnType<typeof createAdminClient>

const clean = (v: FormDataEntryValue | null, max: number) => String(v ?? "").trim().slice(0, max)

/** Public: a school asks to join. Reviewed by HIF staff in the admin console. */
export async function applyForSchool(formData: FormData): Promise<{ ok: boolean; error?: string }> {
  if (clean(formData.get("website"), 100)) return { ok: true } // honeypot: bots fill this
  const email = clean(formData.get("email"), 200)
  const row = {
    school_name: clean(formData.get("school_name"), 200),
    proprietor_name: clean(formData.get("proprietor_name"), 200),
    email,
    phone: clean(formData.get("phone"), 40) || null,
    state: clean(formData.get("state"), 60) || null,
    registration_no: clean(formData.get("registration_no"), 80) || null,
    pupils_estimate: Number(formData.get("pupils_estimate")) || null,
    notes: clean(formData.get("notes"), 2000) || null,
  }
  if (row.school_name.length < 2 || row.proprietor_name.length < 2 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return { ok: false, error: "Please give the school name, your name and a valid email." }
  const { error } = await createAdminClient().from("school_applications").insert(row)
  return error ? { ok: false, error: "Could not send. Please try again." } : { ok: true }
}

export async function createClass(formData: FormData) {
  const orgId = clean(formData.get("org_id"), 60)
  const { userId } = await assertOrgRole(orgId, ["school_admin"])
  const name = clean(formData.get("name"), 60)
  if (!name) throw new Error("Give the class a name")
  const db = createAdminClient()
  const { error } = await db.from("classes").insert({
    org_id: orgId,
    name,
    level: clean(formData.get("level"), 40) || null,
    term: clean(formData.get("term"), 40) || null,
  })
  if (error) throw new Error(error.message)
  void userId
  revalidatePath(`/schools/${orgId}`)
}

export async function addAssignment(formData: FormData) {
  const classId = clean(formData.get("class_id"), 60)
  const { userId, orgId } = await assertClassAccess(classId)
  const kind = clean(formData.get("kind"), 20)
  if (!["hifz", "reading", "lesson", "quiz", "other"].includes(kind)) throw new Error("Bad kind")
  const num = (k: string) => {
    const n = Number(formData.get(k))
    return Number.isInteger(n) && n > 0 ? n : null
  }
  const surah = num("surah")
  if (surah && surah > 114) throw new Error("Surah must be 1 to 114")
  const { error } = await createAdminClient()
    .from("assignments")
    .insert({
      class_id: classId,
      kind,
      title: clean(formData.get("title"), 200),
      details: clean(formData.get("details"), 1000) || null,
      surah,
      from_ayah: num("from_ayah"),
      to_ayah: num("to_ayah"),
      due_on: clean(formData.get("due_on"), 10) || null,
      created_by: userId,
    })
  if (error) throw new Error(error.message)
  revalidatePath(`/schools/${orgId}/classes/${classId}`)
}

export async function deleteAssignment(formData: FormData) {
  const db = createAdminClient()
  const id = clean(formData.get("id"), 60)
  const { data: a } = await db.from("assignments").select("class_id").eq("id", id).single()
  if (!a) return
  const { orgId } = await assertClassAccess(a.class_id)
  await db.from("assignments").delete().eq("id", id)
  revalidatePath(`/schools/${orgId}/classes/${a.class_id}`)
}

export async function postAnnouncement(formData: FormData) {
  const classId = clean(formData.get("class_id"), 60)
  const { userId, orgId } = await assertClassAccess(classId)
  const body = clean(formData.get("body"), 2000)
  if (!body) throw new Error("Write something first")
  const { error } = await createAdminClient()
    .from("class_announcements")
    .insert({ class_id: classId, author_id: userId, body })
  if (error) throw new Error(error.message)
  revalidatePath(`/schools/${orgId}/classes/${classId}`)
}

/** A teacher or admin answers a guardian's reply. Everything stays inside the school. */
export async function replyToAnnouncement(formData: FormData) {
  const db = createAdminClient()
  const id = clean(formData.get("announcement_id"), 60)
  const { data: n } = await db.from("class_announcements").select("class_id").eq("id", id).single()
  if (!n) throw new Error("Not found")
  const { userId, orgId } = await assertClassAccess(n.class_id)
  const body = clean(formData.get("body"), 1000)
  if (!body) throw new Error("Write something first")
  await db.from("announcement_replies").insert({ announcement_id: id, author_id: userId, body })
  revalidatePath(`/schools/${orgId}/classes/${n.class_id}`)
}

/** Gives a managed pupil a new passphrase (shown once). */
export async function resetPupilPassword(orgId: string, pupilId: string): Promise<{ username: string; password: string } | { error: string }> {
  try {
    await assertOrgRole(orgId, ["school_admin", "teacher"])
    const db = createAdminClient()
    const { data: m } = await db
      .from("org_members")
      .select("username, managed")
      .eq("org_id", orgId)
      .eq("user_id", pupilId)
      .eq("role", "student")
      .is("ended_at", null)
      .maybeSingle()
    if (!m?.managed || !m.username) return { error: "This pupil signs in another way" }
    const password = makePassphrase()
    const { error } = await db.auth.admin.updateUserById(pupilId, { password })
    if (error) return { error: "Could not reset" }
    return { username: m.username, password }
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Failed" }
  }
}

// ---------- roster import ----------

export type RosterPreview =
  | { ok: false; errors: { line: number; message: string }[] }
  | {
      ok: true
      newStudents: number
      existingStudents: number
      changedClass: number
      leaving: number
      teachers: number
      newClasses: string[]
      seatsUsed: number
      seatsAfter: number
      seats: number
      overSeats: boolean
      skipped: { line: number; message: string }[]
    }

async function loadState(db: Db, orgId: string) {
  const [{ data: classes }, { data: students }, { data: cmembers }] = await Promise.all([
    db.from("classes").select("id, name").eq("org_id", orgId),
    db.from("org_members").select("user_id, roster_key").eq("org_id", orgId).eq("role", "student").is("ended_at", null),
    db.from("class_members").select("class_id, user_id, role").is("ended_at", null),
  ])
  const classByName = new Map((classes ?? []).map((c) => [c.name.toLowerCase(), c.id as string]))
  const classIds = new Set((classes ?? []).map((c) => c.id as string))
  const studentByKey = new Map((students ?? []).filter((s) => s.roster_key).map((s) => [s.roster_key as string, s.user_id as string]))
  const classOf = new Map<string, string>()
  for (const m of cmembers ?? []) if (m.role === "student" && classIds.has(m.class_id)) classOf.set(m.user_id, m.class_id)
  return { classByName, studentByKey, classOf, studentCount: students?.length ?? 0 }
}

/** Checks the sheet and says what would change. Writes nothing. */
export async function previewRoster(orgId: string, text: string, fullImport: boolean): Promise<RosterPreview> {
  const { seats } = await assertOrgRole(orgId, ["school_admin"])
  const { rows, errors } = parseRoster(text)
  if (!rows.length) return { ok: false, errors: errors.length ? errors : [{ line: 1, message: "No rows found" }] }
  const st = await loadState(createAdminClient(), orgId)
  let newStudents = 0, existing = 0, changed = 0, teachers = 0
  const newClasses = new Set<string>()
  const keys = new Set<string>()
  for (const r of rows) {
    if (!st.classByName.has(r.className.toLowerCase())) newClasses.add(r.className)
    if (r.role === "teacher") { teachers++; continue }
    const key = rosterKey(r)
    keys.add(key)
    const uid = st.studentByKey.get(key)
    if (!uid) newStudents++
    else {
      existing++
      const was = st.classOf.get(uid)
      if (was && st.classByName.get(r.className.toLowerCase()) !== was) changed++
    }
  }
  const leaving = fullImport ? [...st.studentByKey.keys()].filter((k) => !keys.has(k)).length : 0
  const seatsAfter = st.studentCount + newStudents - leaving
  return { ok: true, newStudents, existingStudents: existing, changedClass: changed, leaving, teachers, newClasses: [...newClasses], seatsUsed: st.studentCount, seatsAfter, seats, overSeats: seatsAfter > seats, skipped: errors }
}

export type RosterResult = {
  ok: boolean
  error?: string
  created: { name: string; className: string; username: string; password: string }[]
  teachersInvited: string[]
  updated: number
  ended: number
}

async function findUserByEmail(db: Db, email: string): Promise<string | null> {
  const { data } = await db.from("profiles").select("id").ilike("email", email).limit(1).maybeSingle()
  return data?.id ?? null
}

/** Applies the sheet. Pupils get managed accounts; passphrases are returned once, never stored. */
export async function confirmRoster(orgId: string, text: string, fullImport: boolean): Promise<RosterResult> {
  const empty: RosterResult = { ok: false, created: [], teachersInvited: [], updated: 0, ended: 0 }
  try {
    const { seats } = await assertOrgRole(orgId, ["school_admin"])
    const db = createAdminClient()
    const { rows } = parseRoster(text)
    if (!rows.length) return { ...empty, error: "No valid rows" }
    const st = await loadState(db, orgId)

    const keys = new Set(rows.filter((r) => r.role === "student").map(rosterKey))
    const incoming = [...keys].filter((k) => !st.studentByKey.has(k)).length
    const leavers = fullImport ? [...st.studentByKey].filter(([k]) => !keys.has(k)) : []
    if (st.studentCount + incoming - leavers.length > seats)
      return { ...empty, error: `This would use more than the ${seats} seats on the licence.` }

    const classId = async (name: string) => {
      const have = st.classByName.get(name.toLowerCase())
      if (have) return have
      const { data, error } = await db.from("classes").insert({ org_id: orgId, name }).select("id").single()
      if (error || !data) throw new Error(`Could not create class ${name}`)
      st.classByName.set(name.toLowerCase(), data.id)
      return data.id as string
    }

    const result: RosterResult = { ...empty, ok: true }
    for (const r of rows) {
      const cid = await classId(r.className)
      if (r.role === "teacher") {
        await addTeacher(db, orgId, cid, r, result)
        continue
      }
      const key = rosterKey(r)
      const existingId = st.studentByKey.get(key)
      if (existingId) {
        if (st.classOf.get(existingId) !== cid) {
          await db.from("class_members").update({ ended_at: new Date().toISOString() }).eq("user_id", existingId).eq("role", "student").is("ended_at", null)
            .in("class_id", [...st.classByName.values()])
          await db.from("class_members").upsert({ class_id: cid, user_id: existingId, role: "student", ended_at: null })
          result.updated++
        }
        continue
      }
      const made = await createPupil(db, orgId, cid, r, key)
      if (made) result.created.push(made)
    }

    for (const [, uid] of leavers) {
      const now = new Date().toISOString()
      await db.from("org_members").update({ ended_at: now }).eq("org_id", orgId).eq("user_id", uid).eq("role", "student")
      await db.from("class_members").update({ ended_at: now }).eq("user_id", uid).eq("role", "student").is("ended_at", null)
      result.ended++
    }
    revalidatePath(`/schools/${orgId}`)
    return result
  } catch (e) {
    return { ...empty, error: e instanceof Error ? e.message : "Import failed" }
  }
}

async function createPupil(db: Db, orgId: string, classId: string, r: RosterRow, key: string) {
  for (let attempt = 0; attempt < 5; attempt++) {
    const username = makeUsername(r.first, r.last)
    const password = makePassphrase()
    const { data, error } = await db.auth.admin.createUser({
      email: pupilEmail(username),
      password,
      email_confirm: true,
      user_metadata: { first_name: r.first, last_name: r.last, managed: true, org_id: orgId },
    })
    if (error || !data.user) continue // a username clash: try another
    const id = data.user.id
    await db.from("profiles").upsert(
      { id, user_id: id, email: pupilEmail(username), first_name: r.first, last_name: r.last, role: "user", is_active: true },
      { onConflict: "id" },
    )
    await db.from("org_members").insert({ org_id: orgId, user_id: id, role: "student", username, managed: true, roster_key: key })
    await db.from("class_members").insert({ class_id: classId, user_id: id, role: "student" })
    if (r.email) await db.from("guardian_links").upsert({ org_id: orgId, student_id: id, guardian_email: r.email })
    return { name: `${r.first} ${r.last}`, className: r.className, username, password }
  }
  return null
}

async function addTeacher(db: Db, orgId: string, classId: string, r: RosterRow, result: RosterResult) {
  let id = await findUserByEmail(db, r.email)
  if (!id) {
    const site = process.env.NEXT_PUBLIC_SITE_URL ?? ""
    const { data, error } = await db.auth.admin.inviteUserByEmail(r.email, {
      data: { first_name: r.first, last_name: r.last },
      redirectTo: `${site}/auth/callback?next=/schools`,
    })
    if (error || !data.user) return
    id = data.user.id
    result.teachersInvited.push(r.email)
  }
  await db.from("org_members").upsert({ org_id: orgId, user_id: id, role: "teacher", ended_at: null })
  await db.from("class_members").upsert({ class_id: classId, user_id: id, role: "teacher", ended_at: null })
}
