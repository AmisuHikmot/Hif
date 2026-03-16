"use client"

import { useMemo } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  ShoppingBag,
  ShieldCheck,
  Package,
  Tag,
  Truck,
  PartyPopper,
} from "lucide-react"

interface OrderTrackerProps {
  order: any
}

const STEPS = [
  {
    id: "pending",
    label: "Order Placed",
    icon: ShoppingBag,
    subtitle: "We have received your order",
    colorClass: "text-green-600",
    bgClass: "bg-green-100",
  },
  {
    id: "processing",
    label: "Payment Confirmed",
    icon: ShieldCheck,
    subtitle: "Your payment has been verified",
    colorClass: "text-green-600",
    bgClass: "bg-green-100",
  },
  {
    id: "ready_for_dispatch",
    label: "Order Processing",
    icon: Package,
    subtitle: "We are preparing your items",
    colorClass: "text-green-600",
    bgClass: "bg-green-100",
  },
  {
    id: "out_for_delivery",
    label: "Ready for Dispatch",
    icon: Tag,
    subtitle: "Your order is packed and ready to go",
    colorClass: "text-green-600",
    bgClass: "bg-green-100",
  },
  {
    id: "delivered",
    label: "Out for Delivery",
    icon: Truck,
    subtitle: "Your order is on its way to you",
    colorClass: "text-green-600",
    bgClass: "bg-green-100",
  },
  {
    id: "final",
    label: "Delivered",
    icon: PartyPopper,
    subtitle: "Your order has been delivered. Enjoy!",
    colorClass: "text-green-600",
    bgClass: "bg-green-100",
  },
]

export function OrderTracker({ order }: OrderTrackerProps) {
  const statusIndex = useMemo(() => {
    const statusMap: { [key: string]: number } = {
      pending: 0,
      processing: 1,
      ready_for_dispatch: 2,
      out_for_delivery: 3,
      delivered: 4,
      cancelled: -1,
    }
    return statusMap[order.order_status] ?? 0
  }, [order.order_status])

  if (order.order_status === "cancelled") {
    return (
      <Card className="p-8">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
            <span className="text-2xl">✕</span>
          </div>
          <h3 className="text-2xl font-bold text-red-600 mb-2">Order Cancelled</h3>
          <p className="text-muted-foreground mb-4">
            {order.cancellation_reason ||
              "This order has been cancelled. Please contact support if you have any questions."}
          </p>
          {order.cancelled_at && (
            <p className="text-sm text-muted-foreground">
              Cancelled on{" "}
              {new Date(order.cancelled_at).toLocaleDateString("en-NG", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          )}
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-8">
      <div className="space-y-8">
        {/* Desktop Tracker - Horizontal */}
        <div className="hidden md:block">
          <div className="flex items-center justify-between mb-8">
            {STEPS.slice(0, 5).map((step, index) => {
              const isCompleted = index <= statusIndex
              const isActive = index === statusIndex
              const Icon = step.icon

              return (
                <div key={step.id} className="flex flex-col items-center flex-1">
                  {/* Step Circle */}
                  <div className="relative w-12 h-12 mb-4">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all ${
                        isCompleted
                          ? "bg-green-500 border-green-500"
                          : isActive
                            ? "bg-amber-500 border-amber-500"
                            : "border-gray-300 bg-white"
                      }`}
                    >
                      {isCompleted ? (
                        <span className="text-white font-bold">✓</span>
                      ) : (
                        <Icon
                          className={`w-6 h-6 ${
                            isActive ? "text-white" : "text-gray-400"
                          }`}
                        />
                      )}
                    </div>

                    {/* Connecting Line */}
                    {index < STEPS.length - 1 && (
                      <div
                        className={`absolute top-6 left-12 h-1 ${
                          index < statusIndex
                            ? "w-full"
                            : "w-full border-t-2 border-dashed border-gray-300"
                        }`}
                        style={{
                          width: "calc(100vw / 6 - 2rem)",
                          backgroundColor:
                            index < statusIndex ? "#22c55e" : "transparent",
                        }}
                      />
                    )}
                  </div>

                  {/* Step Label */}
                  <div className="text-center">
                    <p
                      className={`font-semibold text-sm ${
                        isCompleted
                          ? "text-foreground"
                          : "text-muted-foreground"
                      }`}
                    >
                      {step.label}
                    </p>
                    {isActive && (
                      <Badge variant="secondary" className="mt-2">
                        Current Status
                      </Badge>
                    )}
                  </div>

                  {/* Timestamp */}
                  {isCompleted && order[`${step.id}_at`] && (
                    <p className="text-xs text-muted-foreground mt-2">
                      {new Date(order[`${step.id}_at`]).toLocaleDateString(
                        "en-NG"
                      )}
                    </p>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Mobile Tracker - Vertical */}
        <div className="md:hidden space-y-4">
          {STEPS.slice(0, 5).map((step, index) => {
            const isCompleted = index <= statusIndex
            const isActive = index === statusIndex
            const Icon = step.icon

            return (
              <div key={step.id}>
                <div className="flex gap-4">
                  {/* Vertical Line */}
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                        isCompleted
                          ? "bg-green-500 border-green-500"
                          : isActive
                            ? "bg-amber-500 border-amber-500"
                            : "border-gray-300 bg-white"
                      }`}
                    >
                      {isCompleted ? (
                        <span className="text-white font-bold text-lg">✓</span>
                      ) : (
                        <Icon
                          className={`w-5 h-5 ${
                            isActive ? "text-white" : "text-gray-400"
                          }`}
                        />
                      )}
                    </div>
                    {index < STEPS.length - 1 && (
                      <div
                        className={`w-0.5 h-12 mt-2 ${
                          isCompleted ? "bg-green-500" : "border-l-2 border-dashed border-gray-300"
                        }`}
                      />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 pt-1 pb-4">
                    <p className="font-semibold text-sm text-foreground">
                      {step.label}
                    </p>
                    {isActive && (
                      <Badge variant="secondary" className="mt-1 text-xs">
                        Current Status
                      </Badge>
                    )}
                    {isActive && (
                      <p className="text-xs text-muted-foreground mt-2">
                        {step.subtitle}
                      </p>
                    )}
                    {isCompleted && order[`${step.id}_at`] && (
                      <p className="text-xs text-muted-foreground mt-2">
                        {new Date(order[`${step.id}_at`]).toLocaleDateString(
                          "en-NG",
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          }
                        )}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </Card>
  )
}
