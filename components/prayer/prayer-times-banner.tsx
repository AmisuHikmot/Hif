"use client"

import { useEffect, useMemo, useState } from "react"

const order = ["fajr", "dhuhr", "asr", "maghrib", "isha"] as const
const labels: Record<string, string> = {
  fajr: "Fajr",
  dhuhr: "Dhuhr",
  asr: "Asr",
  maghrib: "Maghrib",
  isha: "Isha",
}

export function PrayerTimesBanner({ compact = false }: { compact?: boolean }) {
  const [times, setTimes] = useState<Record<string, string> | null>(null)
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    fetch("/api/prayer-times")
      .then((response) => response.json())
      .then((data) => setTimes(data.prayerTimes))
      .catch(() => setTimes(null))
  }, [])

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60_000)
    return () => clearInterval(id)
  }, [])

  const state = useMemo(() => {
    if (!times) return null
    const today = now.toISOString().split("T")[0]
    const entries = order.map((key) => ({ key, date: new Date(`${today}T${times[key] || "00:00"}:00`) }))
    const currentIndex = Math.max(
      0,
      entries.reduce((last, entry, index) => (now >= entry.date ? index : last), -1),
    )
    const current = entries[currentIndex] || entries[0]
    const next = entries[currentIndex + 1] || entries[0]
    const nextDate = currentIndex + 1 < entries.length ? next.date : new Date(new Date(`${today}T${next.date.toTimeString().slice(0, 5)}:00`).getTime() + 24 * 60 * 60 * 1000)
    const span = nextDate.getTime() - current.date.getTime()
    const elapsed = now.getTime() - current.date.getTime()
    const progress = Math.max(0, Math.min(100, (elapsed / span) * 100))
    return { current, next, progress }
  }, [times, now])

  if (!times || !state) return null

  if (compact) {
    return (
      <div className="flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs text-emerald-900">
        <div className="relative h-6 w-6 rounded-full border-2 border-emerald-200">
          <div
            className="absolute inset-0 rounded-full border-2 border-transparent border-t-emerald-600"
            style={{ transform: `rotate(${state.progress * 3.6}deg)` }}
          />
          <div className="absolute inset-1 rounded-full bg-emerald-600/10" />
        </div>
        <span className="hidden lg:inline">{labels[state.current.key]}</span>
        <span className="font-semibold">{times[state.next.key]}</span>
      </div>
    )
  }

  return (
    <div className="mb-6 rounded-lg border border-white/20 bg-white/10 p-3 text-white backdrop-blur">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-white/70">Today&apos;s Salah Times</p>
          <p className="font-semibold">
            Current: {labels[state.current.key]} · Next: {labels[state.next.key]} {times[state.next.key]}
          </p>
        </div>
        <div className="grid grid-cols-5 gap-2 text-center text-xs sm:min-w-[420px]">
          {order.map((key) => (
            <div key={key} className="rounded-md bg-white/10 px-2 py-1">
              <p className="text-white/70">{labels[key]}</p>
              <p className="font-semibold">{times[key]}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/15">
        <div className="h-full rounded-full bg-amber-300" style={{ width: `${state.progress}%` }} />
      </div>
    </div>
  )
}
