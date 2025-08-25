"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { LanguageSwitcher } from "@/components/language-switcher"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ChevronDown, Menu, Search, X } from "lucide-react"
import { useState } from "react"
import { useLanguage } from "@/contexts/language-context"
import { SearchDialog } from "@/components/search/search-dialog"

export function SiteHeader() {
  const { t } = useLanguage()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const pathname = usePathname()

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const openSearch = () => {
    setIsSearchOpen(true)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6 md:gap-10">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold">{t("site.name")}</span>
          </Link>
          <nav className="hidden md:flex gap-6">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-1">
                  {t("nav.about")} <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
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
                <Button variant="ghost" className="flex items-center gap-1">
                  {t("nav.focus")} <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
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
                <Button variant="ghost" className="flex items-center gap-1">
                  {t("nav.conference")} <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
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
                <Button variant="ghost" className="flex items-center gap-1">
                  {t("nav.membership")} <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
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
                <Button variant="ghost" className="flex items-center gap-1">
                  {t("nav.media")} <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
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
              </DropdownMenuContent>
            </DropdownMenu>

            <Link href="/events" className="text-sm font-medium transition-colors hover:text-primary">
              {t("nav.events")}
            </Link>
            <Link href="/donate" className="text-sm font-medium transition-colors hover:text-primary">
              {t("nav.donate")}
            </Link>
            <Link href="/contact-us" className="text-sm font-medium transition-colors hover:text-primary">
              {t("nav.contact")}
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={openSearch} className="h-8 w-8">
              <Search className="h-4 w-4" />
              <span className="sr-only">Search</span>
            </Button>
            <LanguageSwitcher />
            <ModeToggle />
            <Link href="/auth/login">
              <Button variant="ghost" size="sm">
                {t("nav.login")}
              </Button>
            </Link>
            <Link href="/auth/register">
              <Button size="sm">{t("nav.register")}</Button>
            </Link>
          </div>
          <div className="flex md:hidden items-center gap-2">
            <Button variant="ghost" size="icon" onClick={openSearch} className="h-8 w-8">
              <Search className="h-4 w-4" />
              <span className="sr-only">Search</span>
            </Button>
            <LanguageSwitcher />
            <Button variant="ghost" size="icon" onClick={toggleMenu} aria-label="Toggle Menu">
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 top-16 z-50 bg-background p-4 overflow-y-auto">
          <nav className="flex flex-col gap-4">
            <div className="border-b pb-2">
              <div className="font-medium mb-1">{t("nav.about")}</div>
              <div className="pl-4 flex flex-col gap-2">
                <Link href="/about/history" className="text-sm" onClick={toggleMenu}>
                  History
                </Link>
                <Link href="/about/vision" className="text-sm" onClick={toggleMenu}>
                  Vision & Mission
                </Link>
                <Link href="/about/founders" className="text-sm" onClick={toggleMenu}>
                  Founders
                </Link>
                <Link href="/about/executives" className="text-sm" onClick={toggleMenu}>
                  Executives
                </Link>
                <Link href="/about/past-leaders" className="text-sm" onClick={toggleMenu}>
                  Past Leaders
                </Link>
                <Link href="/about/branches" className="text-sm" onClick={toggleMenu}>
                  Branches
                </Link>
              </div>
            </div>

            <div className="border-b pb-2">
              <div className="font-medium mb-1">{t("nav.focus")}</div>
              <div className="pl-4 flex flex-col gap-2">
                <Link href="/focus" className="text-sm" onClick={toggleMenu}>
                  Overview
                </Link>
                <Link href="/focus/ramadan-tafsir" className="text-sm" onClick={toggleMenu}>
                  Ramadan Tafsir
                </Link>
                <Link href="/focus/lectures" className="text-sm" onClick={toggleMenu}>
                  Lectures
                </Link>
                <Link href="/focus/training" className="text-sm" onClick={toggleMenu}>
                  Training
                </Link>
                <Link href="/focus/advocacy" className="text-sm" onClick={toggleMenu}>
                  Advocacy
                </Link>
              </div>
            </div>

            <div className="border-b pb-2">
              <div className="font-medium mb-1">{t("nav.conference")}</div>
              <div className="pl-4 flex flex-col gap-2">
                <Link href="/conference/islam-in-nigeria" className="text-sm" onClick={toggleMenu}>
                  Islam in Nigeria
                </Link>
                <Link href="/conference/islam-and-education" className="text-sm" onClick={toggleMenu}>
                  Islam & Education
                </Link>
                <Link href="/conference/islam-and-politics" className="text-sm" onClick={toggleMenu}>
                  Islam & Politics
                </Link>
                <Link href="/conference/islam-and-economy" className="text-sm" onClick={toggleMenu}>
                  Islam & Economy
                </Link>
              </div>
            </div>

            <div className="border-b pb-2">
              <div className="font-medium mb-1">{t("nav.membership")}</div>
              <div className="pl-4 flex flex-col gap-2">
                <Link href="/membership/who-can-join" className="text-sm" onClick={toggleMenu}>
                  Who Can Join
                </Link>
                <Link href="/membership/how-to-join" className="text-sm" onClick={toggleMenu}>
                  How to Join
                </Link>
                <Link href="/membership/registration" className="text-sm" onClick={toggleMenu}>
                  Registration
                </Link>
                <Link href="/membership/renewal" className="text-sm" onClick={toggleMenu}>
                  Membership Renewal
                </Link>
                <Link href="/members" className="text-sm" onClick={toggleMenu}>
                  Members Directory
                </Link>
              </div>
            </div>

            <div className="border-b pb-2">
              <div className="font-medium mb-1">{t("nav.media")}</div>
              <div className="pl-4 flex flex-col gap-2">
                <Link href="/media" className="text-sm" onClick={toggleMenu}>
                  Overview
                </Link>
                <Link href="/media/videos" className="text-sm" onClick={toggleMenu}>
                  Videos
                </Link>
                <Link href="/media/gallery" className="text-sm" onClick={toggleMenu}>
                  Gallery
                </Link>
                <Link href="/media/downloads" className="text-sm" onClick={toggleMenu}>
                  Downloads
                </Link>
              </div>
            </div>

            <Link href="/events" className="border-b pb-2" onClick={toggleMenu}>
              {t("nav.events")}
            </Link>
            <Link href="/donate" className="border-b pb-2" onClick={toggleMenu}>
              {t("nav.donate")}
            </Link>
            <Link href="/contact-us" className="border-b pb-2" onClick={toggleMenu}>
              {t("nav.contact")}
            </Link>

            <div className="flex flex-col gap-2 mt-2">
              <Link href="/auth/login" onClick={toggleMenu}>
                <Button variant="outline" className="w-full">
                  {t("nav.login")}
                </Button>
              </Link>
              <Link href="/auth/register" onClick={toggleMenu}>
                <Button className="w-full">{t("nav.register")}</Button>
              </Link>
              <div className="flex justify-center mt-2">
                <ModeToggle />
              </div>
            </div>
          </nav>
        </div>
      )}

      {/* Search Dialog */}
      <SearchDialog open={isSearchOpen} onOpenChange={setIsSearchOpen} />
    </header>
  )
}
