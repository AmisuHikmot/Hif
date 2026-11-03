"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { Bookmark, Pause, Play } from "lucide-react"
import { RECITERS, audioUrl } from "@/lib/quran/api"
import { getBookmarks, setLastRead, toggleBookmark } from "@/lib/quran/bookmarks"

export type MushafLine = {
  n: number
  banner?: string // Arabic surah name, when a surah starts on this line
  bismillah?: boolean
  words: { text: string; end: boolean; key: string }[]
}

type Props = {
  page: number
  head: string
  firstSurah: number
  lines: MushafLine[]
  /** Verses in all earlier surahs, to find a verse's number counted from the start. */
  before: Record<number, number>
  surahs: { number: number; name: string; page: number }[]
}

const RECITER = RECITERS.find((r) => r.id === "alafasy") ?? RECITERS[0]

export default function MushafView({ page, head, firstSurah, lines, before, surahs }: Props) {
  const router = useRouter()
  const audio = useRef<HTMLAudioElement | null>(null)
  const [picked, setPicked] = useState<string | null>(null)
  const [playing, setPlaying] = useState(false)
  const [marks, setMarks] = useState<string[]>([])
  const [jump, setJump] = useState(String(page))

  useEffect(() => {
    setMarks(getBookmarks())
    setLastRead({ href: `/quran/mushaf/${page}`, label: `Mushaf page ${page}, ${head}` })
    setJump(String(page))
    setPicked(null)
  }, [page, head])

  function play(key: string) {
    const [s, a] = key.split(":").map(Number)
    const el = audio.current
    if (!el) return
    el.src = audioUrl(RECITER, { global: (before[s] ?? 0) + a, surah: s, number: a })
    el.play().then(() => setPlaying(true)).catch(() => setPlaying(false))
  }

  function go(n: number) {
    if (Number.isInteger(n) && n >= 1 && n <= 604) router.push(`/quran/mushaf/${n}`)
  }

  return (
    <>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2 text-sm text-muted-foreground">
        <Link href="/quran" className="hover:underline">
          All surahs
        </Link>
        <span>
          {head} · page {page} of 604
        </span>
        <Link href={`/quran/${firstSurah}`} className="hover:underline">
          Listen to the surah
        </Link>
      </div>

      <form
        className="mb-4 flex flex-wrap items-center gap-2 text-sm"
        onSubmit={(e) => {
          e.preventDefault()
          go(Number(jump))
        }}
      >
        <label className="flex items-center gap-2">
          Page
          <input
            type="number"
            min={1}
            max={604}
            value={jump}
            onChange={(e) => setJump(e.target.value)}
            className="w-20 rounded border bg-background px-2 py-1"
          />
        </label>
        <button type="submit" className="rounded border px-3 py-1 hover:bg-muted">
          Go
        </button>
        <select
          aria-label="Go to surah"
          value=""
          onChange={(e) => e.target.value && go(Number(e.target.value))}
          className="ml-auto rounded border bg-background px-2 py-1"
        >
          <option value="">Go to surah…</option>
          {surahs.map((s) => (
            <option key={s.number} value={s.page}>
              {s.number}. {s.name}
            </option>
          ))}
        </select>
      </form>

      <div
        lang="ar"
        dir="rtl"
        className="rounded-lg border bg-card px-3 py-6 sm:px-8"
        style={{ fontFamily: "var(--font-quran), serif", fontSize: "clamp(1.1rem, 4.6vw, 1.7rem)" }}
      >
        {lines.map((l) => (
          <div key={l.n}>
            {l.banner && (
              <div className="my-3 rounded border border-primary/30 bg-primary/5 py-1 text-center text-base font-semibold">{l.banner}</div>
            )}
            {l.bismillah && <div className="py-1 text-center leading-[2.3]">بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ</div>}
            <div className="flex justify-between leading-[2.3]" style={{ textAlignLast: "justify" }}>
              {l.words.map((w, i) =>
                w.end ? (
                  <button
                    key={i}
                    type="button"
                    aria-label={`Verse ${w.key}`}
                    onClick={() => setPicked(w.key === picked ? null : w.key)}
                    className={`rounded px-0.5 ${picked === w.key ? "bg-primary text-primary-foreground" : "text-primary"}`}
                  >
                    {w.text}
                  </button>
                ) : (
                  <span key={i} className={picked && w.key === picked ? "bg-primary/10" : undefined}>
                    {w.text}
                  </span>
                ),
              )}
            </div>
          </div>
        ))}
      </div>

      <audio ref={audio} onEnded={() => setPlaying(false)} onPause={() => setPlaying(false)} />

      {picked && (
        <div className="sticky bottom-3 z-10 mx-auto mt-4 flex w-fit items-center gap-3 rounded-full border bg-background/95 px-4 py-2 text-sm shadow backdrop-blur">
          <span className="font-medium">Verse {picked}</span>
          <button
            type="button"
            aria-label={playing ? "Pause" : `Play verse ${picked}`}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground"
            onClick={() => (playing ? audio.current?.pause() : play(picked))}
          >
            {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </button>
          <button
            type="button"
            aria-label={marks.includes(picked) ? "Remove bookmark" : "Bookmark this verse"}
            className="flex h-8 w-8 items-center justify-center rounded-full border"
            onClick={() => {
              toggleBookmark(picked)
              setMarks(getBookmarks())
            }}
          >
            <Bookmark className={`h-4 w-4 ${marks.includes(picked) ? "fill-current text-primary" : ""}`} />
          </button>
          <Link href={`/quran/${picked.split(":")[0]}#ayah-${picked.split(":")[1]}`} className="text-primary hover:underline">
            Translation and tafsir
          </Link>
        </div>
      )}

      <nav className="mt-4 flex items-center justify-between text-sm">
        {page < 604 ? (
          <Link href={`/quran/mushaf/${page + 1}`} className="rounded border px-4 py-2 hover:bg-muted">
            ← Next page
          </Link>
        ) : (
          <span />
        )}
        {page > 1 ? (
          <Link href={`/quran/mushaf/${page - 1}`} className="rounded border px-4 py-2 hover:bg-muted">
            Previous page →
          </Link>
        ) : (
          <span />
        )}
      </nav>
    </>
  )
}
