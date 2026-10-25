import { NextRequest, NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { getStaffId } from "@/lib/auth/staff"

// Staff-only management of the Ask-a-scholar content: questions (approve or
// reject), scholars, and answers. The mobile app only creates pending
// questions; everything published goes through here.

const QUESTION_STATUSES = ["pending", "approved", "rejected"]

async function guard() {
  const staffId = await getStaffId()
  return staffId
    ? null
    : NextResponse.json({ error: "Forbidden" }, { status: 403 })
}

export async function GET() {
  const denied = await guard()
  if (denied) return denied

  const db = createAdminClient()
  const [questions, scholars] = await Promise.all([
    db
      .from("questions")
      .select("id, question_text, category, is_anonymous, status, created_at, answers(id, answer_text, scholar_id, scholars(name))")
      .order("created_at", { ascending: false })
      .limit(200),
    db.from("scholars").select("id, name, specialization, bio, is_available").order("name"),
  ])

  if (questions.error || scholars.error) {
    console.error("[admin/qa] load failed:", questions.error ?? scholars.error)
    return NextResponse.json({ error: "Failed to load" }, { status: 500 })
  }
  return NextResponse.json({ questions: questions.data, scholars: scholars.data })
}

export async function POST(request: NextRequest) {
  const denied = await guard()
  if (denied) return denied

  const body = await request.json().catch(() => null)
  if (!body || typeof body.action !== "string") {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }
  const db = createAdminClient()

  switch (body.action) {
    case "set-status": {
      if (!QUESTION_STATUSES.includes(body.status) || typeof body.questionId !== "string") {
        return NextResponse.json({ error: "Invalid status" }, { status: 400 })
      }
      const { error } = await db.from("questions").update({ status: body.status }).eq("id", body.questionId)
      if (error) return fail("set-status", error)
      return NextResponse.json({ ok: true })
    }

    case "add-answer": {
      const text = String(body.answerText ?? "").trim()
      if (!body.questionId || !body.scholarId || text.length < 2 || text.length > 5000) {
        return NextResponse.json({ error: "A scholar and an answer are required" }, { status: 400 })
      }
      const { error } = await db
        .from("answers")
        .insert({ question_id: body.questionId, scholar_id: body.scholarId, answer_text: text })
      if (error) return fail("add-answer", error)
      return NextResponse.json({ ok: true })
    }

    case "delete-answer": {
      if (typeof body.answerId !== "string") return NextResponse.json({ error: "Invalid request" }, { status: 400 })
      const { error } = await db.from("answers").delete().eq("id", body.answerId)
      if (error) return fail("delete-answer", error)
      return NextResponse.json({ ok: true })
    }

    case "add-scholar": {
      const name = String(body.name ?? "").trim()
      if (name.length < 2) return NextResponse.json({ error: "Name is required" }, { status: 400 })
      const { error } = await db.from("scholars").insert({
        name,
        specialization: body.specialization ? String(body.specialization).trim() : null,
        bio: body.bio ? String(body.bio).trim() : null,
        is_available: true,
      })
      if (error) return fail("add-scholar", error)
      return NextResponse.json({ ok: true })
    }

    default:
      return NextResponse.json({ error: "Unknown action" }, { status: 400 })
  }
}

function fail(action: string, error: unknown) {
  console.error(`[admin/qa] ${action} failed:`, error)
  return NextResponse.json({ error: "Could not save" }, { status: 500 })
}
