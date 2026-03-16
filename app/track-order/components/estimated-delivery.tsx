"use client"

import { Card } from "@/components/ui/card"
import { Calendar, Clock } from "lucide-react"
import { useEffect, useState } from "react"

interface EstimatedDeliveryProps {
  date: string
}

export function EstimatedDelivery({ date }: EstimatedDeliveryProps) {
  const [timeLeft, setTimeLeft] = useState("")

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date()
      const deliveryDate = new Date(date)
      const diff = deliveryDate.getTime() - now.getTime()

      if (diff <= 0) {
        setTimeLeft("Today")
        return
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24))
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24)
      const minutes = Math.floor((diff / 1000 / 60) % 60)

      setTimeLeft(`${days}d ${hours}h ${minutes}m`)
    }

    updateCountdown()
    const interval = setInterval(updateCountdown, 60000) // Update every minute

    return () => clearInterval(interval)
  }, [date])

  const deliveryDate = new Date(date)
  const formattedDate = deliveryDate.toLocaleDateString("en-NG", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <Card className="p-4 bg-blue-50 border-blue-200">
      <div className="flex gap-3 items-start">
        <Calendar className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="font-medium text-blue-900">Estimated Delivery</p>
          <p className="text-sm text-blue-800 mt-1">{formattedDate}</p>
          <div className="flex items-center gap-1 text-sm text-blue-700 mt-2">
            <Clock className="h-4 w-4" />
            Arriving in {timeLeft}
          </div>
        </div>
      </div>
    </Card>
  )
}
