"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatPrice } from "@/lib/shop"
import { motion, AnimatePresence } from "framer-motion"
import {
  ArrowRight,
  ArrowLeft,
  Package,
  Download,
  ShoppingBag,
  Calendar,
  CheckCircle2,
  Clock,
  Truck,
  XCircle,
  AlertCircle,
  Tag,
} from "lucide-react"

// ── Types ──────────────────────────────────────────────────────

interface Order {
  id: string
  reference: string
  customer_name: string
  customer_email: string
  total: number
  payment_status: string
  order_status: string
  created_at: string
  shop_order_items_enhanced: any[] // ← unchanged
}

interface OrderListProps {
  orders: Order[]
  onSelectOrder: (order: Order) => void
  onBack?: () => void
}

// ── Status config ──────────────────────────────────────────────
// FIX 1: Record generic must be on a single line

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ReactNode; stepIndex: number }> = {
  pending: {
    label:     "Order Placed",
    color:     "border-amber-200 bg-amber-50 text-amber-700",
    icon:      <Clock className="h-3 w-3" />,
    stepIndex: 1,
  },
  processing: {
    label:     "Processing",
    color:     "border-blue-200 bg-blue-50 text-blue-700",
    icon:      <Package className="h-3 w-3" />,
    stepIndex: 3,
  },
  ready_for_dispatch: {
    label:     "Ready for Dispatch",
    color:     "border-indigo-200 bg-indigo-50 text-indigo-700",
    icon:      <Tag className="h-3 w-3" />,
    stepIndex: 4,
  },
  out_for_delivery: {
    label:     "Out for Delivery",
    color:     "border-purple-200 bg-purple-50 text-purple-700",
    icon:      <Truck className="h-3 w-3" />,
    stepIndex: 5,
  },
  delivered: {
    label:     "Delivered",
    color:     "border-emerald-200 bg-emerald-50 text-emerald-700",
    icon:      <CheckCircle2 className="h-3 w-3" />,
    stepIndex: 6,
  },
  cancelled: {
    label:     "Cancelled",
    color:     "border-red-200 bg-red-50 text-red-700",
    icon:      <XCircle className="h-3 w-3" />,
    stepIndex: 0,
  },
}

// FIX 2: Record generic must be on a single line

const PAYMENT_CONFIG: Record<string, { label: string; color: string }> = {
  paid: {
    label: "Paid",
    color: "border-emerald-200 bg-emerald-50 text-emerald-700",
  },
  pending: {
    label: "Payment Pending",
    color: "border-amber-200 bg-amber-50 text-amber-700",
  },
  failed: {
    label: "Payment Failed",
    color: "border-red-200 bg-red-50 text-red-700",
  },
}

const TOTAL_STEPS = 6

// ── Mini progress bar ──────────────────────────────────────────

function MiniProgressBar({ status }: { status: string }) {
  const config = STATUS_CONFIG[status]
  if (!config || config.stepIndex === 0) return null

  const percent    = Math.round((config.stepIndex / TOTAL_STEPS) * 100)
  const isComplete = status === "delivered"

  return (
    <div className="mt-3">
      <div className="mb-1 flex items-center justify-between text-[11px] text-muted-foreground">
        <span>Order progress</span>
        <span>{config.stepIndex} of {TOTAL_STEPS} steps</span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className={`h-full rounded-full ${
            isComplete ? "bg-emerald-500" : "bg-emerald-700"
          }`}
        />
      </div>
    </div>
  )
}

// ── Single order card ──────────────────────────────────────────

function OrderCard({
  order,
  index,
  onSelectOrder,
}: {
  order:         Order
  index:         number
  onSelectOrder: (order: Order) => void
}) {
  const statusConfig = STATUS_CONFIG[order.order_status] ?? {
    label:     order.order_status,
    color:     "border-gray-200 bg-gray-50 text-gray-700",
    icon:      <AlertCircle className="h-3 w-3" />,
    stepIndex: 0,
  }
  const paymentConfig = PAYMENT_CONFIG[order.payment_status] ?? {
    label: order.payment_status,
    color: "border-gray-200 bg-gray-50 text-gray-700",
  }

  // ── unchanged: uses shop_order_items_enhanced exactly as passed ──
  const items         = order.shop_order_items_enhanced ?? []
  const digitalCount  = items.filter((i: any) => i.product_type === "digital").length
  const physicalCount = items.filter((i: any) => i.product_type === "physical").length

  const formattedDate = new Date(order.created_at).toLocaleDateString("en-NG", {
    year:  "numeric",
    month: "long",
    day:   "numeric",
  })
  const formattedTime = new Date(order.created_at).toLocaleTimeString("en-NG", {
    hour:   "2-digit",
    minute: "2-digit",
  })

  const isCancelled = order.order_status === "cancelled"
  const isDelivered = order.order_status === "delivered"

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.3 }}
      whileHover={{ y: -2 }}
    >
      <Card
        onClick={() => onSelectOrder(order)}
        className={`cursor-pointer overflow-hidden border transition-all duration-200 hover:shadow-md ${
          isCancelled ? "opacity-70" : ""
        } ${isDelivered ? "border-emerald-200" : "border-border"}`}
      >
        {/* Delivered accent bar */}
        {isDelivered && (
          <div className="h-1 w-full bg-gradient-to-r from-emerald-500 to-emerald-600" />
        )}

        <div className="p-4 sm:p-5">
          {/* Top row: reference + total */}
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <p className="truncate font-mono text-sm font-semibold text-foreground">
                {order.reference}
              </p>
              <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3 flex-shrink-0" />
                {formattedDate} at {formattedTime}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <p className="text-right font-bold text-foreground">
                {formatPrice(order.total)}
              </p>
              <ArrowRight className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
            </div>
          </div>

          {/* Middle row: item counts */}
          {items.length > 0 && (
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <ShoppingBag className="h-3 w-3" />
                {items.length} {items.length === 1 ? "item" : "items"}
              </div>
              {physicalCount > 0 && (
                <div className="flex items-center gap-1 rounded-full border border-blue-200 bg-blue-50 px-2 py-0.5 text-[11px] text-blue-700">
                  <Package className="h-2.5 w-2.5" />
                  {physicalCount} physical
                </div>
              )}
              {digitalCount > 0 && (
                <div className="flex items-center gap-1 rounded-full border border-violet-200 bg-violet-50 px-2 py-0.5 text-[11px] text-violet-700">
                  <Download className="h-2.5 w-2.5" />
                  {digitalCount} digital
                </div>
              )}
            </div>
          )}

          {/* Bottom row: status badges */}
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <Badge
              variant="outline"
              className={`flex items-center gap-1 text-xs font-medium ${statusConfig.color}`}
            >
              {statusConfig.icon}
              {statusConfig.label}
            </Badge>
            <Badge
              variant="outline"
              className={`text-xs font-medium ${paymentConfig.color}`}
            >
              {paymentConfig.label}
            </Badge>
          </div>

          {/* Mini progress bar — hidden for cancelled */}
          {!isCancelled && <MiniProgressBar status={order.order_status} />}

          {/* Cancelled strip */}
          {isCancelled && (
            <div className="mt-3 flex items-center gap-1.5 text-xs text-red-600">
              <XCircle className="h-3 w-3 flex-shrink-0" />
              This order was cancelled
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-border bg-muted/30 px-4 py-2.5">
          <p className="flex items-center gap-1 text-xs font-medium text-muted-foreground">
            Tap to view full tracking details
            <ArrowRight className="h-3 w-3" />
          </p>
        </div>
      </Card>
    </motion.div>
  )
}

// ── Main Component ─────────────────────────────────────────────

export function OrderList({ orders, onSelectOrder, onBack }: OrderListProps) {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground">Your Orders</h2>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {orders.length} {orders.length === 1 ? "order" : "orders"} found
            — select one to track it
          </p>
        </div>
        {onBack && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="gap-1.5 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        )}
      </div>

      {/* Order cards */}
      <AnimatePresence>
        <div className="space-y-3">
          {orders.map((order, index) => (
            <OrderCard
              key={order.id}
              order={order}
              index={index}
              onSelectOrder={onSelectOrder}
            />
          ))}
        </div>
      </AnimatePresence>

      {/* Footer note */}
      {/* FIX 3: restored missing opening <a> tag */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: orders.length * 0.08 + 0.2 }}
        className="text-center text-xs text-muted-foreground"
      >
        Can't find your order?{" "}
        
          href={`mailto:support@hif.com.ng?subject=${encodeURIComponent(
            "Order Lookup Help"
          )}`}
          className="font-medium text-emerald-700 underline underline-offset-2 hover:text-emerald-600"
        >
          Contact support
        </a>
      </motion.p>
    </div>
  )
}
