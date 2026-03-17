"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, AlertTriangle, CheckCircle2, Phone, Mail } from "lucide-react"
import { useEffect, useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
  isOverdue: boolean
  isToday: boolean
  isTomorrow: boolean
}

interface EstimatedDeliveryProps {
  date: string
  orderReference?: string
  orderStatus?: string
}

function calculateTimeLeft(dateStr: string): TimeLeft {
  const now = new Date()
  const delivery = new Date(dateStr)
  delivery.setHours(23, 59, 59, 999)
  const diff = delivery.getTime() - now.getTime()
  const todayDate = now.toDateString()
  const deliveryDateStr = new Date(dateStr).toDateString()
  const tomorrow = new Date(now)
  tomorrow.setDate(now.getDate() + 1)
  const isToday = deliveryDateStr === todayDate
  const isTomorrow = deliveryDateStr === tomorrow.toDateString()
  const isOverdue = diff < 0
  if (isOverdue) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isOverdue: true, isToday, isTomorrow }
  }
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24)
  const minutes = Math.floor((diff / (1000 * 60)) % 60)
  const seconds = Math.floor((diff / 1000) % 60)
  return { days, hours, minutes, seconds, isOverdue: false, isToday, isTomorrow }
}

function formatDeliveryDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-NG", { weekday: "long", year: "numeric", month: "long", day: "numeric" })
}

function CountdownUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <motion.div key={value} initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }} className="min-w-[2.5rem] rounded-lg bg-blue-900/20 px-2.5 py-1.5 text-center">
        <span className="text-lg font-bold tabular-nums text-blue-900">{String(value).padStart(2, "0")}</span>
      </motion.div>
      <span className="mt-1 text-[10px] uppercase tracking-wider text-blue-600/70">{label}</span>
    </div>
  )
}

export function EstimatedDelivery({ date, orderReference, orderStatus }: EstimatedDeliveryProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() => calculateTimeLeft(date))
  const [showSupport, setShowSupport] = useState(false)
  const isDelivered = orderStatus === "delivered"

  const tick = useCallback(() => { setTimeLeft(calculateTimeLeft(date)) }, [date])

  useEffect(() => {
    tick()
    const interval = setInterval(tick, 1000)
    return () => clearInterval(interval)
  }, [tick])

  useEffect(() => {
    if (timeLeft.isOverdue && !isDelivered) {
      const timer = setTimeout(() => setShowSupport(true), 1500)
      return () => clearTimeout(timer)
    }
  }, [timeLeft.isOverdue, isDelivered])

  const formattedDate = formatDeliveryDate(date)

  if (isDelivered) {
    return (
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="overflow-hidden border-emerald-200 bg-emerald-50">
          <div className="flex items-start gap-3 p-4">
            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-emerald-100">
              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="font-semibold text-emerald-900">Order Delivered</p>
              <p className="mt-0.5 text-sm text-emerald-700">
                Your order was delivered on {formattedDate}.<br />
                JazakAllahu Khairan for shopping with HIF!
              </p>
            </div>
          </div>
        </Card>
      </motion.div>
    )
  }

  if (timeLeft.isOverdue) {
    return (
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
        <Card className="overflow-hidden border-amber-300 bg-amber-50">
          <div className="border-b border-amber-200 bg-amber-100/60 px-4 py-2.5">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              <span className="text-sm font-semibold text-amber-800">Delivery Running Late</span>
              <Badge className="ml-auto border-amber-300 bg-amber-200 text-xs text-amber-800">Est. {formattedDate}</Badge>
            </div>
          </div>
          <div className="p-4">
            <p className="text-sm leading-relaxed text-amber-800">
              Your order was estimated to arrive by <span className="font-medium">{formattedDate}</span>.
              We apologise for the delay — our team is working to get your order to you as soon as possible insha&apos;Allah.
            </p>
            <button onClick={() => setShowSupport((s) => !s)} className="mt-3 text-sm font-medium text-amber-700 underline underline-offset-2 hover:text-amber-900">
              {showSupport ? "Hide support options" : "Contact support about this order"}
            </button>
          </div>
        </Card>

        <AnimatePresence>
          {showSupport && orderReference && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.25 }}>
              <Card className="overflow-hidden border-border">
                <div className="bg-muted/40 px-4 py-3 text-sm font-medium text-foreground">
                  Get help with order {orderReference}
                </div>
                <div className="flex flex-col gap-2 p-4 sm:flex-row">
                  <a
                    href={`https://wa.me/+2349167656667?text=${encodeURIComponent(`Assalamu Alaykum, my order ${orderReference} appears to be running late. Could you please provide an update? JazakAllahu Khairan.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-1 items-center justify-center gap-2 rounded-md border border-green-300 bg-white px-3 py-2 text-sm font-medium text-green-700 hover:bg-green-50">
                      
                    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    WhatsApp Us
                  </a>
                  <a href={`mailto:support@hif.com.ng?subject=${encodeURIComponent(`Late Delivery Enquiry — ${orderReference}`)}&body=${encodeURIComponent(`Assalamu Alaykum,\n\nMy order ${orderReference} appears to be running late.\nCould you please provide an update?\n\nJazakAllahu Khairan.`)}`} className="flex flex-1 items-center justify-center gap-2 rounded-md border border-border bg-white px-3 py-2 text-sm font-medium text-foreground hover:bg-muted">
                    <Mail className="h-4 w-4" />
                    Email Support
                  </a>
                  <a href="tel:+2349167656667" className="flex flex-1 items-center justify-center gap-2 rounded-md border border-border bg-white px-3 py-2 text-sm font-medium text-foreground hover:bg-muted">
                    <Phone className="h-4 w-4" />
                    Call Us
                  </a>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    )
  }

  const isUrgent = timeLeft.days === 0

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <Card className={`overflow-hidden border-blue-200 ${isUrgent ? "bg-blue-100" : "bg-blue-50"}`}>
        <div className="flex items-center justify-between border-b border-blue-200/70 bg-blue-100/60 px-4 py-2.5">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-semibold text-blue-900">Estimated Delivery</span>
          </div>
          {timeLeft.isToday && <Badge className="border-emerald-300 bg-emerald-100 text-xs font-medium text-emerald-800">🎉 Arriving Today</Badge>}
          {timeLeft.isTomorrow && !timeLeft.isToday && <Badge className="border-blue-300 bg-blue-200 text-xs font-medium text-blue-800">Tomorrow</Badge>}
        </div>
        <div className="p-4">
          <p className="text-sm font-medium text-blue-900">{formattedDate}</p>
          <div className="mt-4">
            <div className="mb-2 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-blue-600/80">
              <Clock className="h-3.5 w-3.5" />
              {timeLeft.isToday ? "Arriving in" : "Time remaining"}
            </div>
            {timeLeft.isToday ? (
              <div className="flex items-end gap-2">
                <CountdownUnit value={timeLeft.hours} label="hours" />
                <span className="mb-3 text-lg font-bold text-blue-700">:</span>
                <CountdownUnit value={timeLeft.minutes} label="mins" />
                <span className="mb-3 text-lg font-bold text-blue-700">:</span>
                <CountdownUnit value={timeLeft.seconds} label="secs" />
              </div>
            ) : (
              <div className="flex items-end gap-2">
                <CountdownUnit value={timeLeft.days} label="days" />
                <span className="mb-3 text-lg font-bold text-blue-700">:</span>
                <CountdownUnit value={timeLeft.hours} label="hours" />
                <span className="mb-3 text-lg font-bold text-blue-700">:</span>
                <CountdownUnit value={timeLeft.minutes} label="mins" />
              </div>
            )}
          </div>
          <p className="mt-4 text-xs text-blue-600/70">
            Delivery estimates are provided by HIF staff and may vary. Insha&apos;Allah your order will arrive on time.
          </p>
        </div>
      </Card>
    </motion.div>
  )
}
