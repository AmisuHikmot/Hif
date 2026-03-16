"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Mail, AlertCircle, Wifi, WifiOff } from "lucide-react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { toast } from "sonner"
import { motion, AnimatePresence } from "framer-motion"

import { TrackingResults }    from "./components/tracking-results"
import { OrderNotFound }      from "./components/order-not-found"
import { OrderList }          from "./components/order-list"
import { TrackOrderSkeleton } from "./components/track-order-skeleton"

// ── Types ──────────────────────────────────────────────────────

export type OrderStatus =
  | "pending"
  | "processing"
  | "ready_for_dispatch"
  | "out_for_delivery"
  | "delivered"
  | "cancelled"

export type PaymentStatus = "pending" | "paid" | "failed"

export interface StatusHistoryEntry {
  id:         string
  status:     OrderStatus
  note:       string | null
  changed_at: string
}

export interface TrackingItem {
  id:             string
  product_name:   string
  product_type:   "physical" | "digital"
  quantity:       number
  unit_price:     number
  subtotal:       number
  image_url?:     string | null
  download_token: string | null
  expires_at:     string | null
  download_count: number | null
  max_downloads:  number | null
}

export interface TrackingOrder {
  id:                      string
  reference:               string
  customer_name:           string
  customer_email:          string
  delivery_address:        string
  total:                   number
  subtotal:                number
  shipping_fee:            number
  discount_amount:         number
  payment_status:          PaymentStatus
  order_status:            OrderStatus
  status_note:             string | null
  has_digital:             boolean
  estimated_delivery_date: string | null
  created_at:              string
  payment_confirmed_at:    string | null
  processing_at:           string | null
  ready_for_dispatch_at:   string | null
  out_for_delivery_at:     string | null
  delivered_at:            string | null
  cancelled_at:            string | null
  cancellation_reason:     string | null
  shop_order_items_enhanced: TrackingItem[]       // ← unchanged
  order_status_history:      StatusHistoryEntry[] // ← unchanged
}

export interface OrderSummary {
  id:             string
  reference:      string
  created_at:     string
  order_status:   OrderStatus
  payment_status: PaymentStatus
  total:          number
}

// ── Status label helpers ───────────────────────────────────────

export function getStatusLabel(status: OrderStatus): string {
  const labels: Record<OrderStatus, string> = {
    pending:            "Order Placed",
    processing:         "Processing",
    ready_for_dispatch: "Ready for Dispatch",
    out_for_delivery:   "Out for Delivery",
    delivered:          "Delivered",
    cancelled:          "Cancelled",
  }
  return labels[status] ?? status
}

export function getPaymentStatusLabel(status: PaymentStatus): string {
  const labels: Record<PaymentStatus, string> = {
    pending: "Payment Pending",
    paid:    "Payment Confirmed",
    failed:  "Payment Failed",
  }
  return labels[status] ?? status
}

// ── Reference validation ───────────────────────────────────────

const REF_REGEX = /^shop_\d{13}_[a-f0-9]{8}$/i

// ── Main Component ─────────────────────────────────────────────

export function TrackOrderClient() {
  const searchParams = useSearchParams()
  const router       = useRouter()
  const supabase     = createClientComponentClient()

  const realtimeChannelRef = useRef<ReturnType<typeof supabase.channel> | null>(null)
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // ── State ────────────────────────────────────────────────

  const [activeTab,         setActiveTab]         = useState<"reference" | "email">("reference")
  const [reference,         setReference]         = useState("")
  const [email,             setEmail]             = useState("")
  const [isLoading,         setIsLoading]         = useState(false)
  const [order,             setOrder]             = useState<TrackingOrder | null>(null)
  const [orders,            setOrders]            = useState<OrderSummary[]>([])
  const [referenceError,    setReferenceError]    = useState("")
  const [emailError,        setEmailError]        = useState("")
  const [searchCompleted,   setSearchCompleted]   = useState(false)
  const [realtimeConnected, setRealtimeConnected] = useState(false)
  const [hasAutoSearched,   setHasAutoSearched]   = useState(false)

  // ── Search by reference ──────────────────────────────────

  const handleSearchByReference = useCallback(
    async (searchRef?: string) => {
      const refToSearch = (searchRef ?? reference)?.trim() ?? ""

      if (!refToSearch) {
        setReferenceError("Please enter a valid order reference")
        return
      }

      if (!REF_REGEX.test(refToSearch)) {
        setReferenceError(
          "Please enter a valid HIF order reference (e.g. shop_1773663154271_0c5fe5e8)"
        )
        return
      }

      setIsLoading(true)
      setReferenceError("")
      setEmailError("")
      setOrder(null)
      setOrders([])
      setSearchCompleted(false)

      try {
        // ── unchanged: your original API route ──────────────
        const res  = await fetch(`/api/track-order?reference=${encodeURIComponent(refToSearch)}`)
        const data = await res.json()

        if (!res.ok) {
          setReferenceError(data.error ?? "Order not found")
          setSearchCompleted(true)
          return
        }

        setOrder(data.order)
        setSearchCompleted(true)
        router.push(`/track-order?ref=${refToSearch}`, { scroll: false })
      } catch {
        setReferenceError("Something went wrong. Please try again.")
        setSearchCompleted(true)
      } finally {
        setIsLoading(false)
      }
    },
    [reference, router]
  )

  // ── Search by email ──────────────────────────────────────

  const handleSearchByEmail = useCallback(async () => {
    const trimmedEmail = email?.trim() ?? ""

    if (!trimmedEmail) {
      setEmailError("Please enter your email address")
      return
    }

    if (!/^\S+@\S+\.\S+$/.test(trimmedEmail)) {
      setEmailError("Please enter a valid email address")
      return
    }

    setIsLoading(true)
    setEmailError("")
    setReferenceError("")
    setOrder(null)
    setOrders([])
    setSearchCompleted(false)

    try {
      // ── unchanged: your original API route ──────────────
      const res  = await fetch(`/api/track-order?email=${encodeURIComponent(trimmedEmail)}`)
      const data = await res.json()

      if (!res.ok) {
        setEmailError(data.error ?? "No orders found for this email address")
        setSearchCompleted(true)
        return
      }

      setOrders(data.orders ?? [])
      setSearchCompleted(true)
    } catch {
      setEmailError("Something went wrong. Please try again.")
      setSearchCompleted(true)
    } finally {
      setIsLoading(false)
    }
  }, [email])

  // ── Select order from email list ─────────────────────────

  const handleSelectOrder = useCallback((selectedOrder: TrackingOrder) => {
    setOrder(selectedOrder)
    setOrders([])
  }, [])

  // ── Go back to search ────────────────────────────────────

  const handleBackToSearch = useCallback(() => {
    setOrder(null)
    setOrders([])
    setSearchCompleted(false)
    setReferenceError("")
    setEmailError("")
    router.push("/track-order", { scroll: false })
    if (realtimeChannelRef.current) {
      supabase.removeChannel(realtimeChannelRef.current)
      realtimeChannelRef.current = null
    }
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current)
      pollingIntervalRef.current = null
    }
  }, [router, supabase])

  // ── Auto-search from URL ?ref= ───────────────────────────

  useEffect(() => {
    if (hasAutoSearched) return
    const urlRef = searchParams.get("ref")
    if (urlRef) {
      const trimmed = urlRef.trim()
      setReference(trimmed)
      setActiveTab("reference")
      setHasAutoSearched(true)
      handleSearchByReference(trimmed)
    }
  }, [searchParams, hasAutoSearched, handleSearchByReference])

  // ── Supabase Realtime subscription ───────────────────────
  // NOTE: table names below must match your actual Supabase
  // tables. Update "shop_orders_enhanced" and
  // "order_status_history" if your names differ.

  useEffect(() => {
    if (!order?.id) return
    if (order.order_status === "delivered" || order.order_status === "cancelled") return

    if (realtimeChannelRef.current) {
      supabase.removeChannel(realtimeChannelRef.current)
    }

    const channel = supabase
      .channel(`order-tracking-${order.id}`)
      .on(
        "postgres_changes",
        {
          event:  "UPDATE",
          schema: "public",
          table:  "shop_orders_enhanced", // ← your actual orders table
          filter: `id=eq.${order.id}`,
        },
        (payload) => {
          const updated = payload.new as TrackingOrder
          setOrder((prev) =>
            prev ? {
              ...prev,
              order_status:            updated.order_status,
              payment_status:          updated.payment_status,
              status_note:             updated.status_note,
              estimated_delivery_date: updated.estimated_delivery_date,
              payment_confirmed_at:    updated.payment_confirmed_at,
              processing_at:           updated.processing_at,
              ready_for_dispatch_at:   updated.ready_for_dispatch_at,
              out_for_delivery_at:     updated.out_for_delivery_at,
              delivered_at:            updated.delivered_at,
              cancelled_at:            updated.cancelled_at,
              cancellation_reason:     updated.cancellation_reason,
            } : prev
          )
          toast.success("📦 Order status updated!", {
            description: getStatusLabel(updated.order_status),
            duration:    5000,
          })
        }
      )
      .on(
        "postgres_changes",
        {
          event:  "INSERT",
          schema: "public",
          table:  "order_status_history", // ← your actual history table
          filter: `order_id=eq.${order.id}`,
        },
        (payload) => {
          const newEntry = payload.new as StatusHistoryEntry
          setOrder((prev) =>
            prev ? {
              ...prev,
              order_status_history: [newEntry, ...prev.order_status_history],
            } : prev
          )
        }
      )
      .subscribe((status) => {
        setRealtimeConnected(status === "SUBSCRIBED")
      })

    realtimeChannelRef.current = channel

    const handleFocus = () => {
      if (!realtimeConnected) channel.subscribe()
    }
    window.addEventListener("focus", handleFocus)

    return () => {
      supabase.removeChannel(channel)
      window.removeEventListener("focus", handleFocus)
    }
  }, [order?.id, supabase])

  // ── Polling fallback (60s) ───────────────────────────────

  useEffect(() => {
    if (!order?.id) return
    if (order.order_status === "delivered" || order.order_status === "cancelled") return
    if (realtimeConnected) return

    pollingIntervalRef.current = setInterval(async () => {
      try {
        // ── unchanged: your original API route ──────────
        const res = await fetch(
          `/api/track-order?reference=${encodeURIComponent(order.reference)}`
        )
        if (!res.ok) return
        const data = await res.json()
        if (data.order && data.order.order_status !== order.order_status) {
          setOrder(data.order)
          toast.info("📦 Order status updated", {
            description: getStatusLabel(data.order.order_status),
          })
        }
      } catch {
        // silently ignore polling errors
      }
    }, 60_000)

    return () => {
      if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current)
    }
  }, [order?.id, order?.reference, order?.order_status, realtimeConnected])

  // ── Cleanup on unmount ───────────────────────────────────

  useEffect(() => {
    return () => {
      if (realtimeChannelRef.current) supabase.removeChannel(realtimeChannelRef.current)
      if (pollingIntervalRef.current)  clearInterval(pollingIntervalRef.current)
    }
  }, [supabase])

  // ── Render ───────────────────────────────────────────────

  return (
    <div className="space-y-6">
      {/* Realtime connection indicator */}
      <AnimatePresence>
        {order && !order.order_status.match(/delivered|cancelled/) && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="flex justify-end"
          >
            <Badge
              variant="outline"
              className={`flex items-center gap-1.5 text-xs ${
                realtimeConnected
                  ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600"
                  : "border-amber-500/30 bg-amber-500/10 text-amber-600"
              }`}
            >
              {realtimeConnected ? (
                <><Wifi className="h-3 w-3" />Live updates active</>
              ) : (
                <><WifiOff className="h-3 w-3" />Live updates paused</>
              )}
            </Badge>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search form */}
      <AnimatePresence mode="wait">
        {!order && (
          <motion.div
            key="search"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="overflow-hidden border-border shadow-sm">
              <CardContent className="p-0">
                <Tabs
                  value={activeTab}
                  onValueChange={(v) => {
                    setActiveTab(v as "reference" | "email")
                    setReferenceError("")
                    setEmailError("")
                  }}
                  className="w-full"
                >
                  <TabsList className="grid h-auto w-full grid-cols-2 rounded-none border-b border-border bg-muted/40 p-0">
                    <TabsTrigger
                      value="reference"
                      className="flex items-center gap-2 rounded-none border-r border-border py-4 text-sm font-medium data-[state=active]:bg-background data-[state=active]:shadow-none"
                    >
                      <Search className="h-4 w-4" />
                      Track by Reference
                    </TabsTrigger>
                    <TabsTrigger
                      value="email"
                      className="flex items-center gap-2 rounded-none py-4 text-sm font-medium data-[state=active]:bg-background data-[state=active]:shadow-none"
                    >
                      <Mail className="h-4 w-4" />
                      Track by Email
                    </TabsTrigger>
                  </TabsList>

                  {/* Reference tab */}
                  <TabsContent value="reference" className="m-0 p-6 sm:p-8">
                    <div className="space-y-5">
                      <p className="text-sm text-muted-foreground">
                        You can find your order reference in your confirmation email.
                      </p>
                      <div className="space-y-2">
                        <label
                          htmlFor="order-reference"
                          className="block text-sm font-medium text-foreground"
                        >
                          Order Reference
                        </label>
                        <Input
                          id="order-reference"
                          placeholder="e.g. shop_1773663154271_0c5fe5e8"
                          value={reference}
                          onChange={(e) => {
                            setReference(e.target.value)
                            if (referenceError) setReferenceError("")
                          }}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handleSearchByReference()
                          }}
                          className={
                            referenceError
                              ? "border-destructive focus-visible:ring-destructive"
                              : ""
                          }
                          aria-describedby={referenceError ? "ref-error" : undefined}
                          aria-invalid={!!referenceError}
                        />
                        <AnimatePresence>
                          {referenceError && (
                            <motion.p
                              id="ref-error"
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              className="flex items-center gap-1.5 text-sm text-destructive"
                              role="alert"
                            >
                              <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
                              {referenceError}
                            </motion.p>
                          )}
                        </AnimatePresence>
                      </div>
                      <Button
                        onClick={() => handleSearchByReference()}
                        disabled={isLoading}
                        className="w-full bg-emerald-700 text-white hover:bg-emerald-600"
                        size="lg"
                      >
                        {isLoading ? (
                          <span className="flex items-center gap-2">
                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                            Searching...
                          </span>
                        ) : (
                          <span className="flex items-center gap-2">
                            <Search className="h-4 w-4" />
                            Track Order
                          </span>
                        )}
                      </Button>
                    </div>
                  </TabsContent>

                  {/* Email tab */}
                  <TabsContent value="email" className="m-0 p-6 sm:p-8">
                    <div className="space-y-5">
                      <p className="text-sm text-muted-foreground">
                        We'll show all orders placed with this email address.
                      </p>
                      <div className="space-y-2">
                        <label
                          htmlFor="order-email"
                          className="block text-sm font-medium text-foreground"
                        >
                          Email Address
                        </label>
                        <Input
                          id="order-email"
                          type="email"
                          placeholder="your@email.com"
                          value={email}
                          onChange={(e) => {
                            setEmail(e.target.value)
                            if (emailError) setEmailError("")
                          }}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handleSearchByEmail()
                          }}
                          className={
                            emailError
                              ? "border-destructive focus-visible:ring-destructive"
                              : ""
                          }
                          aria-describedby={emailError ? "email-error" : undefined}
                          aria-invalid={!!emailError}
                        />
                        <AnimatePresence>
                          {emailError && (
                            <motion.p
                              id="email-error"
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              className="flex items-center gap-1.5 text-sm text-destructive"
                              role="alert"
                            >
                              <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
                              {emailError}
                            </motion.p>
                          )}
                        </AnimatePresence>
                      </div>
                      <Button
                        onClick={handleSearchByEmail}
                        disabled={isLoading}
                        className="w-full bg-emerald-700 text-white hover:bg-emerald-600"
                        size="lg"
                      >
                        {isLoading ? (
                          <span className="flex items-center gap-2">
                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                            Searching...
                          </span>
                        ) : (
                          <span className="flex items-center gap-2">
                            <Mail className="h-4 w-4" />
                            Find My Orders
                          </span>
                        )}
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Loading skeleton */}
            <AnimatePresence>
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="mt-6"
                >
                  <TrackOrderSkeleton />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Order not found */}
      <AnimatePresence>
        {searchCompleted && !order && orders.length === 0 && !isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <OrderNotFound
              onTryAgain={() => {
                setSearchCompleted(false)
                setReferenceError("")
                setEmailError("")
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Email results list */}
      <AnimatePresence>
        {orders.length > 0 && !order && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <OrderList
              orders={orders}
              onSelectOrder={handleSelectOrder}
              onBack={() => {
                setOrders([])
                setSearchCompleted(false)
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Full tracking results */}
      <AnimatePresence>
        {order && (
          <motion.div
            key={order.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <TrackingResults
              order={order}
              onBackClick={handleBackToSearch}
              onOrderUpdate={setOrder}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
