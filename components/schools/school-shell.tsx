import Link from "next/link"
import type { ReactNode } from "react"

export default function SchoolShell({
  title,
  intro,
  crumbs = [],
  children,
}: {
  title: string
  intro?: string
  crumbs?: { href: string; label: string }[]
  children: ReactNode
}) {
  return (
    <div className="container mx-auto max-w-5xl px-4 py-8">
      {crumbs.length > 0 && (
        <nav className="mb-3 text-sm text-muted-foreground">
          {crumbs.map((c, i) => (
            <span key={c.href}>
              {i > 0 && " / "}
              <Link href={c.href} className="hover:underline">
                {c.label}
              </Link>
            </span>
          ))}
        </nav>
      )}
      <h1 className="text-3xl font-bold">{title}</h1>
      {intro && <p className="mt-2 text-muted-foreground">{intro}</p>}
      <div className="mt-6 space-y-6">{children}</div>
    </div>
  )
}
