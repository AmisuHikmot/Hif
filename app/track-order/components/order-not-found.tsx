"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { HelpCircle } from "lucide-react"
import Link from "next/link"

export function OrderNotFound() {
  return (
    <Card className="p-8 text-center">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
        <HelpCircle className="h-8 w-8 text-gray-600" />
      </div>
      <h3 className="text-2xl font-bold text-foreground mb-2">Order Not Found</h3>
      <p className="text-muted-foreground mb-6">
        We couldn't find an order matching your details. Please double-check your reference or email.
      </p>
      <div className="flex gap-3 justify-center flex-wrap">
        <Link href="/shop">
          <Button variant="outline">Continue Shopping</Button>
        </Link>
        <a href="mailto:support@hif.com.ng?subject=Order%20Inquiry">
          <Button variant="default">Contact Support</Button>
        </a>
      </div>
    </Card>
  )
}
