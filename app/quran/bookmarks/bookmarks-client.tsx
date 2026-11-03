"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { getBookmarks, toggleBookmark } from "@/lib/quran/bookmarks"

export default function BookmarksClient({ names }: { names: Record<number, string> }) {
  const [marks, setMarks] = useState<string[] | null>(null)
  useEffect(() => setMarks(getBookmarks()), [])

  if (!marks) return null
  if (!marks.length) return <p className="text-muted-foreground">No bookmarks yet. Tap the bookmark icon beside a verse to save it.</p>
  return (
    <ul className="divide-y rounded-lg border">
      {marks.map((k) => {
        const [s, a] = k.split(":")
        return (
          <li key={k} className="flex items-center justify-between gap-3 p-4">
            <Link href={`/quran/${s}#ayah-${a}`} className="font-medium hover:underline">
              {names[Number(s)] ?? `Surah ${s}`} · verse {a}
            </Link>
            <button
              type="button"
              className="text-sm text-muted-foreground underline"
              onClick={() => {
                toggleBookmark(k)
                setMarks(getBookmarks())
              }}
            >
              Remove
            </button>
          </li>
        )
      })}
    </ul>
  )
}
