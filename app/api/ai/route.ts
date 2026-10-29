import { NextResponse, type NextRequest } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { rateLimitKey } from "@/lib/rate-limit"
import { answerQuestion, type ChatTurn } from "@/lib/ai/engine"
import type { Source } from "@/lib/ai/sources"

export const runtime = "nodejs"
export const maxDuration = 60

const FREE_PER_DAY = 20
const PLUS_PER_DAY = 100
const IMAGE_FREE_PER_DAY = 5
const IMAGE_PLUS_PER_DAY = 25
const MAX_IMAGE_CHARS = 1_600_000 // about 1.2 MB of picture
const IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"])
const MADHABS = new Set(["maliki", "hanafi", "shafii", "hanbali", "all"])

/**
 * POST /api/ai  { text, history?, madhab?, hadith?: { collection, number } }
 * Signed-in users only. The AI keys stay on the server. Nothing the person
 * types is stored.
 */
export async function POST(req: NextRequest) {
  if (!process.env.GEMINI_API_KEY && !process.env.GROQ_API_KEY) {
    return NextResponse.json({ error: "The assistant is not switched on yet." }, { status: 503 })
  }

  const token = req.headers.get("authorization")?.replace(/^Bearer\s+/i, "")
  const admin = createAdminClient()
  let userId: string | undefined
  if (token) userId = (await admin.auth.getUser(token)).data.user?.id
  else {
    const { createClient } = await import("@/lib/supabase/server")
    userId = (await (await createClient()).auth.getUser()).data.user?.id
  }
  if (!userId) return NextResponse.json({ error: "Sign in to use the assistant." }, { status: 401 })

  // More messages for Plus members; the assistant is free for everyone.
  const { count } = await admin
    .from("entitlements")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .is("revoked_at", null)
    .gt("valid_to", new Date().toISOString())
  const plus = (count ?? 0) > 0
  const burst = await rateLimitKey(`ai-min:${userId}`, 6, 60)
  if (burst) return burst
  const day = await rateLimitKey(`ai-day:${userId}`, plus ? PLUS_PER_DAY : FREE_PER_DAY, 86400)
  if (day) return NextResponse.json({ error: `You have reached today's limit of ${plus ? PLUS_PER_DAY : FREE_PER_DAY} messages. It resets tomorrow.` }, { status: 429 })

  let body: { text?: string; history?: unknown; madhab?: string; hadith?: { collection?: string; number?: string | number }; image?: { mime?: string; data?: string } }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "Bad request." }, { status: 400 })
  }
  let image: { mime: string; data: string } | undefined
  if (body.image?.data) {
    const { mime, data } = body.image
    if (!mime || !IMAGE_TYPES.has(mime) || data.length > MAX_IMAGE_CHARS || !/^[A-Za-z0-9+/=]+$/.test(data)) {
      return NextResponse.json({ error: "Use a JPEG, PNG or WebP picture under about 1 MB." }, { status: 400 })
    }
    const img = await rateLimitKey(`ai-img:${userId}`, plus ? IMAGE_PLUS_PER_DAY : IMAGE_FREE_PER_DAY, 86400)
    if (img) return NextResponse.json({ error: "You have reached today's limit for pictures. It resets tomorrow." }, { status: 429 })
    image = { mime, data }
  }
  const text = (body.text ?? "").toString().trim().slice(0, 600)
  if (!text && !image) return NextResponse.json({ error: "Bad request." }, { status: 400 })

  const history: ChatTurn[] = Array.isArray(body.history)
    ? (body.history as { role?: string; text?: string }[])
        .filter((t) => (t.role === "user" || t.role === "model") && typeof t.text === "string")
        .slice(-6)
        .map((t) => ({ role: t.role as "user" | "model", text: (t.text as string).slice(0, 700) }))
    : []

  // A hadith the app is showing is looked up here, not trusted from the client.
  const extra: Source[] = []
  if (body.hadith?.collection && body.hadith?.number != null) {
    const { data: h } = await admin
      .from("hadith")
      .select("collection, number, arabic, translation, narrator, grade, review_status, reviewer_name")
      .eq("collection", String(body.hadith.collection).slice(0, 80))
      .eq("number", String(body.hadith.number).slice(0, 20))
      .maybeSingle()
    if (h) {
      extra.push({
        type: "hadith",
        ref: `${h.collection} ${h.number}`,
        label: `Hadith: ${h.collection} ${h.number}`,
        text:
          `Arabic: ${h.arabic ?? ""}\nTranslation: ${h.translation ?? ""}` +
          (h.narrator ? `\nNarrator: ${h.narrator}` : "") +
          (h.grade ? `\nGrade (as recorded): ${h.grade}` : "\nGrade: not recorded"),
        note: h.review_status === "approved" ? (h.reviewer_name ? `reviewed by ${h.reviewer_name}` : "reviewed") : "pending board review",
      })
    }
  }

  try {
    const madhab = MADHABS.has(body.madhab ?? "") ? body.madhab : undefined
    const out = await answerQuestion(text || "What does this say?", history, { madhab, extra, image })
    return NextResponse.json({ answer: out.answer, sources: out.sources, model: out.model })
  } catch {
    return NextResponse.json({ error: "The assistant is busy. Try again soon." }, { status: 502 })
  }
}
