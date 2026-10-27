"use client"

import { Button } from "@/components/ui/button"

export default function DashboardError({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="container mx-auto flex min-h-[50vh] flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="text-2xl font-bold">We couldn&apos;t load your dashboard</h1>
      <p className="text-muted-foreground">Something went wrong on our side. Your account is fine.</p>
      <Button onClick={reset}>Try again</Button>
    </div>
  )
}
