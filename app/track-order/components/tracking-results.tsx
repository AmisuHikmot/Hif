"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Copy, Share2, QrCode, Printer } from "lucide-react"
import { OrderSummary } from "./order-summary"
import { OrderTracker } from "./order-tracker"
import { StatusNote } from "./status-note"
import { EstimatedDelivery } from "./estimated-delivery"
import { OrderItems } from "./order-items"
import { StatusTimeline } from "./status-timeline"
import { SupportPanel } from "./support-panel"
import { QrCodeModal } from "./qr-code-modal"
import { useToast } from "@/hooks/use-toast"

interface Order {
  id: string
  reference: string
  customer_name: string
  customer_email: string
  delivery_address: string
  total: number
  subtotal: number
  shipping_fee: number
  discount_amount: number
  payment_status: string
  order_status: string
  status_note: string
  has_digital: boolean
  estimated_delivery_date: string
  created_at: string
  payment_confirmed_at: string
  processing_at: string
  ready_for_dispatch_at: string
  out_for_delivery_at: string
  delivered_at: string
  cancelled_at: string
  cancellation_reason: string
  shop_order_items_enhanced: any[]
  order_status_history: any[]
}

interface TrackingResultsProps {
  order: Order
  onBackClick: () => void
}

export function TrackingResults({ order, onBackClick }: TrackingResultsProps) {
  const { toast } = useToast()
  const [showQrCode, setShowQrCode] = useState(false)

  const handleCopyReference = async () => {
    try {
      await navigator.clipboard.writeText(order.reference)
      toast({
        description: "Order reference copied to clipboard",
      })
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
          text: `Track my order on HIF`,
          url: trackingUrl,
        })
      } else {
        await navigator.clipboard.writeText(trackingUrl)
        toast({
          description: "Tracking link copied to clipboard",
        })
      }
    } catch (err) {
      console.error("[v0] Share error:", err)
    }
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="space-y-8">
      {/* Back Button */}
      <Button variant="ghost" onClick={onBackClick} className="flex items-center gap-2">
        <ArrowLeft className="h-4 w-4" />
        Back to Search
      </Button>

      {/* Order Summary Card */}
      <OrderSummary
        order={order}
        onCopy={handleCopyReference}
        onShare={handleShareLink}
        onShowQR={() => setShowQrCode(true)}
        onPrint={handlePrint}
      />

      {/* Status Note */}
      {order.status_note && <StatusNote note={order.status_note} />}

      {/* Estimated Delivery */}
      {order.estimated_delivery_date &&
        order.order_status !== "delivered" &&
        order.order_status !== "cancelled" && (
          <EstimatedDelivery date={order.estimated_delivery_date} />
        )}

      {/* Main Tracker */}
      <OrderTracker order={order} />

      {/* Status Timeline */}
      <StatusTimeline history={order.order_status_history} />

      {/* Order Items */}
      <OrderItems items={order.shop_order_items_enhanced} />

      {/* Support Panel */}
      <SupportPanel reference={order.reference} email={order.customer_email} />

      {/* QR Code Modal */}
      <QrCodeModal
        isOpen={showQrCode}
        onClose={() => setShowQrCode(false)}
        reference={order.reference}
      />
    </div>
  )
}
