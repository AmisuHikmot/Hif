"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, AlertTriangle } from "lucide-react"
import { toast } from "sonner"
import { useToast } from "@/hooks/use-toast"
import { OrderSummary } from "./order-summary"
import { OrderTracker } from "./order-tracker"
import { StatusNote } from "./status-note"
import { EstimatedDelivery } from "./estimated-delivery"
import { OrderItems } from "./order-items"
import { StatusTimeline } from "./status-timeline"
import { SupportPanel } from "./support-panel"
import { QrCodeModal } from "./qr-code-modal"
import type { TrackingOrder } from "../track-order-client"

interface TrackingResultsProps {
  order: TrackingOrder
  onBackClick: () => void
  onOrderUpdate: (order: TrackingOrder) => void
}

function Section({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay }}>
      {children}
    </motion.div>
  )
}

export function TrackingResults({ order, onBackClick, onOrderUpdate }: TrackingResultsProps) {
  const { toast: shadcnToast } = useToast()
  const [showQrCode, setShowQrCode] = useState(false)

  const canCancel = order.order_status === "pending" || order.order_status === "processing"

  const handleCopyReference = async () => {
    try {
      await navigator.clipboard.writeText(order.reference)
      shadcnToast({ description: "Order reference copied to clipboard" })
    } catch (err) { console.error("[v0] Copy error:", err) }
  }

  const handleShareLink = async () => {
    const trackingUrl = `${window.location.origin}/track-order?ref=${order.reference}`
    try {
      if (navigator.share) {
        await navigator.share({ title: `Track Order ${order.reference}`, text: "Track my order on HIF", url: trackingUrl })
      } else {
        await navigator.clipboard.writeText(trackingUrl)
        shadcnToast({ description: "Tracking link copied to clipboard" })
      }
    } catch (err) { console.error("[v0] Share error:", err) }
  }

  const handlePrint = () => { window.print() }

  return (
    <>
      <div className="space-y-6">
        <Section delay={0}>
          <div className="flex items-center justify-between">
            <button onClick={onBackClick} className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground">
              <ArrowLeft className="h-4 w-4" />Back to Search
            </button>
            <AnimatePresence>
              {canCancel && (
                <motion.div initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 8 }}>
                  <a
                    href={`mailto:support@hif.com.ng?subject=${encodeURIComponent(`Cancellation Request — ${order.reference}`)}&body=${encodeURIComponent(`Assalamu Alaykum,\n\nI would like to request cancellation of my order: ${order.reference}\n\nJazakAllahu Khairan.`)}`}
                    className="flex items-center gap-1.5 rounded-md px-3 py-2 text-xs text-muted-foreground hover:bg-muted hover:text-red-600"
                  >
                    <AlertTriangle className="h-3.5 w-3.5" />Request Cancellation
                  </a>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </Section>

        <Section delay={0.08}>
          <OrderSummary order={order} onCopy={handleCopyReference} onShare={handleShareLink} onShowQR={() => setShowQrCode(true)} onPrint={handlePrint} />
        </Section>

        <AnimatePresence>
          {order.status_note && (
            <Section delay={0.1}>
              <StatusNote note={order.status_note} updatedAt={order.order_status_history?.[0]?.changed_at ?? null} />
            </Section>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {order.estimated_delivery_date && order.order_status !== "delivered" && order.order_status !== "cancelled" && (
            <Section delay={0.12}>
              <EstimatedDelivery date={order.estimated_delivery_date} orderReference={order.reference} orderStatus={order.order_status} />
            </Section>
          )}
        </AnimatePresence>

        <Section delay={0.15}>
          <OrderTracker order={order} />
        </Section>

        {order.order_status_history?.length > 0 && (
          <Section delay={0.18}>
            <StatusTimeline history={order.order_status_history} />
          </Section>
        )}

        <Section delay={0.2}>
          <OrderItems items={order.shop_order_items_enhanced} paymentStatus={order.payment_status} />
        </Section>

        <Section delay={0.24}>
          <SupportPanel reference={order.reference} email={order.customer_email} />
        </Section>

        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }} className="text-center text-xs text-muted-foreground">
          JazakAllahu Khairan for shopping with HIF. May your order reach you safely.
        </motion.p>
      </div>

      <QrCodeModal isOpen={showQrCode} onClose={() => setShowQrCode(false)} reference={order.reference} />
    </>
  )
}
