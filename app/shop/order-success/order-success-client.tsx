"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { CheckCircle2, Download, Loader2, AlertCircle } from "lucide-react"
import { formatPrice } from "@/lib/shop"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface Order {
  id: string
  reference: string
  customer_name: string
  customer_email: string
  customer_phone: string
  subtotal: number
  shipping_fee: number
  discount_amount: number
  total: number
  payment_status: string
  has_digital: boolean
  created_at: string
}

interface OrderItem {
  id: string
  product_name: string
  product_type: string
  quantity: number
  unit_price: number
  subtotal: number
}

interface DownloadItem {
  id: string
  product_id: string
  download_token: string
  product_name: string
  product: {
    name: string
  }
}

interface OrderSuccessClientProps {
  reference: string
}

export function OrderSuccessClient({ reference }: OrderSuccessClientProps) {
  const [order, setOrder] = useState<Order | null>(null)
  const [items, setItems] = useState<OrderItem[]>([])
  const [downloads, setDownloads] = useState<DownloadItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [downloadingId, setDownloadingId] = useState<string | null>(null)

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const supabase = createClient()

        // Fetch order
        const { data: orderData, error: orderError } = await supabase
          .from("shop_orders_enhanced")
          .select("*")
          .eq("reference", reference)
          .single()

        if (orderError || !orderData) {
          setError("Order not found")
          setLoading(false)
          return
        }

        setOrder(orderData)

        // Fetch order items
        const { data: itemsData } = await supabase
          .from("shop_order_items_enhanced")
          .select("*")
          .eq("order_id", orderData.id)

        if (itemsData) {
          setItems(itemsData)
        }

        // Fetch digital downloads if applicable
        if (orderData.has_digital) {
          const { data: downloadsData } = await supabase
            .from("shop_digital_downloads")
            .select("id, product_id, download_token, shop_products_enhanced:product_id(name)")
            .eq("order_id", orderData.id)

          if (downloadsData) {
            setDownloads(
              downloadsData.map((d: any) => ({
                ...d,
                product_name: d.shop_products_enhanced?.name || "Unknown Product",
              }))
            )
          }
        }
      } catch (err) {
        setError("Failed to fetch order details")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchOrderDetails()
  }, [reference])

  const handleDownload = async (downloadItem: DownloadItem) => {
    try {
      setDownloadingId(downloadItem.id)

      const response = await fetch(
        `/api/shop/download?token=${downloadItem.download_token}`
      )

      if (!response.ok) {
        const error = await response.json()
        alert(error.error || "Download failed")
        return
      }

      const data = await response.json()

      // Trigger download
      const link = document.createElement("a")
      link.href = data.downloadUrl
      link.target = "_blank"
      link.click()
    } catch (err) {
      alert("Failed to initiate download")
      console.error(err)
    } finally {
      setDownloadingId(null)
    }
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="text-center">
          <Loader2 className="mx-auto mb-4 h-8 w-8 animate-spin" />
          <p>Loading your order details...</p>
        </div>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error || "Order not found"}</AlertDescription>
        </Alert>
        <div className="mt-6 flex justify-center">
          <Button asChild>
            <Link href="/shop">Return to Shop</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8 space-y-8">
      {/* Success Header */}
      <div className="text-center">
        <CheckCircle2 className="mx-auto mb-4 h-12 w-12 text-green-600" />
        <h1 className="text-3xl font-bold">Order Successful!</h1>
        <p className="mt-2 text-muted-foreground">
          Thank you for your purchase. Your order confirmation has been sent to{" "}
          <strong>{order.customer_email}</strong>
        </p>
      </div>

      {/* Order Reference */}
      <Card className="p-6">
        <div className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">Order Reference</p>
            <p className="font-mono text-lg font-semibold">{order.reference}</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Order Date</p>
              <p className="font-medium">
                {new Date(order.created_at).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <p className="font-medium capitalize">{order.payment_status}</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Order Items */}
      <Card className="p-6">
        <h2 className="mb-4 text-lg font-semibold">Order Items</h2>
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.id} className="flex gap-4 pb-4 last:pb-0 last:border-b-0 border-b">
              <div className="flex-1">
                <h3 className="font-semibold">{item.product_name}</h3>
                <p className="text-sm text-muted-foreground capitalize">
                  {item.product_type}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground">
                  {item.quantity} × {formatPrice(item.unit_price)}
                </p>
                <p className="font-semibold">{formatPrice(item.subtotal)}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Digital Downloads */}
      {downloads.length > 0 && (
        <Card className="p-6 border-green-200 bg-green-50">
          <h2 className="mb-4 text-lg font-semibold flex items-center gap-2">
            <Download className="h-5 w-5" />
            Digital Downloads
          </h2>
          <p className="mb-4 text-sm text-muted-foreground">
            Your digital products are ready to download. Download links expire in 72 hours and
            can be used up to 3 times.
          </p>
          <div className="space-y-2">
            {downloads.map((download) => (
              <Button
                key={download.id}
                onClick={() => handleDownload(download)}
                disabled={downloadingId === download.id}
                variant="outline"
                className="w-full justify-start"
              >
                {downloadingId === download.id ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Downloading...
                  </>
                ) : (
                  <>
                    <Download className="mr-2 h-4 w-4" />
                    {download.product_name}
                  </>
                )}
              </Button>
            ))}
          </div>
        </Card>
      )}

      {/* Order Summary */}
      <Card className="p-6">
        <h2 className="mb-4 text-lg font-semibold">Order Summary</h2>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Subtotal</span>
            <span>{formatPrice(order.subtotal)}</span>
          </div>
          {order.shipping_fee > 0 && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">Shipping</span>
              <span>{formatPrice(order.shipping_fee)}</span>
            </div>
          )}
          {order.discount_amount > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Discount</span>
              <span>-{formatPrice(order.discount_amount)}</span>
            </div>
          )}
          <Separator />
          <div className="flex justify-between text-base font-semibold">
            <span>Total</span>
            <span>{formatPrice(order.total)}</span>
          </div>
        </div>
      </Card>

      {/* Customer Info */}
      <Card className="p-6">
        <h2 className="mb-4 text-lg font-semibold">Delivery Information</h2>
        <div className="space-y-3 text-sm">
          <div>
            <p className="text-muted-foreground">Name</p>
            <p className="font-medium">{order.customer_name}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Email</p>
            <p className="font-medium">{order.customer_email}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Phone</p>
            <p className="font-medium">{order.customer_phone}</p>
          </div>
        </div>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button asChild className="flex-1">
          <Link href="/shop">Continue Shopping</Link>
        </Button>
        <Button variant="outline" asChild className="flex-1">
          <Link href="/dashboard">View Orders</Link>
        </Button>
      </div>

      <p className="text-center text-sm text-muted-foreground">
        A detailed receipt has been sent to your email address
      </p>
    </div>
  )
}
