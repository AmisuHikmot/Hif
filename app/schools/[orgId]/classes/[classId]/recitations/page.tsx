import { notFound } from "next/navigation"
import GradeForm from "@/components/schools/grade-form"
import ReplyRecorder from "@/components/schools/reply-recorder"
import SchoolShell from "@/components/schools/school-shell"
import { requireOrgRole } from "@/lib/schools/guard"
import { createAdminClient } from "@/lib/supabase/admin"
import type { Mark } from "@/lib/schools/recitations"

export const dynamic = "force-dynamic"

type Sub = {
  id: string
  student_id: string
  surah: number
  from_ayah: number
  to_ayah: number
  duration_s: number
  audio_path: string | null
  summary: { missed?: number; notReached?: number; total?: number } | null
  status: string
  grade: string | null
  comment: string | null
  marks: Mark[] | null
  reply_path: string | null
  reply_duration_s: number | null
  graded_at: string | null
  created_at: string
}

export default async function RecitationsPage({ params }: { params: Promise<{ orgId: string; classId: string }> }) {
  const { orgId, classId } = await params
  const { userId, role, org } = await requireOrgRole(orgId, ["school_admin", "teacher"], `/schools/${orgId}/classes/${classId}/recitations`)
  const db = createAdminClient()
  const { data: cls } = await db.from("classes").select("id, name").eq("id", classId).eq("org_id", orgId).single()
  if (!cls) notFound()
  if (role === "teacher") {
    const { data: mine } = await db.from("class_members").select("user_id").eq("class_id", classId).eq("user_id", userId).eq("role", "teacher").is("ended_at", null).maybeSingle()
    if (!mine) notFound()
  }
  const { data: rows } = await db
    .from("recitation_submissions")
    .select("id, student_id, surah, from_ayah, to_ayah, duration_s, audio_path, summary, status, grade, comment, marks, reply_path, reply_duration_s, graded_at, created_at")
    .eq("class_id", classId)
    .order("status", { ascending: true })
    .order("created_at", { ascending: false })
    .limit(100)
  const subs = (rows ?? []) as Sub[]
  const ids = [...new Set(subs.map((s) => s.student_id))]
  const { data: profiles } = ids.length ? await db.from("profiles").select("id, first_name, last_name").in("id", ids) : { data: [] }
  const nameOf = (id: string) => {
    const p = profiles?.find((x) => x.id === id)
    return p ? [p.first_name, p.last_name].filter(Boolean).join(" ") || "Pupil" : "Pupil"
  }
  // Short-lived links, made here on the server for people already checked above.
  const signed = new Map<string, string>()
  for (const s of subs) {
    for (const p of [s.audio_path, s.reply_path]) {
      if (!p) continue
      const { data } = await db.storage.from("recitations").createSignedUrl(p, 3600)
      if (data?.signedUrl) signed.set(p, data.signedUrl)
    }
  }

  return (
    <SchoolShell
      title={`Recitations: ${cls.name}`}
      crumbs={[
        { href: "/schools", label: "Schools" },
        { href: `/schools/${orgId}`, label: org.name },
        { href: `/schools/${orgId}/classes/${classId}`, label: cls.name },
      ]}
      intro={`Recordings are deleted ${org.recording_days ?? 90} days after grading. Pupils can delete their own at any time.`}
    >
      {subs.length === 0 && <p className="text-muted-foreground">Nothing sent yet. Pupils send recitations from the HIF app.</p>}
      {subs.map((s) => (
        <section key={s.id} className="space-y-3 rounded-lg border p-4">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="font-semibold">
              {nameOf(s.student_id)} · surah {s.surah}:{s.from_ayah}-{s.to_ayah}
            </h2>
            <span className="text-sm text-muted-foreground">
              {new Date(s.created_at).toLocaleString("en-NG")} · {Math.floor(s.duration_s / 60)}:{String(s.duration_s % 60).padStart(2, "0")} ·{" "}
              {s.status === "graded" ? `graded ${s.grade}` : "waiting for you"}
            </span>
          </div>
          {s.summary && (s.summary.missed != null || s.summary.notReached != null) && (
            <p className="text-sm text-muted-foreground">
              The pupil’s phone counted {s.summary.missed ?? 0} missed words
              {s.summary.notReached ? `, stopped ${s.summary.notReached} words before the end` : ""}. This is a word count only, not a judgement of tajweed.
            </p>
          )}
          {s.audio_path && signed.get(s.audio_path) ? (
            <audio src={signed.get(s.audio_path)} controls className="w-full" preload="none" />
          ) : (
            <p className="text-sm text-muted-foreground">The recording has been deleted.</p>
          )}
          <GradeForm id={s.id} from={s.from_ayah} to={s.to_ayah} initial={{ grade: s.grade, comment: s.comment, marks: s.marks ?? [] }} />
          <div className="border-t pt-3">
            {s.reply_path && signed.get(s.reply_path) && (
              <div className="mb-2 text-sm">
                Your voice reply ({s.reply_duration_s}s):
                <audio src={signed.get(s.reply_path)} controls className="mt-1 w-full" preload="none" />
              </div>
            )}
            <ReplyRecorder id={s.id} />
          </div>
        </section>
      ))}
    </SchoolShell>
  )
}
