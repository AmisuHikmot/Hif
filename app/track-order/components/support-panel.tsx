"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Mail, MessageCircle } from "lucide-react"

interface SupportPanelProps {
  reference: string
  email: string
}

export function SupportPanel({ reference, email }: SupportPanelProps) {
  const whatsappNumber = "+2349167656667"
  const whatsappMessage = encodeURIComponent(
    `Assalamu alaykum, I need help with order ${reference}`
  )

  return (
    <Card className="p-6 sm:p-8">
      <h3 className="text-xl font-bold mb-6">Need Help With Your Order?</h3>
      <div className="grid gap-4 sm:grid-cols-2">
        <a
          href={`mailto:support@hif.com.ng?subject=Order%20Enquiry%20—%20${reference}`}
          className="w-full"
        >
          <Button variant="outline" className="w-full justify-start gap-2">
            <Mail className="h-4 w-4" />
            Email Support
          </Button>
        </a>
        <a
          href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full"
        >
          <Button variant="outline" className="w-full justify-start gap-2">
            <MessageCircle className="h-4 w-4" />
            WhatsApp Support
          </Button>
        </a>
      </div>
      <p className="text-xs text-muted-foreground mt-4">
        support@hif.com.ng | WhatsApp: {whatsappNumber}
      </p>
    </Card>
  )
}
