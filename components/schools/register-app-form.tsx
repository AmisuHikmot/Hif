"use client"

import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { registerApp, type NewApp } from "@/lib/developers/actions"

export default function RegisterAppForm() {
  const [res, setRes] = useState<NewApp | null>(null)
  const [busy, start] = useTransition()
  if (res?.ok)
    return (
      <div className="space-y-2 rounded-lg border p-4">
        <p className="font-medium">App registered.</p>
        <p className="font-mono text-sm break-all">Client ID: {res.clientId}</p>
        {res.clientSecret ? (
          <>
            <p className="font-mono text-sm break-all">Client secret: {res.clientSecret}</p>
            <p className="text-sm text-destructive">Copy the secret now. It is shown once and cannot be recovered; you can only make a new one.</p>
          </>
        ) : (
          <p className="text-sm text-muted-foreground">This is a public client: use PKCE and no secret.</p>
        )}
        <Button variant="outline" onClick={() => setRes(null)}>Register another</Button>
      </div>
    )
  return (
    <form action={(fd) => start(async () => setRes(await registerApp(fd)))} className="grid gap-3 rounded-lg border p-4">
      <Input name="name" placeholder="App name" required />
      <Textarea name="description" placeholder="What does the app do? (one or two lines)" maxLength={500} />
      <Input name="homepage_url" placeholder="Homepage (https://…)" />
      <Input name="privacy_url" placeholder="Privacy policy (https://…) — required" required />
      <Input name="terms_url" placeholder="Terms (https://…)" />
      <Input name="support_email" type="email" placeholder="Support email — required" required />
      <Textarea name="redirect_uris" placeholder={"Redirect URIs, one per line, exact and HTTPS\nhttps://yourapp.example/auth/callback"} rows={3} required />
      <fieldset className="text-sm">
        <legend className="mb-1 text-muted-foreground">What your app asks for</legend>
        {["profile", "email", "phone", "offline_access"].map((s) => (
          <label key={s} className="mr-4 inline-flex items-center gap-1">
            <input type="checkbox" name="scopes" value={s} defaultChecked={s === "profile" || s === "email"} /> {s}
          </label>
        ))}
      </fieldset>
      {res && !res.ok && <p className="text-sm text-destructive">{res.error}</p>}
      <Button type="submit" disabled={busy}>{busy ? "Registering…" : "Register app"}</Button>
    </form>
  )
}
