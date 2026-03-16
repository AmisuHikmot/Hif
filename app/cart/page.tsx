import { Metadata } from "next"
import Link from "next/link"
import { ShoppingCartClient } from "./shopping-cart-client"

export const metadata: Metadata = {
  title: "Shopping Cart | HIF",
  description: "Review and manage your shopping cart",
}

export default function CartPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Shopping Cart</h1>
        </div>

        <ShoppingCartClient />
      </div>
    </div>
  )
}
