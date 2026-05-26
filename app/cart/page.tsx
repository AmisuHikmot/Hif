import { Metadata } from "next"
import Link from "next/link"
import { ShoppingCartClient } from "./shopping-cart-client"

export const metadata: Metadata = {
  title: "Shopping Cart | Hamduk Islamic Foundation Shop",
  description: "Review and manage your shopping cart. Proceed to checkout for Islamic books and resources from HIF.",
  keywords: ["shopping cart", "checkout", "Islamic books", "HIF shop", "online store"],
  openGraph: {
    title: "Shopping Cart | Hamduk Islamic Foundation",
    description: "Review your selected Islamic books and products before checkout.",
    url: "https://www.hif.com.ng/cart",
    type: "website",
  },
  alternates: {
    canonical: "https://www.hif.com.ng/cart",
  },
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
