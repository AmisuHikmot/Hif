"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Spinner } from "@/components/ui/spinner"
import { Search, Mail } from "lucide-react"
import { TrackingResults } from "./components/tracking-results"
import { OrderNotFound } from "./components/order-not-found"
import { OrderList } from "./components/order-list"

interface Order {
  id: string
  reference: string
  customer_name: string
  customer_email: string
  delivery_address: string
  total: number
  subtotal: number
  shipping_fee: number
  discount_amount: number
  payment_status: string
  order_status: string
  status_note: string
  has_digital: boolean
  estimated_delivery_date: string
  created_at: string
  payment_confirmed_at: string
  processing_at: string
  ready_for_dispatch_at: string
  out_for_delivery_at: string
  delivered_at: string
  cancelled_at: string
  cancellation_reason: string
  shop_order_items_enhanced: any[]
  order_status_history: any[]
}

export function TrackOrderClient() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const [activeTab, setActiveTab] = useState("reference")
  const [reference, setReference] = useState("")
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [order, setOrder] = useState<Order | null>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [error, setError] = useState("")
  const [searchCompleted, setSearchCompleted] = useState(false)

  // Auto-search if reference is in URL
  useEffect(() => {
    const urlRef = searchParams.get("ref")
    if (urlRef) {
      setReference(urlRef)
      setActiveTab("reference")
      handleSearchByReference(urlRef)
    }
  }, [searchParams])

  const handleSearchByReference = async (searchRef?: string) => {
    const refToSearch = searchRef || reference
    if (!refToSearch.trim()) {
      setError("Please enter a valid order reference")
      return
    }

    // Validate format
    const refRegex = /^shop-\d{8}-[A-Z0-9]{4,}$/i
    if (!refRegex.test(refToSearch)) {
      setError("Please enter a valid HIF shop order reference (e.g., shop-20260316-XXXX)")
      return
    }

    setIsLoading(true)
    setError("")
    setOrder(null)
    setOrders([])

    try {
      const response = await fetch(`/api/track-order?reference=${encodeURIComponent(refToSearch)}`)
      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "Order not found")
        setSearchCompleted(true)
        return
      }

      setOrder(data.order)
      setSearchCompleted(true)
      router.push(`/track-order?ref=${refToSearch}`, { scroll: false })
    } catch (err) {
      console.error("[v0] Search error:", err)
      setError("Failed to search for order. Please try again.")
      setSearchCompleted(true)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearchByEmail = async () => {
    if (!email.trim()) {
      setError("Please enter your email address")
      return
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError("Please enter a valid email address")
      return
    }

    setIsLoading(true)
    setError("")
    setOrder(null)
    setOrders([])

    try {
      const response = await fetch(`/api/track-order?email=${encodeURIComponent(email)}`)
      const data = await response.json()

      if (!response.ok) {
        setError(data.error || "No orders found for this email")
        setSearchCompleted(true)
        return
      }

      setOrders(data.orders || [])
      setSearchCompleted(true)
    } catch (err) {
      console.error("[v0] Search error:", err)
      setError("Failed to search for orders. Please try again.")
      setSearchCompleted(true)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSelectOrder = (selectedOrder: Order) => {
    setOrder(selectedOrder)
    setOrders([])
    setSearchCompleted(true)
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl">
        {/* Hero Section */}
        <div className="mb-12 text-center">
          <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground">
            Track Your Order
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Enter your order reference or email address to see your live delivery status
          </p>
        </div>

        {/* Search Form */}
        {!order && (
          <Card className="p-6 sm:p-8 mb-8">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="reference" className="flex items-center gap-2">
                  <Search className="h-4 w-4" />
                  Track by Reference
                </TabsTrigger>
                <TabsTrigger value="email" className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Track by Email
                </TabsTrigger>
              </TabsList>

              {/* Reference Tab */}
              <TabsContent value="reference" className="space-y-4 mt-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Order Reference</label>
                  <Input
                    placeholder="e.g., shop-20260316-XXXX"
                    value={reference}
                    onChange={(e) => {
                      setReference(e.target.value)
                      setError("")
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleSearchByReference()
                      }
                    }}
                  />
                  {error && <p className="mt-1 text-sm text-destructive">{error}</p>}
                </div>
                <Button
                  onClick={() => handleSearchByReference()}
                  disabled={isLoading}
                  className="w-full"
                  size="lg"
                >
                  {isLoading ? (
                    <>
                      <Spinner className="mr-2 h-4 w-4" />
                      Searching...
                    </>
                  ) : (
                    "Track Order"
                  )}
                </Button>
              </TabsContent>

              {/* Email Tab */}
              <TabsContent value="email" className="space-y-4 mt-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Email Address</label>
                  <Input
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      setError("")
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleSearchByEmail()
                      }
                    }}
                  />
                  {error && <p className="mt-1 text-sm text-destructive">{error}</p>}
                </div>
                <Button
                  onClick={handleSearchByEmail}
                  disabled={isLoading}
                  className="w-full"
                  size="lg"
                >
                  {isLoading ? (
                    <>
                      <Spinner className="mr-2 h-4 w-4" />
                      Searching...
                    </>
                  ) : (
                    "Find My Orders"
                  )}
                </Button>
              </TabsContent>
            </Tabs>
          </Card>
        )}

        {/* Results */}
        {searchCompleted && !order && orders.length === 0 && (
          <OrderNotFound />
        )}

        {orders.length > 0 && (
          <OrderList orders={orders} onSelectOrder={handleSelectOrder} />
        )}

        {order && (
          <TrackingResults order={order} onBackClick={() => setOrder(null)} />
        )}
      </div>
    </div>
  )
}
