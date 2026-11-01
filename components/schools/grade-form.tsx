"use client"

import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { gradeSubmission, type Mark } from "@/lib/schools/recitations"

const RULES = ["madd", "ghunnah", "qalqalah", "idgham", "ikhfa", "makharij"]

export default function GradeForm({
  id,
  from,
  to,
  initial,
}: {
  id: string
  from: number
  to: number
  initial?: { grade?: string | null; comment?: string | null; marks?: Mark[] }
}) {
  const [marks, setMarks] = useState<Mark[]>(initial?.marks ?? [])
  const [error, setError] = useState<string | null>(null)
  const [pending, start] = useTransition()

  function update(i: number, patch: Partial<Mark>) {
    setMarks((m) => m.map((x, j) => (j === i ? { ...x, ...patch } : x)))
  }

  return (
    <form
      className="space-y-3"
      action={(fd) => {
        fd.set("marks", JSON.stringify(marks))
        setError(null)
        start(async () => {
          try {
            await gradeSubmission(fd)
          } catch (e) {
            setError(e instanceof Error ? e.message : "Could not save")
          }
        })
      }}
    >
      <input type="hidden" name="id" value={id} />
      <div className="space-y-2">
        {marks.map((m, i) => (
          <div key={i} className="flex flex-wrap items-center gap-2 text-sm">
            <input
              type="number"
              min={from}
              max={to}
              value={m.ayah}
              onChange={(e) => update(i, { ayah: Number(e.target.value) })}
              className="w-20 rounded border bg-background px-2 py-1"
              aria-label="Ayah"
            />
            <input
              type="number"
              min={1}
              value={m.word}
              onChange={(e) => update(i, { word: Number(e.target.value) })}
              className="w-20 rounded border bg-background px-2 py-1"
              aria-label="Word number"
            />
            <select
              value={m.type}
              onChange={(e) => update(i, { type: e.target.value as Mark["type"] })}
              className="rounded border bg-background px-2 py-1"
              aria-label="Kind of mark"
            >
              <option value="wrong">Wrong word</option>
              <option value="missed">Missed word</option>
              <option value="tajweed">Tajweed</option>
            </select>
            {m.type === "tajweed" && (
              <select
                value={m.rule ?? ""}
                onChange={(e) => update(i, { rule: e.target.value })}
                className="rounded border bg-background px-2 py-1"
                aria-label="Tajweed rule"
              >
                <option value="">Rule…</option>
                {RULES.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            )}
            <input
              value={m.note ?? ""}
              maxLength={500}
              onChange={(e) => update(i, { note: e.target.value })}
              placeholder="Note"
              className="min-w-[8rem] flex-1 rounded border bg-background px-2 py-1"
            />
            <button type="button" className="text-red-600" onClick={() => setMarks((x) => x.filter((_, j) => j !== i))}>
              Remove
            </button>
          </div>
        ))}
        <Button type="button" size="sm" variant="outline" onClick={() => setMarks((m) => [...m, { ayah: from, word: 1, type: "wrong" }])}>
          Add a mark
        </Button>
      </div>
      <textarea
        name="comment"
        defaultValue={initial?.comment ?? ""}
        maxLength={2000}
        placeholder="Comment for the pupil (optional)"
        className="w-full rounded border bg-background px-3 py-2 text-sm"
      />
      <div className="flex flex-wrap items-center gap-3">
        <select name="grade" defaultValue={initial?.grade ?? ""} required className="rounded border bg-background px-3 py-2 text-sm">
          <option value="" disabled>
            Grade…
          </option>
          <option value="excellent">Excellent</option>
          <option value="good">Good</option>
          <option value="repeat">Repeat</option>
        </select>
        <Button type="submit" disabled={pending}>
          {pending ? "Saving…" : initial?.grade ? "Update grade" : "Save grade"}
        </Button>
        {error && <span className="text-sm text-red-600">{error}</span>}
      </div>
    </form>
  )
}
