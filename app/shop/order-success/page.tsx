import { Metadata } from "next"
import { Suspense } from "react"
import { OrderSuccessClient } from "./order-success-client"

export const metadata: Metadata = {
  title: "Order Successful | HIF",
  description: "Your order has been successfully placed",
}

interface OrderSuccessPageProps {
  searchParams: {
    ref?: string
  }
}

export default function OrderSuccessPage({ searchParams }: OrderSuccessPageProps) {
  const reference = searchParams.ref

  if (!reference) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Invalid Order Reference</h1>
          <p className="mt-2 text-muted-foreground">No order reference was provided</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Suspense fallback={<OrderLoadingState />}>
        <OrderSuccessClient reference={reference} />
      </Suspense>
    </div>
  )
}

function OrderLoadingState() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="animate-pulse">
        <div className="h-12 w-32 rounded bg-muted mx-auto mb-4"></div>
        <div className="space-y-4">
          <div className="h-4 w-full rounded bg-muted"></div>
          <div className="h-4 w-3/4 rounded bg-muted"></div>
        </div>
      </div>
    </div>
  )
}
