import type { Metadata } from "next"
import { getSurahs } from "@/lib/quran/api"
import BookmarksClient from "./bookmarks-client"

export const metadata: Metadata = {
  title: "Your Quran bookmarks | HIF",
  robots: { index: false },
}

export default async function BookmarksPage() {
  const surahs = await getSurahs()
  return (
    <main className="container mx-auto max-w-3xl px-4 py-10">
      <h1 className="mb-2 text-3xl font-bold tracking-tight">Your bookmarks</h1>
      <p className="mb-6 text-sm text-muted-foreground">
        Saved in this browser only. Clearing your browser data removes them. The HIF app keeps bookmarks with your account.
      </p>
      <BookmarksClient names={Object.fromEntries(surahs.map((s) => [s.number, s.englishName]))} />
    </main>
  )
}
