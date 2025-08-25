"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { CalendarDays, CreditCard, FileText, Home, Settings, User } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function DashboardNav() {
  const pathname = usePathname()

  const navItems = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: <Home className="mr-2 h-4 w-4" />,
    },
    {
      title: "Profile",
      href: "/dashboard/profile",
      icon: <User className="mr-2 h-4 w-4" />,
    },
    {
      title: "My Events",
      href: "/dashboard/events",
      icon: <CalendarDays className="mr-2 h-4 w-4" />,
    },
    {
      title: "Donations",
      href: "/dashboard/donations",
      icon: <CreditCard className="mr-2 h-4 w-4" />,
    },
    {
      title: "Resources",
      href: "/dashboard/resources",
      icon: <FileText className="mr-2 h-4 w-4" />,
    },
    {
      title: "Settings",
      href: "/dashboard/settings",
      icon: <Settings className="mr-2 h-4 w-4" />,
    },
  ]

  return (
    <aside className="flex flex-col gap-6">
      <div className="flex items-center gap-3 rounded-lg border p-4">
        <Avatar>
          <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Ahmed Ibrahim" />
          <AvatarFallback>AI</AvatarFallback>
        </Avatar>
        <div>
          <p className="text-sm font-medium">Ahmed Ibrahim</p>
          <p className="text-xs text-muted-foreground">Full Member</p>
        </div>
      </div>

      <nav className="flex flex-col gap-1">
        {navItems.map((item) => (
          <Button
            key={item.href}
            variant="ghost"
            className={cn("justify-start", pathname === item.href && "bg-muted font-medium")}
            asChild
          >
            <Link href={item.href}>
              {item.icon}
              {item.title}
            </Link>
          </Button>
        ))}
      </nav>
    </aside>
  )
}
