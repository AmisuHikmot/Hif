"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatPrice } from "@/lib/shop"

interface Order {
  id: string
  reference: string
  customer_name: string
  customer_email: string
  total: number
  payment_status: string
  order_status: string
  created_at: string
  shop_order_items_enhanced: any[]
}

interface OrderListProps {
  orders: Order[]
  onSelectOrder: (order: Order) => void
}

export function OrderList({ orders, onSelectOrder }: OrderListProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-blue-100 text-blue-800"
      case "processing":
        return "bg-purple-100 text-purple-800"
      case "ready_for_dispatch":
        return "bg-orange-100 text-orange-800"
      case "out_for_delivery":
        return "bg-cyan-100 text-cyan-800"
      case "delivered":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusLabel = (status: string) => {
    return status
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Your Orders</h2>
      {orders.map((order) => {
        const orderDate = new Date(order.created_at)
        const formattedDate = orderDate.toLocaleDateString("en-NG", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })

        return (
          <Card
            key={order.id}
            onClick={() => onSelectOrder(order)}
            className="p-4 cursor-pointer hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <p className="font-semibold text-foreground">{order.reference}</p>
                <p className="text-sm text-muted-foreground mt-1">{formattedDate}</p>
                {order.shop_order_items_enhanced && order.shop_order_items_enhanced.length > 0 && (
                  <p className="text-xs text-muted-foreground mt-1">
                    {order.shop_order_items_enhanced.length} item(s)
                  </p>
                )}
              </div>
              <div className="text-right">
                <p className="font-bold text-primary">{formatPrice(order.total)}</p>
                <Badge className={`${getStatusColor(order.order_status)} mt-2`}>
                  {getStatusLabel(order.order_status)}
                </Badge>
              </div>
            </div>
          </Card>
        )
      })}
    </div>
  )
}
