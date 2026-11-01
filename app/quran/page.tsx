import type { Metadata } from "next"
import { getSurahs } from "@/lib/quran/api"
import SurahList from "./surah-list"

export const revalidate = 86400

export const metadata: Metadata = {
  title: "Read and listen to the Quran | Hamduk Islamic Foundation",
  description:
    "Read the Quran with the Saheeh International translation and listen verse by verse in the voice of five reciters. Free, no account needed.",
  alternates: { canonical: "https://www.hif.com.ng/quran" },
}

export default async function QuranPage() {
  let surahs: Awaited<ReturnType<typeof getSurahs>> = []
  let failed = false
  try {
    surahs = await getSurahs()
  } catch {
    failed = true
  }
  return (
    <main className="container mx-auto max-w-5xl px-4 py-10">
      <h1 className="mb-2 text-3xl font-bold tracking-tight">The Quran</h1>
      <p className="mb-6 max-w-2xl text-muted-foreground">
        Read with the Saheeh International translation and listen verse by verse. Free for everyone, no account needed.
        For offline reading, word-by-word following and more reciters, get the HIF app.
      </p>
      {failed ? (
        <p className="rounded-md border p-4 text-sm">The Quran service could not be reached. Please try again in a moment.</p>
      ) : (
        <SurahList surahs={surahs} />
      )}
      <p className="mt-10 text-xs text-muted-foreground">
        Arabic text and translation come from Al-Quran Cloud (Tanzil text; Saheeh International). Audio from the Islamic
        Network CDN. Awaiting review by the HIF Shariah Board.
      </p>
    </main>
  )
}
