// Bookmarks and "continue reading" live in this browser only (no account
// needed). Every read and write is guarded: private windows can block storage.

const MARKS = "hif.quran.bookmarks"
const LAST = "hif.quran.last"

export type LastRead = { href: string; label: string }

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}
function save(key: string, v: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(v))
  } catch {}
}

/** Verse keys like "2:255", newest first. */
export function getBookmarks(): string[] {
  const v = load<unknown>(MARKS, [])
  return Array.isArray(v) ? v.filter((x): x is string => typeof x === "string") : []
}

export function isBookmarked(key: string): boolean {
  return getBookmarks().includes(key)
}

/** Adds or removes a bookmark; returns whether it is now bookmarked. */
export function toggleBookmark(key: string): boolean {
  const all = getBookmarks()
  const has = all.includes(key)
  save(MARKS, has ? all.filter((k) => k !== key) : [key, ...all])
  return !has
}

export function getLastRead(): LastRead | null {
  const v = load<Partial<LastRead> | null>(LAST, null)
  return v && typeof v.href === "string" && typeof v.label === "string" ? { href: v.href, label: v.label } : null
}

export function setLastRead(v: LastRead) {
  save(LAST, v)
}
