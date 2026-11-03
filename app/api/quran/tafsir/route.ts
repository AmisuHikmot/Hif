import { NextResponse } from "next/server"

export const revalidate = 2592000

const HOSTS = ["https://api.quran.com/api/v4", "https://api.qurancdn.com/api/qdc"]
// Ibn Kathir (abridged, English) and Tafsir Al-Muyassar (Arabic).
const SOURCES: Record<string, string> = { "169": "Ibn Kathir (abridged)", "16": "Al-Muyassar" }

const ENTITIES: Record<string, string> = { "&amp;": "&", "&lt;": "<", "&gt;": ">", "&quot;": '"', "&#39;": "'", "&nbsp;": " " }

/** Tafsir arrives as HTML; the page shows plain paragraphs only. */
function toParagraphs(html: string): string[] {
  return html
    .replace(/<\/(p|h\d|div|li)>/gi, "\n")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]*>/g, "")
    .replace(/&(amp|lt|gt|quot|#39|nbsp);/g, (m) => ENTITIES[m] ?? m)
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean)
}

export async function GET(req: Request) {
  const u = new URL(req.url)
  const surah = Number(u.searchParams.get("s"))
  const ayah = Number(u.searchParams.get("a"))
  const id = u.searchParams.get("id") ?? "169"
  if (!(id in SOURCES) || !Number.isInteger(surah) || !Number.isInteger(ayah) || surah < 1 || surah > 114 || ayah < 1 || ayah > 286) {
    return NextResponse.json({ error: "Bad request" }, { status: 400 })
  }
  for (const host of HOSTS) {
    for (let i = 0; i < 2; i++) {
      try {
        const res = await fetch(`${host}/tafsirs/${id}/by_ayah/${surah}:${ayah}`, { next: { revalidate: 2592000 } })
        if (!res.ok) throw new Error(String(res.status))
        const d = (await res.json()) as { tafsir?: { text?: string } }
        const paragraphs = toParagraphs(d.tafsir?.text ?? "")
        if (!paragraphs.length) throw new Error("empty")
        return NextResponse.json({ source: SOURCES[id], paragraphs })
      } catch {
        await new Promise((r) => setTimeout(r, 300))
      }
    }
  }
  return NextResponse.json({ error: "Tafsir could not be loaded. Please try again." }, { status: 502 })
}
