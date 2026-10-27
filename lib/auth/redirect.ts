/** Auth pages a sign-in or email link may legitimately end on. */
const ALLOWED_AUTH = new Set(["/auth/continue", "/auth/reset-password"])

/** Only allow same-site paths, never an absolute URL or an auth page. */
export function safeNext(value: string | null | undefined, fallback = "/auth/continue"): string {
  if (!value || !value.startsWith("/") || value.startsWith("//") || value.startsWith("/\\")) return fallback
  if (ALLOWED_AUTH.has(value)) return value
  if (value === "/" || value.startsWith("/auth")) return fallback
  return value
}
