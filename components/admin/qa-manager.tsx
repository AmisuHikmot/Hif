"use client"

import { useCallback, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

type Answer = { id: string; answer_text: string; scholar_id: string; scholars: { name: string } | null }
type Question = {
  id: string
  question_text: string
  category: string | null
  is_anonymous: boolean
  status: "pending" | "approved" | "rejected"
  created_at: string
  answers: Answer[]
}
type Scholar = { id: string; name: string; specialization: string | null; bio: string | null }

async function call(body: Record<string, unknown>) {
  const res = await fetch("/api/admin/qa", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error ?? "Request failed")
}

export default function QaManager() {
  const [questions, setQuestions] = useState<Question[]>([])
  const [scholars, setScholars] = useState<Scholar[]>([])
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/qa")
      if (!res.ok) throw new Error("Could not load")
      const data = await res.json()
      setQuestions(data.questions)
      setScholars(data.scholars)
      setError("")
    } catch {
      setError("Could not load questions.")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const run = async (body: Record<string, unknown>) => {
    try {
      await call(body)
      await load()
    } catch (e) {
      setError(e instanceof Error ? e.message : "Request failed")
    }
  }

  if (loading) return <p className="text-muted-foreground">Loading…</p>

  const by = (status: Question["status"]) => questions.filter((q) => q.status === status)

  return (
    <div className="space-y-6">
      {error && <p className="text-sm text-destructive" role="alert">{error}</p>}

      <Tabs defaultValue="pending">
        <TabsList>
          <TabsTrigger value="pending">Pending ({by("pending").length})</TabsTrigger>
          <TabsTrigger value="approved">Approved ({by("approved").length})</TabsTrigger>
          <TabsTrigger value="rejected">Rejected ({by("rejected").length})</TabsTrigger>
          <TabsTrigger value="scholars">Scholars ({scholars.length})</TabsTrigger>
        </TabsList>

        {(["pending", "approved", "rejected"] as const).map((status) => (
          <TabsContent key={status} value={status} className="space-y-4">
            {by(status).length === 0 && <p className="text-muted-foreground">Nothing here.</p>}
            {by(status).map((q) => (
              <QuestionCard key={q.id} q={q} scholars={scholars} run={run} />
            ))}
          </TabsContent>
        ))}

        <TabsContent value="scholars">
          <ScholarsPanel scholars={scholars} run={run} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

function QuestionCard({
  q,
  scholars,
  run,
}: {
  q: Question
  scholars: Scholar[]
  run: (body: Record<string, unknown>) => Promise<void>
}) {
  const [scholarId, setScholarId] = useState("")
  const [text, setText] = useState("")

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex flex-wrap items-center gap-2 text-base">
          {q.category && <Badge variant="outline">{q.category}</Badge>}
          {q.is_anonymous && <Badge variant="secondary">Anonymous</Badge>}
          <span className="text-xs font-normal text-muted-foreground">
            {new Date(q.created_at).toLocaleDateString()}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p>{q.question_text}</p>

        {q.answers.map((a) => (
          <div key={a.id} className="rounded-md border p-3 text-sm">
            <p>{a.answer_text}</p>
            <div className="mt-2 flex items-center justify-between text-muted-foreground">
              <span>— {a.scholars?.name ?? "Scholar"}</span>
              <Button size="sm" variant="ghost" onClick={() => run({ action: "delete-answer", answerId: a.id })}>
                Remove
              </Button>
            </div>
          </div>
        ))}

        {q.status === "approved" && (
          <div className="space-y-2">
            <select
              className="w-full rounded-md border bg-background p-2 text-sm"
              value={scholarId}
              onChange={(e) => setScholarId(e.target.value)}
              aria-label="Scholar"
            >
              <option value="">Choose the scholar answering…</option>
              {scholars.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
            <Textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Write the answer" rows={4} />
            <Button
              size="sm"
              disabled={!scholarId || text.trim().length < 2}
              onClick={async () => {
                await run({ action: "add-answer", questionId: q.id, scholarId, answerText: text })
                setText("")
              }}
            >
              Publish answer
            </Button>
          </div>
        )}

        <div className="flex gap-2">
          {q.status !== "approved" && (
            <Button size="sm" onClick={() => run({ action: "set-status", questionId: q.id, status: "approved" })}>
              Approve
            </Button>
          )}
          {q.status !== "rejected" && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => run({ action: "set-status", questionId: q.id, status: "rejected" })}
            >
              Reject
            </Button>
          )}
          {q.status !== "pending" && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => run({ action: "set-status", questionId: q.id, status: "pending" })}
            >
              Back to pending
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

function ScholarsPanel({
  scholars,
  run,
}: {
  scholars: Scholar[]
  run: (body: Record<string, unknown>) => Promise<void>
}) {
  const [name, setName] = useState("")
  const [specialization, setSpecialization] = useState("")
  const [bio, setBio] = useState("")

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Add a scholar</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
          <Input value={specialization} onChange={(e) => setSpecialization(e.target.value)} placeholder="Specialization (optional)" />
          <Textarea value={bio} onChange={(e) => setBio(e.target.value)} placeholder="Short bio (optional)" rows={3} />
          <Button
            disabled={name.trim().length < 2}
            onClick={async () => {
              await run({ action: "add-scholar", name, specialization, bio })
              setName("")
              setSpecialization("")
              setBio("")
            }}
          >
            Add scholar
          </Button>
        </CardContent>
      </Card>

      {scholars.length === 0 && <p className="text-muted-foreground">No scholars yet. Add one before publishing answers.</p>}
      {scholars.map((s) => (
        <Card key={s.id}>
          <CardContent className="p-4">
            <p className="font-medium">{s.name}</p>
            {s.specialization && <p className="text-sm text-muted-foreground">{s.specialization}</p>}
            {s.bio && <p className="mt-1 text-sm">{s.bio}</p>}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
