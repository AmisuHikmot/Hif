import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Ramadan Charity | HIF",
  description: "Give zakat, sadaqah and fitr through the Hamduk Islamic Foundation this Ramadan.",
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
