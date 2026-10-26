import { createSign } from "node:crypto"
import { createAdminClient } from "@/lib/supabase/admin"

/**
 * Sends a push message through Firebase Cloud Messaging (HTTP v1).
 * Needs FIREBASE_SERVICE_ACCOUNT_JSON (the service account key JSON, from
 * Firebase console > Project settings > Service accounts). Without it nothing
 * is sent and the caller is told so.
 */
type ServiceAccount = { project_id: string; client_email: string; private_key: string }

function account(): ServiceAccount | null {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON
  if (!raw) return null
  try {
    return JSON.parse(raw) as ServiceAccount
  } catch {
    return null
  }
}

const b64 = (v: object | Buffer) => Buffer.from(v instanceof Buffer ? v : JSON.stringify(v)).toString("base64url")

async function accessToken(sa: ServiceAccount): Promise<string> {
  const now = Math.floor(Date.now() / 1000)
  const unsigned = `${b64({ alg: "RS256", typ: "JWT" })}.${b64({
    iss: sa.client_email,
    scope: "https://www.googleapis.com/auth/firebase.messaging",
    aud: "https://oauth2.googleapis.com/token",
    iat: now,
    exp: now + 3600,
  })}`
  const sig = createSign("RSA-SHA256").update(unsigned).sign(sa.private_key)
  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: `${unsigned}.${sig.toString("base64url")}`,
    }),
  })
  if (!res.ok) throw new Error(`Google token error ${res.status}`)
  return (await res.json()).access_token as string
}

export async function pushToKind(kind: string, title: string, body: string): Promise<{ sent: number; skipped?: string }> {
  const sa = account()
  if (!sa) return { sent: 0, skipped: "Firebase is not configured (FIREBASE_SERVICE_ACCOUNT_JSON missing)." }
  const db = createAdminClient()
  const { data: devices } = await db.from("device_tokens").select("token").contains("kinds", [kind]).limit(5000)
  if (!devices?.length) return { sent: 0 }
  const token = await accessToken(sa)
  let sent = 0
  for (const d of devices) {
    const res = await fetch(`https://fcm.googleapis.com/v1/projects/${sa.project_id}/messages:send`, {
      method: "POST",
      headers: { authorization: `Bearer ${token}`, "content-type": "application/json" },
      body: JSON.stringify({ message: { token: d.token, notification: { title, body }, android: { priority: "high" } } }),
    })
    if (res.ok) sent++
    else if (res.status === 404 || res.status === 400) {
      // The token is dead (app removed): forget it.
      await db.from("device_tokens").delete().eq("token", d.token)
    }
  }
  return { sent }
}
