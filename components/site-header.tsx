"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { ModeToggle } from "@/components/mode-toggle"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import {
  ChevronDown, Menu, Search, X, User, LogOut, ShoppingCart,
  LayoutDashboard, Settings, Moon, Bell, BookOpen,
  Heart, Trophy, Home, Star, Package, Truck,
} from "lucide-react"
import { useState, useEffect } from "react"
import { useLanguage } from "@/contexts/language-context"
import { useAuth } from "@/contexts/auth-context"
import { SearchDialog } from "@/components/search/search-dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getCartItemCount } from "@/lib/shop"

// ─── Nav data ─────────────────────────────────────────────────────────────────
const NAV_GROUPS = [
  {
    label: "nav.about",
    links: [
      { href: "/about/history",      label: "History"           },
      { href: "/about/vision",       label: "Vision & Mission"  },
      { href: "/about/founders",     label: "Founders"          },
      { href: "/about/executives",   label: "Executives"        },
      { href: "/about/past-leaders", label: "Past Leaders"      },
      { href: "/about/branches",     label: "Branches"          },
    ],
  },
  {
    label: "nav.conference",
    links: [
      { href: "/conference/islam-in-nigeria",    label: "Islam in Nigeria"  },
      { href: "/conference/islam-and-education", label: "Islam & Education" },
      { href: "/conference/islam-and-politics",  label: "Islam & Politics"  },
      { href: "/conference/islam-and-economy",   label: "Islam & Economy"   },
    ],
  },
  {
    label: "nav.membership",
    links: [
      { href: "/membership/who-can-join",  label: "Who Can Join"       },
      { href: "/membership/how-to-join",   label: "How to Join"        },
      { href: "/membership/registration",  label: "Registration"       },
      { href: "/membership/renewal",       label: "Membership Renewal" },
      { href: "/members",                  label: "Members Directory"  },
    ],
  },
  {
    label: "nav.media",
    links: [
      { href: "/media",                label: "Overview"        },
      { href: "/media/videos",         label: "Videos"          },
      { href: "/media/gallery",        label: "Gallery"         },
      { href: "/media/downloads",      label: "Downloads"       },
      { href: "/publications/papers",  label: "Research Papers" },
      { href: "/publications/journals",label: "Journals"        },
    ],
  },
]

const STANDALONE = [
  { key: "nav.events",  href: "/events"     },
  { key: "nav.donate",  href: "/donate"     },
  { key: "nav.contact", href: "/contact-us" },
]

// Shop dropdown menu
const SHOP_LINKS = [
  { href: "/shop",        icon: Package,     label: "Shop Home"   },
  { href: "/cart",        icon: ShoppingCart, label: "Shopping Cart" },
  { href: "/track-order", icon: Truck,       label: "Track Order"  },
]

// Ramadan sub-links — register is marked hot
const RAMADAN_LINKS = [
  { href: "/ramadan",                icon: Home,     label: "Home",           sub: "Ramadan hub"               },
  { href: "/ramadan/daily-reminder", icon: Bell,     label: "Daily Reminder", sub: "Today's reminder"          },
  { href: "/ramadan/knowledge",      icon: BookOpen, label: "Learn Ramadan",  sub: "Articles & knowledge"      },
  { href: "/ramadan/duas",           icon: Moon,     label: "Duas Corner",    sub: "Essential supplications"   },
  { href: "/ramadan/charity",        icon: Heart,    label: "Charity",        sub: "Donate & give"             },
  {
    href: "/ramadan/register",
    icon: Trophy,
    label: "Quiz — Register Now",
    sub: "Mosque registration open!",
    hot: true,
  },
]

// ─── Keyframe injection (once, at module level) ───────────────────────────────
const KEYFRAMES = `
  @keyframes goldPulseRing {
    0%,100% { box-shadow: 0 0 0 0 #d4af3766, 0 0 0 0 #d4af3733; opacity:.8; }
    50%      { box-shadow: 0 0 0 5px #d4af3700, 0 0 8px 3px #d4af3722; opacity:1; }
  }
  @keyframes crescentWobble {
    0%,100% { transform: rotate(-8deg) scale(1);    }
    50%      { transform: rotate(8deg)  scale(1.15); }
  }
  @keyframes goldTextGlow {
    0%,100% { text-shadow: 0 0 0px #d4af3700; }
    50%      { text-shadow: 0 0 14px #d4af3788; }
  }
  @keyframes hotBadgePop {
    0%,100% { transform: scale(1);    }
    50%      { transform: scale(1.08); }
  }
  @keyframes slideDown {
    from { opacity:0; transform: translateY(-6px); }
    to   { opacity:1; transform: translateY(0);    }
  }
  @keyframes shimmerSweep {
    0%   { background-position: -200% center; }
    100% { background-position:  200% center; }
  }
`

// ─── Ramadan trigger button (desktop) ────────────────────────────────────────
function RamadanTrigger({ isActive }: { isActive: boolean }) {
  return (
    <button
      className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-bold outline-none select-none"
      style={{
        color:      "#d4af37",
        background: isActive ? "rgba(212,175,55,0.1)" : "transparent",
        border:     "1px solid rgba(212,175,55,0.35)",
        animation:  "goldPulseRing 2.8s ease-in-out infinite",
        transition: "background 0.2s",
      }}
    >
      {/* Shimmer sweep overlay */}
      <span
        className="pointer-events-none absolute inset-0 rounded-lg overflow-hidden"
        aria-hidden
      >
        <span
          style={{
            position:   "absolute",
            inset:       0,
            background: "linear-gradient(105deg, transparent 30%, rgba(212,175,55,0.18) 50%, transparent 70%)",
            backgroundSize: "200% 100%",
            animation: "shimmerSweep 2.4s linear infinite",
          }}
        />
      </span>

      {/* Animated crescent */}
      <Moon
        className="w-3.5 h-3.5 fill-current shrink-0"
        style={{ animation: "crescentWobble 3.2s ease-in-out infinite" }}
      />

      <span style={{ animation: "goldTextGlow 2.8s ease-in-out infinite" }}>
        Ramadan
      </span>

      <ChevronDown className="w-3 h-3 opacity-60" />

      {/* Live dot */}
      <span
        className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full border-2 border-white dark:border-slate-950"
        style={{ background: "#d4af37", boxShadow: "0 0 6px #d4af37" }}
      />
    </button>
  )
}

// ─── Ramadan dropdown panel ───────────────────────────────────────────────────
function RamadanPanel({ onClose }: { onClose?: () => void }) {
  return (
    <div style={{ animation: "slideDown 0.18s ease-out both" }}>
      {/* Dark header band */}
      <div
        className="px-3 pt-3 pb-2.5 rounded-t-xl"
        style={{
          background: "linear-gradient(135deg,#0c1a2e,#130a05)",
          borderBottom: "1px solid rgba(212,175,55,0.2)",
        }}
      >
        <div className="flex items-center gap-2">
          <Moon className="w-4 h-4 fill-current" style={{ color: "#d4af37", animation: "crescentWobble 3.2s ease-in-out infinite" }} />
          <div>
            <p className="text-xs font-bold tracking-widest uppercase" style={{ color: "#d4af37" }}>
              Ramadan 1446H
            </p>
            <p className="text-xs" style={{ color: "#94a3b8" }}>Temporary season features · live now</p>
          </div>
        </div>
      </div>

      {/* Links */}
      <div className="p-1.5 space-y-0.5" style={{ background: "linear-gradient(145deg,#0f1e35,#0c1520)" }}>
        {RAMADAN_LINKS.map((link) => {
          const Icon = link.icon
          return (
            <DropdownMenuItem key={link.href} asChild>
              <Link
                href={link.href}
                onClick={onClose}
                className="flex items-center gap-3 px-2.5 py-2.5 rounded-xl cursor-pointer group outline-none"
                style={
                  link.hot
                    ? {
                        background: "linear-gradient(135deg,rgba(146,64,14,0.25),rgba(212,175,55,0.15))",
                        border:     "1px solid rgba(212,175,55,0.3)",
                      }
                    : { border: "1px solid transparent" }
                }
              >
                {/* Icon */}
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                  style={
                    link.hot
                      ? { background: "linear-gradient(135deg,#92400e,#d4af37)" }
                      : { background: "rgba(212,175,55,0.12)", border: "1px solid rgba(212,175,55,0.25)" }
                  }
                >
                  <Icon className="w-4 h-4" style={{ color: link.hot ? "#0c1a2e" : "#d4af37" }} />
                </div>

                {/* Text */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span
                      className="text-sm font-semibold"
                      style={{ color: link.hot ? "#fde68a" : "#e2e8f0" }}
                    >
                      {link.label}
                    </span>
                    {link.hot && (
                      <span
                        className="text-xs px-1.5 py-0.5 rounded-full font-bold"
                        style={{
                          background: "#d4af37",
                          color:      "#0c1a2e",
                          animation:  "hotBadgePop 1.8s ease-in-out infinite",
                        }}
                      >
                        OPEN
                      </span>
                    )}
                  </div>
                  <p className="text-xs truncate" style={{ color: "#64748b" }}>{link.sub}</p>
                </div>

                {/* Arrow on hot */}
                {link.hot && (
                  <ChevronDown
                    className="w-3.5 h-3.5 shrink-0 -rotate-90"
                    style={{ color: "#d4af37" }}
                  />
                )}
              </Link>
            </DropdownMenuItem>
          )
        })}
      </div>

      {/* Bottom note */}
      <div
        className="px-3 py-2 rounded-b-xl text-center"
        style={{
          background:   "linear-gradient(135deg,#0c1a2e,#130a05)",
          borderTop:    "1px solid rgba(212,175,55,0.15)",
        }}
      >
        <p className="text-xs" style={{ color: "#475569" }}>
          🌙 Available during Ramadan 1446H only
        </p>
      </div>
    </div>
  )
}

// ─── Mobile collapsible section ───────────────────────────────────────────────
function MobileSection({
  title,
  children,
  defaultOpen = false,
  accent = false,
}: {
  title: string
  children: React.ReactNode
  defaultOpen?: boolean
  accent?: boolean
}) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={
        accent
          ? {
              background: "linear-gradient(135deg,rgba(12,26,46,0.5),rgba(19,10,5,0.5))",
              border:     "1px solid rgba(212,175,55,0.3)",
              animation:  "goldPulseRing 2.8s ease-in-out infinite",
            }
          : { border: "1px solid transparent" }
      }
    >
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-3 py-3 text-sm font-semibold text-left"
        style={{ color: accent ? "#d4af37" : "inherit" }}
      >
        <span className="flex items-center gap-2">
          {accent && (
            <Moon
              className="w-3.5 h-3.5 fill-current"
              style={{ animation: "crescentWobble 3.2s ease-in-out infinite", color: "#d4af37" }}
            />
          )}
          {title}
          {accent && (
            <span
              className="text-xs px-1.5 py-0.5 rounded-full font-bold"
              style={{ background: "#d4af37", color: "#0c1a2e", animation: "hotBadgePop 1.8s ease-in-out infinite" }}
            >
              LIVE
            </span>
          )}
        </span>
        <ChevronDown
          className="w-4 h-4 opacity-50 transition-transform duration-200"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
        />
      </button>

      {open && (
        <div className="px-3 pb-3 flex flex-col gap-0.5">
          {children}
        </div>
      )}
    </div>
  )
}

// ─── Main header ──────────────────────────────────────────────────────────────
export function SiteHeader() {
  const { t } = useLanguage()
  const { user, profile, isAuthenticated, isAdmin, signOut, isLoading } = useAuth()
  const [mobileOpen,   setMobileOpen]   = useState(false)
  const [searchOpen,   setSearchOpen]   = useState(false)
  const [scrolled,     setScrolled]     = useState(false)
  const [cartCount,    setCartCount]    = useState(0)
  const pathname = usePathname()
  const router   = useRouter()

  const isRamadanPage = pathname?.startsWith("/ramadan")

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 6)
    window.addEventListener("scroll", fn, { passive: true })
    return () => window.removeEventListener("scroll", fn)
  }, [])

  // Update cart count on mount and when cart changes
  useEffect(() => {
    setCartCount(getCartItemCount())
    
    const handleCartUpdate = () => {
      setCartCount(getCartItemCount())
    }

    window.addEventListener("cart-updated", handleCartUpdate)
    return () => window.removeEventListener("cart-updated", handleCartUpdate)
  }, [])

  // Close sidebar on navigation
  useEffect(() => { setMobileOpen(false) }, [pathname])

  // Prevent body scroll when sidebar open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : ""
    return () => { document.body.style.overflow = "" }
  }, [mobileOpen])

  const getInitials = () => {
    if (profile?.first_name && profile?.last_name)
      return `${profile.first_name[0]}${profile.last_name[0]}`.toUpperCase()
    return user?.email?.[0]?.toUpperCase() ?? "U"
  }

  const handleSignOut = async () => {
    await signOut()
    router.push("/")
  }

  return (
    <>
      {/* Inject keyframes once */}
      <style dangerouslySetInnerHTML={{ __html: KEYFRAMES }} />

      {/* ═══════════════════════════════ HEADER BAR ═══════════════════════════ */}
      <header
        className="fixed top-0 left-0 right-0 z-[1000] w-full border-b transition-all duration-300"
        style={{
          background:    scrolled
            ? "rgba(255,255,255,0.97)"
            : "rgba(255,255,255,0.95)",
          backdropFilter: "blur(16px)",
          borderColor:    scrolled ? "#e2e8f0" : "transparent",
          boxShadow:      scrolled ? "0 1px 24px rgba(0,0,0,0.07)" : "none",
        }}
      >
        {/* Dark mode overlay — handled by next-themes class on <html> */}
        <div className="dark:bg-slate-950/97" style={{ position: "absolute", inset: 0, zIndex: -1 }} />

        <div className="container mx-auto max-w-7xl px-4 flex h-16 items-center justify-between gap-4">

          {/* ── Logo ── */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
            <div
              className="h-8 w-8 rounded-lg flex items-center justify-center transition-transform group-hover:scale-105"
              style={{ background: "linear-gradient(135deg,#059669,#10b981)" }}
            >
              <span className="text-sm font-bold text-white">H</span>
            </div>
            <span className="hidden sm:inline font-bold text-gray-900 dark:text-white tracking-tight">
              {t("site.name")}
            </span>
          </Link>

          {/* ── Desktop Nav ── */}
          <nav className="hidden lg:flex items-center gap-0.5 flex-1 justify-center">

            {/* Standard dropdown groups */}
            {NAV_GROUPS.map((group) => (
              <DropdownMenu key={group.label}>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-800 transition-all outline-none">
                    {t(group.label)}
                    <ChevronDown className="w-3.5 h-3.5 opacity-50" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-52 p-1.5">
                  {group.links.map((link) => (
                    <DropdownMenuItem key={link.href} asChild>
                      <Link href={link.href} className="px-2.5 py-2 rounded-md text-sm cursor-pointer">
                        {link.label}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            ))}

            {/* ══ Ramadan — special showy dropdown ══ */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="outline-none">
                  <RamadanTrigger isActive={isRamadanPage} />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                className="p-0 overflow-hidden"
                style={{
                  width:        "280px",
                  borderRadius: "14px",
                  border:       "1px solid rgba(212,175,55,0.35)",
                  boxShadow:    "0 20px 60px rgba(0,0,0,0.35), 0 0 0 1px rgba(212,175,55,0.1)",
                  background:   "transparent",
                }}
              >
                <RamadanPanel />
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Shop dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-800 transition-all outline-none">
                  Shop
                  <ChevronDown className="w-3.5 h-3.5 opacity-50" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-52 p-1.5">
                {SHOP_LINKS.map((link) => {
                  const Icon = link.icon
                  return (
                    <DropdownMenuItem key={link.href} asChild>
                      <Link href={link.href} className="flex items-center gap-2 px-2.5 py-2 rounded-md text-sm cursor-pointer">
                        <Icon className="w-4 h-4 opacity-60" />
                        {link.label}
                      </Link>
                    </DropdownMenuItem>
                  )
                })}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Standalone links */}
            {STANDALONE.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="px-3 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-800 transition-all"
              >
                {t(l.key)}
              </Link>
            ))}
          </nav>

          {/* ── Desktop right actions ── */}
          <div className="hidden lg:flex items-center gap-1.5">
            <button
              onClick={() => setSearchOpen(true)}
              className="h-9 w-9 rounded-lg flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-800 transition-all"
              aria-label="Search"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Cart icon with badge */}
            <Link href="/cart">
              <button
                className="relative h-9 w-9 rounded-lg flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-800 transition-all"
                aria-label="Shopping cart"
              >
                <ShoppingCart className="w-4 h-4" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-emerald-600 text-white text-xs font-bold flex items-center justify-center">
                    {cartCount > 9 ? "9+" : cartCount}
                  </span>
                )}
              </button>
            </Link>

            <ModeToggle />

            {/* Auth */}
            {isLoading ? (
              <div className="h-9 w-9 rounded-full bg-gray-100 dark:bg-slate-800 animate-pulse" />
            ) : isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="h-9 w-9 rounded-full ring-2 ring-transparent hover:ring-emerald-500/40 transition-all">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={profile?.avatar_url || undefined} />
                      <AvatarFallback className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300 text-xs font-bold">
                        {getInitials()}
                      </AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 p-1.5">
                  {/* User info */}
                  <div className="flex items-center gap-2.5 px-2 py-2.5 mb-1 border-b border-gray-100 dark:border-slate-800">
                    <Avatar className="h-8 w-8 shrink-0">
                      <AvatarImage src={profile?.avatar_url || undefined} />
                      <AvatarFallback className="text-xs font-bold">{getInitials()}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      {profile?.first_name && (
                        <p className="text-sm font-semibold truncate">
                          {profile.first_name} {profile.last_name}
                        </p>
                      )}
                      <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                    </div>
                  </div>

                  {[
                    { href: "/dashboard",          icon: LayoutDashboard, label: "Dashboard" },
                    { href: "/dashboard/profile",  icon: User,            label: "Profile"   },
                    { href: "/dashboard/settings", icon: Settings,        label: "Settings"  },
                  ].map(({ href, icon: Icon, label }) => (
                    <DropdownMenuItem key={href} asChild>
                      <Link href={href} className="flex items-center gap-2 px-2 py-2 rounded-md text-sm cursor-pointer">
                        <Icon className="w-4 h-4 opacity-50" /> {label}
                      </Link>
                    </DropdownMenuItem>
                  ))}

                  {isAdmin && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/admin" className="flex items-center gap-2 px-2 py-2 rounded-md text-sm cursor-pointer text-emerald-600 dark:text-emerald-400">
                          <LayoutDashboard className="w-4 h-4" /> Admin Panel
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}

                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleSignOut}
                    className="flex items-center gap-2 px-2 py-2 rounded-md text-sm cursor-pointer text-red-600 dark:text-red-400"
                  >
                    <LogOut className="w-4 h-4" /> Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-2 ml-1">
                <Link href="/auth/login">
                  <button className="px-3 py-1.5 rounded-lg text-sm font-medium border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 transition-all">
                    {t("nav.login")}
                  </button>
                </Link>
                <Link href="/auth/register">
                  <button className="px-3 py-1.5 rounded-lg text-sm font-semibold bg-emerald-600 hover:bg-emerald-700 text-white transition-all">
                    {t("nav.register")}
                  </button>
                </Link>
              </div>
            )}
          </div>

          {/* ── Mobile: search + burger ── */}
          <div className="flex lg:hidden items-center gap-1">
            <button
              onClick={() => setSearchOpen(true)}
              className="h-9 w-9 rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-100 dark:hover:bg-slate-800 transition-all"
              aria-label="Search"
            >
              <Search className="w-4 h-4" />
            </button>
            <button
              onClick={() => setMobileOpen((o) => !o)}
              className="h-9 w-9 rounded-lg flex items-center justify-center text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 transition-all"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* ═══════════════════════════════ MOBILE SIDEBAR ═══════════════════════ */}

      {/* Backdrop */}
      <div
        onClick={() => setMobileOpen(false)}
        className="fixed inset-0 top-16 z-[1050] bg-black/40 backdrop-blur-sm lg:hidden transition-opacity duration-300"
        style={{ opacity: mobileOpen ? 1 : 0, pointerEvents: mobileOpen ? "auto" : "none" }}
      />

      {/* Drawer */}
      <div
        className="fixed left-0 top-16 z-[1100] h-[calc(100dvh-4rem)] w-[300px] max-w-[88vw] overflow-y-auto lg:hidden bg-white dark:bg-slate-950 border-r border-gray-200 dark:border-slate-800 transition-transform duration-300 ease-out"
        style={{
          transform: mobileOpen ? "translateX(0)" : "translateX(-100%)",
          boxShadow: mobileOpen ? "6px 0 40px rgba(0,0,0,0.15)" : "none",
        }}
      >
        <div className="p-3 space-y-1.5 pb-24">

          {/* ── Ramadan — top, prominent, always open ── */}
          <MobileSection title="Ramadan" defaultOpen accent>
            {RAMADAN_LINKS.map((link) => {
              const Icon = link.icon
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-2 py-2.5 rounded-xl transition-all"
                  style={
                    link.hot
                      ? {
                          background: "linear-gradient(135deg,rgba(146,64,14,0.2),rgba(212,175,55,0.12))",
                          border:     "1px solid rgba(212,175,55,0.35)",
                        }
                      : { border: "1px solid transparent" }
                  }
                >
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                    style={
                      link.hot
                        ? { background: "linear-gradient(135deg,#92400e,#d4af37)" }
                        : { background: "rgba(212,175,55,0.1)", border: "1px solid rgba(212,175,55,0.25)" }
                    }
                  >
                    <Icon className="w-3.5 h-3.5" style={{ color: link.hot ? "#0c1a2e" : "#d4af37" }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span
                        className="text-sm font-semibold"
                        style={{ color: link.hot ? "#fde68a" : "inherit" }}
                      >
                        {link.label}
                      </span>
                      {link.hot && (
                        <span
                          className="text-xs px-1.5 py-0.5 rounded-full font-bold"
                          style={{
                            background: "#d4af37",
                            color:      "#0c1a2e",
                            animation:  "hotBadgePop 1.8s ease-in-out infinite",
                          }}
                        >
                          OPEN
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-400">{link.sub}</p>
                  </div>
                </Link>
              )
            })}
          </MobileSection>

          {/* Divider */}
          <div className="h-px bg-gray-100 dark:bg-slate-800 mx-1" />

          {/* Standard nav groups */}
          {NAV_GROUPS.map((group) => (
            <MobileSection key={group.label} title={t(group.label)}>
              {group.links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block px-2 py-2 rounded-lg text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-slate-800 transition-all"
                >
                  {link.label}
                </Link>
              ))}
            </MobileSection>
          ))}

          {/* Shop section */}
          <MobileSection title="Shop">
            {SHOP_LINKS.map((link) => {
              const Icon = link.icon
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 px-2 py-2 rounded-lg text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-slate-800 transition-all"
                >
                  <Icon className="w-4 h-4 opacity-60" />
                  {link.label}
                  {link.label === "Shopping Cart" && cartCount > 0 && (
                    <span className="ml-auto text-xs font-bold bg-emerald-600 text-white px-2 py-0.5 rounded-full">
                      {cartCount}
                    </span>
                  )}
                </Link>
              )
            })}
          </MobileSection>

          {/* Standalone links */}
          <div className="flex flex-col gap-0.5 pt-1">
            {STANDALONE.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-2.5 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 transition-all"
              >
                {t(l.key)}
              </Link>
            ))}
          </div>

          {/* Mobile auth */}
          <div className="border-t border-gray-100 dark:border-slate-800 pt-4 mt-2">
            {isLoading ? (
              <div className="h-12 rounded-xl bg-gray-100 dark:bg-slate-800 animate-pulse" />
            ) : isAuthenticated ? (
              <div className="space-y-0.5">
                {/* User card */}
                <div className="flex items-center gap-2.5 p-3 rounded-xl bg-gray-50 dark:bg-slate-800/50 mb-2">
                  <Avatar className="h-9 w-9 shrink-0">
                    <AvatarImage src={profile?.avatar_url || undefined} />
                    <AvatarFallback className="text-xs font-bold bg-emerald-100 text-emerald-700">
                      {getInitials()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate text-gray-900 dark:text-white">
                      {profile?.first_name} {profile?.last_name}
                    </p>
                    <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                  </div>
                </div>

                {[
                  { href: "/dashboard",          icon: LayoutDashboard, label: "Dashboard" },
                  { href: "/dashboard/profile",  icon: User,            label: "Profile"   },
                  { href: "/dashboard/settings", icon: Settings,        label: "Settings"  },
                ].map(({ href, icon: Icon, label }) => (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 transition-all"
                  >
                    <Icon className="w-4 h-4 opacity-50" /> {label}
                  </Link>
                ))}

                {isAdmin && (
                  <Link
                    href="/admin"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-all"
                  >
                    <LayoutDashboard className="w-4 h-4" /> Admin Panel
                  </Link>
                )}

                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all text-left"
                >
                  <LogOut className="w-4 h-4" /> Sign out
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <Link href="/auth/login" className="flex-1" onClick={() => setMobileOpen(false)}>
                  <button className="w-full py-2.5 rounded-xl text-sm font-medium border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 transition-all">
                    {t("nav.login")}
                  </button>
                </Link>
                <Link href="/auth/register" className="flex-1" onClick={() => setMobileOpen(false)}>
                  <button className="w-full py-2.5 rounded-xl text-sm font-semibold bg-emerald-600 hover:bg-emerald-700 text-white transition-all">
                    {t("nav.register")}
                  </button>
                </Link>
              </div>
            )}

            {/* Theme + language */}
            <div className="flex items-center gap-2 mt-3 px-1">
              <ModeToggle />
            </div>
          </div>

        </div>
      </div>

      <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  )
}
