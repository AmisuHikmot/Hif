"use client"

import { useActionState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { checkInTicket } from "@/lib/admin/actions"

export default function CheckInForm() {
  const [state, action, pending] = useActionState(checkInTicket, null)
  return (
    <form action={action} className="space-y-3">
      <Input name="code" autoFocus placeholder="Scan or paste the ticket code" required />
      <Button type="submit" disabled={pending}>{pending ? "Checking…" : "Check in"}</Button>
      {state && <p className={state.ok ? "text-emerald-700" : "text-red-700"}>{state.message}</p>}
    </form>
  )
}
