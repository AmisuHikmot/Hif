import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "School console | HIF",
  description: "School administration.",
  robots: { index: false, follow: false },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
