"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabase/client"

// What each scope means, in words a person can accept or refuse.
const SCOPE_TEXT: Record<string, string> = {
  openid: "Know that you have a HIF ID",
  email: "See your email address",
  profile: "See your name and profile picture",
  phone: "See your phone number",
  offline_access: "Stay signed in without asking you again",
}

type Details = {
  authorization_id: string
  redirect_url?: string
  client: { name: string; uri?: string; logo_uri?: string }
  user: { email: string }
  scope: string
}

export default function ConsentClient() {
  const params = useSearchParams()
  const id = params.get("authorization_id")
  const [details, setDetails] = useState<Details | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (!id) return setError("This sign-in link is not valid.")
    ;(async () => {
      const { data: auth } = await supabase.auth.getUser()
      if (!auth?.user) {
        const back = `/oauth/consent?authorization_id=${encodeURIComponent(id)}`
        window.location.replace(`/auth/login?redirect=${encodeURIComponent(back)}`)
        return
      }
      const { data, error: err } = await supabase.auth.oauth.getAuthorizationDetails(id)
      if (err || !data) return setError("This request has expired. Go back to the app and try again.")
      // Already approved earlier: send the person straight back.
      if (data.redirect_url) return void window.location.replace(data.redirect_url)
      setDetails(data as Details)
    })()
  }, [id])

  const decide = async (approve: boolean) => {
    if (!id) return
    setBusy(true)
    const { data, error: err } = approve
      ? await supabase.auth.oauth.approveAuthorization(id)
      : await supabase.auth.oauth.denyAuthorization(id)
    if (err || !data?.redirect_url) {
      setError("Something went wrong. Please try again.")
      setBusy(false)
      return
    }
    window.location.href = data.redirect_url
  }

  return (
    <main className="container mx-auto flex min-h-[70vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-lg border p-6">
        <p className="text-sm text-muted-foreground">Sign in with HIF ID</p>
        {error && <p className="mt-3 text-destructive">{error}</p>}
        {!error && !details && <p className="mt-3">Loading…</p>}
        {details && (
          <>
            <h1 className="mt-1 text-2xl font-bold">{details.client.name}</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              wants to use your HIF ID ({details.user.email}). It will be able to:
            </p>
            <ul className="mt-4 list-disc space-y-1 pl-5">
              {details.scope.split(" ").filter(Boolean).map((s) => (
                <li key={s}>{SCOPE_TEXT[s] ?? s}</li>
              ))}
            </ul>
            <p className="mt-4 text-xs text-muted-foreground">
              It cannot see your prayer tracker, your Quran reading, your location or your messages. You can remove its access any time in your HIF account.
            </p>
            <div className="mt-6 flex gap-2">
              <Button onClick={() => decide(true)} disabled={busy}>Allow</Button>
              <Button variant="outline" onClick={() => decide(false)} disabled={busy}>Cancel</Button>
            </div>
          </>
        )}
      </div>
    </main>
  )
}
