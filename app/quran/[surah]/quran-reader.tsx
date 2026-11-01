"use client"

import Link from "next/link"
import { useCallback, useEffect, useRef, useState } from "react"
import { Pause, Play, SkipBack, SkipForward } from "lucide-react"
import { RECITERS, audioUrl, type AyahView } from "@/lib/quran/api"

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
  const audio = useRef<HTMLAudioElement | null>(null)
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

  const playIndex = useCallback(
    async (i: number) => {
      const a = ayahs[i]
      const el = audio.current
      if (!a || !el) return
      setCurrent(i)
      setProblem(null)
      setLoading(true)
      el.src = audioUrl(reciter, a.global)
      try {
        await el.play()
        setPlaying(true)
      } catch {
        setPlaying(false)
        setProblem("Could not play this recitation. Check your connection and try again.")
      }
      setLoading(false)
    },
    [ayahs, reciter],
  )

  // Keep the verse being recited in view.
  useEffect(() => {
    if (current === null) return
    document.getElementById(`ayah-${ayahs[current].number}`)?.scrollIntoView({ block: "center", behavior: "smooth" })
  }, [current, ayahs])

  function toggle() {
    const el = audio.current
    if (!el) return
    if (current === null) return void playIndex(0)
    if (playing) {
      el.pause()
      setPlaying(false)
    } else {
      el.play().then(() => setPlaying(true)).catch(() => setProblem("Could not play this recitation."))
    }
  }

  function onEnded() {
    if (current !== null && current + 1 < ayahs.length) void playIndex(current + 1)
    else setPlaying(false)
  }

  function chooseReciter(id: string) {
    setReciterId(id)
    write("hif.quran.reciter", id)
    // Carry on from the same verse in the new voice.
    if (current !== null && playing) {
      const r = RECITERS.find((x) => x.id === id) ?? RECITERS[0]
      const el = audio.current
      if (el) {
        el.src = audioUrl(r, ayahs[current].global)
        el.play().catch(() => setPlaying(false))
      }
    }
  }

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
        <audio ref={audio} onEnded={onEnded} onPause={() => setPlaying(false)} onPlay={() => setPlaying(true)} preload="none" />
      </div>
    </>
  )
}
