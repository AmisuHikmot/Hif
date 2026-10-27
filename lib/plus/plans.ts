/** Prices are whole naira, set here on the server; the app only names a plan. */
export const PLUS_PLANS = {
  monthly: { naira: 1500, days: 30, label: "HIF Plus, 30 days" },
  yearly: { naira: 12000, days: 365, label: "HIF Plus, 1 year" },
  pass: { naira: 400, days: 7, label: "HIF Plus, 7-day pass" },
} as const

export type PlusPlan = keyof typeof PLUS_PLANS
export const isPlusPlan = (p: unknown): p is PlusPlan => typeof p === "string" && p in PLUS_PLANS
