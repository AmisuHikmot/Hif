"use client"

import { useRef, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Download, Share2, Check, Copy, ExternalLink } from "lucide-react"
import { QRCodeSVG } from "qrcode.react"
import { useToast } from "@/hooks/use-toast"
import { motion, AnimatePresence } from "framer-motion"

// ── Types ──────────────────────────────────────────────────────

interface QrCodeModalProps {
  isOpen:    boolean
  onClose:   () => void
  reference: string
}

// ── Main Component ─────────────────────────────────────────────

export function QrCodeModal({ isOpen, onClose, reference }: QrCodeModalProps) {
  const qrRef                           = useRef<HTMLDivElement>(null)
  const { toast }                       = useToast()
  const [downloadState, setDownloadState] = useState<"idle" | "loading" | "done">("idle")
  const [shareState, setShareState]       = useState<"idle" | "done">("idle")
  const [copyState, setCopyState]         = useState<"idle" | "done">("idle")

  // ── unchanged: your original trackingUrl ──────────────────
  const trackingUrl = `${
    typeof window !== "undefined" ? window.location.origin : ""
  }/track-order?ref=${reference}`

  // ── unchanged: your original download logic ───────────────
  const handleDownload = () => {
    const svg = qrRef.current?.querySelector("svg")
    if (!svg) return

    setDownloadState("loading")

    const canvas  = document.createElement("canvas")
    const svgData = new XMLSerializer().serializeToString(svg)
    const img     = new Image()

    img.onload = () => {
      canvas.width  = img.width
      canvas.height = img.height
      const ctx = canvas.getContext("2d")
      if (ctx) {
        ctx.fillStyle = "white"
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        ctx.drawImage(img, 0, 0)
        const link      = document.createElement("a")
        link.download   = `order-${reference}-qr.png`
        link.href       = canvas.toDataURL()
        link.click()

        setDownloadState("done")
        toast({ description: "QR code downloaded successfully" })
        setTimeout(() => setDownloadState("idle"), 2500)
      }
    }
    img.src = "data:image/svg+xml;base64," + btoa(svgData)
  }

  // ── unchanged: your original share logic ──────────────────
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Track Order ${reference}`,
          text:  "Track my order on HIF",
          url:   trackingUrl,
        })
        setShareState("done")
        setTimeout(() => setShareState("idle"), 2500)
      } catch (err) {
        console.error("[v0] Share error:", err)
      }
    } else {
      await navigator.clipboard.writeText(trackingUrl)
      setShareState("done")
      toast({ description: "Tracking link copied to clipboard" })
      setTimeout(() => setShareState("idle"), 2500)
    }
  }

  // ── Copy reference to clipboard ────────────────────────────
  const handleCopyReference = async () => {
    await navigator.clipboard.writeText(reference)
    setCopyState("done")
    toast({ description: "Order reference copied" })
    setTimeout(() => setCopyState("idle"), 2500)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-sm overflow-hidden p-0">
        {/* ── Header ──────────────────────────────────────── */}
        <DialogHeader className="border-b border-border bg-muted/40 px-6 py-4">
          <DialogTitle className="flex items-center gap-2 text-base">
            {/* Mini QR icon */}
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4 text-emerald-700"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <rect x="3"  y="3"  width="7" height="7" rx="1" />
              <rect x="14" y="3"  width="7" height="7" rx="1" />
              <rect x="3"  y="14" width="7" height="7" rx="1" />
              <rect x="14" y="14" width="3" height="3" />
              <rect x="19" y="14" width="2" height="2" />
              <rect x="14" y="19" width="2" height="2" />
              <rect x="18" y="18" width="3" height="3" />
            </svg>
            Order Tracking QR Code
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center gap-5 px-6 pb-6 pt-5">
          {/* ── QR code block ────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 18 }}
            className="relative"
          >
            {/* Outer decorative frame */}
            <div className="rounded-2xl border-2 border-emerald-100 bg-white p-1 shadow-md">
              {/* Corner accents */}
              <div className="pointer-events-none absolute inset-2 z-10">
                <div className="absolute left-0  top-0    h-5 w-5 rounded-tl-lg border-l-2 border-t-2 border-emerald-600" />
                <div className="absolute right-0 top-0    h-5 w-5 rounded-tr-lg border-r-2 border-t-2 border-emerald-600" />
                <div className="absolute bottom-0 left-0  h-5 w-5 rounded-bl-lg border-b-2 border-l-2 border-emerald-600" />
                <div className="absolute bottom-0 right-0 h-5 w-5 rounded-br-lg border-b-2 border-r-2 border-emerald-600" />
              </div>

              {/* ── unchanged: your original QRCodeSVG ───── */}
              <div ref={qrRef} className="p-3">
                <QRCodeSVG
                  value={trackingUrl}
                  size={200}
                  bgColor="#ffffff"
                  fgColor="#064e3b"
                  level="H"
                  includeMargin={true}
                />
              </div>
            </div>
          </motion.div>

          {/* ── Reference + scan hint ────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="w-full text-center"
          >
            {/* Reference pill — tap to copy */}
            <button
              onClick={handleCopyReference}
              className="group inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/50 px-3 py-1.5 transition-colors hover:border-emerald-200 hover:bg-emerald-50"
              title="Copy reference"
            >
              <span className="font-mono text-xs font-medium text-foreground">
                {reference}
              </span>
              <AnimatePresence mode="wait">
                {copyState === "done" ? (
                  <motion.span
                    key="check"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                  >
                    <Check className="h-3 w-3 text-emerald-600" />
                  </motion.span>
                ) : (
                  <motion.span
                    key="copy"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                  >
                    <Copy className="h-3 w-3 text-muted-foreground group-hover:text-emerald-600" />
                  </motion.span>
                )}
              </AnimatePresence>
            </button>

            <p className="mt-2 text-xs text-muted-foreground">
              Scan with any camera app to track this order
            </p>

            {/* Open in browser link */}
            
              href={trackingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 inline-flex items-center gap-1 text-[11px] text-emerald-700 hover:underline"
            >
              Open tracking page
              <ExternalLink className="h-2.5 w-2.5" />
            </a>
          </motion.div>

          {/* ── Action buttons ───────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid w-full grid-cols-2 gap-2"
          >
            {/* Download */}
            <Button
              onClick={handleDownload}
              variant="outline"
              size="sm"
              disabled={downloadState === "loading"}
              className="gap-2"
            >
              <AnimatePresence mode="wait">
                {downloadState === "done" ? (
                  <motion.span
                    key="done"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="flex items-center gap-2"
                  >
                    <Check className="h-4 w-4 text-emerald-600" />
                    Saved!
                  </motion.span>
                ) : downloadState === "loading" ? (
                  <motion.span
                    key="loading"
                    className="flex items-center gap-2"
                  >
                    <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-muted border-t-foreground" />
                    Saving...
                  </motion.span>
                ) : (
                  <motion.span
                    key="idle"
                    className="flex items-center gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Download
                  </motion.span>
                )}
              </AnimatePresence>
            </Button>

            {/* Share */}
            <Button
              onClick={handleShare}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              <AnimatePresence mode="wait">
                {shareState === "done" ? (
                  <motion.span
                    key="done"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="flex items-center gap-2"
                  >
                    <Check className="h-4 w-4 text-emerald-600" />
                    Shared!
                  </motion.span>
                ) : (
                  <motion.span
                    key="idle"
                    className="flex items-center gap-2"
                  >
                    <Share2 className="h-4 w-4" />
                    Share
                  </motion.span>
                )}
              </AnimatePresence>
            </Button>
          </motion.div>

          {/* ── Footer note ──────────────────────────────── */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center text-[11px] text-muted-foreground"
          >
            Share this QR code with someone to let them track your delivery.
          </motion.p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
