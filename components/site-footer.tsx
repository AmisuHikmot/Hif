"use client"

import type React from "react"
import { useState } from "react"
import { useToast } from "@/components/ui/use-toast"
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"
import { Mail, Phone, ExternalLink, ArrowRight } from "lucide-react"

// ─── Social icon SVGs (no external deps) ──────────────────────────────────────
const XIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.259 5.63L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
  </svg>
)

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
  </svg>
)

const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
)

const TikTokIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.17 8.17 0 004.78 1.52V6.75a4.85 4.85 0 01-1.01-.06z" />
  </svg>
)

const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
)

// ─── Data ─────────────────────────────────────────────────────────────────────
const SOCIAL_LINKS = [
  { icon: XIcon,        label: "X (Twitter)",  href: "https://x.com/hamdukfoundation",              color: "#e2e8f0" },
  { icon: InstagramIcon,label: "Instagram",    href: "https://instagram.com/hamdukfoundation",      color: "#e1306c" },
  { icon: FacebookIcon, label: "Facebook",     href: "https://facebook.com/hamdukfoundation",       color: "#1877f2" },
  { icon: TikTokIcon,   label: "TikTok",       href: "https://tiktok.com/@hamdukfoundation",        color: "#ff0050" },
  { icon: WhatsAppIcon, label: "WhatsApp",     href: "https://wa.me/234XXXXXXXXXX",                 color: "#25d366" },
]

const FOOTER_COLS = [
  {
    title: "Organisation",
    links: [
      { label: "History",         href: "/about/history"       },
      { label: "Vision & Mission",href: "/about/vision"        },
      { label: "Founders",        href: "/about/founders"      },
      { label: "Executives",      href: "/about/executives"    },
      { label: "Our Branches",    href: "/about/branches"      },
    ],
  },
  {
    title: "Programmes",
    links: [
      { label: "Ramadan Tafsir",  href: "/focus/ramadan-tafsir"         },
      { label: "Training",        href: "/focus/training"               },
      { label: "Advocacy",        href: "/focus/advocacy"               },
      { label: "Conferences",     href: "/conference/islam-in-nigeria"  },
      { label: "Events",          href: "/events"                       },
    ],
  },
  {
    title: "Get Involved",
    links: [
      { label: "Who Can Join",    href: "/membership/who-can-join"  },
      { label: "Registration",    href: "/membership/registration"  },
      { label: "Membership Renewal", href: "/membership/renewal"   },
      { label: "Members Directory",  href: "/members"              },
      { label: "Donate",          href: "/donate"                  },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Media Gallery",   href: "/media/gallery"           },
      { label: "Videos",          href: "/media/videos"            },
      { label: "Research Papers", href: "/publications/papers"     },
      { label: "Journals",        href: "/publications/journals"   },
      { label: "Contact Us",      href: "/contact-us"              },
    ],
  },
]

// ─── Dot separator ────────────────────────────────────────────────────────────
const Dot = () => (
  <span className="inline-block w-1 h-1 rounded-full bg-slate-600 mx-2 align-middle" />
)

// ─── Main component ───────────────────────────────────────────────────────────
export function SiteFooter() {
  const [email,     setEmail]     = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const supabase = createClient()
      const { error } = await supabase.from("newsletters").insert({
        email,
        is_active:         true,
        subscription_date: new Date().toISOString(),
      })
      if (error) {
        if (error.code === "23505") {
          toast({ title: "Already subscribed", description: "This email is already on our list.", variant: "destructive" })
        } else {
          throw error
        }
      } else {
        toast({ title: "Subscribed! 🎉", description: "You'll hear from us on our latest activities." })
        setEmail("")
      }
    } catch {
      toast({ title: "Subscription failed", description: "Please try again.", variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <footer
      className="relative overflow-hidden"
      style={{
        background: "linear-gradient(170deg,#0a0f1a 0%,#0d1117 50%,#080d14 100%)",
        fontFamily: "'Georgia', serif",
      }}
    >
      {/* ── Subtle geometric pattern overlay ── */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.025]" aria-hidden>
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="fp" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
              <polygon points="30,3 37,21 56,21 41,33 46,51 30,41 14,51 19,33 4,21 23,21"
                fill="none" stroke="#10b981" strokeWidth="0.6" />
              <circle cx="30" cy="30" r="3" fill="none" stroke="#10b981" strokeWidth="0.4" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#fp)" />
        </svg>
      </div>

      {/* ── Top ambient glow ── */}
      <div
        className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[200px] opacity-10 blur-3xl"
        style={{ background: "radial-gradient(ellipse,#10b981,transparent)" }}
        aria-hidden
      />

      {/* ══════════════════════════════════════════════════════════════
          TOP BAND — Digital Hub promo
      ══════════════════════════════════════════════════════════════ */}
      <div
        className="relative border-b"
        style={{ borderColor: "#10b98122" }}
      >
        <div className="container mx-auto max-w-7xl px-6 py-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            {/* Left: Digital Hub branding */}
            <div className="flex items-center gap-4">
              {/* Icon */}
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                style={{
                  background: "linear-gradient(135deg,#064e3b,#10b981)",
                  boxShadow:  "0 0 20px rgba(16,185,129,0.3)",
                }}
              >
                <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="white" strokeWidth="1.8">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M2 12h20M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20" strokeLinecap="round" />
                </svg>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p
                    className="text-xs font-bold tracking-widest uppercase"
                    style={{ color: "#10b981", letterSpacing: "0.18em" }}
                  >
                    Hamduk Digital Hub
                  </p>
                  <span
                    className="text-xs px-1.5 py-0.5 rounded font-bold"
                    style={{ background: "#10b98122", color: "#10b981", border: "1px solid #10b98133" }}
                  >
                    NEW
                  </span>
                </div>
                <p className="text-slate-400 text-sm mt-0.5">
                  Our digital arm — resources, tools & online services for the Muslim community
                </p>
              </div>
            </div>

            {/* Right: Visit link */}
            <a
              href="https://digital.hamduk.com.ng"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all shrink-0"
              style={{
                background:  "rgba(16,185,129,0.08)",
                border:      "1px solid rgba(16,185,129,0.25)",
                color:       "#10b981",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(16,185,129,0.15)"
                e.currentTarget.style.borderColor = "rgba(16,185,129,0.5)"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(16,185,129,0.08)"
                e.currentTarget.style.borderColor = "rgba(16,185,129,0.25)"
              }}
            >
              <span>digital.hamduk.com.ng</span>
              <ExternalLink className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════
          MAIN FOOTER BODY
      ══════════════════════════════════════════════════════════════ */}
      <div className="container mx-auto max-w-7xl px-6 py-14">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-14">

          {/* Left block: Brand + links grid + socials */}
          <div className="space-y-10">

            {/* Brand */}
            <div className="space-y-4 max-w-sm">
              <div className="flex items-center gap-3">
                <div
                  className="h-9 w-9 rounded-lg flex items-center justify-center"
                  style={{ background: "linear-gradient(135deg,#059669,#10b981)" }}
                >
                  <span className="text-sm font-bold text-white">H</span>
                </div>
                <div>
                  <p className="font-bold text-white text-base leading-tight" style={{ fontFamily: "Georgia,serif" }}>
                    Hamduk Islamic Foundation
                  </p>
                  <p className="text-xs text-slate-500">Est. 1996 · Lagos, Nigeria</p>
                </div>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed">
                Dedicated to promoting Islamic education, community development, and advocacy — building a better
                society rooted in faith and knowledge.
              </p>

              {/* Contact */}
              <div className="space-y-2">
                <a
                  href="mailto:info@hif.com.ng"
                  className="flex items-center gap-2 text-sm text-slate-400 hover:text-emerald-400 transition-colors group"
                >
                  <Mail className="w-4 h-4 opacity-60 group-hover:opacity-100" />
                  info@hif.com.ng
                </a>
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <Phone className="w-4 h-4 opacity-60" />
                  +234 706 227 3586
                </div>
              </div>
            </div>

            {/* Nav columns grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {FOOTER_COLS.map((col) => (
                <div key={col.title}>
                  <h4
                    className="text-xs font-bold tracking-widest uppercase mb-4"
                    style={{ color: "#10b981", letterSpacing: "0.14em" }}
                  >
                    {col.title}
                  </h4>
                  <ul className="space-y-2.5">
                    {col.links.map((link) => (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          className="text-sm text-slate-400 hover:text-white transition-colors duration-150 leading-tight block"
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Social row */}
            <div>
              <p
                className="text-xs font-bold tracking-widest uppercase mb-4"
                style={{ color: "#10b981", letterSpacing: "0.14em" }}
              >
                Follow Us
              </p>
              <div className="flex items-center gap-2 flex-wrap">
                {SOCIAL_LINKS.map((s) => {
                  const Icon = s.icon
                  return (
                    <a
                      key={s.label}
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={s.label}
                      title={s.label}
                      className="group w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200"
                      style={{
                        background:  "rgba(255,255,255,0.04)",
                        border:      "1px solid rgba(255,255,255,0.08)",
                        color:       "#94a3b8",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color       = s.color
                        e.currentTarget.style.background  = `${s.color}15`
                        e.currentTarget.style.borderColor = `${s.color}44`
                        e.currentTarget.style.transform   = "translateY(-2px)"
                        e.currentTarget.style.boxShadow   = `0 4px 12px ${s.color}22`
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color       = "#94a3b8"
                        e.currentTarget.style.background  = "rgba(255,255,255,0.04)"
                        e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"
                        e.currentTarget.style.transform   = "translateY(0)"
                        e.currentTarget.style.boxShadow   = "none"
                      }}
                    >
                      <Icon />
                    </a>
                  )
                })}

                {/* Label next to icons */}
                <p className="text-xs text-slate-600 ml-2">@hamdukfoundation</p>
              </div>
            </div>
          </div>

          {/* Right block: Newsletter card */}
          <div className="lg:w-72 shrink-0">
            <div
              className="rounded-2xl p-6 h-full flex flex-col gap-5"
              style={{
                background:  "linear-gradient(145deg,rgba(16,185,129,0.06),rgba(5,150,105,0.03))",
                border:      "1px solid rgba(16,185,129,0.15)",
              }}
            >
              {/* Newsletter heading */}
              <div>
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center mb-3"
                  style={{ background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.25)" }}
                >
                  <Mail className="w-4 h-4 text-emerald-400" />
                </div>
                <h4 className="font-bold text-white text-base mb-1.5" style={{ fontFamily: "Georgia,serif" }}>
                  Stay Connected
                </h4>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Get updates on programmes, events, and Ramadan activities delivered to your inbox.
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleNewsletterSubmit} className="space-y-3 mt-auto">
                <input
                  type="email"
                  placeholder="Your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-all placeholder:opacity-40"
                  style={{
                    background:  "rgba(255,255,255,0.05)",
                    border:      "1px solid rgba(255,255,255,0.1)",
                    color:       "#e2e8f0",
                  }}
                  onFocus={(e) => {
                    e.target.style.border    = "1px solid rgba(16,185,129,0.4)"
                    e.target.style.boxShadow = "0 0 0 3px rgba(16,185,129,0.1)"
                  }}
                  onBlur={(e) => {
                    e.target.style.border    = "1px solid rgba(255,255,255,0.1)"
                    e.target.style.boxShadow = "none"
                  }}
                />
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all disabled:opacity-60"
                  style={{
                    background: isLoading
                      ? "rgba(16,185,129,0.3)"
                      : "linear-gradient(135deg,#059669,#10b981)",
                    color: "white",
                  }}
                  onMouseEnter={(e) => {
                    if (!isLoading) e.currentTarget.style.background = "linear-gradient(135deg,#047857,#059669)"
                  }}
                  onMouseLeave={(e) => {
                    if (!isLoading) e.currentTarget.style.background = "linear-gradient(135deg,#059669,#10b981)"
                  }}
                >
                  {isLoading ? (
                    "Subscribing…"
                  ) : (
                    <>Subscribe <ArrowRight className="w-4 h-4" /></>
                  )}
                </button>
                <p className="text-xs text-slate-600 text-center">
                  No spam. Unsubscribe anytime.
                </p>
              </form>

              {/* Divider */}
              <div className="border-t" style={{ borderColor: "rgba(16,185,129,0.1)" }} />

              {/* Ramadan quick link */}
              <Link
                href="/ramadan"
                className="group flex items-center justify-between px-3 py-2.5 rounded-xl transition-all"
                style={{
                  background: "rgba(212,175,55,0.06)",
                  border:     "1px solid rgba(212,175,55,0.15)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background   = "rgba(212,175,55,0.1)"
                  e.currentTarget.style.borderColor  = "rgba(212,175,55,0.3)"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background   = "rgba(212,175,55,0.06)"
                  e.currentTarget.style.borderColor  = "rgba(212,175,55,0.15)"
                }}
              >
                <div className="flex items-center gap-2">
                  <span className="text-base">🌙</span>
                  <div>
                    <p className="text-xs font-semibold" style={{ color: "#d4af37" }}>Ramadan 1446H</p>
                    <p className="text-xs text-slate-500">Features live now</p>
                  </div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-amber-500/60 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>

        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════
          BOTTOM BAR
      ══════════════════════════════════════════════════════════════ */}
      <div
        className="relative border-t"
        style={{ borderColor: "rgba(255,255,255,0.06)" }}
      >
        {/* Thin emerald top line */}
        <div
          className="absolute top-0 left-0 right-0 h-px"
          style={{ background: "linear-gradient(90deg,transparent,#10b98133,transparent)" }}
        />

        <div className="container mx-auto max-w-7xl px-6 py-5">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">

            {/* Left: copyright */}
            <p className="text-xs text-slate-600 text-center md:text-left">
              © 2026 Hamduk Islamic Foundation. All rights reserved.
              <Dot />
              <a
                href="https://digital.hamduk.com.ng"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-emerald-500 transition-colors"
                style={{ color: "#10b98166" }}
              >
                Powered by Hamduk Digital Hub
              </a>
            </p>

            {/* Right: legal links */}
            <nav className="flex items-center gap-1 text-xs text-slate-600 flex-wrap justify-center">
              <Link href="/privacy"       className="hover:text-slate-400 transition-colors px-2 py-1">Privacy Policy</Link>
              <Dot />
              <Link href="/terms"         className="hover:text-slate-400 transition-colors px-2 py-1">Terms of Service</Link>
              <Dot />
              <Link href="/cookie-policy" className="hover:text-slate-400 transition-colors px-2 py-1">Cookie Policy</Link>
            </nav>
          </div>
        </div>
      </div>

    </footer>
  )
}
