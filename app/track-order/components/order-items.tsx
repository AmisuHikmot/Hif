"use client"

import { useState } from "react"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatPrice } from "@/lib/shop"
import { motion, AnimatePresence } from "framer-motion"
import {
  Package,
  Download,
  Clock,
  Lock,
  AlertCircle,
  ShoppingBag,
  CheckCircle2,
  Loader2,
} from "lucide-react"
import { toast } from "sonner"
import type { TrackingItem } from "../track-order-client"

// ── Types ──────────────────────────────────────────────────────

interface OrderItemsProps {
  items:         TrackingItem[]
  paymentStatus: string
}

type DownloadState = "idle" | "loading" | "done" | "error"

// ── Helpers ────────────────────────────────────────────────────

function getDownloadStatus(
  item: TrackingItem,
  paymentStatus: string
): {
  canDownload: boolean
  label:       string
  reason:      "available" | "payment_pending" | "expired" | "limit_reached" | "not_digital"
} {
  if (item.product_type !== "digital") {
    return { canDownload: false, label: "", reason: "not_digital" }
  }

  if (paymentStatus !== "paid") {
    return {
      canDownload: false,
      label:       "Payment pending — download unavailable",
      reason:      "payment_pending",
    }
  }

  if (!item.download_token || !item.expires_at) {
    return {
      canDownload: false,
      label:       "Payment pending — download unavailable",
      reason:      "payment_pending",
    }
  }

  const isExpired = new Date(item.expires_at) < new Date()
  if (isExpired) {
    return {
      canDownload: false,
      label:       "Download link expired",
      reason:      "expired",
    }
  }

  const limitReached =
    item.max_downloads !== null &&
    item.download_count !== null &&
    item.download_count >= item.max_downloads
  if (limitReached) {
    return {
      canDownload: false,
      label:       `Download limit reached (${item.download_count}/${item.max_downloads})`,
      reason:      "limit_reached",
    }
  }

  return {
    canDownload: true,
    label:       "Download available",
    reason:      "available",
  }
}

function formatExpiry(expiresAt: string): string {
  return new Date(expiresAt).toLocaleDateString("en-NG", {
    day:    "numeric",
    month:  "short",
    year:   "numeric",
    hour:   "2-digit",
    minute: "2-digit",
  })
}

// ── Download Button ────────────────────────────────────────────

function DownloadButton({
  item,
  paymentStatus,
}: {
  item:          TrackingItem
  paymentStatus: string
}) {
  const [state, setState] = useState<DownloadState>("idle")
  const { label, reason } = getDownloadStatus(item, paymentStatus)

  const handleDownload = async () => {
    if (!item.download_token || state === "loading") return
    setState("loading")

    try {
      // ── unchanged: your original GET pattern ──────────────
      const res = await fetch(
        `/api/shop/download?token=${item.download_token}`
      )

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error ?? "Download failed")
      }

      const { url } = await res.json()
      window.location.href = url

      setState("done")
      toast.success("Download started!", {
        description: `${item.product_name} is downloading.`,
      })
    } catch (err: any) {
      setState("error")
      toast.error("Download failed", {
        description: err.message ?? "Please try again or contact support.",
      })
      setTimeout(() => setState("idle"), 3000)
    }
  }

  // ── Payment pending ──────────────────────────────────────

  if (reason === "payment_pending") {
    return (
      <div className="flex items-center gap-1.5 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-700">
        <Clock className="h-3.5 w-3.5 flex-shrink-0" />
        {label}
      </div>
    )
  }

  // ── Expired ──────────────────────────────────────────────

  if (reason === "expired") {
    return (
      <div className="space-y-1.5">
        <div className="flex items-center gap-1.5 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
          <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
          {label}
        </div>
        <Button
          asChild
          variant="ghost"
          size="sm"
          className="h-auto w-full px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground"
        >
          <a
            href={`mailto:support@hif.com.ng?subject=${encodeURIComponent(
              "Download Extension Request"
            )}&body=${encodeURIComponent(
              `Assalamu Alaykum,\n\nI would like to request a download extension for:\nProduct: ${item.product_name}\n\nJazakAllahu Khairan.`
            )}`}
          >
            Request extension →
          </a>
        </Button>
      </div>
    )
  }

  // ── Limit reached ────────────────────────────────────────

  if (reason === "limit_reached") {
    return (
      <div className="space-y-1.5">
        <div className="flex items-center gap-1.5 rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-600">
          <Lock className="h-3.5 w-3.5 flex-shrink-0" />
          {label}
        </div>
        <Button
          asChild
          variant="ghost"
          size="sm"
          className="h-auto w-full px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground"
        >
          <a
            href={`mailto:support@hif.com.ng?subject=${encodeURIComponent(
              "Download Limit Reset Request"
            )}&body=${encodeURIComponent(
              `Assalamu Alaykum,\n\nI have reached the download limit for:\nProduct: ${item.product_name}\n\nCould you please assist?\n\nJazakAllahu Khairan.`
            )}`}
          >
            Contact support →
          </a>
        </Button>
      </div>
    )
  }

  // ── Available ────────────────────────────────────────────

  return (
    <div className="space-y-1.5">
      <Button
        onClick={handleDownload}
        disabled={state === "loading" || state === "done"}
        size="sm"
        className="w-full gap-2 bg-emerald-700 text-white hover:bg-emerald-600"
      >
        {state === "loading" && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
        {state === "done"    && <CheckCircle2 className="h-3.5 w-3.5" />}
        {state === "idle"    && <Download className="h-3.5 w-3.5" />}
        {state === "error"   && <AlertCircle className="h-3.5 w-3.5" />}
        {state === "loading" ? "Preparing..."  :
         state === "done"    ? "Downloaded"    :
         state === "error"   ? "Try Again"     :
                               "Download"}
      </Button>

      {/* Expiry + usage counter */}
      {item.expires_at && (
        <p className="text-center text-[11px] text-muted-foreground">
          Expires {formatExpiry(item.expires_at)}
          {item.download_count !== null && item.max_downloads !== null && (
            <> · {item.download_count}/{item.max_downloads} downloads used</>
          )}
        </p>
      )}
    </div>
  )
}

// ── Single item row ──────────────────────────────────────────

function OrderItemRow({
  item,
  index,
  paymentStatus,
}: {
  item:          TrackingItem
  index:         number
  paymentStatus: string
}) {
  const isDigital = item.product_type === "digital"

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.3 }}
      className={`rounded-xl border p-4 transition-colors ${
        isDigital
          ? "border-violet-200 bg-violet-50/40"
          : "border-border bg-background"
      }`}
    >
      <div className="flex gap-4">
        {/* Product image */}
        <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg border border-border bg-muted">
          {item.image_url ? (
            <Image
              src={item.image_url}
              alt={item.product_name}
              fill
              className="object-cover"
              sizes="64px"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              {isDigital ? (
                <Download className="h-6 w-6 text-muted-foreground/40" />
              ) : (
                <Package className="h-6 w-6 text-muted-foreground/40" />
              )}
            </div>
          )}
        </div>

        {/* Details */}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="truncate font-semibold leading-tight text-foreground">
                {item.product_name}
              </p>
              <div className="mt-1.5 flex flex-wrap items-center gap-2">
                {/* Type badge */}
                <Badge
                  variant="secondary"
                  className={`text-xs font-medium ${
                    isDigital
                      ? "border-violet-200 bg-violet-100 text-violet-700"
                      : "border-blue-200 bg-blue-100 text-blue-700"
                  }`}
                >
                  {isDigital ? (
                    <><Download className="mr-1 h-3 w-3" />Digital</>
                  ) : (
                    <><Package className="mr-1 h-3 w-3" />Physical</>
                  )}
                </Badge>

                {/* Quantity */}
                <span className="text-xs text-muted-foreground">
                  Qty:{" "}
                  <span className="font-medium text-foreground">
                    {item.quantity}
                  </span>
                </span>

                {/* Unit price */}
                <span className="text-xs text-muted-foreground">
                  {formatPrice(item.unit_price)} each
                </span>
              </div>
            </div>

            {/* Subtotal */}
            <div className="text-right">
              <p className="font-bold text-foreground">
                {formatPrice(item.subtotal)}
              </p>
            </div>
          </div>

          {/* Digital download section */}
          <AnimatePresence>
            {isDigital && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mt-3 border-t border-violet-200/60 pt-3"
              >
                <DownloadButton item={item} paymentStatus={paymentStatus} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  )
}

// ── Main Component ───────────────────────────────────────────

export function OrderItems({ items, paymentStatus }: OrderItemsProps) {
  if (!items || items.length === 0) return null

  const physicalItems = items.filter((i) => i.product_type === "physical")
  const digitalItems  = items.filter((i) => i.product_type === "digital")
  const hasDigital    = digitalItems.length > 0
  const hasPhysical   = physicalItems.length > 0

  return (
    <Card className="overflow-hidden">
      <CardHeader className="border-b border-border bg-muted/30 px-6 py-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base font-semibold">
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
            Order Items
            <span className="ml-1 rounded-full bg-muted px-2 py-0.5 text-xs font-normal text-muted-foreground">
              {items.length} {items.length === 1 ? "item" : "items"}
            </span>
          </CardTitle>

          {/* Type summary badges */}
          <div className="flex gap-1.5">
            {hasPhysical && (
              <Badge
                variant="outline"
                className="border-blue-200 bg-blue-50 text-xs text-blue-700"
              >
                {physicalItems.length} Physical
              </Badge>
            )}
            {hasDigital && (
              <Badge
                variant="outline"
                className="border-violet-200 bg-violet-50 text-xs text-violet-700"
              >
                {digitalItems.length} Digital
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4 sm:p-6">
        {/* Digital download notice */}
        <AnimatePresence>
          {hasDigital && paymentStatus === "paid" && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mb-4 flex items-start gap-2.5 rounded-lg border border-violet-200 bg-violet-50 p-3 text-sm text-violet-800"
            >
              <Download className="mt-0.5 h-4 w-4 flex-shrink-0 text-violet-600" />
              <p>
                Your digital{" "}
                {digitalItems.length === 1 ? "product is" : "products are"} ready
                to download. Links expire 72 hours after payment.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Items list */}
        <div className="space-y-3">
          {items.map((item, index) => (
            <OrderItemRow
              key={item.id ?? index}
              item={item}
              index={index}
              paymentStatus={paymentStatus}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
