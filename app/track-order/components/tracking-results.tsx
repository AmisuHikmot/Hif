"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { motion, AnimatePresence } from "framer-motion"
import {
  ArrowLeft,
  ShoppingCart,
  RefreshCcw,
  AlertTriangle,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { toast as sonnerToast } from "sonner"

// ── Sub-components — unchanged imports ─────────────────────────
import { OrderSummary }      from "./order-summary"
import { OrderTracker }      from "./order-tracker"
import { StatusNote }        from "./status-note"
import { EstimatedDelivery } from "./estimated-delivery"
import { OrderItems }        from "./order-items"
import { StatusTimeline }    from "./status-timeline"
import { SupportPanel }      from "./support-panel"
import { QrCodeModal }       from "./qr-code-modal"
import { CompletePayment }   from "./complete-payment"
import { CancellationModal } from "./cancellation-modal"
import { ReOrderButton }     from "./re-order-button"

import type { TrackingOrder } from "../track-order-client"

// ── Types ──────────────────────────────────────────────────────

interface TrackingResultsProps {
  order:         TrackingOrder
  onBackClick:   () => void
  onOrderUpdate: (order: TrackingOrder) => void
}

// ── Section wrapper — consistent fade-in per section ──────────

function Section({
  children,
  delay = 0,
}: {
  children: React.ReactNode
  delay?:   number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay }}
    >
      {children}
    </motion.div>
  )
}

// ── Main Component ─────────────────────────────────────────────

export function TrackingResults({
  order,
  onBackClick,
  onOrderUpdate,
}: TrackingResultsProps) {
  const { toast }                           = useToast()
  const [showQrCode, setShowQrCode]         = useState(false)
  const [showCancelModal, setShowCancelModal] = useState(false)

  // ── Derived state ──────────────────────────────────────────

  const isDelivered  = order.order_status === "delivered"
  const isCancelled  = order.order_status === "cancelled"
  const isPending    = order.payment_status === "pending"
  const isProcessing = order.order_status === "processing"
  const canCancel    = order.order_status === "pending" || order.order_status === "processing"

  const hasDigitalItems = order.shop_order_items_enhanced?.some(
    (i) => i.product_type === "digital"
  )
  const hasPhysicalItems = order.shop_order_items_enhanced?.some(
    (i) => i.product_type === "physical"
  )

  // ── unchanged: your original handlers ─────────────────────

  const handleCopyReference = async () => {
    try {
      await navigator.clipboard.writeText(order.reference)
      toast({ description: "Order reference copied to clipboard" })
    } catch (err) {
      console.error("[v0] Copy error:", err)
    }
  }

  const handleShareLink = async () => {
    const trackingUrl = `${window.location.origin}/track-order?ref=${order.reference}`
    try {
      if (navigator.share) {
        await navigator.share({
          title: `Track Order ${order.reference}`,
          text:  "Track my order on HIF",
          url:   trackingUrl,
        })
      } else {
        await navigator.clipboard.writeText(trackingUrl)
        toast({ description: "Tracking link copied to clipboard" })
      }
    } catch (err) {
      console.error("[v0] Share error:", err)
    }
  }

  const handlePrint = () => {
    window.print()
  }

  // ── Cancellation success handler ──────────────────────────

  const handleCancellationRequested = () => {
    setShowCancelModal(false)
    sonnerToast.success("Cancellation request submitted", {
      description:
        "Our team will review your request and respond within 24 hours insha'Allah.",
    })
  }

  // ── Re-order success handler ───────────────────────────────

  const handleReOrderSuccess = (skippedCount: number) => {
    if (skippedCount > 0) {
      sonnerToast.info(`Items added to cart`, {
        description: `${skippedCount} item${skippedCount > 1 ? "s were" : " was"} out of stock and not added.`,
      })
    } else {
      sonnerToast.success("Items added to your cart!", {
        description: "Head to your cart to complete your purchase.",
      })
    }
  }

  // ── Render ─────────────────────────────────────────────────

  return (
    <>
      <div className="space-y-6">

        {/* ── Back button + cancel request link ─────────────── */}
        <Section delay={0}>
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={onBackClick}
              className="gap-2 text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Search
            </Button>

            {/* Cancel request — only while cancellable */}
            <AnimatePresence>
              {canCancel && (
                <motion.div
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 8 }}
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowCancelModal(true)}
                    className="gap-1.5 text-xs text-muted-foreground hover:text-red-600"
                  >
                    <AlertTriangle className="h-3.5 w-3.5" />
                    Request Cancellation
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </Section>

        {/* ── Complete Payment banner ────────────────────────── */}
        {/* Only shown when payment is pending */}
        <AnimatePresence>
          {isPending && (
            <Section delay={0.05}>
              <CompletePayment
                orderId={order.id}
                reference={order.reference}
                total={order.total}
                onPaymentInitiated={() => {
                  sonnerToast.info("Redirecting to payment...", {
                    description: "Please complete your payment on the next page.",
                  })
                }}
              />
            </Section>
          )}
        </AnimatePresence>

        {/* ── Order Summary Card ────────────────────────────── */}
        {/* unchanged: passes order.reference, order.* directly */}
        <Section delay={0.08}>
          <OrderSummary
            order={order}
            onCopy={handleCopyReference}
            onShare={handleShareLink}
            onShowQR={() => setShowQrCode(true)}
            onPrint={handlePrint}
          />
        </Section>

        {/* ── Status Note banner ────────────────────────────── */}
        {/* unchanged: order.status_note */}
        <AnimatePresence>
          {order.status_note && (
            <Section delay={0.1}>
              <StatusNote
                note={order.status_note}
                updatedAt={
                  // Show timestamp of the most recent history entry
                  order.order_status_history?.[0]?.changed_at ?? null
                }
              />
            </Section>
          )}
        </AnimatePresence>

        {/* ── Estimated Delivery ────────────────────────────── */}
        {/* unchanged: order.estimated_delivery_date condition */}
        <AnimatePresence>
          {order.estimated_delivery_date &&
            !isDelivered &&
            !isCancelled && (
              <Section delay={0.12}>
                <EstimatedDelivery
                  date={order.estimated_delivery_date}
                  orderReference={order.reference}
                  orderStatus={order.order_status}
                />
              </Section>
            )}
        </AnimatePresence>

        {/* ── Main Visual Tracker ───────────────────────────── */}
        {/* unchanged: passes order directly */}
        <Section delay={0.15}>
          <OrderTracker order={order} />
        </Section>

        {/* ── Status Timeline ───────────────────────────────── */}
        {/* unchanged: order.order_status_history */}
        {order.order_status_history?.length > 0 && (
          <Section delay={0.18}>
            <StatusTimeline history={order.order_status_history} />
          </Section>
        )}

        {/* ── Order Items ───────────────────────────────────── */}
        {/* unchanged: order.shop_order_items_enhanced */}
        <Section delay={0.2}>
          <OrderItems
            items={order.shop_order_items_enhanced}
            paymentStatus={order.payment_status}
          />
        </Section>

        {/* ── Re-Order button ───────────────────────────────── */}
        {/* Only shown when delivered and has physical items */}
        <AnimatePresence>
          {isDelivered && hasPhysicalItems && (
            <Section delay={0.22}>
              <ReOrderButton
                items={order.shop_order_items_enhanced}
                onSuccess={handleReOrderSuccess}
              />
            </Section>
          )}
        </AnimatePresence>

        {/* ── Support Panel ─────────────────────────────────── */}
        {/* unchanged: order.reference, order.customer_email */}
        <Section delay={0.24}>
          <SupportPanel
            reference={order.reference}
            email={order.customer_email}
          />
        </Section>

        {/* ── Islamic closing ───────────────────────────────── */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
          className="text-center text-xs text-muted-foreground"
        >
          JazakAllahu Khairan for shopping with HIF. May your order reach you safely.
        </motion.p>
      </div>

      {/* ── QR Code Modal ─────────────────────────────────────── */}
      {/* unchanged: order.reference */}
      <QrCodeModal
        isOpen={showQrCode}
        onClose={() => setShowQrCode(false)}
        reference={order.reference}
      />

      {/* ── Cancellation Modal ────────────────────────────────── */}
      <CancellationModal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        orderId={order.id}
        reference={order.reference}
        currentStatus={order.order_status}
        onSuccess={handleCancellationRequested}
      />
    </>
  )
}
