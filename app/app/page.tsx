import { createAdminClient } from "@/lib/supabase/admin"

export const metadata = {
  title: "Get the HIF App",
  description: "Download the HIF App for Android: prayer times, Quran, hifz, your school and more, in one app from the Hamduk Islamic Foundation.",
}
export const dynamic = "force-dynamic"

export default async function GetAppPage() {
  const { data: r } = await createAdminClient()
    .from("app_releases").select("*").eq("published", true).order("build", { ascending: false }).limit(1).maybeSingle()
  return (
    <main className="mx-auto max-w-2xl space-y-6 px-4 py-12">
      <h1 className="text-3xl font-bold">The HIF App</h1>
      <p className="text-muted-foreground">
        Prayer times, Quran, hifz, adhkar, mosques, halal food, your school and giving, in one app from the Hamduk Islamic Foundation.
        Worship features are free.
      </p>
      {r ? (
        <div className="space-y-3 rounded-lg border p-5">
          <div className="font-medium">Android · version {r.version_name}{r.size_mb ? ` · ${r.size_mb} MB` : ""}</div>
          <a href={r.apk_url} className="inline-block rounded-md bg-primary px-5 py-3 font-medium text-primary-foreground">Download the APK</a>
          {r.notes && <p className="text-sm">{r.notes}</p>}
          {r.sha256 && <p className="break-all text-xs text-muted-foreground">SHA-256: {r.sha256}</p>}
        </div>
      ) : (
        <p className="rounded-lg border p-5">The first download is almost ready. Please check back soon.</p>
      )}
      <section className="space-y-2 text-sm">
        <h2 className="text-lg font-semibold">How to install</h2>
        <ol className="list-decimal space-y-1 pl-5">
          <li>Tap Download the APK and open the file when it finishes.</li>
          <li>If Android asks, allow installs from your browser for this one time.</li>
          <li>Open HIF App. Updates are announced inside the app.</li>
        </ol>
        <p className="text-muted-foreground">The app is not on Google Play yet. Only install it from hif.com.ng.</p>
      </section>
    </main>
  )
}
