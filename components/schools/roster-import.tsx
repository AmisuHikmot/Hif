"use client"

import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { confirmRoster, previewRoster, type RosterPreview, type RosterResult } from "@/lib/schools/actions"

const TEMPLATE = "Class,First name,Last name,Role,Email\nJSS 1,Musa,Bello,student,parent@example.com\nJSS 1,Hauwa,Ibrahim,teacher,hauwa@school.ng"

export default function RosterImport({ orgId }: { orgId: string }) {
  const [text, setText] = useState("")
  const [full, setFull] = useState(false)
  const [preview, setPreview] = useState<RosterPreview | null>(null)
  const [result, setResult] = useState<RosterResult | null>(null)
  const [busy, start] = useTransition()

  const check = () =>
    start(async () => {
      setResult(null)
      setPreview(await previewRoster(orgId, text, full))
    })
  const apply = () =>
    start(async () => {
      const r = await confirmRoster(orgId, text, full)
      setResult(r)
      if (r.ok) setPreview(null)
    })

  if (result?.ok) {
    return (
      <div className="space-y-4">
        <div className="rounded-lg border p-4 print:hidden">
          <p className="font-medium">
            Done: {result.created.length} new pupils, {result.updated} moved, {result.ended} ended
            {result.teachersInvited.length > 0 && `, ${result.teachersInvited.length} teachers invited by email`}.
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            These passphrases are shown once and are not stored. Print the slips now. Pupils aged 13 and over may change theirs after signing in.
          </p>
          <Button className="mt-3" onClick={() => window.print()}>
            Print sign-in slips
          </Button>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 print:grid-cols-2">
          {result.created.map((c) => (
            <div key={c.username} className="break-inside-avoid rounded-lg border p-4">
              <div className="font-medium">{c.name}</div>
              <div className="text-sm text-muted-foreground">{c.className}</div>
              <div className="mt-2 font-mono text-sm">Username: {c.username}</div>
              <div className="font-mono text-sm">Passphrase: {c.password}</div>
              <div className="mt-1 text-xs text-muted-foreground">Sign in at hif.com.ng or in the HIF app: choose “Pupil sign-in”.</div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Paste a sheet with the columns <b>class, first name, last name, role, email</b>. For a pupil the email is the guardian’s (optional); for a teacher it is their own. Nothing is written until you confirm.
      </p>
      <Textarea rows={10} value={text} onChange={(e) => setText(e.target.value)} placeholder={TEMPLATE} className="font-mono text-sm" />
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={full} onChange={(e) => setFull(e.target.checked)} />
        This is the full list: pupils missing from it have left
      </label>
      <div className="flex gap-2">
        <Button onClick={check} disabled={busy || !text.trim()}>
          {busy ? "Checking…" : "Check the sheet"}
        </Button>
        <Button variant="outline" onClick={() => setText(TEMPLATE)} type="button">
          Use example
        </Button>
      </div>

      {result && !result.ok && <p className="text-sm text-destructive">{result.error}</p>}

      {preview && !preview.ok && (
        <ul className="rounded-lg border p-4 text-sm">
          {preview.errors.map((e) => (
            <li key={e.line} className="text-destructive">Row {e.line}: {e.message}</li>
          ))}
        </ul>
      )}

      {preview?.ok && (
        <div className="space-y-3 rounded-lg border p-4">
          <p className="font-medium">
            {preview.newStudents} new pupils, {preview.existingStudents} already here
            {preview.changedClass > 0 && ` (${preview.changedClass} changing class)`}
            {preview.leaving > 0 && `, ${preview.leaving} leaving`}, {preview.teachers} teacher rows.
          </p>
          {preview.newClasses.length > 0 && <p className="text-sm">New classes: {preview.newClasses.join(", ")}</p>}
          <p className="text-sm">
            Seats: {preview.seatsUsed} in use now, {preview.seatsAfter} after this, of {preview.seats}.
          </p>
          {preview.skipped.length > 0 && (
            <ul className="text-sm text-muted-foreground">
              {preview.skipped.map((e) => (
                <li key={e.line}>Skipped row {e.line}: {e.message}</li>
              ))}
            </ul>
          )}
          {preview.overSeats ? (
            <p className="text-sm text-destructive">This is more than the licence allows. Contact HIF to add seats.</p>
          ) : (
            <Button onClick={apply} disabled={busy}>
              {busy ? "Applying…" : "Confirm and apply"}
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
