import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Payment status | HIF",
  description: "Payment confirmation.",
  robots: { index: false, follow: false },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
