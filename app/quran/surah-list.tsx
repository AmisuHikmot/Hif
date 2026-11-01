"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import type { SurahInfo } from "@/lib/quran/api"

// Letters only, lower case, so "al baqara", "Al-Baqarah" and "2" all find it.
const plain = (s: string) => s.toLowerCase().replace(/[^a-z0-9؀-ۿ]/g, "")

export default function SurahList({ surahs }: { surahs: SurahInfo[] }) {
  const [q, setQ] = useState("")
  const shown = useMemo(() => {
    const k = plain(q)
    if (!k) return surahs
    return surahs.filter(
      (s) =>
        String(s.number) === k ||
        plain(s.englishName).includes(k) ||
        plain(s.englishNameTranslation).includes(k) ||
        s.name.includes(q.trim()),
    )
  }, [q, surahs])

  return (
    <>
      <input
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search a surah by name or number"
        aria-label="Search a surah"
        className="mb-6 w-full max-w-md rounded-lg border bg-background px-3 py-2 text-sm"
      />
      {shown.length === 0 && <p className="text-sm text-muted-foreground">No surah matches that.</p>}
      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((s) => (
          <li key={s.number}>
            <Link
              href={`/quran/${s.number}`}
              className="flex items-center gap-4 rounded-xl border p-4 transition-colors hover:bg-muted/60"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-medium">
                {s.number}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate font-medium">{s.englishName}</span>
                <span className="block truncate text-xs text-muted-foreground">
                  {s.englishNameTranslation} · {s.numberOfAyahs} verses · {s.revelationType}
                </span>
              </span>
              <span lang="ar" dir="rtl" className="shrink-0 text-xl" style={{ fontFamily: "var(--font-quran), serif" }}>
                {s.name.replace(/^سُورَةُ\s*/, "")}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </>
  )
}
