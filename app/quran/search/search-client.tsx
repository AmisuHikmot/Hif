"use client"

import Link from "next/link"
import { useState } from "react"

type Hit = { key: string; arabic: string; translation: string }
type Out = { results: Hit[]; total: number; pages: number; page: number }

/** Shows the translation with the matched words in bold, without injecting HTML. */
function Highlighted({ text }: { text: string }) {
  const parts = text.split(/(<em>.*?<\/em>)/g)
  return (
    <>
      {parts.map((p, i) =>
        p.startsWith("<em>") ? (
          <mark key={i} className="rounded bg-primary/15 px-0.5 text-foreground">
            {p.slice(4, -5)}
          </mark>
        ) : (
          <span key={i}>{p}</span>
        ),
      )}
    </>
  )
}

export default function SearchClient() {
  const [q, setQ] = useState("")
  const [out, setOut] = useState<Out | null>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function run(page: number) {
    if (q.trim().length < 2) return
    setBusy(true)
    setError(null)
    try {
      const r = await fetch(`/api/quran/search?q=${encodeURIComponent(q.trim())}&page=${page}`)
      const j = await r.json()
      if (!r.ok) throw new Error(j.error ?? "Search failed")
      setOut(j as Out)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Search failed")
    }
    setBusy(false)
  }

  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          void run(1)
        }}
        className="mb-6 flex gap-2"
      >
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="e.g. patience, mercy, الرحمة"
          aria-label="Search the Quran"
          className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
        />
        <button type="submit" disabled={busy} className="rounded-lg bg-primary px-4 py-2 text-sm text-primary-foreground disabled:opacity-60">
          {busy ? "Searching…" : "Search"}
        </button>
      </form>
      {error && <p className="mb-4 text-sm text-destructive">{error}</p>}
      {out && (
        <>
          <p className="mb-4 text-sm text-muted-foreground">
            {out.total} {out.total === 1 ? "verse" : "verses"} found
          </p>
          <ul className="divide-y">
            {out.results.map((h) => {
              const [s, a] = h.key.split(":")
              return (
                <li key={h.key} className="py-4">
                  <Link href={`/quran/${s}#ayah-${a}`} className="mb-2 inline-block text-xs font-medium text-primary hover:underline">
                    {s}:{a}
                  </Link>
                  <p lang="ar" dir="rtl" className="mb-2 text-xl leading-loose" style={{ fontFamily: "var(--font-quran), serif" }}>
                    {h.arabic}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <Highlighted text={h.translation} />
                  </p>
                </li>
              )
            })}
          </ul>
          {out.pages > 1 && (
            <div className="mt-6 flex items-center justify-between text-sm">
              <button type="button" disabled={busy || out.page <= 1} onClick={() => void run(out.page - 1)} className="rounded border px-3 py-1.5 disabled:opacity-40">
                ← Previous
              </button>
              <span>
                Page {out.page} of {out.pages}
              </span>
              <button type="button" disabled={busy || out.page >= out.pages} onClick={() => void run(out.page + 1)} className="rounded border px-3 py-1.5 disabled:opacity-40">
                Next →
              </button>
            </div>
          )}
        </>
      )}
    </>
  )
}
