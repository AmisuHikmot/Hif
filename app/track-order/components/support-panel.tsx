"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from "framer-motion"
import { Mail, Phone, HeadphonesIcon, ChevronRight, Clock } from "lucide-react"

interface SupportPanelProps {
  reference: string
  email: string
}

export function SupportPanel({ reference, email }: SupportPanelProps) {
  const whatsappNumber = "+2349167656667"
  const whatsappMessage = encodeURIComponent(`Assalamu alaykum, I need help with order ${reference}`)

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
      <Card className="overflow-hidden">
        <CardHeader className="border-b border-border bg-muted/30 px-6 py-4">
          <CardTitle className="flex items-center gap-2 text-base font-semibold">
            <HeadphonesIcon className="h-4 w-4 text-muted-foreground" />
            Need Help With Your Order?
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            <motion.a initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.08 }} href={`mailto:support@hif.com.ng?subject=Order%20Enquiry%20—%20${reference}&body=${encodeURIComponent(`Assalamu Alaykum,\n\nI need help with my order: ${reference}\n\nJazakAllahu Khairan.`)}`} className="flex items-center gap-4 px-6 py-4 transition-colors hover:bg-emerald-50">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-emerald-200 bg-emerald-50 text-emerald-600">
                <Mail className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">Email Support</p>
                <p className="text-xs text-muted-foreground truncate">support@hif.com.ng</p>
              </div>
              <ChevronRight className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
            </motion.a>
            <motion.a initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.16 }} href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 px-6 py-4 transition-colors hover:bg-green-50">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-green-200 bg-green-50 text-green-600">
                <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">WhatsApp Support</p>
                <p className="text-xs text-muted-foreground truncate">{whatsappNumber}</p>
              </div>
              <ChevronRight className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
            </motion.a>
            <motion.a initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.24 }} href={`tel:${whatsappNumber}`} className="flex items-center gap-4 px-6 py-4 transition-colors hover:bg-blue-50">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-blue-200 bg-blue-50 text-blue-600">
                <Phone className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">Call Us</p>
                <p className="text-xs text-muted-foreground truncate">{whatsappNumber}</p>
              </div>
              <ChevronRight className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
            </motion.a>
          </div>
          <div className="border-t border-border bg-muted/20 px-6 py-4">
            <div className="flex items-start gap-2">
              <Clock className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-muted-foreground/60" />
              <div className="space-y-0.5">
                <p className="text-xs font-medium text-muted-foreground">Support Hours</p>
                <p className="text-xs text-muted-foreground/70">Saturday – Thursday: 9:00 AM – 6:00 PM (WAT)</p>
                <p className="text-xs text-muted-foreground/70">Friday: Closed during Jumu&apos;ah (12:00 – 2:00 PM)</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
