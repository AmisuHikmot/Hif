import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getMushafPage, getSurahStartPages, getSurahs, type MushafWord } from "@/lib/quran/api"
import MushafView, { type MushafLine } from "./mushaf-view"

export const revalidate = 2592000
export const dynamicParams = true

type Props = { params: Promise<{ page: string }> }

function parse(raw: string): number | null {
  const n = Number(raw)
  return Number.isInteger(n) && n >= 1 && n <= 604 ? n : null
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = parse((await params).page)
  if (!p) return {}
  return {
    title: `Quran page ${p} | Mushaf view | HIF`,
    description: `Page ${p} of the Madani mushaf, set line by line as printed.`,
    alternates: { canonical: `https://www.hif.com.ng/quran/mushaf/${p}` },
  }
}

export default async function MushafPageRoute({ params }: Props) {
  const p = parse((await params).page)
  if (!p) notFound()
  // A failure is thrown so it is never saved as the page.
  const [{ words }, surahs, startPages] = await Promise.all([getMushafPage(p), getSurahs(), getSurahStartPages()])

  const byLine = new Map<number, MushafWord[]>()
  for (const w of words) byLine.set(w.line, [...(byLine.get(w.line) ?? []), w])

  const lines: MushafLine[] = [...byLine.keys()]
    .sort((a, b) => a - b)
    .map((n) => {
      const ws = byLine.get(n)!
      // A surah starting on this line (its verse 1 begins here) gets a name banner.
      const starter = ws.find((w) => {
        const [s, a] = w.verseKey.split(":").map(Number)
        return a === 1 && !words.some((x) => x.verseKey === w.verseKey && x.line < n) && s > 0
      })
      const sid = starter ? Number(starter.verseKey.split(":")[0]) : 0
      const info = sid ? surahs.find((x) => x.number === sid) : undefined
      return {
        n,
        banner: info ? `سورة ${info.name.replace(/^سُورَةُ\s*/, "")}` : undefined,
        bismillah: !!info && info.number !== 1 && info.number !== 9,
        words: ws.map((w) => ({ text: w.text, end: w.end, key: w.verseKey })),
      }
    })

  const before: Record<number, number> = {}
  let run = 0
  for (const s of surahs) {
    before[s.number] = run
    run += s.numberOfAyahs
  }
  const first = Number(words[0].verseKey.split(":")[0])

  return (
    <main className="container mx-auto max-w-2xl px-4 py-8">
      <MushafView
        page={p}
        head={surahs.find((s) => s.number === first)?.englishName ?? ""}
        firstSurah={first}
        lines={lines}
        before={before}
        surahs={surahs.map((s) => ({ number: s.number, name: s.englishName, page: startPages[s.number] }))}
      />
    </main>
  )
}
