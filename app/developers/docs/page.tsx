import SchoolShell from "@/components/schools/school-shell"

export const metadata = { title: "HIF ID guide" }

const base = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://YOUR-PROJECT.supabase.co") + "/auth/v1"

export default function DocsPage() {
  const rows: [string, string][] = [
    ["Discovery", `${base}/.well-known/openid-configuration`],
    ["Authorization", `${base}/oauth/authorize`],
    ["Token", `${base}/oauth/token`],
    ["UserInfo", `${base}/oauth/userinfo`],
    ["Signing keys (JWKS)", `${base}/.well-known/jwks.json`],
  ]
  return (
    <SchoolShell
      title="HIF ID guide"
      crumbs={[{ href: "/developers", label: "Developers" }]}
      intro="HIF ID is an OpenID Connect provider. Use any standard library: openid-client (Node), Authlib (Python), league/oauth2-client (PHP), AppAuth (Android, iOS) or flutter_appauth."
    >
      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Endpoints</h2>
        <div className="rounded-lg border">
          {rows.map(([k, v]) => (
            <div key={k} className="border-b p-3 last:border-0">
              <div className="text-sm text-muted-foreground">{k}</div>
              <div className="font-mono text-sm break-all">{v}</div>
            </div>
          ))}
        </div>
      </section>
      <section className="space-y-2">
        <h2 className="text-xl font-semibold">The rules</h2>
        <ol className="list-decimal space-y-1 pl-5">
          <li>Use the authorization code flow with PKCE (S256). Always send <code>state</code> and <code>nonce</code>.</li>
          <li>Redirect URIs must match exactly what you registered. Use HTTPS (http only for localhost).</li>
          <li>Keep tokens on your server. Never put a client secret inside a mobile app; mobile apps use PKCE with no secret.</li>
          <li>Ask only for the scopes you need: <code>openid</code>, <code>profile</code>, <code>email</code>, <code>phone</code>, <code>offline_access</code>. People see each one in plain words and can refuse.</li>
          <li>You may not use HIF data for advertising, or to profile anyone’s religious practice. Delete HIF-derived data within 30 days when a person asks.</li>
          <li>New apps are Basic: up to 100 people, and the consent screen says they are not yet verified by HIF. Write to info@hif.com.ng for verification.</li>
        </ol>
      </section>
      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Sign in with a school account</h2>
        <p>
          A school’s pupils and teachers sign in with the HIF ID their school gave them. Your app receives the same standard tokens. LTI 1.3
          for Moodle and Canvas is planned.
        </p>
      </section>
    </SchoolShell>
  )
}
