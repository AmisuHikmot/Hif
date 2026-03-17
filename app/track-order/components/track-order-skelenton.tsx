export function TrackOrderSkeleton() {
  return (
    <div className="space-y-6" aria-busy="true">
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
      <div className="overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="mb-6 h-5 w-40 animate-pulse rounded bg-muted" />
        <div className="hidden sm:flex items-start justify-between">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="relative flex flex-1 flex-col items-center gap-3">
              <div className="h-10 w-10 animate-pulse rounded-full bg-muted" />
              <div className="h-3 w-16 animate-pulse rounded bg-muted" />
              <div className="h-2.5 w-12 animate-pulse rounded bg-muted/60" />
            </div>
          ))}
        </div>
        <div className="space-y-5 sm:hidden">
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
