"use client"

import { useRef, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Download, Share2, Copy, Check } from "lucide-react"
import { QRCodeSVG } from "qrcode.react"
import { useToast } from "@/hooks/use-toast"

interface QrCodeModalProps {
  isOpen: boolean
  onClose: () => void
  orderReference: string
  shareUrl: string
}

export function QrCodeModal({ isOpen, onClose, orderReference, shareUrl }: QrCodeModalProps) {
  const qrRef = useRef<HTMLDivElement>(null)
  const [copied, setCopied] = useState(false)
  const { toast } = useToast()

  const handleDownload = () => {
    const svg = qrRef.current?.querySelector("svg")
    if (!svg) return

    const svgData = new XMLSerializer().serializeToString(svg)
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    const img = new Image()

    img.onload = () => {
      canvas.width = img.width
      canvas.height = img.height
      ctx?.drawImage(img, 0, 0)
      const link = document.createElement("a")
      link.href = canvas.toDataURL("image/png")
      link.download = `order-${orderReference}-qr.png`
      link.click()
      toast({ description: "QR code downloaded" })
    }

    img.src = `data:image/svg+xml;base64,${btoa(svgData)}`
  }

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
      toast({ description: "Link copied to clipboard" })
    } catch {
      toast({ description: "Failed to copy link", variant: "destructive" })
    }
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Track Order ${orderReference}`,
          text: "Track my order status",
          url: shareUrl,
        })
      } catch {
        // User cancelled share
      }
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-sm overflow-hidden p-0">
        <DialogHeader className="border-b px-6 py-4">
          <DialogTitle>Share Order Tracking</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 p-6">
          <div className="flex justify-center rounded-lg border border-muted bg-muted/30 p-4">
            <div ref={qrRef}>
              <QRCodeSVG
                value={shareUrl}
                size={256}
                level="H"
                includeMargin={true}
                fgColor="#000000"
                bgColor="#ffffff"
              />
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium">Order Reference</p>
            <div className="flex items-center gap-2 rounded-lg border bg-muted/30 p-3">
              <code className="flex-1 text-sm font-mono">{orderReference}</code>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium">Tracking Link</p>
            <div className="flex gap-2">
              <input
                type="text"
                value={shareUrl}
                readOnly
                className="flex-1 rounded-lg border bg-background px-3 py-2 text-sm"
              />
              <Button size="sm" variant="outline" onClick={handleCopyLink} className="px-3">
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={handleDownload}
              variant="outline"
              className="flex-1"
            >
              <Download className="mr-2 h-4 w-4" />
              Download QR
            </Button>
            {navigator.share && (
              <Button
                onClick={handleShare}
                variant="outline"
                className="flex-1"
              >
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </Button>
            )}
          </div>

          <Button onClick={onClose} className="w-full">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
