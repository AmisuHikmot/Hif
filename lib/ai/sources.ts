import { createAdminClient } from "@/lib/supabase/admin"

/** One piece of real text handed to the model, and shown to the person. */
export type Source = {
  type: "quran" | "tafsir" | "hadith"
  ref: string
  label: string
  /** Everything the model may quote, exactly as fetched. */
  text: string
  note?: string
}

const QURAN = "https://api.quran.com/api/v4"
// 20 = Saheeh International. 169 = Ibn Kathir (abridged), 170 = as-Sa'di (English).
const TRANSLATION = 20
const TAFSIRS = [
  { id: 169, name: "Ibn Kathir (abridged)" },
  { id: 170, name: "as-Sa'di" },
]

const REF = /^(\d{1,3}):(\d{1,3})$/

export function cleanRefs(refs: unknown, max: number): string[] {
  if (!Array.isArray(refs)) return []
  const out: string[] = []
  for (const r of refs) {
    const m = typeof r === "string" ? REF.exec(r.trim()) : null
    if (!m) continue
    const s = +m[1]
    const a = +m[2]
    if (s < 1 || s > 114 || a < 1 || a > 286) continue
    const k = `${s}:${a}`
    if (!out.includes(k)) out.push(k)
    if (out.length >= max) break
  }
  return out
}

export function cleanTerms(terms: unknown, max = 3): string[] {
  if (!Array.isArray(terms)) return []
  return terms
    .filter((t): t is string => typeof t === "string")
    .map((t) => t.replace(/[^\p{L}\p{N} '-]/gu, "").trim().slice(0, 40))
    .filter((t) => t.length > 1)
    .slice(0, max)
}

const strip = (html: string) =>
  html
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#?\w+;/g, " ")
    .replace(/\s+/g, " ")
    .trim()

async function getJson(url: string) {
  const r = await fetch(url, { signal: AbortSignal.timeout(8000), next: { revalidate: 86400 } })
  if (!r.ok) throw new Error(String(r.status))
  return r.json()
}

/** The ayah itself, in Arabic (Uthmani) and English. Fails soft. */
export async function fetchAyah(key: string): Promise<Source | null> {
  try {
    const j = await getJson(`${QURAN}/verses/by_key/${key}?language=en&translations=${TRANSLATION}&fields=text_uthmani`)
    const v = j.verse
    const t = strip(v?.translations?.[0]?.text ?? "")
    if (!v?.text_uthmani || !t) return null
    return {
      type: "quran",
      ref: key,
      label: `Quran ${key}`,
      text: `Arabic: ${v.text_uthmani}\nTranslation (Saheeh International): ${t}`,
    }
  } catch {
    return null
  }
}

/** Classical commentary on one ayah, trimmed. Fails soft. */
export async function fetchTafsir(key: string, maxChars = 1500): Promise<Source[]> {
  const got = await Promise.all(
    TAFSIRS.map(async (t) => {
      try {
        const j = await getJson(`${QURAN}/tafsirs/${t.id}/by_ayah/${key}`)
        const text = strip(j?.tafsir?.text ?? "")
        if (text.length < 40) return null
        return {
          type: "tafsir" as const,
          ref: `${key}/${t.id}`,
          label: `Tafsir ${t.name} on ${key}`,
          text: text.slice(0, maxChars) + (text.length > maxChars ? " …" : ""),
        }
      } catch {
        return null
      }
    }),
  )
  return got.filter((x): x is NonNullable<typeof x> => x !== null)
}

/** Verses in the Quran that mention a theme. Fails soft. */
export async function searchQuran(term: string, size = 4): Promise<string[]> {
  try {
    const j = await getJson(`${QURAN}/search?q=${encodeURIComponent(term)}&size=${size}&language=en`)
    return ((j?.search?.results ?? []) as { verse_key?: string }[])
      .map((r) => r.verse_key ?? "")
      .filter((k) => REF.test(k))
  } catch {
    return []
  }
}

/**
 * Hadith from the foundation's own table. Includes those awaiting review but
 * says so, so the model can tell the person.
 */
export async function searchHadith(terms: string[], limit = 5): Promise<Source[]> {
  if (terms.length === 0) return []
  try {
    const or = terms.flatMap((t) => [`translation.ilike.%${t}%`, `topic.ilike.%${t}%`]).join(",")
    const { data } = await createAdminClient()
      .from("hadith")
      .select("collection, number, arabic, translation, narrator, grade, review_status, reviewer_name")
      .or(or)
      .limit(limit)
    return (data ?? []).map((h) => {
      const approved = h.review_status === "approved"
      return {
        type: "hadith" as const,
        ref: `${h.collection} ${h.number}`,
        label: `Hadith: ${h.collection} ${h.number}`,
        text:
          `Arabic: ${h.arabic ?? ""}\nTranslation: ${h.translation ?? ""}` +
          (h.narrator ? `\nNarrator: ${h.narrator}` : "") +
          (h.grade ? `\nGrade (as recorded): ${h.grade}` : "\nGrade: not recorded"),
        note: approved ? (h.reviewer_name ? `reviewed by ${h.reviewer_name}` : "reviewed") : "pending board review",
      }
    })
  } catch {
    return []
  }
}

/** Renders sources in the form the answer prompt expects. */
export function renderSources(sources: Source[], maxChars = 22000): string {
  let used = 0
  const blocks: string[] = []
  for (const s of sources) {
    const b = `<source type="${s.type}" ref="${s.label}"${s.note ? ` status="${s.note}"` : ""}>\n${s.text}\n</source>`
    if (used + b.length > maxChars) break
    used += b.length
    blocks.push(b)
  }
  return blocks.join("\n\n")
}
