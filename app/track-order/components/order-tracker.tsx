"use client"

import { useMemo } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { motion, AnimatePresence } from "framer-motion"
import {
  ShoppingBag,
  ShieldCheck,
  Package,
  Tag,
  Truck,
  PartyPopper,
  XCircle,
} from "lucide-react"
import type { TrackingOrder } from "../track-order-client"

type StepState = "completed" | "active" | "pending"

const STEPS = [
  { id: "pending", label: "Order Placed", icon: ShoppingBag },
  { id: "processing", label: "Payment Confirmed", icon: ShieldCheck },
  { id: "ready_for_dispatch", label: "Order Processing", icon: Package },
  { id: "out_for_delivery", label: "Ready for Dispatch", icon: Tag },
  { id: "delivered", label: "Delivered", icon: PartyPopper },
] as const

export function OrderTracker({ order }: { order: TrackingOrder }) {
  const steps = useMemo(() => {
    return STEPS.map((step) => {
      const timestamp = order[`${step.id}_at` as keyof TrackingOrder] as string | null
      const isDelivered =
        (order.order_status === "delivered" &&
          step.id === "delivered") ||
        (step.id === "delivered" &&
          typeof timestamp === "string" &&
          timestamp !== null)

      const state: StepState = isDelivered || order.order_status === "cancelled"
        ? "completed"
        : order.order_status === step.id
        ? "active"
        : STEPS.findIndex((s) => s.id === order.order_status) > STEPS.findIndex((s) => s.id === step.id)
        ? "completed"
        : "pending"

      return { ...step, state, timestamp }
    })
  }, [order])

  if (order.order_status === "cancelled") {
    return (
      <Card className="overflow-hidden border-red-200 bg-red-50">
        <div className="p-6 text-center">
          <XCircle className="mx-auto mb-3 h-12 w-12 text-red-500" />
          <h3 className="font-semibold text-red-900">Order Cancelled</h3>
          <p className="mt-1 text-sm text-red-700">{order.cancellation_reason || "This order has been cancelled."}</p>
        </div>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-5 gap-4">
        {steps.map((step, index) => (
          <div key={step.id} className="flex flex-col items-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${
                step.state === "completed"
                  ? "border-emerald-500 bg-emerald-500"
                  : step.state === "active"
                  ? "border-amber-500 bg-amber-500"
                  : "border-muted bg-background"
              }`}
            >
              <step.icon className={`h-5 w-5 ${step.state !== "pending" ? "text-white" : "text-muted-foreground"}`} />
            </motion.div>
            <p className="mt-2 text-xs font-medium text-center">{step.label}</p>
          </div>
        ))}
      </div>

      <Card>
        <div className="p-4">
          <p className="text-sm text-muted-foreground">
            {order.order_status === "delivered"
              ? "Your order has been delivered."
              : order.order_status === "out_for_delivery"
              ? "Your order is on its way."
              : order.order_status === "ready_for_dispatch"
              ? "Your order is being prepared for shipment."
              : "Your order is being processed."}
          </p>
        </div>
      </Card>
    </div>
  )
}
