import type { Metadata } from "next"
import SearchClient from "./search-client"

export const metadata: Metadata = {
  title: "Search the Quran | HIF",
  description: "Search the Quran in English or Arabic and jump to the verse.",
  alternates: { canonical: "https://www.hif.com.ng/quran/search" },
}

export default function SearchPage() {
  return (
    <main className="container mx-auto max-w-3xl px-4 py-10">
      <h1 className="mb-2 text-3xl font-bold tracking-tight">Search the Quran</h1>
      <p className="mb-6 text-muted-foreground">Search the Saheeh International translation or the Arabic text.</p>
      <SearchClient />
    </main>
  )
}
