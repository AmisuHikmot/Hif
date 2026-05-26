import type { Metadata } from "next"
import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
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
  const { data: profile } = await supabase.from("profiles").select("role, is_admin").eq("id", user.id).single()

  if (!profile || (profile.role !== "admin" && profile.role !== "super_admin" && !profile.is_admin)) {
    redirect("/dashboard")
  }

  const today = new Date().toISOString().split("T")[0]
  const adminSupabase = createAdminClient()

  // Fetch dashboard statistics
  const [
    { count: totalMembers },
    { count: activeEvents },
    { count: totalPublications },
    { data: donationStats },
    { data: recentActivity },
    { data: upcomingEvents },
    { count: pendingRegistrations },
  ] = await Promise.all([
    adminSupabase.from("profiles").select("*", { count: "exact", head: true }).eq("is_active", true),
    adminSupabase
      .from("events")
      .select("*", { count: "exact", head: true })
      .or(`status.eq.upcoming,status.eq.ongoing,event_date.gte.${today}`),
    adminSupabase.from("publications").select("*", { count: "exact", head: true }),
    adminSupabase.from("donations").select("amount").eq("payment_status", "completed"),
    adminSupabase
      .from("activity_logs")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(10),
    adminSupabase
      .from("events")
      .select("*")
      .or(`status.eq.upcoming,status.eq.ongoing,event_date.gte.${today}`)
      .order("event_date", { ascending: true })
      .limit(5),
    adminSupabase.from("profiles").select("*", { count: "exact", head: true }).eq("role", "user"),
  ])

  const totalDonations = donationStats?.reduce((sum, d) => sum + (d.amount || 0), 0) || 0
  const activityUserIds = Array.from(new Set((recentActivity || []).map((activity) => activity.user_id).filter(Boolean)))
  const { data: activityProfiles } = activityUserIds.length
    ? await adminSupabase.from("profiles").select("id, first_name, last_name, profile_picture_url, avatar_url").in("id", activityUserIds)
    : { data: [] }
  const profileById = new Map((activityProfiles || []).map((profile) => [profile.id, profile]))
  const recentActivityWithUsers = (recentActivity || []).map((activity) => ({
    ...activity,
    user: activity.user_id ? profileById.get(activity.user_id) : null,
  }))

  return (
    <AdminDashboardClient
      stats={{
        totalMembers: totalMembers || 0,
        activeEvents: activeEvents || 0,
        totalPublications: totalPublications || 0,
        totalDonations,
        pendingRegistrations: pendingRegistrations || 0,
      }}
      recentActivity={recentActivityWithUsers}
      upcomingEvents={upcomingEvents || []}
    />
  )
}
