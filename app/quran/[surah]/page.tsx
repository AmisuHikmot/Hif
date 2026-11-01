import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { getSurah, getSurahs, splitBismillah } from "@/lib/quran/api"
import QuranReader from "./quran-reader"

export const revalidate = 604800

type Props = { params: Promise<{ surah: string }> }

function parse(raw: string): number | null {
  const n = Number(raw)
  return Number.isInteger(n) && n >= 1 && n <= 114 ? n : null
}

// Surahs are built on first visit and then kept for a week. They are not all
// built at deploy time: 114 requests at once make the data service throttle.
export const dynamicParams = true

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const n = parse((await params).surah)
  if (!n) return {}
  try {
    const surahs = await getSurahs()
    const s = surahs.find((x) => x.number === n)
    if (!s) return {}
    return {
      title: `Surah ${s.englishName} (${s.englishNameTranslation}) | Read and listen | HIF`,
      description: `Read Surah ${s.englishName}, ${s.numberOfAyahs} verses, with the Saheeh International translation and listen verse by verse.`,
      alternates: { canonical: `https://www.hif.com.ng/quran/${n}` },
    }
  } catch {
    return { title: `Surah ${n} | HIF` }
  }
}

export default async function SurahPage({ params }: Props) {
  const n = parse((await params).surah)
  if (!n) notFound()
  // A failure is thrown (not rendered) so it is never kept as the saved page.
  const data = await getSurah(n)
  const { info, ayahs } = data
  const first = ayahs[0] ? splitBismillah(n, ayahs[0].arabic) : { bismillah: false, text: "" }
  const view = ayahs.map((a, i) => (i === 0 ? { ...a, arabic: first.text } : a))
  return (
    <main className="container mx-auto max-w-3xl px-4 pb-40 pt-8">
      <nav className="mb-4 text-sm">
        <Link href="/quran" className="text-muted-foreground hover:underline">
          ← All surahs
        </Link>
      </nav>
      <header className="mb-6 text-center">
        <p lang="ar" dir="rtl" className="text-4xl" style={{ fontFamily: "var(--font-quran), serif" }}>
          {info.name}
        </p>
        <h1 className="mt-2 text-2xl font-bold">
          {info.number}. {info.englishName}
        </h1>
        <p className="text-sm text-muted-foreground">
          {info.englishNameTranslation} · {info.numberOfAyahs} verses · {info.revelationType}
        </p>
      </header>
      <QuranReader surah={n} bismillah={first.bismillah} ayahs={view} prev={n > 1 ? n - 1 : null} next={n < 114 ? n + 1 : null} />
      <p className="mt-10 text-xs text-muted-foreground">
        Arabic text and Saheeh International translation from Al-Quran Cloud. Awaiting review by the HIF Shariah Board. Spotted
        a mistake? Tell us at hif.com.ng/contact-us.
      </p>
    </main>
  )
}
