"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowRight, ArrowLeft } from "lucide-react"
import { formatPrice } from "@/lib/shop"

interface Order {
  id: string
  reference: string
  customer_name: string
  total: number
  order_status: string
  created_at: string
}

interface OrderListProps {
  orders: Order[]
  onSelectOrder: (order: Order) => void
  onBack?: () => void
}

const STATUS_COLORS: Record<string, string> = {
  pending: "border-amber-200 bg-amber-50 text-amber-700",
  processing: "border-blue-200 bg-blue-50 text-blue-700",
  ready_for_dispatch: "border-indigo-200 bg-indigo-50 text-indigo-700",
  out_for_delivery: "border-purple-200 bg-purple-50 text-purple-700",
  delivered: "border-emerald-200 bg-emerald-50 text-emerald-700",
  cancelled: "border-red-200 bg-red-50 text-red-700",
}

const STATUS_LABELS: Record<string, string> = {
  pending: "Order Placed",
  processing: "Processing",
  ready_for_dispatch: "Ready for Dispatch",
  out_for_delivery: "Out for Delivery",
  delivered: "Delivered",
  cancelled: "Cancelled",
}

export function OrderList({ orders, onSelectOrder, onBack }: OrderListProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Your Orders</h2>
          <p className="text-sm text-muted-foreground">
            {orders.length} {orders.length === 1 ? "order" : "orders"} found
          </p>
        </div>
        {onBack && (
          <Button variant="outline" size="sm" onClick={onBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        )}
      </div>

      <div className="space-y-3">
        {orders.map((order) => (
          <Card
            key={order.id}
            className="cursor-pointer overflow-hidden border transition-all hover:shadow-md"
            onClick={() => onSelectOrder(order)}
          >
            <div className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="font-mono text-sm text-muted-foreground">{order.reference}</p>
                  <p className="mt-1 font-semibold">{order.customer_name}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className={STATUS_COLORS[order.order_status] || "border-gray-200 bg-gray-50"}
                    >
                      {STATUS_LABELS[order.order_status] || order.order_status}
                    </Badge>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{formatPrice(order.total)}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(order.created_at).toLocaleDateString()}
                  </p>
                  <ArrowRight className="mt-2 h-4 w-4 text-muted-foreground" />
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
