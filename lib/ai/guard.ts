/**
 * Post-checks on a model answer. The prompt tells the model to copy Arabic
 * scripture only from its sources; this makes sure it did.
 */

const MARKS = /[ً-ٰٟـۖ-ۭ‌-‏]/g

/** Arabic letters only, with common spelling variants merged. */
export function foldArabic(s: string): string {
  return s
    .replace(MARKS, "")
    .replace(/[أإآٱ]/g, "ا")
    .replace(/ى/g, "ي")
    .replace(/ة/g, "ه")
    .replace(/[^ء-ي]/g, "")
}

const RUN = /[؀-ۿ][؀-ۿ\sً-ٰٟۖ-ۭ]{10,}/g

/**
 * Finds Arabic passages in [answer] (long enough to be a verse or hadith,
 * not a lone word) that do not appear in [sourceText].
 */
export function unverifiedArabic(answer: string, sourceText: string): string[] {
  const haystack = foldArabic(sourceText)
  const bad: string[] = []
  for (const m of answer.match(RUN) ?? []) {
    const f = foldArabic(m)
    if (f.length >= 12 && !haystack.includes(f)) bad.push(m.trim())
  }
  return bad
}

/** Removes the given passages from [answer]. */
export function removeArabic(answer: string, bad: string[]): string {
  let out = answer
  for (const b of bad) out = out.split(b).join("[Arabic removed: could not be checked against the sources]")
  return out
}

export const FOOTER = "AI-generated study aid, not a ruling. Awaiting board review."

/** Makes sure the required last line is present exactly once, at the end. */
export function withFooter(answer: string): string {
  const body = answer.replace(FOOTER, "").trim()
  return `${body}\n\n${FOOTER}`
}
