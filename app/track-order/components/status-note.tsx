"use client"

import { Card } from "@/components/ui/card"
import { AlertCircle, X } from "lucide-react"
import { useState } from "react"

interface StatusNoteProps {
  note: string
}

export function StatusNote({ note }: StatusNoteProps) {
  const [isDismissed, setIsDismissed] = useState(false)

  if (isDismissed) return null

  return (
    <Card className="p-4 bg-amber-50 border-amber-200">
      <div className="flex gap-3 items-start">
        <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="font-medium text-amber-900">Update from HIF</p>
          <p className="text-sm text-amber-800 mt-1">{note}</p>
        </div>
        <button
          onClick={() => setIsDismissed(true)}
          className="text-amber-600 hover:text-amber-700 flex-shrink-0"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </Card>
  )
}
