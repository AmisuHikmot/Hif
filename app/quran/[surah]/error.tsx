"use client"

import Link from "next/link"

export default function SurahError({ reset }: { error: Error; reset: () => void }) {
  return (
    <main className="container mx-auto max-w-3xl px-4 py-10">
      <p className="mb-4 rounded-md border p-4 text-sm">
        This surah could not be loaded just now. Please try again in a moment.
      </p>
      <div className="flex gap-3">
        <button type="button" onClick={reset} className="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground">
          Try again
        </button>
        <Link href="/quran" className="rounded-md border px-4 py-2 text-sm">
          Back to the list
        </Link>
      </div>
    </main>
  )
}
