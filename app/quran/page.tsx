import type { Metadata } from "next"
import { getSurahs } from "@/lib/quran/api"
import SurahList from "./surah-list"

export const revalidate = 86400

export const metadata: Metadata = {
  title: "Read and listen to the Quran | Hamduk Islamic Foundation",
  description:
    "Read the Quran with the Saheeh International translation and listen verse by verse in the voice of 23 reciters. Free, no account needed.",
  alternates: { canonical: "https://www.hif.com.ng/quran" },
}

export default async function QuranPage() {
  // A failure is thrown so it is never kept as the saved page.
  const surahs = await getSurahs()
  return (
    <main className="container mx-auto max-w-5xl px-4 py-10">
      <h1 className="mb-2 text-3xl font-bold tracking-tight">The Quran</h1>
      <p className="mb-6 max-w-2xl text-muted-foreground">
        Read with the Saheeh International translation and listen verse by verse. Free for everyone, no account needed.
        For offline reading, word-by-word following and more reciters, get the HIF app.
      </p>
      <SurahList surahs={surahs} />
      <p className="mt-10 text-xs text-muted-foreground">
        Arabic text and translation come from Al-Quran Cloud (Tanzil text; Saheeh International). Audio from the Islamic
        Network CDN, Tarteel (via QUL) and the EveryAyah mirror at QuranicAudio.com. Awaiting review by the HIF Shariah Board.
      </p>
    </main>
  )
}
