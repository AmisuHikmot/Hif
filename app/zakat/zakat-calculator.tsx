"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"

// Nisab by weight: 85 g of gold or 595 g of silver. Rate: 2.5% of net zakatable wealth held for a lunar year.
const GOLD_NISAB_G = 85
const SILVER_NISAB_G = 595

const naira = (n: number) => `₦${Math.round(n).toLocaleString()}`

export default function ZakatCalculator() {
  const [v, setV] = useState<Record<string, string>>({})
  const [basis, setBasis] = useState<"gold" | "silver">("silver")
  const n = (k: string) => Math.max(0, Number(v[k]) || 0)
  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) => setV({ ...v, [k]: e.target.value })

  const assets = n("cash") + n("savings") + n("gold") + n("silver") + n("invest") + n("stock") + n("owed")
  const net = Math.max(0, assets - n("debts"))
  const pricePerGram = basis === "gold" ? n("goldPrice") : n("silverPrice")
  const nisab = pricePerGram * (basis === "gold" ? GOLD_NISAB_G : SILVER_NISAB_G)
  const ready = pricePerGram > 0
  const due = ready && net >= nisab ? net * 0.025 : 0

  const Field = ({ k, label, hint }: { k: string; label: string; hint?: string }) => (
    <div className="space-y-1">
      <Label htmlFor={k}>{label}</Label>
      <Input id={k} inputMode="decimal" placeholder="0" value={v[k] ?? ""} onChange={set(k)} />
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  )

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">Enter amounts in naira. Nothing is stored or sent anywhere.</p>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field k="cash" label="Cash in hand" />
        <Field k="savings" label="Bank balances" />
        <Field k="gold" label="Value of gold you own" />
        <Field k="silver" label="Value of silver you own" />
        <Field k="invest" label="Investments and shares" />
        <Field k="stock" label="Business stock for sale" />
        <Field k="owed" label="Money owed to you (expected back)" />
        <Field k="debts" label="Debts due now" hint="Subtracted from the total." />
      </div>

      <div className="space-y-3 rounded-lg border p-4">
        <p className="text-sm font-medium">Nisab threshold</p>
        <div className="flex gap-4 text-sm">
          <label className="flex items-center gap-2">
            <input type="radio" checked={basis === "silver"} onChange={() => setBasis("silver")} /> Silver (595 g)
          </label>
          <label className="flex items-center gap-2">
            <input type="radio" checked={basis === "gold"} onChange={() => setBasis("gold")} /> Gold (85 g)
          </label>
        </div>
        {basis === "gold" ? (
          <Field k="goldPrice" label="Today's price of 1 gram of gold" hint="Check a current local price." />
        ) : (
          <Field k="silverPrice" label="Today's price of 1 gram of silver" hint="Check a current local price." />
        )}
      </div>

      <Card>
        <CardContent className="space-y-1 pt-6 text-sm">
          <div className="flex justify-between"><span>Net zakatable wealth</span><span>{naira(net)}</span></div>
          {ready && <div className="flex justify-between"><span>Nisab</span><span>{naira(nisab)}</span></div>}
          <div className="flex justify-between pt-2 text-lg font-semibold">
            <span>Zakat due (2.5%)</span>
            <span>{ready ? naira(due) : "Enter a price above"}</span>
          </div>
          {ready && net < nisab && <p className="pt-2 text-muted-foreground">Your wealth is below the nisab, so no zakat is due on this estimate.</p>}
          <p className="pt-3 text-xs text-muted-foreground">
            Zakat applies to wealth held for a full lunar year. Different schools treat some items differently; ask a scholar if unsure.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
