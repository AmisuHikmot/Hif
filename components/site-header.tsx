"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { LanguageSwitcher } from "@/components/language-switcher"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { ChevronDown, Menu, Search, X, User, LogOut, LayoutDashboard, Settings } from "lucide-react"
import { useState } from "react"
import { useLanguage } from "@/contexts/language-context"
import { useAuth } from "@/contexts/auth-context"
import { SearchDialog } from "@/components/search/search-dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function SiteHeader() {
  const { t } = useLanguage()
  const { user, profile, isAuthenticated, isAdmin, signOut, isLoading } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const openSearch = () => {
    setIsSearchOpen(true)
  }

  const handleSignOut = async () => {
    await signOut()
    router.push("/")
  }

  const getInitials = () => {
    if (profile?.first_name && profile?.last_name) {
      return `${profile.first_name[0]}${profile.last_name[0]}`.toUpperCase()
    }
    if (user?.email) {
      return user.email[0].toUpperCase()
    }
    return "U"
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-[1000] w-full border-b bg-white/95 dark:bg-slate-950/95 backdrop-blur supports-[backdrop-filter]:bg-white/75 dark:supports-[backdrop-filter]:bg-slate-950/75 shadow-sm">
      <div className="container mx-auto max-w-7xl px-4 flex h-16 items-center justify-between">
        {/* Logo and Desktop Navigation */}
        <div className="flex items-center gap-8 flex-1">
          <Link href="/" className="flex items-center space-x-2 flex-shrink-0">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600">
              <span className="text-sm font-bold text-white">H</span>
            </div>
            <span className="hidden sm:inline text-lg font-bold text-gray-900 dark:text-white">{t("site.name")}</span>
          </Link>

          {/* Desktop Navigation Menu */}
          <nav className="hidden lg:flex gap-1 items-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="h-auto py-2 px-3 text-sm font-medium hover:bg-gray-100 dark:hover:bg-slate-800"
                >
                  {t("nav.about")} <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                <DropdownMenuItem asChild>
                  <Link href="/about/history">History</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/about/vision">Vision & Mission</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/about/founders">Founders</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/about/executives">Executives</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/about/past-leaders">Past Leaders</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/about/branches">Branches</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="h-auto py-2 px-3 text-sm font-medium hover:bg-gray-100 dark:hover:bg-slate-800"
                >
                  {t("nav.focus")} <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                <DropdownMenuItem asChild>
                  <Link href="/focus">Overview</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/focus/ramadan-tafsir">Ramadan Tafsir</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/focus/lectures">Lectures</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/focus/training">Training</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/focus/advocacy">Advocacy</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="h-auto py-2 px-3 text-sm font-medium hover:bg-gray-100 dark:hover:bg-slate-800"
                >
                  {t("nav.conference")} <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                <DropdownMenuItem asChild>
                  <Link href="/conference/islam-in-nigeria">Islam in Nigeria</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/conference/islam-and-education">Islam & Education</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/conference/islam-and-politics">Islam & Politics</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/conference/islam-and-economy">Islam & Economy</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="h-auto py-2 px-3 text-sm font-medium hover:bg-gray-100 dark:hover:bg-slate-800"
                >
                  {t("nav.membership")} <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                <DropdownMenuItem asChild>
                  <Link href="/membership/who-can-join">Who Can Join</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/membership/how-to-join">How to Join</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/membership/registration">Registration</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/membership/renewal">Membership Renewal</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/members">Members Directory</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="h-auto py-2 px-3 text-sm font-medium hover:bg-gray-100 dark:hover:bg-slate-800"
                >
                  {t("nav.media")} <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                <DropdownMenuItem asChild>
                  <Link href="/media">Overview</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/media/videos">Videos</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/media/gallery">Gallery</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/media/downloads">Downloads</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/publications/papers">Research Papers</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/publications/journals">Journals</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Link href="/events">
              <Button
                variant="ghost"
                className="h-auto py-2 px-3 text-sm font-medium hover:bg-gray-100 dark:hover:bg-slate-800"
              >
                {t("nav.events")}
              </Button>
            </Link>
            <Link href="/donate">
              <Button
                variant="ghost"
                className="h-auto py-2 px-3 text-sm font-medium hover:bg-gray-100 dark:hover:bg-slate-800"
              >
                {t("nav.donate")}
              </Button>
            </Link>
            <Link href="/contact-us">
              <Button
                variant="ghost"
                className="h-auto py-2 px-3 text-sm font-medium hover:bg-gray-100 dark:hover:bg-slate-800"
              >
                {t("nav.contact")}
              </Button>
            </Link>
          </nav>
        </div>

        {/* Right Side: Actions and Auth */}
        <div className="flex items-center gap-3 justify-end">
          <div className="hidden lg:flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={openSearch} className="h-9 w-9">
              <Search className="h-4 w-4" />
              <span className="sr-only">Search</span>
            </Button>
            <LanguageSwitcher />
            <ModeToggle />

            {isLoading ? (
              <div className="h-9 w-9 animate-pulse rounded-full bg-muted" />
            ) : isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-9 w-9 rounded-full p-0">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={profile?.avatar_url || undefined} alt={profile?.first_name || "User"} />
                      <AvatarFallback className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300 text-xs font-semibold">
                        {getInitials()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="flex items-center justify-start gap-2 p-2">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={profile?.avatar_url || undefined} />
                      <AvatarFallback>{getInitials()}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col space-y-1 leading-none">
                      {profile?.first_name && (
                        <p className="font-medium text-sm">
                          {profile.first_name} {profile.last_name}
                        </p>
                      )}
                      <p className="w-[180px] truncate text-xs text-muted-foreground">{user?.email}</p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard" className="cursor-pointer">
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      <span>Dashboard</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/profile" className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/settings" className="cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </Link>
                  </DropdownMenuItem>
                  {isAdmin && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/admin" className="cursor-pointer">
                          <LayoutDashboard className="mr-2 h-4 w-4" />
                          <span>Admin Panel</span>
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-red-600 dark:text-red-400">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/auth/login">
                  <Button variant="outline" size="sm" className="text-xs bg-transparent">
                    {t("nav.login")}
                  </Button>
                </Link>
                <Link href="/auth/register">
                  <Button size="sm" className="text-xs">
                    {t("nav.register")}
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center gap-1">
            <Button variant="ghost" size="icon" onClick={openSearch} className="h-9 w-9">
              <Search className="h-4 w-4" />
              <span className="sr-only">Search</span>
            </Button>
            <Button variant="ghost" size="icon" onClick={toggleMenu} aria-label="Toggle Menu" className="h-9 w-9">
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu - Sliding Sidebar */}
      <div
        className={`fixed inset-0 top-16 z-[1100] transition-opacity duration-300 ${isMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
      >
        {/* Background Overlay */}
        <div className="fixed inset-0 top-16 bg-black/40 dark:bg-black/60" onClick={toggleMenu} />

        {/* Sliding Sidebar */}
        <div
          className={`fixed left-0 top-16 h-[calc(100vh-4rem)] w-80 bg-white dark:bg-slate-950 shadow-lg overflow-y-auto transition-transform duration-300 ease-out ${
            isMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <nav className="flex flex-col gap-1 p-4 pb-20">
            <div className="border-b pb-3 mb-3">
              <button className="font-medium text-sm w-full text-left mb-2">{t("nav.about")}</button>
              <div className="pl-4 flex flex-col gap-2">
                <Link
                  href="/about/history"
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                  onClick={toggleMenu}
                >
                  History
                </Link>
                <Link
                  href="/about/vision"
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                  onClick={toggleMenu}
                >
                  Vision & Mission
                </Link>
                <Link
                  href="/about/founders"
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                  onClick={toggleMenu}
                >
                  Founders
                </Link>
                <Link
                  href="/about/executives"
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                  onClick={toggleMenu}
                >
                  Executives
                </Link>
                <Link
                  href="/about/past-leaders"
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                  onClick={toggleMenu}
                >
                  Past Leaders
                </Link>
                <Link
                  href="/about/branches"
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                  onClick={toggleMenu}
                >
                  Branches
                </Link>
              </div>
            </div>

            <div className="border-b pb-3 mb-3">
              <button className="font-medium text-sm w-full text-left mb-2">{t("nav.focus")}</button>
              <div className="pl-4 flex flex-col gap-2">
                <Link
                  href="/focus"
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                  onClick={toggleMenu}
                >
                  Overview
                </Link>
                <Link
                  href="/focus/ramadan-tafsir"
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                  onClick={toggleMenu}
                >
                  Ramadan Tafsir
                </Link>
                <Link
                  href="/focus/lectures"
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                  onClick={toggleMenu}
                >
                  Lectures
                </Link>
                <Link
                  href="/focus/training"
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                  onClick={toggleMenu}
                >
                  Training
                </Link>
                <Link
                  href="/focus/advocacy"
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                  onClick={toggleMenu}
                >
                  Advocacy
                </Link>
              </div>
            </div>

            <div className="border-b pb-3 mb-3">
              <button className="font-medium text-sm w-full text-left mb-2">{t("nav.conference")}</button>
              <div className="pl-4 flex flex-col gap-2">
                <Link
                  href="/conference/islam-in-nigeria"
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                  onClick={toggleMenu}
                >
                  Islam in Nigeria
                </Link>
                <Link
                  href="/conference/islam-and-education"
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                  onClick={toggleMenu}
                >
                  Islam & Education
                </Link>
                <Link
                  href="/conference/islam-and-politics"
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                  onClick={toggleMenu}
                >
                  Islam & Politics
                </Link>
                <Link
                  href="/conference/islam-and-economy"
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                  onClick={toggleMenu}
                >
                  Islam & Economy
                </Link>
              </div>
            </div>

            <div className="border-b pb-3 mb-3">
              <button className="font-medium text-sm w-full text-left mb-2">{t("nav.membership")}</button>
              <div className="pl-4 flex flex-col gap-2">
                <Link
                  href="/membership/who-can-join"
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                  onClick={toggleMenu}
                >
                  Who Can Join
                </Link>
                <Link
                  href="/membership/how-to-join"
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                  onClick={toggleMenu}
                >
                  How to Join
                </Link>
                <Link
                  href="/membership/registration"
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                  onClick={toggleMenu}
                >
                  Registration
                </Link>
                <Link
                  href="/membership/renewal"
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                  onClick={toggleMenu}
                >
                  Membership Renewal
                </Link>
                <Link
                  href="/members"
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                  onClick={toggleMenu}
                >
                  Members Directory
                </Link>
              </div>
            </div>

            <div className="border-b pb-3 mb-3">
              <button className="font-medium text-sm w-full text-left mb-2">{t("nav.media")}</button>
              <div className="pl-4 flex flex-col gap-2">
                <Link
                  href="/media"
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                  onClick={toggleMenu}
                >
                  Overview
                </Link>
                <Link
                  href="/media/videos"
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                  onClick={toggleMenu}
                >
                  Videos
                </Link>
                <Link
                  href="/media/gallery"
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                  onClick={toggleMenu}
                >
                  Gallery
                </Link>
                <Link
                  href="/media/downloads"
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                  onClick={toggleMenu}
                >
                  Downloads
                </Link>
                <Link
                  href="/publications/papers"
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                  onClick={toggleMenu}
                >
                  Research Papers
                </Link>
                <Link
                  href="/publications/journals"
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                  onClick={toggleMenu}
                >
                  Journals
                </Link>
              </div>
            </div>

            <Link href="/events" className="border-b pb-3 mb-3 block text-sm font-medium" onClick={toggleMenu}>
              {t("nav.events")}
            </Link>
            <Link href="/donate" className="border-b pb-3 mb-3 block text-sm font-medium" onClick={toggleMenu}>
              {t("nav.donate")}
            </Link>
            <Link href="/contact-us" className="text-sm font-medium" onClick={toggleMenu}>
              {t("nav.contact")}
            </Link>

            {/* Mobile Auth Section */}
            <div className="border-t pt-4 mt-4">
              {isLoading ? (
                <div className="h-9 w-9 animate-pulse rounded-full bg-muted" />
              ) : isAuthenticated ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 pb-3 border-b">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={profile?.avatar_url || undefined} alt={profile?.first_name || "User"} />
                      <AvatarFallback className="text-xs">{getInitials()}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium truncate">{profile?.first_name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>
                    </div>
                  </div>
                  <Link href="/dashboard" className="text-sm block py-2 hover:text-emerald-600" onClick={toggleMenu}>
                    Dashboard
                  </Link>
                  <Link
                    href="/dashboard/profile"
                    className="text-sm block py-2 hover:text-emerald-600"
                    onClick={toggleMenu}
                  >
                    Profile
                  </Link>
                  {isAdmin && (
                    <Link href="/admin" className="text-sm block py-2 hover:text-emerald-600" onClick={toggleMenu}>
                      Admin Panel
                    </Link>
                  )}
                  <button
                    onClick={handleSignOut}
                    className="text-sm w-full text-left py-2 text-red-600 dark:text-red-400 hover:underline"
                  >
                    Sign out
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Link href="/auth/login" className="flex-1" onClick={toggleMenu}>
                    <Button variant="outline" size="sm" className="w-full text-xs bg-transparent">
                      {t("nav.login")}
                    </Button>
                  </Link>
                  <Link href="/auth/register" className="flex-1" onClick={toggleMenu}>
                    <Button size="sm" className="w-full text-xs">
                      {t("nav.register")}
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </nav>
        </div>
      </div>

      {/* Search Dialog */}
      <SearchDialog open={isSearchOpen} onOpenChange={setIsSearchOpen} />
    </header>
  )
}
