"use client"

import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { resetPupilPassword } from "@/lib/schools/actions"

export default function ResetPasswordButton({ orgId, pupilId }: { orgId: string; pupilId: string }) {
  const [out, setOut] = useState<string | null>(null)
  const [busy, start] = useTransition()
  return (
    <span>
      <Button
        size="sm"
        variant="outline"
        disabled={busy}
        onClick={() =>
          start(async () => {
            const r = await resetPupilPassword(orgId, pupilId)
            setOut("error" in r ? r.error : `${r.username} / ${r.password}`)
          })
        }
      >
        Reset password
      </Button>
      {out && <span className="ml-2 font-mono text-xs">{out}</span>}
    </span>
  )
}
