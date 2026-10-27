import { createHash, randomInt } from "node:crypto"

export type RosterRow = {
  line: number
  className: string
  first: string
  last: string
  role: "student" | "teacher"
  email: string
}
export type RosterError = { line: number; message: string }

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/** Splits one line on tabs (pasted from a spreadsheet) or commas, honouring "quoted, cells". */
function cells(line: string): string[] {
  if (line.includes("\t")) return line.split("\t").map((c) => c.trim())
  const out: string[] = []
  let cur = ""
  let quoted = false
  for (const ch of line) {
    if (ch === '"') quoted = !quoted
    else if (ch === "," && !quoted) {
      out.push(cur.trim())
      cur = ""
    } else cur += ch
  }
  out.push(cur.trim())
  return out
}

/**
 * HIF's one-sheet template: class, first name, last name, role, email.
 * For a pupil the email is the guardian's (optional); for a teacher it is their own.
 */
export function parseRoster(text: string): { rows: RosterRow[]; errors: RosterError[] } {
  const rows: RosterRow[] = []
  const errors: RosterError[] = []
  const seen = new Set<string>()
  const lines = text.split(/\r?\n/)
  lines.forEach((raw, i) => {
    if (!raw.trim()) return
    const c = cells(raw)
    if (i === 0 && /^class$/i.test(c[0] ?? "")) return // header row
    const line = i + 1
    const [className = "", first = "", last = "", roleRaw = "", email = ""] = c
    const role = roleRaw.toLowerCase()
    if (!className || className.length > 60) return void errors.push({ line, message: "Class is missing or too long" })
    if (!first || !last || first.length > 60 || last.length > 60)
      return void errors.push({ line, message: "First and last name are both needed" })
    if (role !== "student" && role !== "teacher")
      return void errors.push({ line, message: `Role must be student or teacher, not "${roleRaw}"` })
    if (role === "teacher" && !EMAIL.test(email)) return void errors.push({ line, message: "A teacher needs a valid email" })
    if (email && !EMAIL.test(email)) return void errors.push({ line, message: `"${email}" is not a valid email` })
    const key = [className, first, last, role, email].join("|").toLowerCase()
    if (seen.has(key)) return void errors.push({ line, message: "Duplicate of an earlier row" })
    seen.add(key)
    rows.push({ line, className, first, last, role, email: email.toLowerCase() })
  })
  return { rows, errors }
}

/** Stable across re-imports (and class changes): names plus guardian email. */
export function rosterKey(r: Pick<RosterRow, "first" | "last" | "email">): string {
  return createHash("sha256")
    .update([r.first, r.last, r.email].join("|").toLowerCase().replace(/\s+/g, " "))
    .digest("hex")
    .slice(0, 24)
}

const ascii = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "")

/** first.last.xxx, unique across HIF; the caller retries on a clash. */
export function makeUsername(first: string, last: string): string {
  const letters = "abcdefghjkmnpqrstuvwxyz"
  const tail = Array.from({ length: 3 }, () => letters[randomInt(letters.length)]).join("")
  return `${ascii(first) || "pupil"}.${ascii(last) || "x"}.${tail}`
}

/** Managed accounts have no real mailbox; this address is never emailed. */
export const pupilEmail = (username: string) => `${username.toLowerCase()}@pupils.hif.com.ng`

const WORDS = (
  "amber apple arrow badge baker beach berry bird blue boat bread brick brook cabin camel candle cedar chair " +
  "cherry cloud clover coast coral crane daisy delta dove eagle earth ember falcon field finch flame forest fox " +
  "garden ginger glade grape green grove harbor hazel heron hill honey iris island ivory jade jasmine kettle " +
  "kite lake lamp lantern leaf lemon lily lotus maple meadow melon mint moon moss nest oasis olive orange " +
  "otter palm pearl pebble pine plum pond quill rabbit rain reed river robin rose sage sand shell silver sky " +
  "snow sparrow spring star stone stream sun swan thyme tide tulip valley violet walnut wave willow wind wren"
).split(" ")

/** Three words and a two-digit number, easy to read off a printed slip. */
export function makePassphrase(): string {
  const w = () => WORDS[randomInt(WORDS.length)]
  return `${w()}-${w()}-${w()}-${String(randomInt(10, 100))}`
}
