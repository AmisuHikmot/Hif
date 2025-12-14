"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { CalendarDays, CreditCard, FileText, Home, Settings, User, LogOut, Bell } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/contexts/auth-context"
import { Skeleton } from "@/components/ui/skeleton"

export default function DashboardNav() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, profile, isLoading, signOut } = useAuth()

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
      title: "Notifications",
      href: "/dashboard/notifications",
      icon: <Bell className="mr-2 h-4 w-4" />,
    },
    {
      title: "Settings",
      href: "/dashboard/settings",
      icon: <Settings className="mr-2 h-4 w-4" />,
    },
  ]

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

  if (isLoading) {
    return (
      <aside className="flex flex-col gap-6">
        <div className="flex items-center gap-3 rounded-lg border p-4">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>
        <nav className="flex flex-col gap-1">
          {[...Array(7)].map((_, i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </nav>
      </aside>
    )
  }

  return (
    <aside className="flex flex-col gap-6">
      <div className="flex items-center gap-3 rounded-lg border p-4">
        <Avatar>
          <AvatarImage src={profile?.avatar_url || undefined} alt={profile?.first_name || "User"} />
          <AvatarFallback className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300">
            {getInitials()}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="text-sm font-medium">
            {profile?.first_name && profile?.last_name
              ? `${profile.first_name} ${profile.last_name}`
              : user?.email?.split("@")[0]}
          </p>
          <p className="text-xs text-muted-foreground">{profile?.role === "admin" ? "Administrator" : "Member"}</p>
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

      <div className="mt-auto">
        <Button
          variant="ghost"
          className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20"
          onClick={handleSignOut}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </aside>
  )
}
