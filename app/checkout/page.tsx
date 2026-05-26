import { Metadata } from "next"
import { CheckoutClient } from "./checkout-client"

export const metadata: Metadata = {
  title: "Checkout | HIF",
  description: "Complete your purchase securely",
}

export default function CheckoutPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Checkout</h1>
          <p className="mt-2 text-muted-foreground">Complete your order information below</p>
        </div>

        <CheckoutClient />
      </div>
    </div>
  )
}
