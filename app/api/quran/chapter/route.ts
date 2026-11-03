import { NextResponse } from "next/server"

// One continuous recording of a whole surah, with the time each verse starts
// and ends, so the site can play without a break between verses (this is how
// Quran.com plays). Data comes from the Quran.com content API.

export const revalidate = 2592000 // 30 days: recordings do not change

const ALLOWED_RECITERS = new Set([2, 3, 4, 5, 6, 7, 9, 10, 97, 161])

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const reciter = Number(searchParams.get("reciter"))
  const chapter = Number(searchParams.get("chapter"))
  if (!ALLOWED_RECITERS.has(reciter) || !Number.isInteger(chapter) || chapter < 1 || chapter > 114) {
    return NextResponse.json({ error: "Unknown reciter or surah" }, { status: 400 })
  }
  let lastStatus = 0
  for (let attempt = 0; attempt < 3; attempt++) {
    if (attempt) await new Promise((r) => setTimeout(r, 500 * 2 ** attempt))
    try {
      const res = await fetch(`https://api.quran.com/api/v4/chapter_recitations/${reciter}/${chapter}?segments=true`, {
        next: { revalidate },
      })
      lastStatus = res.status
      if (!res.ok) {
        if (res.status === 429 || res.status >= 500) continue
        break
      }
      const body = (await res.json()) as {
        audio_file?: { audio_url?: string; timestamps?: { verse_key: string; timestamp_from: number; timestamp_to: number }[] }
      }
      const f = body.audio_file
      if (!f?.audio_url || !f.timestamps?.length) break
      const verses = f.timestamps
        .map((t) => ({ n: Number(t.verse_key.split(":")[1]), from: t.timestamp_from, to: t.timestamp_to }))
        .filter((v) => Number.isInteger(v.n) && v.to > v.from)
      if (!verses.length) break
      return NextResponse.json(
        { audioUrl: f.audio_url, verses },
        { headers: { "Cache-Control": "public, s-maxage=2592000, stale-while-revalidate=86400" } },
      )
    } catch {
      lastStatus = 0
    }
  }
  return NextResponse.json({ error: `Recording unavailable (${lastStatus})` }, { status: 502 })
}
