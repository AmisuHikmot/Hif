import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Ramadan Daily Reminder | HIF",
  description: "A short daily reminder through Ramadan from the Hamduk Islamic Foundation.",
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
