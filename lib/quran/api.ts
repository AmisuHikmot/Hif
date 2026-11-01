// Public Quran data for the website, from Al-Quran Cloud (the same source the
// HIF app uses). Text is never typed or edited here; it is shown as received.

const BASE = "https://api.alquran.cloud/v1"

export type SurahInfo = {
  number: number
  name: string // Arabic
  englishName: string
  englishNameTranslation: string
  numberOfAyahs: number
  revelationType: string
}

export type AyahView = {
  number: number // within the surah
  global: number // 1..6236, for the audio file
  arabic: string
  translation: string
}

export type Reciter = { id: string; label: string; edition: string; kbps: number }

// The same five reciters the app streams.
export const RECITERS: Reciter[] = [
  { id: "alafasy", label: "Mishary Alafasy", edition: "ar.alafasy", kbps: 128 },
  { id: "husary", label: "Mahmoud Khalil Al-Husary", edition: "ar.husary", kbps: 128 },
  { id: "maher", label: "Maher Al-Muaiqly", edition: "ar.mahermuaiqly", kbps: 128 },
  { id: "sudais", label: "Abdurrahman As-Sudais", edition: "ar.abdurrahmaansudais", kbps: 64 },
  { id: "abdulsamad", label: "Abdul Basit Abdul Samad", edition: "ar.abdulsamad", kbps: 64 },
]

export function audioUrl(r: Reciter, global: number) {
  return `https://cdn.islamic.network/quran/audio/${r.kbps}/${r.edition}/${global}.mp3`
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

// The service sometimes throttles a burst of requests (429) or hiccups (5xx).
// Try a few times, waiting longer each time, before giving up.
async function get<T>(path: string, revalidate: number): Promise<T> {
  let last = "no answer"
  for (let attempt = 0; attempt < 4; attempt++) {
    if (attempt > 0) await sleep(400 * 2 ** attempt)
    try {
      const res = await fetch(`${BASE}${path}`, { next: { revalidate } })
      if (res.ok) {
        const body = (await res.json()) as { data: T }
        return body.data
      }
      last = `status ${res.status}`
      if (res.status !== 429 && res.status < 500) break // not worth retrying
    } catch (e) {
      last = e instanceof Error ? e.message : "network error"
    }
  }
  throw new Error(`Quran service failed (${last})`)
}

export async function getSurahs(): Promise<SurahInfo[]> {
  return get<SurahInfo[]>("/surah", 60 * 60 * 24 * 30)
}

const TRANSLATION = "en.sahih"

export async function getSurah(n: number): Promise<{ info: SurahInfo; ayahs: AyahView[] }> {
  const data = await get<
    Array<
      SurahInfo & {
        ayahs: Array<{ number: number; numberInSurah: number; text: string }>
      }
    >
  >(`/surah/${n}/editions/quran-uthmani,${TRANSLATION}`, 60 * 60 * 24 * 7)
  const [ar, en] = data
  const ayahs = ar.ayahs.map((a, i) => ({
    number: a.numberInSurah,
    global: a.number,
    arabic: a.text.replace(/﻿/g, "").trim(),
    translation: (en.ayahs[i]?.text ?? "").trim(),
  }))
  return { info: ar, ayahs }
}

/**
 * The Uthmani text carries the opening bismillah inside verse 1 of every surah
 * but the first and ninth. It is shown as its own line, so it is taken off the
 * front of verse 1 (the first four words).
 */
export function splitBismillah(surah: number, first: string): { bismillah: boolean; text: string } {
  if (surah === 1 || surah === 9) return { bismillah: false, text: first }
  const words = first.split(/\s+/)
  if (words.length > 4) return { bismillah: true, text: words.slice(4).join(" ") }
  return { bismillah: false, text: first }
}
