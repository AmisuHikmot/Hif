"use client"

import { useEffect, useState } from "react"

type Data = { source: string; paragraphs: string[] }

/** Tafsir for one verse, loaded when opened. */
export default function TafsirPanel({ surah, ayah }: { surah: number; ayah: number }) {
  const [id, setId] = useState("169")
  const [data, setData] = useState<Data | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [tick, setTick] = useState(0)

  useEffect(() => {
    let alive = true
    setData(null)
    setError(null)
    fetch(`/api/quran/tafsir?s=${surah}&a=${ayah}&id=${id}`)
      .then(async (r) => {
        const j = await r.json()
        if (!r.ok) throw new Error(j.error ?? "Failed")
        return j as Data
      })
      .then((j) => alive && setData(j))
      .catch((e: Error) => alive && setError(e.message))
    return () => {
      alive = false
    }
  }, [surah, ayah, id, tick])

  const arabic = id === "16"
  return (
    <div className="mt-3 rounded-lg border bg-muted/30 p-4 text-sm">
      <div className="mb-3 flex gap-2">
        {[
          ["169", "Ibn Kathir"],
          ["16", "Al-Muyassar (Arabic)"],
        ].map(([v, label]) => (
          <button
            key={v}
            type="button"
            onClick={() => setId(v)}
            className={`rounded-full border px-3 py-1 text-xs ${id === v ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
          >
            {label}
          </button>
        ))}
      </div>
      {!data && !error && <p className="text-muted-foreground">Loading tafsir…</p>}
      {error && (
        <p className="text-destructive">
          {error}{" "}
          <button type="button" className="underline" onClick={() => setTick(tick + 1)}>
            Try again
          </button>
        </p>
      )}
      {data && (
        <div dir={arabic ? "rtl" : "ltr"} lang={arabic ? "ar" : "en"} className={`space-y-2 leading-relaxed ${arabic ? "text-base" : ""}`}>
          {data.paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
          <p className="pt-2 text-xs text-muted-foreground">
            {data.source}, via Quran.com. Awaiting review by the HIF Shariah Board.
          </p>
        </div>
      )}
    </div>
  )
}
