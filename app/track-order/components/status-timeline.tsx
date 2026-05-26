"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import { ShoppingBag, ShieldCheck, Package, Tag, Truck, PartyPopper, XCircle, Clock, Info } from "lucide-react"

interface StatusHistoryEntry {
  status: string
  note: string | null
  changed_at: string
}

interface StatusTimelineProps {
  history: StatusHistoryEntry[]
}

type StatusConfigValue = { label: string; icon: React.ReactNode; color: string; lineColor: string }

const STATUS_CONFIG: { [key: string]: StatusConfigValue } = {
  pending: { label: "Order Placed", icon: <ShoppingBag className="h-4 w-4" />, color: "border-amber-200 bg-amber-50 text-amber-700", lineColor: "bg-amber-300" },
  processing: { label: "Payment Confirmed", icon: <ShieldCheck className="h-4 w-4" />, color: "border-blue-200 bg-blue-50 text-blue-700", lineColor: "bg-blue-300" },
  ready_for_dispatch: { label: "Order Processing", icon: <Package className="h-4 w-4" />, color: "border-indigo-200 bg-indigo-50 text-indigo-700", lineColor: "bg-indigo-300" },
  out_for_delivery: { label: "Out for Delivery", icon: <Truck className="h-4 w-4" />, color: "border-purple-200 bg-purple-50 text-purple-700", lineColor: "bg-purple-300" },
  delivered: { label: "Delivered", icon: <PartyPopper className="h-4 w-4" />, color: "border-emerald-200 bg-emerald-50 text-emerald-700", lineColor: "bg-emerald-400" },
  cancelled: { label: "Cancelled", icon: <XCircle className="h-4 w-4" />, color: "border-red-200 bg-red-50 text-red-700", lineColor: "bg-red-300" },
}

function getStatusLabel(status: string): string {
  return status.split("_").map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")
}

function formatEntryDate(isoString: string): string {
  return new Date(isoString).toLocaleDateString("en-NG", { weekday: "long", year: "numeric", month: "long", day: "numeric" })
}

function formatEntryTime(isoString: string): string {
  return new Date(isoString).toLocaleTimeString("en-NG", { hour: "2-digit", minute: "2-digit", hour12: true })
}

function TimelineEntry({ entry, index, isFirst, isLast, total }: { entry: StatusHistoryEntry; index: number; isFirst: boolean; isLast: boolean; total: number }) {
  const config = STATUS_CONFIG[entry.status] ?? { label: getStatusLabel(entry.status), icon: <Info className="h-4 w-4" />, color: "border-gray-200 bg-gray-50 text-gray-600", lineColor: "bg-gray-300" }
  const label = config.label || getStatusLabel(entry.status)
  const formattedDate = formatEntryDate(entry.changed_at)
  const formattedTime = formatEntryTime(entry.changed_at)

  return (
    <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.08, duration: 0.3 }} className="flex gap-4">
      <div className="flex flex-col items-center">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: index * 0.08 + 0.1, type: "spring", stiffness: 300, damping: 20 }} className={`relative z-10 flex h-9 w-9 items-center justify-center rounded-full border-2 ${config.color}`}>
          {isFirst && <span className="absolute inset-0 rounded-full animate-ping opacity-30 bg-current" />}
          {config.icon}
        </motion.div>
        {!isLast && (
          <motion.div initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ delay: index * 0.08 + 0.2, duration: 0.4, ease: "easeOut" }} style={{ transformOrigin: "top" }} className={`mt-1 w-0.5 flex-1 opacity-40 ${config.lineColor}`} aria-hidden="true" />
        )}
      </div>
      <div className={`flex-1 pb-6 ${isLast ? "pb-0" : ""}`}>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline" className={`flex items-center gap-1.5 text-xs font-medium ${config.color}`}>
            {config.icon}{label}
          </Badge>
          {isFirst && <Badge variant="outline" className="border-emerald-200 bg-emerald-50 text-[10px] text-emerald-700">Latest</Badge>}
          <span className="ml-auto text-[10px] text-muted-foreground/50">{total - index} of {total}</span>
        </div>
        {entry.note && (
          <div className="mt-2 rounded-lg border border-amber-200/60 bg-amber-50/50 px-3 py-2">
            <p className="text-sm leading-relaxed text-amber-900">&quot;{entry.note}&quot;</p>
          </div>
        )}
        <div className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
          <Clock className="h-3 w-3 flex-shrink-0" />
          <span>{formattedDate}</span>
          <span className="text-muted-foreground/40">·</span>
          <span>{formattedTime}</span>
        </div>
      </div>
    </motion.div>
  )
}

export function StatusTimeline({ history }: StatusTimelineProps) {
  if (!history || history.length === 0) return null

  const sortedHistory = [...history].sort((a, b) => new Date(b.changed_at).getTime() - new Date(a.changed_at).getTime())

  return (
    <Card className="overflow-hidden">
      <CardHeader className="border-b border-border bg-muted/30 px-6 py-4">
        <CardTitle className="flex items-center justify-between text-base font-semibold">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />Order Timeline
          </div>
          <span className="text-xs font-normal text-muted-foreground">{sortedHistory.length} {sortedHistory.length === 1 ? "update" : "updates"}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 sm:p-6">
        <div className="space-y-0">
          {sortedHistory.map((entry, index) => (
            <TimelineEntry key={`${entry.status}-${entry.changed_at}`} entry={entry} index={index} isFirst={index === 0} isLast={index === sortedHistory.length - 1} total={sortedHistory.length} />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
