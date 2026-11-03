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

/**
 * A reciter's verse-by-verse audio. "cloud" files come from the Islamic Network
 * CDN (named by the verse's number across the Quran, 1 to 6236); "direct"
 * files are named by surah and verse (001001.mp3) under a base address.
 */
export type Reciter =
  | { id: string; label: string; kind: "cloud"; edition: string; kbps: number; qf?: number }
  | { id: string; label: string; kind: "direct"; base: string; qf?: number }

// [qf] is the reciter's number on Quran.com, where a whole-surah recording
// (played without a break between verses) exists for them.
const cloud = (id: string, label: string, kbps: number, qf?: number): Reciter => ({
  id,
  label,
  kind: "cloud",
  edition: `ar.${id}`,
  kbps,
  qf,
})
const direct = (id: string, label: string, base: string, qf?: number): Reciter => ({ id, label, kind: "direct", base, qf })

export const RECITERS: Reciter[] = [
  cloud("alafasy", "Mishary Alafasy", 128, 7),
  direct("dosari", "Yasser ad-Dosari", "https://audio-cdn.tarteel.ai/quran/yasserAlDosari/", 97),
  cloud("abdurrahmaansudais", "Abdurrahman As-Sudais", 64, 3),
  cloud("saoodshuraym", "Saud ash-Shuraim", 64, 10),
  cloud("mahermuaiqly", "Maher Al-Muaiqly", 128),
  direct("ghamdi", "Saad al-Ghamdi", "https://audio-cdn.tarteel.ai/quran/ghamadi/"),
  cloud("husary", "Mahmoud Khalil Al-Husary", 128, 6),
  cloud("husarymujawwad", "Al-Husary (Mujawwad)", 128),
  cloud("abdulsamad", "Abdul Basit Abdul Samad", 64, 2),
  direct("abdulbasit-mujawwad", "Abdul Basit (Mujawwad)", "https://audio-cdn.tarteel.ai/quran/abdulBasitMujawwad/"),
  direct("minshawi", "Muhammad Siddiq al-Minshawi", "https://audio-cdn.tarteel.ai/quran/minshawyMurattal/", 9),
  cloud("hanirifai", "Hani ar-Rifai", 192, 5),
  cloud("shaatree", "Abu Bakr ash-Shatri", 128, 4),
  cloud("hudhaify", "Ali al-Hudhaify", 128),
  cloud("ahmedajamy", "Ahmed al-Ajamy", 128),
  cloud("abdullahbasfar", "Abdullah Basfar", 192),
  cloud("muhammadayyoub", "Muhammad Ayyub", 128),
  cloud("muhammadjibreel", "Muhammad Jibreel", 128),
  cloud("ibrahimakhbar", "Ibrahim al-Akhdar", 32),
  cloud("aymanswoaid", "Ayman Sowaid", 64),
  cloud("parhizgar", "Shahriar Parhizgar", 48),
  direct("tunaiji", "Khalifa al-Tunaiji", "https://audio-cdn.tarteel.ai/quran/khalifaAlTunaiji/", 161),
  direct("tablawi", "Mohamed al-Tablawi", "https://mirrors.quranicaudio.com/everyayah/Mohammad_al_Tablaway_128kbps/"),
]

const pad3 = (n: number) => String(n).padStart(3, "0")

export function audioUrl(r: Reciter, ayah: { global: number; surah: number; number: number }) {
  return r.kind === "cloud"
    ? `https://cdn.islamic.network/quran/audio/${r.kbps}/${r.edition}/${ayah.global}.mp3`
    : `${r.base}${pad3(ayah.surah)}${pad3(ayah.number)}.mp3`
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

export type ChapterAudio = { audioUrl: string; verses: { n: number; from: number; to: number }[] }
