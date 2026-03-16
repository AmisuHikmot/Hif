"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Download, Share2 } from "lucide-react"
import { QRCodeSVG } from "qrcode.react"
import { useRef } from "react"
import { useToast } from "@/hooks/use-toast"

interface QrCodeModalProps {
  isOpen: boolean
  onClose: () => void
  reference: string
}

export function QrCodeModal({ isOpen, onClose, reference }: QrCodeModalProps) {
  const qrRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  const trackingUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/track-order?ref=${reference}`

  const handleDownload = () => {
    const svg = qrRef.current?.querySelector("svg")
    if (!svg) return

    const canvas = document.createElement("canvas")
    const svgData = new XMLSerializer().serializeToString(svg)
    const img = new Image()

    img.onload = () => {
      canvas.width = img.width
      canvas.height = img.height
      const ctx = canvas.getContext("2d")
      if (ctx) {
        ctx.fillStyle = "white"
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        ctx.drawImage(img, 0, 0)
        const link = document.createElement("a")
        link.download = `order-${reference}-qr.png`
        link.href = canvas.toDataURL()
        link.click()
        toast({
          description: "QR code downloaded successfully",
        })
      }
    }

    img.src = "data:image/svg+xml;base64," + btoa(svgData)
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Track Order ${reference}`,
          text: "Track my order on HIF",
          url: trackingUrl,
        })
      } catch (err) {
        console.error("[v0] Share error:", err)
      }
    } else {
      await navigator.clipboard.writeText(trackingUrl)
      toast({
        description: "Tracking link copied to clipboard",
      })
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Order Tracking QR Code</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center gap-6 py-6">
          <div ref={qrRef} className="p-4 bg-white rounded-lg border">
            <QRCodeSVG
              value={trackingUrl}
              size={220}
              bgColor="#ffffff"
              fgColor="#064e3b"
              level="H"
              includeMargin={true}
            />
          </div>

          <div className="text-center">
            <p className="font-medium text-sm text-muted-foreground">{reference}</p>
            <p className="text-xs text-muted-foreground mt-1">
              Scan to track this order
            </p>
          </div>

          <div className="flex gap-3 w-full">
            <Button
              onClick={handleDownload}
              variant="outline"
              className="flex-1"
              size="sm"
            >
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
            <Button
              onClick={handleShare}
              variant="outline"
              className="flex-1"
              size="sm"
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
