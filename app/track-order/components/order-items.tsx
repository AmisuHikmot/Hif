"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatPrice } from "@/lib/shop"

interface OrderItemsProps {
  items: any[]
}

export function OrderItems({ items }: OrderItemsProps) {
  if (!items || items.length === 0) {
    return null
  }

  return (
    <Card className="p-6 sm:p-8">
      <h3 className="text-xl font-bold mb-6">Order Items</h3>
      <div className="space-y-4">
        {items.map((item, index) => (
          <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex-1">
              <p className="font-medium text-foreground">{item.product_name}</p>
              <div className="flex gap-2 mt-2">
                <Badge variant="secondary" className="text-xs">
                  {item.product_type === "digital" ? "Digital" : "Physical"}
                </Badge>
                <span className="text-sm text-muted-foreground">Qty: {item.quantity}</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">
                {formatPrice(item.unit_price)} each
              </p>
              <p className="font-semibold text-foreground">
                {formatPrice(item.subtotal)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
