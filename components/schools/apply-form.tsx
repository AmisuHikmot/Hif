"use client"

import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { applyForSchool } from "@/lib/schools/actions"

export default function ApplyForm() {
  const [state, setState] = useState<{ ok: boolean; error?: string } | null>(null)
  const [busy, start] = useTransition()
  if (state?.ok)
    return (
      <div className="rounded-lg border p-6">
        <p className="font-medium">Thank you. HIF will check your registration and email you within a few working days.</p>
      </div>
    )
  return (
    <form
      action={(fd) => start(async () => setState(await applyForSchool(fd)))}
      className="grid gap-3 rounded-lg border p-6"
    >
      <Input name="school_name" placeholder="School name" required />
      <Input name="proprietor_name" placeholder="Your name (proprietor or head)" required />
      <Input name="email" type="email" placeholder="Email" required />
      <Input name="phone" placeholder="Phone" />
      <Input name="state" placeholder="State" />
      <Input name="registration_no" placeholder="State ministry approval or CAC number" />
      <Input name="pupils_estimate" type="number" min={1} placeholder="Roughly how many pupils?" />
      <Textarea name="notes" placeholder="Anything else (optional)" maxLength={2000} />
      <input name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
      {state?.error && <p className="text-sm text-destructive">{state.error}</p>}
      <Button type="submit" disabled={busy}>{busy ? "Sending…" : "Apply"}</Button>
    </form>
  )
}
