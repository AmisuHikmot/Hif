"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import {
  PackageSearch,
  ShoppingBag,
  Mail,
  MessageCircle,
  Phone,
  ChevronRight,
  RefreshCcw,
} from "lucide-react"
import Link from "next/link"

// ── Types ──────────────────────────────────────────────────────

interface OrderNotFoundProps {
  onTryAgain?: () => void
}

// ── Support links ──────────────────────────────────────────────

const SUPPORT_OPTIONS = [
  {
    icon:  <Mail className="h-4 w-4" />,
    label: "Email Support",
    sub:   "support@hif.com.ng",
    href:  `mailto:support@hif.com.ng?subject=${encodeURIComponent(
      "Order Lookup Help"
    )}&body=${encodeURIComponent(
      "Assalamu Alaykum,\n\nI am having trouble finding my order.\n\nJazakAllahu Khairan."
    )}`,
    color: "hover:border-emerald-200 hover:bg-emerald-50/50",
    iconColor: "text-emerald-600",
  },
  {
    icon:  <MessageCircle className="h-4 w-4" />,
    label: "WhatsApp Us",
    sub:   "Quick response",
    href:  `https://wa.me/+2348000000000?text=${encodeURIComponent(
      "Assalamu Alaykum, I am having trouble finding my order. Could you please help?"
    )}`,
    color: "hover:border-green-200 hover:bg-green-50/50",
    iconColor: "text-green-600",
    external: true,
  },
  {
    icon:  <Phone className="h-4 w-4" />,
    label: "Call Us",
    sub:   "+234 800 000 0000",
    href:  "tel:+2348000000000",
    color: "hover:border-blue-200 hover:bg-blue-50/50",
    iconColor: "text-blue-600",
  },
]

// ── Tips ───────────────────────────────────────────────────────

const TIPS = [
  "Check your confirmation email for the exact reference",
  "References look like: shop_1773663154271_0c5fe5e8",
  "Make sure you're using the email used at checkout",
  "Orders may take a few minutes to appear after payment",
]

// ── Main Component ─────────────────────────────────────────────

export function OrderNotFound({ onTryAgain }: OrderNotFoundProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-4"
    >
      {/* Main not-found card */}
      <Card className="overflow-hidden">
        {/* Top accent */}
        <div className="h-1 w-full bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400" />

        <div className="p-8 text-center">
          {/* Animated icon */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.15, type: "spring", stiffness: 200, damping: 15 }}
            className="mb-5 inline-flex items-center justify-center rounded-full border-4 border-amber-100 bg-amber-50 p-5"
          >
            <PackageSearch className="h-10 w-10 text-amber-500" />
          </motion.div>

          {/* Text */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            <h3 className="text-2xl font-bold text-foreground">
              Order Not Found
            </h3>
            <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
              We couldn't find an order matching your details. Please
              double-check your reference number or email address and try again.
            </p>
          </motion.div>

          {/* Action buttons */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="mt-6 flex flex-wrap items-center justify-center gap-3"
          >
            {onTryAgain && (
              <Button
                onClick={onTryAgain}
                className="gap-2 bg-emerald-700 text-white hover:bg-emerald-600"
              >
                <RefreshCcw className="h-4 w-4" />
                Try Again
              </Button>
            )}
            <Link href="/shop">
              <Button variant="outline" className="gap-2">
                <ShoppingBag className="h-4 w-4" />
                Continue Shopping
              </Button>
            </Link>
          </motion.div>
        </div>
      </Card>

      {/* Helpful tips card */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="overflow-hidden border-border">
          <div className="border-b border-border bg-muted/40 px-5 py-3">
            <p className="text-sm font-semibold text-foreground">
              💡 Helpful tips
            </p>
          </div>
          <ul className="divide-y divide-border">
            {TIPS.map((tip, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.45 + i * 0.07 }}
                className="flex items-start gap-3 px-5 py-3 text-sm text-muted-foreground"
              >
                <span className="mt-0.5 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-muted text-[10px] font-bold text-foreground">
                  {i + 1}
                </span>
                {tip}
              </motion.li>
            ))}
          </ul>
        </Card>
      </motion.div>

      {/* Support options */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card className="overflow-hidden border-border">
          <div className="border-b border-border bg-muted/40 px-5 py-3">
            <p className="text-sm font-semibold text-foreground">
              Still can't find it? Contact us
            </p>
          </div>
          <div className="divide-y divide-border">
            {SUPPORT_OPTIONS.map((option, i) => (
              <motion.a
                key={i}
                href={option.href}
                target={option.external ? "_blank" : undefined}
                rel={option.external ? "noopener noreferrer" : undefined}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.65 + i * 0.07 }}
                className={`flex items-center gap-3 px-5 py-3.5 transition-colors ${option.color}`}
              >
                <span
                  className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-muted ${option.iconColor}`}
                >
                  {option.icon}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">
                    {option.label}
                  </p>
                  <p className="text-xs text-muted-foreground">{option.sub}</p>
                </div>
                <ChevronRight className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
              </motion.a>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Islamic closing */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
        className="text-center text-xs text-muted-foreground"
      >
        We'll do our best to help. JazakAllahu Khairan for your patience.
      </motion.p>
    </motion.div>
  )
}
