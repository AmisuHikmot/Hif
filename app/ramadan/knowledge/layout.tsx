import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Ramadan Knowledge | HIF",
  description: "Learn the rulings, virtues and etiquette of Ramadan.",
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
