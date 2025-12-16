import type { Metadata } from "next"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import AdminDashboardClient from "@/components/admin/admin-dashboard-client"

export const metadata: Metadata = {
  title: "Admin Dashboard | Hamduk Islamic Foundation",
  description: "Administrative dashboard for Hamduk Islamic Foundation",
}

export default async function AdminDashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login?redirect=/admin")
  }

  // Check if user is admin
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

  if (!profile || profile.role !== "admin") {
    redirect("/dashboard")
  }

  // Fetch dashboard statistics
  const [
    { count: totalMembers },
    { count: activeEvents },
    { count: totalPublications },
    { data: donationStats },
    { data: recentActivity },
    { data: upcomingEvents },
    { data: pendingRegistrations },
  ] = await Promise.all([
    supabase.from("profiles").select("*", { count: "exact", head: true }).eq("is_active", true),
    supabase.from("events").select("*", { count: "exact", head: true }).or(`status.eq.upcoming,status.eq.ongoing`),
    supabase.from("publications").select("*", { count: "exact", head: true }),
    supabase.from("donations").select("amount").eq("status", "completed"),
    supabase
      .from("activity_log")
      .select(
        `
        *,
        user:profiles(first_name, last_name, avatar_url)
      `,
      )
      .order("created_at", { ascending: false })
      .limit(10),
    supabase
      .from("events")
      .select("*")
      .or(`status.eq.upcoming,status.eq.ongoing`)
      .order("start_date", { ascending: true })
      .limit(5),
    supabase.from("users").select("*", { count: "exact", head: true }).eq("membership_status", "pending"),
  ])

  const totalDonations = donationStats?.reduce((sum, d) => sum + (d.amount || 0), 0) || 0

  return (
    <AdminDashboardClient
      stats={{
        totalMembers: totalMembers || 0,
        activeEvents: activeEvents || 0,
        totalPublications: totalPublications || 0,
        totalDonations,
        pendingRegistrations: pendingRegistrations || 0,
      }}
      recentActivity={recentActivity || []}
      upcomingEvents={upcomingEvents || []}
    />
  )
}
