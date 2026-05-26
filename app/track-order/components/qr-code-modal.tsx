"use client"

import { useRef, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Download, Share2, Check, Copy, ExternalLink } from "lucide-react"
import { QRCodeSVG } from "qrcode.react"
import { useToast } from "@/hooks/use-toast"
import { motion, AnimatePresence } from "framer-motion"

interface QrCodeModalProps {
  isOpen: boolean
  onClose: () => void
  reference: string
}

export function QrCodeModal({ isOpen, onClose, reference }: QrCodeModalProps) {
  const qrRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()
  const [downloadState, setDownloadState] = useState<"idle" | "loading" | "done">("idle")
  const [shareState, setShareState] = useState<"idle" | "done">("idle")
  const [copyState, setCopyState] = useState<"idle" | "done">("idle")

  const trackingUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/track-order?ref=${reference}`

  const handleDownload = () => {
    const svg = qrRef.current?.querySelector("svg")
    if (!svg) return
    setDownloadState("loading")
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
        setDownloadState("done")
        toast({ description: "QR code downloaded successfully" })
        setTimeout(() => setDownloadState("idle"), 2500)
      }
    }
    img.src = "data:image/svg+xml;base64," + btoa(svgData)
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: `Track Order ${reference}`, text: "Track my order on HIF", url: trackingUrl })
        setShareState("done")
        setTimeout(() => setShareState("idle"), 2500)
      } catch (err) { console.error("[v0] Share error:", err) }
    } else {
      await navigator.clipboard.writeText(trackingUrl)
      setShareState("done")
      toast({ description: "Tracking link copied to clipboard" })
      setTimeout(() => setShareState("idle"), 2500)
    }
  }

  const handleCopyReference = async () => {
    await navigator.clipboard.writeText(reference)
    setCopyState("done")
    toast({ description: "Order reference copied" })
    setTimeout(() => setCopyState("idle"), 2500)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-sm overflow-hidden p-0">
        <DialogHeader className="border-b border-border bg-muted/40 px-6 py-4">
          <DialogTitle className="text-base">Order Tracking QR Code</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center gap-5 px-6 pb-6 pt-5">
          <motion.div initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 200, damping: 18 }}>
            <div className="rounded-2xl border-2 border-emerald-100 bg-white p-1 shadow-md">
              <div ref={qrRef} className="p-3">
                <QRCodeSVG value={trackingUrl} size={200} bgColor="#ffffff" fgColor="#064e3b" level="H" includeMargin={true} />
              </div>
            </div>
          </motion.div>
          <div className="w-full text-center">
            <button onClick={handleCopyReference} className="group inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/50 px-3 py-1.5 transition-colors hover:border-emerald-200 hover:bg-emerald-50">
              <span className="font-mono text-xs font-medium text-foreground">{reference}</span>
              <AnimatePresence mode="wait">
                {copyState === "done" ? (
                  <motion.span key="check" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                    <Check className="h-3 w-3 text-emerald-600" />
                  </motion.span>
                ) : (
                  <motion.span key="copy" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                    <Copy className="h-3 w-3 text-muted-foreground group-hover:text-emerald-600" />
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
            <p className="mt-2 text-xs text-muted-foreground">Scan with any camera app to track this order</p>
            <a href={trackingUrl} target="_blank" rel="noopener noreferrer" className="mt-1 inline-flex items-center gap-1 text-[11px] text-emerald-700 hover:underline">
              Open tracking page<ExternalLink className="h-2.5 w-2.5" />
            </a>
          </div>
          <div className="grid w-full grid-cols-2 gap-2">
            <button onClick={handleDownload} disabled={downloadState === "loading"} className="flex items-center justify-center gap-2 rounded-md border border-border bg-background px-3 py-2 text-sm font-medium hover:bg-muted disabled:opacity-60">
              {downloadState === "done" ? (<><Check className="h-4 w-4 text-emerald-600" />Saved!</>) : downloadState === "loading" ? (<><span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-muted border-t-foreground" />Saving...</>) : (<><Download className="h-4 w-4" />Download</>)}
            </button>
            <button onClick={handleShare} className="flex items-center justify-center gap-2 rounded-md border border-border bg-background px-3 py-2 text-sm font-medium hover:bg-muted">
              {shareState === "done" ? (<><Check className="h-4 w-4 text-emerald-600" />Shared!</>) : (<><Share2 className="h-4 w-4" />Share</>)}
            </button>
          </div>
          <p className="text-center text-[11px] text-muted-foreground">Share this QR code to let someone track your delivery.</p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
