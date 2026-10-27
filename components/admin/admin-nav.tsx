"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"
import {
  LayoutDashboard,
  Calendar,
  Users,
  BarChart3,
  LogOut,
  DollarSign,
  MessageCircleQuestion,
  BookOpenCheck,
  CalendarDays,
  Landmark,
  Building2,
  LifeBuoy,
  ShieldCheck,
  MapPin,
  Flower2,
  GraduationCap,
  Utensils,
  Smartphone,
  Code2,
  QrCode,
  PhoneCall,
} from "lucide-react"

const navigation = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Events", href: "/admin/events", icon: Calendar },
  { name: "Event check-in", href: "/admin/checkin", icon: QrCode },
  { name: "Users", href: "/admin/users", icon: Users },
  { name: "Donations", href: "/admin/donations", icon: DollarSign },
  { name: "Questions", href: "/admin/questions", icon: MessageCircleQuestion },
  { name: "Content Studio", href: "/admin/studio", icon: BookOpenCheck },
  { name: "Hijri override", href: "/admin/hijri", icon: CalendarDays },
  { name: "Finance", href: "/admin/finance", icon: Landmark },
  { name: "Branches", href: "/admin/branches", icon: Building2 },
  { name: "Mosques", href: "/admin/mosques", icon: MapPin },
  { name: "Janazah", href: "/admin/janazah", icon: Flower2 },
  { name: "Moderation", href: "/admin/moderation", icon: ShieldCheck },
  { name: "Helplines", href: "/admin/helplines", icon: PhoneCall },
  { name: "Support", href: "/admin/support", icon: LifeBuoy },
  { name: "Schools", href: "/admin/schools", icon: GraduationCap },
  { name: "Halal places", href: "/admin/halal", icon: Utensils },
  { name: "App releases", href: "/admin/releases", icon: Smartphone },
  { name: "Developers", href: "/admin/developer", icon: Code2 },
  { name: "Audit Logs", href: "/admin/audit-logs", icon: BarChart3 },
]

export default function AdminNav() {
  const pathname = usePathname()
  const router = useRouter()
  const { signOut } = useAuth()

  const handleLogout = async () => {
    await signOut()
    router.push("/")
  }

  return (
    <div className="flex h-full w-64 flex-col bg-card border-r">
      <div className="flex h-16 items-center px-6 border-b">
        <h1 className="text-xl font-bold text-emerald-700 dark:text-emerald-500">Admin Panel</h1>
      </div>

      <nav className="flex-1 space-y-1 px-4 py-6 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                isActive
                  ? "bg-emerald-100 dark:bg-emerald-900/20 text-emerald-900 dark:text-emerald-500"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <item.icon
                className={cn(
                  "mr-3 h-5 w-5 flex-shrink-0",
                  isActive ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground",
                )}
              />
              {item.name}
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t">
        <Button variant="ghost" className="w-full justify-start text-muted-foreground" onClick={handleLogout}>
          <LogOut className="mr-3 h-5 w-5" />
          Logout
        </Button>
      </div>
    </div>
  )
}
