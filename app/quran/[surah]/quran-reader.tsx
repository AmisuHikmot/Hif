"use client"

import Link from "next/link"
import { useCallback, useEffect, useRef, useState } from "react"
import { Bookmark, BookOpenText, Pause, Play, SkipBack, SkipForward } from "lucide-react"
import TafsirPanel from "@/components/quran/tafsir-panel"
import { getBookmarks, setLastRead, toggleBookmark } from "@/lib/quran/bookmarks"
import { RECITERS, audioUrl, type AyahView, type ChapterAudio } from "@/lib/quran/api"

type Props = {
  surah: number
  bismillah: boolean
  ayahs: AyahView[]
  prev: number | null
  next: number | null
}

const SIZES = [24, 28, 34, 40, 48]

function read(key: string): string | null {
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}
function write(key: string, v: string) {
  try {
    localStorage.setItem(key, v)
  } catch {}
}

export default function QuranReader({ surah, bismillah, ayahs, prev, next }: Props) {
  // Two players take turns: while one recites a verse the other is already
  // loading the next, so there is no wait between verses.
  const players = useRef<(HTMLAudioElement | null)[]>([null, null])
  const active = useRef(0)
  const [marks, setMarks] = useState<string[]>([])
  const [tafsirFor, setTafsirFor] = useState<number | null>(null)
  // Where a whole-surah recording exists, one file plays from start to end and
  // the verse is found from the time (how Quran.com avoids a break between
  // verses). The two players above are the fallback.
  const chapterEl = useRef<HTMLAudioElement | null>(null)
  const [chapter, setChapter] = useState<ChapterAudio | null>(null)
  const [chapterReady, setChapterReady] = useState(false)
  const resumeAt = useRef<number | null>(null)
  const [current, setCurrent] = useState<number | null>(null) // index into ayahs
  const [playing, setPlaying] = useState(false)
  const [loading, setLoading] = useState(false)
  const [problem, setProblem] = useState<string | null>(null)
  const [reciterId, setReciterId] = useState(RECITERS[0].id)
  const [showTranslation, setShowTranslation] = useState(true)
  const [size, setSize] = useState(2)

  useEffect(() => {
    const r = read("hif.quran.reciter")
    if (r && RECITERS.some((x) => x.id === r)) setReciterId(r)
    if (read("hif.quran.translation") === "off") setShowTranslation(false)
    const s = Number(read("hif.quran.size"))
    if (Number.isInteger(s) && s >= 0 && s < SIZES.length) setSize(s)
  }, [])

  const reciter = RECITERS.find((r) => r.id === reciterId) ?? RECITERS[0]

  useEffect(() => {
    setMarks(getBookmarks())
    // Open at the verse in the link (a bookmark or a search result).
    const m = /^#ayah-(\d+)$/.exec(window.location.hash)
    if (m) document.getElementById(`ayah-${m[1]}`)?.scrollIntoView({ block: "center" })
  }, [])

  // Remember where the reader got to so the Quran page can offer to continue.
  useEffect(() => {
    if (current === null) return
    setLastRead({ href: `/quran/${surah}#ayah-${ayahs[current]?.number}`, label: `Surah ${surah}, verse ${ayahs[current]?.number}` })
  }, [current, surah, ayahs])

  useEffect(() => {
    let alive = true
    setChapter(null)
    setChapterReady(false)
    if (!reciter.qf) {
      setChapterReady(true)
      return
    }
    fetch(`/api/quran/chapter?reciter=${reciter.qf}&chapter=${surah}`)
      .then((r) => (r.ok ? (r.json() as Promise<ChapterAudio>) : Promise.reject(new Error("no recording"))))
      .then((c) => {
        if (alive && c.verses.length >= ayahs.length * 0.9) setChapter(c)
      })
      .catch(() => {})
      .finally(() => alive && setChapterReady(true))
    return () => {
      alive = false
    }
  }, [reciter.qf, surah, ayahs.length])

  const urlFor = useCallback(
    (i: number) => {
      const a = ayahs[i]
      return a ? audioUrl(reciter, { global: a.global, surah, number: a.number }) : null
    },
    [ayahs, reciter, surah],
  )

  // Start loading verse i into the player that is not playing.
  const preload = useCallback(
    (i: number) => {
      const el = players.current[1 - active.current]
      const u = urlFor(i)
      if (!el || !u) return
      el.preload = "auto"
      el.src = u
      el.load()
    },
    [urlFor],
  )

  const playChapter = useCallback(
    async (i: number, c: ChapterAudio) => {
      const el = chapterEl.current
      const v = c.verses.find((x) => x.n === ayahs[i]?.number)
      if (!el || !v) return false
      players.current.forEach((p) => p?.pause())
      setCurrent(i)
      setProblem(null)
      setLoading(true)
      if (el.src !== c.audioUrl) {
        el.src = c.audioUrl
        el.load()
      }
      const seek = () => {
        el.currentTime = v.from / 1000
      }
      if (el.readyState >= 1) seek()
      else el.addEventListener("loadedmetadata", seek, { once: true })
      try {
        await el.play()
        setPlaying(true)
      } catch {
        setPlaying(false)
        setProblem("Could not play this recitation. Check your connection and try again.")
      }
      setLoading(false)
      return true
    },
    [ayahs],
  )

  const playIndex = useCallback(
    async (i: number) => {
      if (chapter && (await playChapter(i, chapter))) return
      const el = players.current[active.current]
      const u = urlFor(i)
      if (!u || !el) return
      chapterEl.current?.pause()
      players.current[1 - active.current]?.pause()
      setCurrent(i)
      setProblem(null)
      setLoading(true)
      el.src = u
      try {
        await el.play()
        setPlaying(true)
        preload(i + 1)
      } catch {
        setPlaying(false)
        setProblem("Could not play this recitation. Check your connection and try again.")
      }
      setLoading(false)
    },
    [chapter, playChapter, urlFor, preload],
  )

  // Keep the verse being recited in view.
  useEffect(() => {
    if (current === null) return
    document.getElementById(`ayah-${ayahs[current].number}`)?.scrollIntoView({ block: "center", behavior: "smooth" })
  }, [current, ayahs])

  function toggle() {
    const usingChapter = !!chapter && !!chapterEl.current?.src && chapterEl.current.src === chapter.audioUrl && !chapterEl.current.paused
    const el = usingChapter || (chapter && chapterEl.current?.src === chapter.audioUrl) ? chapterEl.current : players.current[active.current]
    if (!el) return
    if (current === null) return void playIndex(0)
    if (playing) {
      el.pause()
      setPlaying(false)
    } else {
      el.play().then(() => setPlaying(true)).catch(() => setProblem("Could not play this recitation."))
    }
  }

  // The verse follows the clock in the whole-surah recording.
  function onChapterTime() {
    const el = chapterEl.current
    if (!el || !chapter || el.paused) return
    const t = el.currentTime * 1000
    let n = chapter.verses[0].n
    for (const v of chapter.verses) {
      if (v.from <= t + 40) n = v.n
      else break
    }
    const idx = ayahs.findIndex((a) => a.number === n)
    if (idx >= 0 && idx !== current) setCurrent(idx)
  }

  function onEnded(which: number) {
    if (which !== active.current) return
    if (current === null || current + 1 >= ayahs.length) {
      setPlaying(false)
      return
    }
    // The next verse is already loaded in the other player: start it at once.
    const next = players.current[1 - active.current]
    if (!next || !next.src) return void playIndex(current + 1)
    active.current = 1 - active.current
    setCurrent(current + 1)
    next.play().then(() => preload(current + 2)).catch(() => {
      setPlaying(false)
      setProblem("Could not play this recitation. Check your connection and try again.")
    })
  }

  function chooseReciter(id: string) {
    resumeAt.current = playing ? current : null
    chapterEl.current?.pause()
    players.current.forEach((p) => p?.pause())
    setReciterId(id)
    write("hif.quran.reciter", id)
  }

  // Carry on from the same verse in a newly chosen voice, once we know
  // whether that voice has a whole-surah recording.
  useEffect(() => {
    if (!chapterReady || resumeAt.current === null) return
    const i = resumeAt.current
    resumeAt.current = null
    void playIndex(i)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chapterReady])

  return (
    <>
      <div className="mb-6 flex flex-wrap items-center gap-3 text-sm">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={showTranslation}
            onChange={(e) => {
              setShowTranslation(e.target.checked)
              write("hif.quran.translation", e.target.checked ? "on" : "off")
            }}
          />
          Translation
        </label>
        <div className="flex items-center gap-1" role="group" aria-label="Arabic text size">
          <button
            type="button"
            className="rounded border px-2 py-1 disabled:opacity-40"
            disabled={size === 0}
            aria-label="Smaller text"
            onClick={() => {
              setSize(size - 1)
              write("hif.quran.size", String(size - 1))
            }}
          >
            A−
          </button>
          <button
            type="button"
            className="rounded border px-2 py-1 disabled:opacity-40"
            disabled={size === SIZES.length - 1}
            aria-label="Larger text"
            onClick={() => {
              setSize(size + 1)
              write("hif.quran.size", String(size + 1))
            }}
          >
            A+
          </button>
        </div>
      </div>

      {bismillah && (
        <p lang="ar" dir="rtl" className="mb-8 text-center" style={{ fontFamily: "var(--font-quran), serif", fontSize: SIZES[size] }}>
          بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
        </p>
      )}

      <ol className="divide-y">
        {ayahs.map((a, i) => (
          <li
            key={a.number}
            id={`ayah-${a.number}`}
            className={`scroll-mt-24 py-5 transition-colors ${current === i ? "bg-primary/5" : ""}`}
          >
            <div className="mb-3 flex items-center gap-2 text-xs text-muted-foreground">
              <button
                type="button"
                onClick={() => (current === i && playing ? toggle() : void playIndex(i))}
                aria-label={current === i && playing ? `Pause verse ${a.number}` : `Play verse ${surah}:${a.number}`}
                className="flex h-8 w-8 items-center justify-center rounded-full border hover:bg-muted"
              >
                {current === i && playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </button>
              <span>
                {surah}:{a.number}
              </span>
              <button
                type="button"
                aria-label={marks.includes(`${surah}:${a.number}`) ? "Remove bookmark" : "Bookmark this verse"}
                aria-pressed={marks.includes(`${surah}:${a.number}`)}
                onClick={() => {
                  toggleBookmark(`${surah}:${a.number}`)
                  setMarks(getBookmarks())
                }}
                className="ml-auto flex h-8 w-8 items-center justify-center rounded-full border hover:bg-muted"
              >
                <Bookmark className={`h-4 w-4 ${marks.includes(`${surah}:${a.number}`) ? "fill-current text-primary" : ""}`} />
              </button>
              <button
                type="button"
                aria-label="Tafsir"
                aria-expanded={tafsirFor === a.number}
                onClick={() => setTafsirFor(tafsirFor === a.number ? null : a.number)}
                className="flex h-8 w-8 items-center justify-center rounded-full border hover:bg-muted"
              >
                <BookOpenText className="h-4 w-4" />
              </button>
            </div>
            <p
              lang="ar"
              dir="rtl"
              className="leading-[2.1]"
              style={{ fontFamily: "var(--font-quran), serif", fontSize: SIZES[size] }}
            >
              {a.arabic}
            </p>
            {showTranslation && <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">{a.translation}</p>}
            {tafsirFor === a.number && <TafsirPanel surah={surah} ayah={a.number} />}
          </li>
        ))}
      </ol>

      <nav className="mt-8 flex justify-between text-sm">
        {prev ? (
          <Link href={`/quran/${prev}`} className="underline">
            ← Previous surah
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link href={`/quran/${next}`} className="underline">
            Next surah →
          </Link>
        ) : (
          <span />
        )}
      </nav>

      {/* Player */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t bg-background/95 backdrop-blur">
        <div className="mx-auto flex max-w-3xl flex-wrap items-center gap-3 px-4 py-3">
          <button
            type="button"
            aria-label="Previous verse"
            className="rounded-full border p-2 disabled:opacity-40"
            disabled={current === null || current === 0}
            onClick={() => current !== null && void playIndex(current - 1)}
          >
            <SkipBack className="h-4 w-4" />
          </button>
          <button
            type="button"
            aria-label={playing ? "Pause" : "Play"}
            className="rounded-full bg-primary p-3 text-primary-foreground"
            onClick={toggle}
          >
            {playing ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
          </button>
          <button
            type="button"
            aria-label="Next verse"
            className="rounded-full border p-2 disabled:opacity-40"
            disabled={current === null || current + 1 >= ayahs.length}
            onClick={() => current !== null && void playIndex(current + 1)}
          >
            <SkipForward className="h-4 w-4" />
          </button>
          <div className="min-w-0 flex-1 text-sm">
            <p className="truncate font-medium">
              {current === null ? "Press play to listen" : `Verse ${ayahs[current].number} of ${ayahs.length}`}
              {loading ? " · loading…" : ""}
            </p>
            {problem && <p className="truncate text-xs text-red-600">{problem}</p>}
          </div>
          <select
            aria-label="Reciter"
            value={reciterId}
            onChange={(e) => chooseReciter(e.target.value)}
            className="max-w-[11rem] rounded border bg-background px-2 py-1 text-sm"
          >
            {RECITERS.map((r) => (
              <option key={r.id} value={r.id}>
                {r.label}
              </option>
            ))}
          </select>
        </div>
        <audio
          ref={chapterEl}
          preload="none"
          onTimeUpdate={onChapterTime}
          onWaiting={() => setLoading(true)}
          onPlaying={() => {
            setLoading(false)
            setPlaying(true)
          }}
          onPause={() => !chapterEl.current?.ended && setPlaying(false)}
          onEnded={() => setPlaying(false)}
        />
        {[0, 1].map((n) => (
          <audio
            key={n}
            ref={(el) => {
              players.current[n] = el
            }}
            onEnded={() => onEnded(n)}
            onPause={() => n === active.current && !players.current[n]?.ended && setPlaying(false)}
            onPlay={() => n === active.current && setPlaying(true)}
            preload="none"
          />
        ))}
      </div>
    </>
  )
}
