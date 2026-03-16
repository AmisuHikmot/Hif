import { Metadata } from "next"
import { Suspense } from "react"
import { TrackOrderClient } from "./track-order-client"

export const metadata: Metadata = {
  title: "Track Your Order | Hamduk Islamic Foundation",
  description: "Track your HIF shop order and see the live delivery status",
}

export default function TrackOrderPage() {
  return (
    <Suspense fallback={<TrackOrderPageSkeleton />}>
      <TrackOrderClient />
    </Suspense>
  )
}

function TrackOrderPageSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="h-10 w-48 animate-pulse rounded bg-muted" />
          <div className="mt-2 h-6 w-96 animate-pulse rounded bg-muted" />
        </div>
        <div className="space-y-6">
          <div className="h-64 animate-pulse rounded-lg bg-muted" />
          <div className="h-96 animate-pulse rounded-lg bg-muted" />
        </div>
      </div>
    </div>
  )
}
