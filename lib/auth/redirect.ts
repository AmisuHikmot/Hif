/** Only allow same-site paths, never an absolute URL or an auth page. */
export function safeNext(value: string | null | undefined, fallback = "/dashboard"): string {
  if (!value || !value.startsWith("/") || value.startsWith("//") || value.startsWith("/\\")) return fallback
  if (value === "/" || value.startsWith("/auth")) return fallback
  return value
}
