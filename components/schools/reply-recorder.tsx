"use client"

import { useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { attachReply, startReplyUpload } from "@/lib/schools/recitations"

const MAX = 120

/** Record a spoken reply (2 minutes at most), listen back, then send. */
export default function ReplyRecorder({ id }: { id: string }) {
  const rec = useRef<MediaRecorder | null>(null)
  const chunks = useRef<Blob[]>([])
  const timer = useRef<ReturnType<typeof setInterval> | null>(null)
  const [state, setState] = useState<"idle" | "recording" | "review" | "sending" | "sent">("idle")
  const [secs, setSecs] = useState(0)
  const [url, setUrl] = useState<string | null>(null)
  const [blob, setBlob] = useState<Blob | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function start() {
    setError(null)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const r = new MediaRecorder(stream)
      chunks.current = []
      r.ondataavailable = (e) => e.data.size && chunks.current.push(e.data)
      r.onstop = () => {
        stream.getTracks().forEach((t) => t.stop())
        const b = new Blob(chunks.current, { type: r.mimeType || "audio/webm" })
        setBlob(b)
        setUrl(URL.createObjectURL(b))
        setState("review")
      }
      rec.current = r
      r.start()
      setSecs(0)
      setState("recording")
      timer.current = setInterval(() => {
        setSecs((s) => {
          if (s + 1 >= MAX) stop()
          return s + 1
        })
      }, 1000)
    } catch {
      setError("The microphone could not start. Allow it for this site and try again.")
    }
  }

  function stop() {
    if (timer.current) clearInterval(timer.current)
    if (rec.current && rec.current.state !== "inactive") rec.current.stop()
  }

  async function send() {
    if (!blob) return
    setState("sending")
    setError(null)
    try {
      const { path, token } = await startReplyUpload(id)
      const { error: upErr } = await createClient().storage.from("recitations").uploadToSignedUrl(path, token, blob, { contentType: blob.type || "audio/webm" })
      if (upErr) throw upErr
      await attachReply(id, path, Math.min(MAX, Math.max(1, secs)))
      setState("sent")
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not send the reply")
      setState("review")
    }
  }

  if (state === "sent") return <p className="text-sm text-green-700">Voice reply sent.</p>
  return (
    <div className="space-y-2 text-sm">
      {state === "idle" && (
        <Button type="button" size="sm" variant="outline" onClick={start}>
          Record a voice reply
        </Button>
      )}
      {state === "recording" && (
        <div className="flex items-center gap-3">
          <span className="text-red-600">● {secs}s of {MAX}s</span>
          <Button type="button" size="sm" onClick={stop}>
            Stop
          </Button>
        </div>
      )}
      {(state === "review" || state === "sending") && url && (
        <div className="flex flex-wrap items-center gap-3">
          <audio src={url} controls className="h-9" />
          <Button type="button" size="sm" onClick={send} disabled={state === "sending"}>
            {state === "sending" ? "Sending…" : "Send reply"}
          </Button>
          <Button type="button" size="sm" variant="outline" disabled={state === "sending"} onClick={() => { setUrl(null); setBlob(null); setState("idle") }}>
            Record again
          </Button>
        </div>
      )}
      {error && <p className="text-red-600">{error}</p>}
    </div>
  )
}
