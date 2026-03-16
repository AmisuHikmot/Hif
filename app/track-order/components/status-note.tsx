"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { motion, AnimatePresence } from "framer-motion"
import { Megaphone, X, Clock } from "lucide-react"

// ── Types ──────────────────────────────────────────────────────

interface StatusNoteProps {
  note:      string
  updatedAt?: string | null  // optional timestamp of the status update
}

// ── Helpers ────────────────────────────────────────────────────

function formatUpdatedAt(isoString: string): string {
  return new Date(isoString).toLocaleDateString("en-NG", {
    day:    "numeric",
    month:  "short",
    year:   "numeric",
    hour:   "2-digit",
    minute: "2-digit",
    hour12: true,
  })
}

// ── Main Component ─────────────────────────────────────────────

export function StatusNote({ note, updatedAt }: StatusNoteProps) {
  const [isDismissed, setIsDismissed] = useState(false)

  return (
    <AnimatePresence>
      {!isDismissed && (
        <motion.div
          initial={{ opacity: 0, y: -10, height: "auto" }}
          animate={{ opacity: 1, y: 0 }}
          exit={{
            opacity: 0,
            height: 0,
            marginBottom: 0,
            transition: { duration: 0.25, ease: "easeInOut" },
          }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <Card className="overflow-hidden border-amber-200 bg-amber-50">
            {/* Top accent strip */}
            <div className="h-0.5 w-full bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400" />

            <div className="flex items-start gap-3 p-4">
              {/* Icon */}
              <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-amber-100 border border-amber-200">
                <Megaphone className="h-4 w-4 text-amber-600" />
              </div>

              {/* Content */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-amber-900">
                    Update from HIF
                  </p>
                  {/* Pulsing live dot */}
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-500" />
                  </span>
                </div>

                {/* Note text — unchanged: renders {note} directly */}
                <p className="mt-1 text-sm leading-relaxed text-amber-800">
                  {note}
                </p>

                {/* Timestamp */}
                {updatedAt && (
                  <div className="mt-2 flex items-center gap-1 text-[11px] text-amber-600/80">
                    <Clock className="h-3 w-3" />
                    {formatUpdatedAt(updatedAt)}
                  </div>
                )}
              </div>

              {/* Dismiss button */}
              <button
                onClick={() => setIsDismissed(true)}
                aria-label="Dismiss update"
                className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-amber-500 transition-colors hover:bg-amber-100 hover:text-amber-700"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
