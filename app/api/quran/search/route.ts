import { NextResponse } from "next/server"

export const revalidate = 86400

const HOSTS = ["https://api.qurancdn.com/api/qdc", "https://api.quran.com/api/qdc"]

type Raw = {
  result?: { verses?: { verse_key: string; words: { text?: string; char_type?: string }[]; translations?: { text: string }[] }[] }
  pagination?: { total_records?: number; total_pages?: number; current_page?: number }
}

export async function GET(req: Request) {
  const u = new URL(req.url)
  const q = (u.searchParams.get("q") ?? "").trim().slice(0, 100)
  const page = Math.min(Math.max(Number(u.searchParams.get("page")) || 1, 1), 200)
  if (q.length < 2) return NextResponse.json({ error: "Type at least two letters." }, { status: 400 })

  const qs = `query=${encodeURIComponent(q)}&size=10&page=${page}&language=en&translations=20`
  for (const host of HOSTS) {
    for (let i = 0; i < 2; i++) {
      try {
        const res = await fetch(`${host}/search?${qs}`, { next: { revalidate: 86400 } })
        if (!res.ok) throw new Error(String(res.status))
        const d = (await res.json()) as Raw
        const results = (d.result?.verses ?? []).map((v) => ({
          key: v.verse_key,
          arabic: v.words.filter((w) => w.char_type !== "end").map((w) => w.text ?? "").join(" "),
          // Matches arrive wrapped in <em>; the page splits on them, never injects HTML.
          translation: (v.translations?.[0]?.text ?? "").replace(/<(?!\/?em>)[^>]*>/g, ""),
        }))
        return NextResponse.json({
          results,
          total: d.pagination?.total_records ?? results.length,
          pages: d.pagination?.total_pages ?? 1,
          page,
        })
      } catch {
        await new Promise((r) => setTimeout(r, 300))
      }
    }
  }
  return NextResponse.json({ error: "Search is unavailable. Please try again." }, { status: 502 })
}
