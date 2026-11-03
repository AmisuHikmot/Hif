import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { getMushafPage, getSurahs, type MushafWord } from "@/lib/quran/api"

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
  const [{ words }, surahs] = await Promise.all([getMushafPage(p), getSurahs()])

  const lines = new Map<number, MushafWord[]>()
  for (const w of words) lines.set(w.line, [...(lines.get(w.line) ?? []), w])
  const order = [...lines.keys()].sort((a, b) => a - b)

  // A surah starting on this page gets its name banner above its first line.
  const banner = new Map<number, number>()
  for (const w of words) {
    const [s, a] = w.verseKey.split(":").map(Number)
    if (a === 1 && !banner.has(w.line) && !words.some((x) => x.verseKey === w.verseKey && x.line < w.line)) {
      banner.set(w.line, s)
    }
  }
  const first = Number(words[0].verseKey.split(":")[0])
  const head = surahs.find((s) => s.number === first)

  return (
    <main className="container mx-auto max-w-2xl px-4 py-8">
      <div className="mb-4 flex items-center justify-between text-sm text-muted-foreground">
        <Link href="/quran" className="hover:underline">
          All surahs
        </Link>
        <span>
          {head?.englishName} · page {p} of 604
        </span>
        <Link href={`/quran/${first}`} className="hover:underline">
          Listen
        </Link>
      </div>

      <div
        lang="ar"
        dir="rtl"
        className="rounded-lg border bg-card px-3 py-6 sm:px-8"
        style={{ fontFamily: "var(--font-quran), serif", fontSize: "clamp(1.1rem, 4.6vw, 1.7rem)" }}
      >
        {order.map((n) => {
          const sid = banner.get(n)
          const s = sid ? surahs.find((x) => x.number === sid) : undefined
          return (
            <div key={n}>
              {s && (
                <div className="my-3 rounded border border-primary/30 bg-primary/5 py-1 text-center text-base font-semibold">
                  سورة {s.name.replace(/^سُورَةُ\s*/, "")}
                </div>
              )}
              {s && s.number !== 1 && s.number !== 9 && (
                <div className="py-1 text-center leading-[2.3]">بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ</div>
              )}
              <div
                className="flex justify-between leading-[2.3]"
                style={{ textAlignLast: "justify" }}
              >
                {lines.get(n)!.map((w, i) => (
                  <span key={i} className={w.end ? "text-primary" : undefined}>
                    {w.text}
                  </span>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      <nav className="mt-4 flex items-center justify-between text-sm">
        {p < 604 ? (
          <Link href={`/quran/mushaf/${p + 1}`} className="rounded border px-4 py-2 hover:bg-muted">
            ← Next page
          </Link>
        ) : (
          <span />
        )}
        {p > 1 ? (
          <Link href={`/quran/mushaf/${p - 1}`} className="rounded border px-4 py-2 hover:bg-muted">
            Previous page →
          </Link>
        ) : (
          <span />
        )}
      </nav>
    </main>
  )
}
