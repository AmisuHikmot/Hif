"use client"

import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { regenerateSecret } from "@/lib/developers/actions"

export default function SecretButton({ clientId }: { clientId: string }) {
  const [out, setOut] = useState<string | null>(null)
  const [busy, start] = useTransition()
  return (
    <div>
      <Button size="sm" variant="outline" disabled={busy} onClick={() => start(async () => {
        const r = await regenerateSecret(clientId)
        setOut(r.secret ? `New secret (shown once): ${r.secret}` : r.error ?? "Failed")
      })}>
        New client secret
      </Button>
      {out && <p className="mt-1 font-mono text-xs break-all">{out}</p>}
    </div>
  )
}
