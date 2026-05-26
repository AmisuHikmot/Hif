"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getCartItemCount, getCartTotal, formatPrice } from "@/lib/shop"

export function CartBanner() {
  const [itemCount, setItemCount] = useState(0)
  const [total, setTotal] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const updateCart = () => {
      const count = getCartItemCount()
      setItemCount(count)
      setTotal(getCartTotal())
      setIsVisible(count > 0)
    }

    // Initial load
    updateCart()

    // Listen for cart updates
    window.addEventListener("cart-updated", updateCart)
    return () => window.removeEventListener("cart-updated", updateCart)
  }, [])

  if (!isVisible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-primary text-primary-foreground p-4 shadow-lg">
      <div className="mx-auto max-w-7xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <ShoppingCart className="h-5 w-5" />
          <div>
            <p className="font-semibold">
              {itemCount} {itemCount === 1 ? "item" : "items"} in cart
            </p>
            <p className="text-sm opacity-90">Total: {formatPrice(total)}</p>
          </div>
        </div>
        <Link href="/cart">
          <Button variant="secondary" className="gap-2">
            View Cart & Checkout
          </Button>
        </Link>
      </div>
    </div>
  )
}
