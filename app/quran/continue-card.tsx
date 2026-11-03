"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { getLastRead, type LastRead } from "@/lib/quran/bookmarks"

/** Offers to pick up where this browser last stopped reading or listening. */
export default function ContinueCard() {
  const [last, setLast] = useState<LastRead | null>(null)
  useEffect(() => setLast(getLastRead()), [])
  if (!last) return null
  return (
    <Link href={last.href} className="mb-4 flex items-center justify-between rounded-xl border border-primary/30 bg-primary/5 p-4 text-sm hover:bg-primary/10">
      <span>
        <span className="block text-xs text-muted-foreground">Continue where you left off</span>
        <span className="font-medium">{last.label}</span>
      </span>
      <span aria-hidden>→</span>
    </Link>
  )
}
