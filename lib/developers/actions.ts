"use server"

import { revalidatePath } from "next/cache"
import { createAdminClient } from "@/lib/supabase/admin"
import { currentUserId } from "@/lib/schools/guard"

const SCOPES = ["openid", "profile", "email", "phone", "offline_access"]
const MAX_APPS = 5

const clean = (v: FormDataEntryValue | null, max: number) => String(v ?? "").trim().slice(0, max)
const httpsUrl = (u: string) => {
  try {
    const x = new URL(u)
    return x.protocol === "https:" || (x.protocol === "http:" && ["localhost", "127.0.0.1"].includes(x.hostname))
  } catch {
    return false
  }
}

export type NewApp = { ok: true; clientId: string; clientSecret?: string } | { ok: false; error: string }

/** Registers a partner app. Basic tier: openid, profile and email only; the consent screen is always shown. */
export async function registerApp(formData: FormData): Promise<NewApp> {
  const userId = await currentUserId()
  if (!userId) return { ok: false, error: "Sign in first." }
  const db = createAdminClient()

  const name = clean(formData.get("name"), 80)
  const redirects = clean(formData.get("redirect_uris"), 2000).split(/\s+/).filter(Boolean)
  const privacy = clean(formData.get("privacy_url"), 300)
  const support = clean(formData.get("support_email"), 200)
  const scopes = formData.getAll("scopes").map(String).filter((s) => SCOPES.includes(s))
  if (name.length < 3) return { ok: false, error: "Give the app a name." }
  if (!redirects.length || redirects.some((r) => !httpsUrl(r) || r.includes("*")))
    return { ok: false, error: "Redirect URIs must be exact HTTPS addresses (http only for localhost), one per line." }
  if (!httpsUrl(privacy)) return { ok: false, error: "A privacy policy address is required." }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(support)) return { ok: false, error: "A support email is required." }
  if (!scopes.includes("openid")) scopes.unshift("openid")

  const { count } = await db.from("oauth_apps").select("id", { count: "exact", head: true }).eq("owner_id", userId)
  if ((count ?? 0) >= MAX_APPS) return { ok: false, error: `You can register up to ${MAX_APPS} apps.` }

  const { data, error } = await db.auth.admin.oauth.createClient({
    client_name: name,
    client_uri: clean(formData.get("homepage_url"), 300) || undefined,
    redirect_uris: redirects,
    scope: scopes.join(" "),
  })
  if (error || !data) return { ok: false, error: "The sign-in service did not accept the registration. Check the details and try again." }

  await db.from("oauth_apps").insert({
    owner_id: userId,
    client_id: data.client_id,
    name,
    description: clean(formData.get("description"), 500) || null,
    homepage_url: clean(formData.get("homepage_url"), 300) || null,
    privacy_url: privacy,
    terms_url: clean(formData.get("terms_url"), 300) || null,
    support_email: support,
    redirect_uris: redirects,
    scopes: scopes.join(" "),
  })
  revalidatePath("/developers")
  return { ok: true, clientId: data.client_id, clientSecret: data.client_secret }
}

async function ownedApp(clientId: string) {
  const userId = await currentUserId()
  if (!userId) throw new Error("Sign in first")
  const db = createAdminClient()
  const { data } = await db.from("oauth_apps").select("id, status").eq("client_id", clientId).eq("owner_id", userId).maybeSingle()
  if (!data) throw new Error("Not your app")
  return { db, app: data }
}

export async function regenerateSecret(clientId: string): Promise<{ secret?: string; error?: string }> {
  try {
    const { db, app } = await ownedApp(clientId)
    if (app.status === "suspended") return { error: "This app is suspended." }
    const { data, error } = await db.auth.admin.oauth.regenerateClientSecret(clientId)
    return error || !data?.client_secret ? { error: "Could not make a new secret." } : { secret: data.client_secret }
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Failed" }
  }
}

export async function deleteApp(formData: FormData) {
  const clientId = clean(formData.get("client_id"), 100)
  const { db, app } = await ownedApp(clientId)
  await db.auth.admin.oauth.deleteClient(clientId)
  await db.from("oauth_apps").delete().eq("id", app.id)
  revalidatePath("/developers")
}
