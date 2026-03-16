"use client"

import { Card } from "@/components/ui/card"

const STATUS_ICONS: { [key: string]: string } = {
  pending: "🛒",
  processing: "📦",
  ready_for_dispatch: "📦",
  out_for_delivery: "🚚",
  delivered: "✅",
  cancelled: "❌",
}

interface StatusTimelineProps {
  history: any[]
}

export function StatusTimeline({ history }: StatusTimelineProps) {
  if (!history || history.length === 0) {
    return null
  }

  // Sort by changed_at descending (most recent first)
  const sortedHistory = [...history].sort(
    (a, b) => new Date(b.changed_at).getTime() - new Date(a.changed_at).getTime()
  )

  return (
    <Card className="p-6 sm:p-8">
      <h3 className="text-xl font-bold mb-6">Order Timeline</h3>
      <div className="space-y-6">
        {sortedHistory.map((entry, index) => {
          const date = new Date(entry.changed_at)
          const formattedDate = date.toLocaleDateString("en-NG", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })
          const formattedTime = date.toLocaleTimeString("en-NG", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          })

          const statusLabel = entry.status
            .split("_")
            .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ")

          const icon = STATUS_ICONS[entry.status] || "ℹ️"

          return (
            <div key={index} className="flex gap-4 pb-6 border-b last:border-b-0 last:pb-0">
              <div className="text-2xl flex-shrink-0">{icon}</div>
              <div className="flex-1">
                <p className="font-semibold text-foreground">{statusLabel}</p>
                {entry.note && (
                  <p className="text-sm text-muted-foreground mt-1">"{entry.note}"</p>
                )}
                <p className="text-xs text-muted-foreground mt-2">
                  {formattedDate} at {formattedTime}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </Card>
  )
}
