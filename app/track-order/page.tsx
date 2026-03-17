import { Metadata } from "next"
import { Suspense } from "react"
import { TrackOrderClient } from "./track-order-client"
import { Package, Search } from "lucide-react"

export const metadata: Metadata = {
  title: "Track Your Order | Hamduk Islamic Foundation",
  description:
    "Track your HIF shop order in real time. See live delivery status, download digital products, and get updates at every step.",
  openGraph: {
    title: "Track Your Order | HIF Shop",
    description: "Live order tracking for HIF shop customers.",
    url: "https://www.hif.com.ng/track-order",
  },
}

export default function TrackOrderPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-950 via-emerald-900 to-background">
      {/* ── Page Hero ─────────────────────────────────────────── */}
      <div className="relative overflow-hidden border-b border-emerald-800/40 bg-emerald-950/80 pb-16 pt-14">
        {/* Geometric background pattern */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d4af37' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          {/* Icon badge */}
          <div className="mb-5 inline-flex items-center justify-center rounded-full border border-amber-500/30 bg-amber-500/10 p-4">
            <Package className="h-8 w-8 text-amber-400" />
          </div>

          {/* Arabic bismillah */}
          <p className="mb-3 font-arabic text-lg text-emerald-300/70 tracking-widest">
            بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ
          </p>

          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Track Your Order
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-emerald-200/70">
            Enter your order reference or email address to see your live
            delivery status and manage your purchases.
          </p>

          {/* Trust indicators */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-emerald-300/60">
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Live status updates
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Secure order lookup
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Instant digital downloads
            </span>
          </div>
        </div>
      </div>

      {/* ── Main Content ──────────────────────────────────────── */}
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <Suspense fallback={<TrackOrderPageSkeleton />}>
          <TrackOrderClient />
        </Suspense>
      </div>
    </div>
  )
}

// ── Skeleton ────────────────────────────────────────────────────

function TrackOrderPageSkeleton() {
  return (
    <div className="space-y-6" aria-busy="true" aria-label="Loading order tracker">
      {/* Search form skeleton */}
      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        {/* Tab bar */}
        <div className="flex border-b border-border">
          <div className="h-12 w-1/2 animate-pulse bg-muted/60" />
          <div className="h-12 w-1/2 animate-pulse bg-muted/30" />
        </div>
        {/* Input + button */}
        <div className="space-y-4 p-6">
          <div className="h-5 w-32 animate-pulse rounded bg-muted" />
          <div className="h-12 w-full animate-pulse rounded-lg bg-muted" />
          <div className="h-11 w-full animate-pulse rounded-lg bg-muted/70" />
        </div>
      </div>

      {/* Order summary card skeleton */}
      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <div className="border-b border-border p-6">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div className="h-4 w-28 animate-pulse rounded bg-muted" />
              <div className="h-6 w-48 animate-pulse rounded bg-muted" />
            </div>
            <div className="h-8 w-20 animate-pulse rounded-full bg-muted" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4 p-6 sm:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-1.5">
              <div className="h-3 w-20 animate-pulse rounded bg-muted/60" />
              <div className="h-5 w-28 animate-pulse rounded bg-muted" />
            </div>
          ))}
        </div>
      </div>

      {/* Visual tracker skeleton */}
      <div className="overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="mb-8 h-5 w-40 animate-pulse rounded bg-muted" />

        {/* Desktop tracker steps */}
        <div className="hidden sm:block">
          <div className="relative flex items-start justify-between">
            {/* Connector line */}
            <div className="absolute left-0 right-0 top-5 h-0.5 animate-pulse bg-muted" />
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="relative flex flex-col items-center gap-3">
                <div className="h-10 w-10 animate-pulse rounded-full bg-muted" />
                <div className="h-3 w-16 animate-pulse rounded bg-muted" />
                <div className="h-2.5 w-14 animate-pulse rounded bg-muted/60" />
              </div>
            ))}
          </div>
        </div>

        {/* Mobile tracker steps */}
        <div className="space-y-6 sm:hidden">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-start gap-4">
              <div className="flex flex-col items-center">
                <div className="h-9 w-9 animate-pulse rounded-full bg-muted" />
                {i < 3 && <div className="mt-1 h-8 w-0.5 animate-pulse bg-muted" />}
              </div>
              <div className="flex-1 space-y-1.5 pt-1">
                <div className="h-4 w-32 animate-pulse rounded bg-muted" />
                <div className="h-3 w-24 animate-pulse rounded bg-muted/60" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Order items skeleton */}
      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <div className="border-b border-border px-6 py-4">
          <div className="h-5 w-28 animate-pulse rounded bg-muted" />
        </div>
        <div className="divide-y divide-border">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 p-6">
              <div className="h-16 w-16 flex-shrink-0 animate-pulse rounded-lg bg-muted" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-48 animate-pulse rounded bg-muted" />
                <div className="h-3 w-20 animate-pulse rounded bg-muted/60" />
              </div>
              <div className="space-y-1 text-right">
                <div className="h-4 w-16 animate-pulse rounded bg-muted" />
                <div className="h-3 w-12 animate-pulse rounded bg-muted/60" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
