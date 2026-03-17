"use client"

import { useMemo } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { motion, AnimatePresence } from "framer-motion"
import { ShoppingBag, ShieldCheck, Package, Tag, Truck, PartyPopper, XCircle, Phone, Mail, MessageCircle, Check } from "lucide-react"
import type { TrackingOrder } from "../track-order-client"

interface OrderTrackerProps {
  order: TrackingOrder
}

type StepState = "completed" | "active" | "pending"

const STEPS = [
  { id: "pending", label: "Order Placed", icon: ShoppingBag, subtitle: "We have received your order" },
  { id: "processing", label: "Payment Confirmed", icon: ShieldCheck, subtitle: "Your payment has been verified" },
  { id: "ready_for_dispatch", label: "Order Processing", icon: Package, subtitle: "We are preparing your items" },
  { id: "out_for_delivery", label: "Ready for Dispatch", icon: Tag, subtitle: "Your order is packed and ready to go" },
  { id: "delivered", label: "Delivered", icon: PartyPopper, subtitle: "Your order has been delivered. Enjoy!" },
] as const

function formatStepTime(isoString: string): string {
  return new Date(isoString).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" }) + " · " + new Date(isoString).toLocaleTimeString("en-NG", { hour: "2-digit", minute: "2-digit", hour12: true })
}

function PulseRing() {
  return (
    <>
      <motion.span className="absolute inset-0 rounded-full bg-amber-400/30" animate={{ scale: [1, 1.6], opacity: [0.6, 0] }} transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }} />
      <motion.span className="absolute inset-0 rounded-full bg-amber-400/20" animate={{ scale: [1, 1.9], opacity: [0.4, 0] }} transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut", delay: 0.4 }} />
    </>
  )
}

function DesktopStep({ step, state, timestamp, stepIndex, totalSteps }: { step: (typeof STEPS)[number]; state: StepState; timestamp: string | null; stepIndex: number; totalSteps: number }) {
  const Icon = step.icon
  const isCompleted = state === "completed"
  const isActive = state === "active"
  const isPending = state === "pending"
  const isLast = stepIndex === totalSteps - 1

  return (
    <div className="relative flex flex-1 flex-col items-center">
      {stepIndex > 0 && (
        <div className="absolute left-0 right-1/2 top-5 h-0.5 -translate-y-1/2">
          <motion.div className={`h-full ${isCompleted || isActive ? "bg-emerald-500" : ""}`} initial={{ scaleX: 0 }} animate={{ scaleX: isCompleted || isActive ? 1 : 0 }} transition={{ duration: 0.5, delay: stepIndex * 0.15, ease: "easeOut" }} style={{ transformOrigin: "left" }} />
          {!isCompleted && !isActive && <div className="h-full border-t-2 border-dashed border-muted-foreground/25" />}
        </div>
      )}
      {!isLast && (
        <div className="absolute left-1/2 right-0 top-5 h-0.5 -translate-y-1/2">
          <motion.div className={`h-full ${isCompleted ? "bg-emerald-500" : ""}`} initial={{ scaleX: 0 }} animate={{ scaleX: isCompleted ? 1 : 0 }} transition={{ duration: 0.5, delay: stepIndex * 0.15 + 0.1, ease: "easeOut" }} style={{ transformOrigin: "left" }} />
          {!isCompleted && <div className="h-full border-t-2 border-dashed border-muted-foreground/25" />}
        </div>
      )}
      <motion.div className="relative z-10 mb-3" initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={isActive ? { type: "spring", stiffness: 300, damping: 18, delay: stepIndex * 0.15 } : { duration: 0.3, delay: stepIndex * 0.12 }}>
        <div className="relative flex h-10 w-10 items-center justify-center">
          {isActive && <PulseRing />}
          <div className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors ${isCompleted ? "border-emerald-500 bg-emerald-500" : isActive ? "border-amber-500 bg-amber-500" : "border-muted bg-background"}`}>
            {isCompleted ? <Check className="h-5 w-5 text-white" strokeWidth={3} /> : <Icon className={`h-5 w-5 ${isActive ? "text-white" : "text-muted-foreground/40"}`} />}
          </div>
        </div>
      </motion.div>
      <motion.div className="text-center" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: stepIndex * 0.12 + 0.1 }}>
        <p className={`text-xs font-semibold leading-tight ${isPending ? "text-muted-foreground/50" : "text-foreground"}`}>{step.label}</p>
        {isActive && <Badge className="mt-1.5 border-amber-200 bg-amber-50 px-2 py-0 text-[10px] text-amber-700">Current</Badge>}
        {timestamp && <p className="mt-1 text-[10px] leading-tight text-muted-foreground">{formatStepTime(timestamp)}</p>}
      </motion.div>
    </div>
  )
}

function MobileStep({ step, state, timestamp, stepIndex, totalSteps }: { step: (typeof STEPS)[number]; state: StepState; timestamp: string | null; stepIndex: number; totalSteps: number }) {
  const Icon = step.icon
  const isCompleted = state === "completed"
  const isActive = state === "active"
  const isPending = state === "pending"
  const isLast = stepIndex === totalSteps - 1

  return (
    <motion.div className="flex gap-4" initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: stepIndex * 0.1, duration: 0.3 }}>
      <div className="flex flex-col items-center">
        <div className="relative flex h-9 w-9 flex-shrink-0 items-center justify-center">
          {isActive && <PulseRing />}
          <div className={`relative z-10 flex h-9 w-9 items-center justify-center rounded-full border-2 transition-colors ${isCompleted ? "border-emerald-500 bg-emerald-500" : isActive ? "border-amber-500 bg-amber-500" : "border-muted bg-background"}`}>
            {isCompleted ? <Check className="h-4 w-4 text-white" strokeWidth={3} /> : <Icon className={`h-4 w-4 ${isActive ? "text-white" : "text-muted-foreground/30"}`} />}
          </div>
        </div>
        {!isLast && (
          <div className="relative mt-1 w-0.5 flex-1" style={{ minHeight: "2.5rem" }}>
            <motion.div className={`absolute inset-0 ${isCompleted ? "bg-emerald-500" : ""}`} initial={{ scaleY: 0 }} animate={{ scaleY: isCompleted ? 1 : 0 }} transition={{ duration: 0.4, delay: stepIndex * 0.1 + 0.15 }} style={{ transformOrigin: "top" }} />
            {!isCompleted && <div className="absolute inset-0 border-l-2 border-dashed border-muted-foreground/25" />}
          </div>
        )}
      </div>
      <div className={`flex-1 pb-5 pt-0.5 ${isActive ? "rounded-lg border border-amber-200 bg-amber-50/50 px-3 py-2 -mt-0.5 mb-2 shadow-sm" : ""}`}>
        <div className="flex items-center gap-2 flex-wrap">
          <p className={`text-sm font-semibold ${isPending ? "text-muted-foreground/50" : "text-foreground"}`}>{step.label}</p>
          {isActive && <Badge className="border-amber-200 bg-amber-100 px-1.5 py-0 text-[10px] text-amber-700">Current</Badge>}
        </div>
        {isActive && <p className="mt-1 text-xs text-muted-foreground">{step.subtitle}</p>}
        {timestamp && <p className="mt-1 text-xs text-muted-foreground">{formatStepTime(timestamp)}</p>}
      </div>
    </motion.div>
  )
}

function CancelledState({ order }: { order: TrackingOrder }) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
      <Card className="overflow-hidden">
        <div className="h-1 w-full bg-gradient-to-r from-red-400 to-red-500" />
        <div className="p-8 text-center">
          <motion.div initial={{ scale: 0.5 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200, damping: 15 }} className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full border-4 border-red-100 bg-red-50">
            <XCircle className="h-8 w-8 text-red-500" />
          </motion.div>
          <h3 className="text-2xl font-bold text-red-600">Order Cancelled</h3>
          <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
            {order.cancellation_reason || "This order has been cancelled. Please contact support if you have any questions."}
          </p>
          {order.cancelled_at && (
            <p className="mt-3 text-sm text-muted-foreground">
              Cancelled on <span className="font-medium">{new Date(order.cancelled_at).toLocaleDateString("en-NG", { year: "numeric", month: "long", day: "numeric" })}</span>
            </p>
          )}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <a
              href={`mailto:support@hif.com.ng?subject=${encodeURIComponent(`Cancelled Order Enquiry — ${order.reference}`)}&body=${encodeURIComponent(`Assalamu Alaykum,\n\nI have a question about my cancelled order: ${order.reference}\n\nJazakAllahu Khairan.`)}`}
              className="flex items-center gap-2 rounded-md border border-red-200 bg-white px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-50"
            >
              <Mail className="h-4 w-4" />Email Support
            </a>
            <a
              href={`https://wa.me/+2349167656667?text=${encodeURIComponent(`Assalamu Alaykum, I have a question about my cancelled order: ${order.reference}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 rounded-md border border-green-200 bg-white px-3 py-2 text-sm font-medium text-green-700 hover:bg-green-50"
            >
              <MessageCircle className="h-4 w-4" />WhatsApp Us
            </a>
            <a href="tel:+2349167656667" className="flex items-center gap-2 rounded-md border border-border bg-white px-3 py-2 text-sm font-medium text-foreground hover:bg-muted">
              <Phone className="h-4 w-4" />Call Us
            </a>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}

export function OrderTracker({ order }: OrderTrackerProps) {
  const statusIndex = useMemo(() => {
    const statusMap: { [key: string]: number } = { pending: 0, processing: 1, ready_for_dispatch: 2, out_for_delivery: 3, delivered: 4, cancelled: -1 }
    return statusMap[order.order_status] ?? 0
  }, [order.order_status])

  if (order.order_status === "cancelled") return <CancelledState order={order} />

  return (
    <Card className="overflow-hidden">
      <div className="border-b border-border bg-muted/30 px-6 py-4">
        <h3 className="flex items-center gap-2 text-base font-semibold text-foreground">
          <Truck className="h-4 w-4 text-muted-foreground" />Delivery Progress
        </h3>
        <p className="mt-0.5 text-xs text-muted-foreground">Updated in real time as your order moves through each stage</p>
      </div>
      <div className="p-6">
        <div className="hidden md:block">
          <motion.div className="flex items-start justify-between" initial="hidden" animate="visible" variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.12 } } }}>
            {STEPS.map((step, index) => {
              const state: StepState = index < statusIndex ? "completed" : index === statusIndex ? "active" : "pending"
              const timestamp = (order as any)[`${step.id}_at`] ?? null
              return <DesktopStep key={step.id} step={step} state={state} timestamp={timestamp} stepIndex={index} totalSteps={STEPS.length} />
            })}
          </motion.div>
        </div>
        <div className="space-y-0 md:hidden">
          <AnimatePresence>
            {STEPS.map((step, index) => {
              const state: StepState = index < statusIndex ? "completed" : index === statusIndex ? "active" : "pending"
              const timestamp = (order as any)[`${step.id}_at`] ?? null
              return <MobileStep key={step.id} step={step} state={state} timestamp={timestamp} stepIndex={index} totalSteps={STEPS.length} />
            })}
          </AnimatePresence>
        </div>
      </div>
    </Card>
  )
}
