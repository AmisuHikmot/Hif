"use client"

import { useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

type Source = { type: string; label: string; note?: string; url?: string }
type Msg = { role: "user" | "model"; text: string; sources?: Source[]; error?: boolean }

const EXAMPLES = [
  "What is the meaning of Ayat al-Kursi?",
  "What does the Quran say about patience?",
  "Explain Surah Al-Ikhlas in simple words",
]

/** Shrinks a picture in the browser so it stays well under the upload limit. */
async function shrink(file: File): Promise<{ mime: string; data: string }> {
  const bmp = await createImageBitmap(file)
  const scale = Math.min(1, 1400 / Math.max(bmp.width, bmp.height))
  const c = document.createElement("canvas")
  c.width = Math.round(bmp.width * scale)
  c.height = Math.round(bmp.height * scale)
  c.getContext("2d")!.drawImage(bmp, 0, 0, c.width, c.height)
  const url = c.toDataURL("image/jpeg", 0.8)
  return { mime: "image/jpeg", data: url.split(",")[1] }
}

export default function AiChat() {
  const [image, setImage] = useState<{ mime: string; data: string; name: string } | null>(null)
  const [msgs, setMsgs] = useState<Msg[]>([])
  const [text, setText] = useState("")
  const [busy, setBusy] = useState(false)
  const [madhab, setMadhab] = useState("maliki")
  const end = useRef<HTMLDivElement>(null)

  async function send(q: string) {
    const question = q.trim() || (image ? "What does this say?" : "")
    if (!question || busy) return
    const attached = image
    setImage(null)
    const history = msgs.filter((m) => !m.error).map((m) => ({ role: m.role, text: m.text }))
    setMsgs((m) => [...m, { role: "user", text: attached ? `${question}\n[picture: ${attached.name}]` : question }])
    setText("")
    setBusy(true)
    try {
      const r = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: question, history, madhab, image: attached ? { mime: attached.mime, data: attached.data } : undefined }),
      })
      const j = await r.json()
      setMsgs((m) => [
        ...m,
        r.ok ? { role: "model", text: j.answer, sources: j.sources } : { role: "model", text: j.error ?? "Something went wrong.", error: true },
      ])
    } catch {
      setMsgs((m) => [...m, { role: "model", text: "Could not reach the assistant. Check your connection.", error: true }])
    } finally {
      setBusy(false)
      setTimeout(() => end.current?.scrollIntoView({ behavior: "smooth" }), 50)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <label className="flex items-center gap-2 text-sm">
        School of thought
        <select className="rounded border bg-background px-2 py-1" value={madhab} onChange={(e) => setMadhab(e.target.value)}>
          <option value="maliki">Maliki</option>
          <option value="hanafi">Hanafi</option>
          <option value="shafii">Shafi&apos;i</option>
          <option value="hanbali">Hanbali</option>
          <option value="all">Show all views</option>
        </select>
      </label>

      {msgs.length === 0 && (
        <div className="flex flex-wrap gap-2">
          {EXAMPLES.map((e) => (
            <Button key={e} variant="outline" size="sm" onClick={() => send(e)}>
              {e}
            </Button>
          ))}
        </div>
      )}

      <div className="flex flex-col gap-3" aria-live="polite">
        {msgs.map((m, i) => (
          <div
            key={i}
            className={`max-w-[92%] whitespace-pre-wrap rounded-lg px-4 py-3 text-sm leading-relaxed ${
              m.role === "user" ? "self-end bg-primary text-primary-foreground" : m.error ? "self-start border border-destructive" : "self-start border"
            }`}
          >
            {m.text}
            {m.sources && m.sources.length > 0 && (
              <details className="mt-3 text-xs text-muted-foreground">
                <summary className="cursor-pointer">Sources used ({m.sources.length})</summary>
                <ul className="mt-1 list-disc pl-5">
                  {m.sources.map((s, k) => (
                    <li key={k}>
                      {s.url ? (
                        <a className="underline" href={s.url} target="_blank" rel="noreferrer noopener">
                          {s.label}
                        </a>
                      ) : (
                        s.label
                      )}
                      {s.note ? ` (${s.note})` : ""}
                    </li>
                  ))}
                </ul>
              </details>
            )}
          </div>
        ))}
        {busy && <div className="self-start text-sm text-muted-foreground">Looking up the texts…</div>}
        <div ref={end} />
      </div>

      <form
        className="flex gap-2"
        onSubmit={(e) => {
          e.preventDefault()
          send(text)
        }}
      >
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          maxLength={600}
          rows={2}
          placeholder="Ask about a verse, hadith or topic…"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault()
              send(text)
            }
          }}
        />
        <label className="flex cursor-pointer items-center rounded border px-3 text-sm" title="Add a picture of text to read">
          📷
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="sr-only"
            onChange={async (e) => {
              const f = e.target.files?.[0]
              e.target.value = ""
              if (!f) return
              try {
                setImage({ ...(await shrink(f)), name: f.name.slice(0, 40) })
              } catch {
                setMsgs((m) => [...m, { role: "model", text: "Could not read that picture.", error: true }])
              }
            }}
          />
        </label>
        <Button type="submit" disabled={busy || (!text.trim() && !image)}>
          Ask
        </Button>
      </form>
      {image && <p className="text-xs">Picture attached: {image.name}. <button className="underline" onClick={() => setImage(null)}>Remove</button></p>}
      <p className="text-xs text-muted-foreground">
        AI can make mistakes. Check important points with a scholar. Your questions are not saved. Free: 20 messages and 5 pictures a day, more for HIF App Plus members.
      </p>
    </div>
  )
}
