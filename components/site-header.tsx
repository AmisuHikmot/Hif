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
  LayoutDashboard, Settings, Package, Truck,
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
      { href: "/about/history", label: "History" },
      { href: "/about/vision", label: "Vision & Mission" },
      { href: "/about/founders", label: "Founders" },
      { href: "/about/executives", label: "Executives" },
      { href: "/about/past-leaders", label: "Past Leaders" },
      { href: "/about/branches", label: "Branches" },
    ],
  },
  {
    label: "nav.conference",
    links: [
      { href: "/conference/islam-in-nigeria", label: "Islam in Nigeria" },
      { href: "/conference/islam-and-education", label: "Islam & Education" },
      { href: "/conference/islam-and-politics", label: "Islam & Politics" },
      { href: "/conference/islam-and-economy", label: "Islam & Economy" },
    ],
  },
  {
    label: "nav.membership",
    links: [
      { href: "/membership/who-can-join", label: "Who Can Join" },
      { href: "/membership/how-to-join", label: "How to Join" },
      { href: "/membership/registration", label: "Registration" },
      { href: "/membership/renewal", label: "Membership Renewal" },
      { href: "/members", label: "Members Directory" },
    ],
  },
  {
    label: "nav.media",
    links: [
      { href: "/media", label: "Overview" },
      { href: "/media/videos", label: "Videos" },
      { href: "/media/gallery", label: "Gallery" },
      { href: "/media/downloads", label: "Downloads" },
      { href: "/publications/papers", label: "Research Papers" },
      { href: "/publications/journals", label: "Journals" },
    ],
  },
]

const STANDALONE = [
  { key: "nav.events", href: "/events" },
  { key: "nav.donate", href: "/donate" },
  { key: "nav.contact", href: "/contact-us" },
]

const SHOP_LINKS = [
  { href: "/shop", icon: Package, label: "Shop Home" },
  { href: "/cart", icon: ShoppingCart, label: "Shopping Cart" },
  { href: "/track-order", icon: Truck, label: "Track Order" },
]

// ─── Mobile collapsible section ───────────────────────────────────────────────
function MobileSection({
  title,
  children,
  defaultOpen = false,
}: {
  title: string
  children: React.ReactNode
  defaultOpen?: boolean
}) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div className="rounded-xl overflow-hidden" style={{ border: "1px solid transparent" }}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-3 py-3 text-sm font-semibold text-left"
      >
        <span>{title}</span>
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
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [cartCount, setCartCount] = useState(0)
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 6)
    window.addEventListener("scroll", fn, { passive: true })
    return () => window.removeEventListener("scroll", fn)
  }, [])

  useEffect(() => {
    setCartCount(getCartItemCount())
    const handleCartUpdate = () => setCartCount(getCartItemCount())
    window.addEventListener("cart-updated", handleCartUpdate)
    return () => window.removeEventListener("cart-updated", handleCartUpdate)
  }, [])

  useEffect(() => { setMobileOpen(false) }, [pathname])

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
      {/* ═══════════════════════════════ HEADER BAR ═══════════════════════════ */}
      <header
        className="fixed top-0 left-0 right-0 z-[1000] w-full border-b transition-all duration-300"
        style={{
          background: scrolled ? "rgba(255,255,255,0.97)" : "rgba(255,255,255,0.95)",
          backdropFilter: "blur(16px)",
          borderColor: scrolled ? "#e2e8f0" : "transparent",
          boxShadow: scrolled ? "0 1px 24px rgba(0,0,0,0.07)" : "none",
        }}
      >
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

            {/* ── Shop dropdown ── */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-slate-800 transition-all outline-none">
                  {t("nav.shop")}
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
                    { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
                    { href: "/dashboard/profile", icon: User, label: "Profile" },
                    { href: "/dashboard/settings", icon: Settings, label: "Settings" },
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
          <MobileSection title={t("nav.shop")}>
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
                  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
                  { href: "/dashboard/profile", icon: User, label: "Profile" },
                  { href: "/dashboard/settings", icon: Settings, label: "Settings" },
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

            {/* Theme toggle */}
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