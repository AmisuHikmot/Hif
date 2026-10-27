import { notFound } from "next/navigation"
import SchoolShell from "@/components/schools/school-shell"
import ResetPasswordButton from "@/components/schools/reset-password-button"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { requireOrgRole } from "@/lib/schools/guard"
import { createAdminClient } from "@/lib/supabase/admin"
import { addAssignment, deleteAssignment, postAnnouncement, replyToAnnouncement } from "@/lib/schools/actions"

export const dynamic = "force-dynamic"

export default async function ClassPage({ params }: { params: Promise<{ orgId: string; classId: string }> }) {
  const { orgId, classId } = await params
  const path = `/schools/${orgId}/classes/${classId}`
  const { userId, role, org } = await requireOrgRole(orgId, ["school_admin", "teacher"], path)
  const db = createAdminClient()
  const { data: cls } = await db.from("classes").select("*").eq("id", classId).eq("org_id", orgId).single()
  if (!cls) notFound()
  if (role === "teacher") {
    const { data: mine } = await db.from("class_members").select("user_id").eq("class_id", classId).eq("user_id", userId).eq("role", "teacher").is("ended_at", null).maybeSingle()
    if (!mine) notFound()
  }

  const [{ data: members }, { data: assignments }, { data: notes }] = await Promise.all([
    db.from("class_members").select("user_id, role").eq("class_id", classId).is("ended_at", null),
    db.from("assignments").select("*").eq("class_id", classId).order("created_at", { ascending: false }),
    db.from("class_announcements").select("*, announcement_replies(*)").eq("class_id", classId).order("created_at", { ascending: false }).limit(20),
  ])
  const studentIds = (members ?? []).filter((m) => m.role === "student").map((m) => m.user_id as string)
  const authorIds = [...new Set((notes ?? []).flatMap((n) => [n.author_id, ...(n.announcement_replies ?? []).map((r: { author_id: string }) => r.author_id)]))]
  const [{ data: profiles }, { data: orgRows }, { data: progress }] = await Promise.all([
    db.from("profiles").select("id, first_name, last_name").in("id", [...studentIds, ...authorIds]),
    db.from("org_members").select("user_id, username, managed").eq("org_id", orgId).eq("role", "student").in("user_id", studentIds),
    db.from("assignment_progress").select("assignment_id, student_id, status").in("assignment_id", (assignments ?? []).map((a) => a.id)).eq("status", "done"),
  ])
  const nameOf = (id: string) => {
    const p = profiles?.find((x) => x.id === id)
    return p ? [p.first_name, p.last_name].filter(Boolean).join(" ") || "—" : "—"
  }
  const done = new Set((progress ?? []).map((p) => `${p.assignment_id}:${p.student_id}`))
  const managed = new Map((orgRows ?? []).map((o) => [o.user_id as string, o]))
  const students = studentIds.map((id) => ({ id, name: nameOf(id) })).sort((a, b) => a.name.localeCompare(b.name))

  return (
    <SchoolShell
      title={cls.name}
      crumbs={[{ href: "/schools", label: "Schools" }, { href: `/schools/${orgId}`, label: org.name }]}
      intro={`${students.length} pupils`}
    >
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Assign work</h2>
        <form action={addAssignment} className="grid gap-2 rounded-lg border p-4 md:grid-cols-4">
          <input type="hidden" name="class_id" value={classId} />
          <Input name="title" placeholder="Title (e.g. Memorise Al-Ikhlas)" required className="md:col-span-2" />
          <select name="kind" className="rounded-md border bg-background px-3 py-2 text-sm" defaultValue="hifz">
            <option value="hifz">Memorise</option>
            <option value="reading">Reading</option>
            <option value="lesson">Lesson</option>
            <option value="quiz">Quiz</option>
            <option value="other">Other</option>
          </select>
          <Input name="due_on" type="date" />
          <Input name="surah" type="number" min={1} max={114} placeholder="Surah (1-114)" />
          <Input name="from_ayah" type="number" min={1} placeholder="From verse" />
          <Input name="to_ayah" type="number" min={1} placeholder="To verse" />
          <Button type="submit">Assign</Button>
          <Textarea name="details" placeholder="Notes for pupils (optional)" className="md:col-span-4" maxLength={1000} />
        </form>

        {(assignments ?? []).map((a) => {
          const n = students.filter((s) => done.has(`${a.id}:${s.id}`)).length
          return (
            <div key={a.id} className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <div className="font-medium">{a.title}</div>
                <div className="text-sm text-muted-foreground">
                  {a.kind}{a.surah ? ` · surah ${a.surah}${a.from_ayah ? `:${a.from_ayah}${a.to_ayah ? `-${a.to_ayah}` : ""}` : ""}` : ""}
                  {a.due_on ? ` · due ${new Date(a.due_on).toLocaleDateString("en-NG")}` : ""} · {n}/{students.length} done
                </div>
              </div>
              <form action={deleteAssignment}>
                <input type="hidden" name="id" value={a.id} />
                <Button size="sm" variant="outline" type="submit">Remove</Button>
              </form>
            </div>
          )
        })}
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Pupils and progress</h2>
        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left">
                <th className="p-2">Pupil</th>
                {(assignments ?? []).map((a) => (
                  <th key={a.id} className="p-2" title={a.title}>{a.title.slice(0, 14)}</th>
                ))}
                <th className="p-2" />
              </tr>
            </thead>
            <tbody>
              {students.map((s) => (
                <tr key={s.id} className="border-b last:border-0">
                  <td className="p-2">
                    {s.name}
                    {managed.get(s.id)?.username && <div className="font-mono text-xs text-muted-foreground">{managed.get(s.id)!.username}</div>}
                  </td>
                  {(assignments ?? []).map((a) => (
                    <td key={a.id} className="p-2">{done.has(`${a.id}:${s.id}`) ? "✓" : "·"}</td>
                  ))}
                  <td className="p-2 text-right">{managed.get(s.id)?.managed && <ResetPasswordButton orgId={orgId} pupilId={s.id} />}</td>
                </tr>
              ))}
              {students.length === 0 && (
                <tr><td className="p-3 text-muted-foreground">No pupils yet. Import a roster.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Announcements</h2>
        <form action={postAnnouncement} className="grid gap-2 rounded-lg border p-4">
          <input type="hidden" name="class_id" value={classId} />
          <Textarea name="body" placeholder="Write to the class and its guardians" required maxLength={2000} />
          <Button type="submit" className="w-fit">Post</Button>
        </form>
        {(notes ?? []).map((n) => (
          <div key={n.id} className="rounded-lg border p-4">
            <div className="text-sm text-muted-foreground">{nameOf(n.author_id)} · {new Date(n.created_at).toLocaleString("en-NG")}</div>
            <p className="mt-1 whitespace-pre-wrap">{n.body}</p>
            {(n.announcement_replies ?? []).map((r: { id: string; author_id: string; body: string }) => (
              <p key={r.id} className="mt-2 border-l-2 pl-3 text-sm"><span className="text-muted-foreground">{nameOf(r.author_id)}:</span> {r.body}</p>
            ))}
            <form action={replyToAnnouncement} className="mt-2 flex gap-2">
              <input type="hidden" name="announcement_id" value={n.id} />
              <Input name="body" placeholder="Reply" required maxLength={1000} />
              <Button size="sm" variant="outline" type="submit">Reply</Button>
            </form>
          </div>
        ))}
        <p className="text-xs text-muted-foreground">Guardians reply from the HIF app. Replies are seen only by the class’s teachers and the school admin.</p>
      </section>
    </SchoolShell>
  )
}
