import type { Metadata } from "next"
import Link from "next/link"
import { checkCertificate } from "@/lib/certificates/verify"

export const dynamic = "force-dynamic"
export const metadata: Metadata = {
  title: "Check a certificate | Hamduk Islamic Foundation",
  robots: { index: false, follow: false },
}

const fmt = (d: string) => new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })

export default async function CertificatePage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params
  const c = await checkCertificate(code)
  return (
    <main className="mx-auto max-w-xl px-4 py-12">
      <h1 className="mb-6 text-2xl font-semibold">Certificate check</h1>
      {c.status === "unknown" ? (
        <div className="rounded-lg border p-6">
          <p className="font-medium">No certificate found for this code.</p>
          <p className="mt-2 text-sm text-muted-foreground">Check the code and try again. Codes have 12 letters and numbers.</p>
        </div>
      ) : (
        <div className={`rounded-lg border p-6 ${c.status === "revoked" ? "border-destructive" : ""}`}>
          <p className={`mb-4 text-sm font-semibold uppercase tracking-wide ${c.status === "revoked" ? "text-destructive" : "text-green-700"}`}>
            {c.status === "revoked" ? "✕ Revoked" : "✓ Valid"}
          </p>
          <dl className="space-y-2">
            <div><dt className="text-sm text-muted-foreground">Awarded to</dt><dd className="text-lg font-medium">{c.name}</dd></div>
            <div><dt className="text-sm text-muted-foreground">Course</dt><dd>{c.course}</dd></div>
            <div><dt className="text-sm text-muted-foreground">Grade</dt><dd>{c.grade}%</dd></div>
            <div><dt className="text-sm text-muted-foreground">Issued</dt><dd>{fmt(c.issued)}</dd></div>
            <div><dt className="text-sm text-muted-foreground">Code</dt><dd className="font-mono">{code.toUpperCase()}</dd></div>
          </dl>
          {c.status === "valid" && (
            <p className="mt-5 text-sm">
              <Link className="underline" href={`/c/${code}/pdf`}>Download the certificate (PDF)</Link>
            </p>
          )}
        </div>
      )}
      <p className="mt-6 text-xs text-muted-foreground">Issued by the Hamduk Islamic Foundation. This page confirms the record exists; it does not show anything else about the person.</p>
    </main>
  )
}
