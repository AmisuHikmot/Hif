import type { ReactNode } from "react"
import AdminNav from "@/components/admin/admin-nav"

export default function ConsoleShell({
  title,
  intro,
  children,
}: {
  title: string
  intro?: string
  children: ReactNode
}) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid gap-8 md:grid-cols-[256px_1fr]">
        <AdminNav />
        <main className="min-w-0">
          <h1 className="text-3xl font-bold">{title}</h1>
          {intro && <p className="mt-2 mb-6 text-muted-foreground">{intro}</p>}
          <div className="mt-6 space-y-6">{children}</div>
        </main>
      </div>
    </div>
  )
}
