"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Copy, Share2, QrCode, Printer } from "lucide-react"
import { formatPrice } from "@/lib/shop"

interface OrderSummaryProps {
  order: any
  onCopy: () => void
  onShare: () => void
  onShowQR: () => void
  onPrint: () => void
}

export function OrderSummary({
  order,
  onCopy,
  onShare,
  onShowQR,
  onPrint,
}: OrderSummaryProps) {
  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "failed":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getOrderStatusColor = (status: string) => {
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

  const orderDate = new Date(order.created_at)
  const formattedDate = orderDate.toLocaleDateString("en-NG", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })
  const formattedTime = orderDate.toLocaleTimeString("en-NG", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  })

  const [city, state] = order.delivery_address ? order.delivery_address.split(",").slice(-2) : ["", ""]

  return (
    <Card className="p-6 sm:p-8">
      <div className="grid gap-6">
        {/* Header with reference and actions */}
        <div className="flex items-start justify-between gap-4 pb-6 border-b">
          <div>
            <h2 className="text-2xl font-bold text-foreground">{order.reference}</h2>
            <p className="text-sm text-muted-foreground mt-1">
              {formattedDate} at {formattedTime}
            </p>
          </div>
          <div className="flex gap-2 flex-wrap justify-end">
            <Button size="sm" variant="outline" onClick={onCopy} title="Copy reference">
              <Copy className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="outline" onClick={onShare} title="Share tracking link">
              <Share2 className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="outline" onClick={onShowQR} title="Show QR code">
              <QrCode className="h-4 w-4" />
            </Button>
            <Button size="sm" variant="outline" onClick={onPrint} title="Print order">
              <Printer className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Order Details Grid */}
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Customer Name</p>
            <p className="font-medium">{order.customer_name}</p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground mb-1">Payment Status</p>
            <Badge className={getPaymentStatusColor(order.payment_status)}>
              {getStatusLabel(order.payment_status)}
            </Badge>
          </div>

          <div>
            <p className="text-sm text-muted-foreground mb-1">Order Status</p>
            <Badge className={getOrderStatusColor(order.order_status)}>
              {getStatusLabel(order.order_status)}
            </Badge>
          </div>

          <div>
            <p className="text-sm text-muted-foreground mb-1">Total Amount</p>
            <p className="text-xl font-bold text-primary">{formatPrice(order.total)}</p>
          </div>

          {order.delivery_address && (
            <div>
              <p className="text-sm text-muted-foreground mb-1">Delivery Location</p>
              <p className="font-medium">{city.trim()}, {state.trim()}</p>
            </div>
          )}

          {order.has_digital && (
            <div>
              <p className="text-sm text-muted-foreground mb-1">Order Type</p>
              <Badge variant="secondary">Contains Digital Downloads</Badge>
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}
