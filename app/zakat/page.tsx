import type { Metadata } from "next"
import ZakatCalculator from "./zakat-calculator"

export const metadata: Metadata = {
  title: "Zakat Calculator | Hamduk Islamic Foundation",
  description: "Estimate the zakat due on your savings, gold, silver, investments and business stock.",
}

export default function ZakatPage() {
  return (
    <main className="container mx-auto max-w-2xl px-4 py-12">
      <h1 className="mb-2 text-3xl font-bold tracking-tight">Zakat calculator</h1>
      <p className="mb-2 rounded-md bg-amber-50 p-3 text-sm text-amber-900 dark:bg-amber-950 dark:text-amber-100">
        Awaiting board review. This is a simple estimate, not a ruling. For your own situation, ask a qualified scholar.
      </p>
      <ZakatCalculator />
    </main>
  )
}
