"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatPrice } from "@/lib/shop"
import { motion } from "framer-motion"
import { toast } from "sonner"
import { Copy, Share2, QrCode, Printer, User, MapPin, Calendar, CreditCard, Package, Download, CheckCircle2, Clock, XCircle, Truck, Tag, AlertCircle, ChevronDown, ChevronUp, Receipt } from "lucide-react"
import type { TrackingOrder } from "../track-order-client"

interface OrderSummaryProps {
  order: TrackingOrder
  onCopy: () => void
  onShare: () => void
  onShowQR: () => void
  onPrint: () => void
}

type StatusConfig = { label: string; color: string; icon: React.ReactNode }

const ORDER_STATUS_CONFIG: { [key: string]: StatusConfig } = {
  pending: { label: "Order Placed", color: "border-amber-200 bg-amber-50 text-amber-700", icon: <Clock className="h-3 w-3" /> },
  processing: { label: "Processing", color: "border-blue-200 bg-blue-50 text-blue-700", icon: <Package className="h-3 w-3" /> },
  ready_for_dispatch: { label: "Ready for Dispatch", color: "border-indigo-200 bg-indigo-50 text-indigo-700", icon: <Tag className="h-3 w-3" /> },
  out_for_delivery: { label: "Out for Delivery", color: "border-purple-200 bg-purple-50 text-purple-700", icon: <Truck className="h-3 w-3" /> },
  delivered: { label: "Delivered", color: "border-emerald-200 bg-emerald-50 text-emerald-700", icon: <CheckCircle2 className="h-3 w-3" /> },
  cancelled: { label: "Cancelled", color: "border-red-200 bg-red-50 text-red-700", icon: <XCircle className="h-3 w-3" /> },
}

const PAYMENT_STATUS_CONFIG: { [key: string]: StatusConfig } = {
  paid: { label: "Payment Confirmed", color: "border-emerald-200 bg-emerald-50 text-emerald-700", icon: <CheckCircle2 className="h-3 w-3" /> },
  pending: { label: "Payment Pending", color: "border-amber-200 bg-amber-50 text-amber-700", icon: <Clock className="h-3 w-3" /> },
  failed: { label: "Payment Failed", color: "border-red-200 bg-red-50 text-red-700", icon: <AlertCircle className="h-3 w-3" /> },
}

function getDeliveryLocation(address: string | null | undefined): string {
  if (!address) return ""
  const parts = address.split(",").map((p) => p.trim()).filter(Boolean)
  if (parts.length === 0) return ""
  if (parts.length === 1) return parts[0]
  return `${parts[parts.length - 2]}, ${parts[parts.length - 1]}`
}

function DetailField({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">{icon}</span>
      <div className="min-w-0 flex-1">
        <p className="text-xs text-muted-foreground">{label}</p>
        <div className="mt-0.5">{children}</div>
      </div>
    </div>
  )
}

export function OrderSummary({ order, onCopy, onShare, onShowQR, onPrint }: OrderSummaryProps) {
  const [showBreakdown, setShowBreakdown] = useState(false)

  const orderStatusConfig = ORDER_STATUS_CONFIG[order.order_status] ?? { label: order.order_status, color: "border-gray-200 bg-gray-50 text-gray-700", icon: <AlertCircle className="h-3 w-3" /> }
  const paymentStatusConfig = PAYMENT_STATUS_CONFIG[order.payment_status] ?? { label: order.payment_status, color: "border-gray-200 bg-gray-50 text-gray-700", icon: <AlertCircle className="h-3 w-3" /> }

  const orderDate = new Date(order.created_at)
  const formattedDate = orderDate.toLocaleDateString("en-NG", { weekday: "long", year: "numeric", month: "long", day: "numeric" })
  const formattedTime = orderDate.toLocaleTimeString("en-NG", { hour: "2-digit", minute: "2-digit", hour12: true })
  const deliveryLocation = getDeliveryLocation(order.delivery_address)
  const isDelivered = order.order_status === "delivered"
  const isCancelled = order.order_status === "cancelled"
  const hasDiscount = order.discount_amount > 0
  const hasBreakdown = order.subtotal !== undefined

  const handleCopyWithToast = () => { onCopy(); toast.success("Reference copied!", { description: order.reference }) }
  const handleShareWithToast = () => { onShare(); toast.success("Tracking link copied!", { description: "Share it to let others track this order." }) }

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
      <Card className="overflow-hidden">
        <div className={`h-1 w-full ${isDelivered ? "bg-gradient-to-r from-emerald-500 to-emerald-400" : isCancelled ? "bg-gradient-to-r from-red-400 to-red-500" : "bg-gradient-to-r from-emerald-800 to-emerald-600"}`} />
        <div className="p-5 sm:p-6">
          <div className="flex items-start justify-between gap-4 border-b border-border pb-5">
            <div className="min-w-0">
              <h2 className="truncate font-mono text-lg font-bold text-foreground sm:text-xl">{order.reference}</h2>
              <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3 flex-shrink-0" />{formattedDate} at {formattedTime}
              </div>
            </div>
            <div className="flex flex-shrink-0 flex-wrap justify-end gap-1.5">
              <button onClick={handleCopyWithToast} title="Copy" className="flex items-center gap-1.5 rounded-md border border-border bg-background px-2.5 py-1.5 text-xs font-medium hover:bg-muted">
                <Copy className="h-3.5 w-3.5" /><span className="hidden sm:inline">Copy</span>
              </button>
              <button onClick={handleShareWithToast} title="Share" className="flex items-center gap-1.5 rounded-md border border-border bg-background px-2.5 py-1.5 text-xs font-medium hover:bg-muted">
                <Share2 className="h-3.5 w-3.5" /><span className="hidden sm:inline">Share</span>
              </button>
              <button onClick={onShowQR} title="QR Code" className="flex items-center gap-1.5 rounded-md border border-border bg-background px-2.5 py-1.5 text-xs font-medium hover:bg-muted">
                <QrCode className="h-3.5 w-3.5" /><span className="hidden sm:inline">QR Code</span>
              </button>
              <button onClick={onPrint} title="Print" className="flex items-center gap-1.5 rounded-md border border-border bg-background px-2.5 py-1.5 text-xs font-medium hover:bg-muted">
                <Printer className="h-3.5 w-3.5" /><span className="hidden sm:inline">Print</span>
              </button>
            </div>
          </div>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <DetailField icon={<User className="h-3.5 w-3.5" />} label="Customer Name">
              <p className="text-sm font-medium text-foreground">{order.customer_name}</p>
            </DetailField>
            <DetailField icon={<Package className="h-3.5 w-3.5" />} label="Order Status">
              <Badge variant="outline" className={`flex w-fit items-center gap-1 text-xs font-medium ${orderStatusConfig.color}`}>
                {orderStatusConfig.icon}{orderStatusConfig.label}
              </Badge>
            </DetailField>
            <DetailField icon={<CreditCard className="h-3.5 w-3.5" />} label="Payment Status">
              <Badge variant="outline" className={`flex w-fit items-center gap-1 text-xs font-medium ${paymentStatusConfig.color}`}>
                {paymentStatusConfig.icon}{paymentStatusConfig.label}
              </Badge>
            </DetailField>
            <DetailField icon={<Receipt className="h-3.5 w-3.5" />} label="Total Amount">
              <p className="text-lg font-bold text-foreground">{formatPrice(order.total)}</p>
            </DetailField>
            {deliveryLocation && (
              <DetailField icon={<MapPin className="h-3.5 w-3.5" />} label="Delivery Location">
                <p className="text-sm font-medium text-foreground">{deliveryLocation}</p>
              </DetailField>
            )}
            {order.has_digital && (
              <DetailField icon={<Download className="h-3.5 w-3.5" />} label="Order Type">
                <Badge variant="outline" className="border-violet-200 bg-violet-50 text-xs text-violet-700">
                  <Download className="mr-1 h-3 w-3" />Contains Digital Downloads
                </Badge>
              </DetailField>
            )}
          </div>
          {hasBreakdown && (
            <div className="mt-5 border-t border-border pt-4">
              <button onClick={() => setShowBreakdown((s) => !s)} className="flex w-full items-center justify-between text-sm font-medium text-muted-foreground hover:text-foreground">
                <span className="flex items-center gap-1.5"><Receipt className="h-3.5 w-3.5" />Price breakdown</span>
                {showBreakdown ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </button>
              {showBreakdown && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} transition={{ duration: 0.2 }} className="mt-3 space-y-2 rounded-lg bg-muted/40 p-4 text-sm">
                  <div className="flex justify-between text-muted-foreground"><span>Subtotal</span><span>{formatPrice(order.subtotal)}</span></div>
                  {order.shipping_fee > 0 && <div className="flex justify-between text-muted-foreground"><span>Shipping</span><span>{formatPrice(order.shipping_fee)}</span></div>}
                  {order.shipping_fee === 0 && <div className="flex justify-between text-emerald-600"><span>Shipping</span><span className="font-medium">Free</span></div>}
                  {hasDiscount && <div className="flex justify-between text-emerald-600"><span>Discount</span><span className="font-medium">− {formatPrice(order.discount_amount)}</span></div>}
                  <div className="flex justify-between border-t border-border pt-2 font-bold text-foreground"><span>Total</span><span>{formatPrice(order.total)}</span></div>
                </motion.div>
              )}
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  )
}
