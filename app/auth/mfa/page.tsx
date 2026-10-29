"use client"

import { Suspense, useCallback, useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/client"

type Enroll = { factorId: string; qr: string; secret: string }

function MfaForm() {
  const router = useRouter()
  const params = useSearchParams()
  const redirect = params.get("redirect") || "/dashboard"
  const supabase = createClient()

  const [factorId, setFactorId] = useState<string | null>(null)
  const [enroll, setEnroll] = useState<Enroll | null>(null)
  const [code, setCode] = useState("")
  const [error, setError] = useState("")
  const [busy, setBusy] = useState(false)
  const [ready, setReady] = useState(false)

  const start = useCallback(async () => {
    const { data: auth } = await supabase.auth.getUser()
    if (!auth.user) {
      router.replace(`/auth/login?redirect=${encodeURIComponent(redirect)}`)
      return
    }
    const { data: factors } = await supabase.auth.mfa.listFactors()
    const verified = factors?.totp?.[0]
    if (verified) {
      setFactorId(verified.id)
    } else {
      // Drop any half-finished enrolment before starting a new one.
      for (const f of factors?.all ?? []) if (f.status === "unverified") await supabase.auth.mfa.unenroll({ factorId: f.id })
      const { data, error } = await supabase.auth.mfa.enroll({ factorType: "totp", friendlyName: "Authenticator" })
      if (error || !data) setError(error?.message || "Could not start setup")
      else setEnroll({ factorId: data.id, qr: data.totp.qr_code, secret: data.totp.secret })
    }
    setReady(true)
  }, [supabase, router, redirect])

  useEffect(() => {
    start()
  }, [start])

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    const id = factorId || enroll?.factorId
    if (!id) return
    setBusy(true)
    setError("")
    const { data: ch, error: chErr } = await supabase.auth.mfa.challenge({ factorId: id })
    if (chErr || !ch) {
      setError(chErr?.message || "Could not start the check")
      setBusy(false)
      return
    }
    const { error: vErr } = await supabase.auth.mfa.verify({ factorId: id, challengeId: ch.id, code: code.trim() })
    if (vErr) {
      setError("That code did not work. Check your authenticator app and try again.")
      setBusy(false)
      return
    }
    router.replace(redirect.startsWith("/") ? redirect : "/dashboard")
    router.refresh()
  }

  return (
    <div className="container mx-auto flex min-h-[70vh] items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <ShieldCheck className="mx-auto mb-2 h-10 w-10 text-emerald-700" />
          <CardTitle>{enroll ? "Set up two-step sign-in" : "Two-step sign-in"}</CardTitle>
          <CardDescription>
            {enroll
              ? "Scan the code with an authenticator app (Google Authenticator, Microsoft Authenticator, Authy), then enter the 6-digit code."
              : "Enter the 6-digit code from your authenticator app."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!ready ? (
            <p className="text-center text-sm text-muted-foreground">Loading…</p>
          ) : (
            <form onSubmit={submit} className="space-y-4">
              {enroll && (
                <div className="space-y-2 text-center">
                  {/* data: URI SVG from Supabase */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={enroll.qr} alt="Authenticator QR code" className="mx-auto h-44 w-44" />
                  <p className="text-xs text-muted-foreground">
                    Can't scan? Enter this key: <span className="break-all font-mono">{enroll.secret}</span>
                  </p>
                </div>
              )}
              <Input
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={6}
                placeholder="123456"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                className="text-center text-lg tracking-widest"
              />
              {error && <p className="text-sm text-red-600">{error}</p>}
              <Button type="submit" className="w-full" disabled={busy || code.length !== 6}>
                {busy ? "Checking…" : enroll ? "Turn on and continue" : "Continue"}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default function MfaPage() {
  return (
    <Suspense>
      <MfaForm />
    </Suspense>
  )
}
