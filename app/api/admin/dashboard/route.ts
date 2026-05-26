import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"

export async function GET() {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user is admin
    const { data: profile } = await supabase.from("profiles").select("role, is_admin").eq("id", user.id).single()

    if (profile?.role !== "admin" && profile?.role !== "super_admin" && !profile?.is_admin) {
      return Response.json({ error: "Forbidden" }, { status: 403 })
    }

    const adminSupabase = createAdminClient()

    // Get dashboard statistics
    const { count: totalUsers } = await adminSupabase.from("profiles").select("*", { count: "exact" })

    const { count: totalMembers } = await adminSupabase
      .from("memberships")
      .select("*", { count: "exact" })
      .eq("status", "active")

    const { count: totalEvents } = await adminSupabase.from("events").select("*", { count: "exact" })

    const { count: totalDonations } = await adminSupabase
      .from("donations")
      .select("*", { count: "exact" })
      .eq("payment_status", "completed")

    const { data: recentActivities } = await adminSupabase
      .from("activity_logs")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(10)

    const { data: recentDonations } = await adminSupabase
      .from("donations")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(5)

    const { data: upcomingEvents } = await adminSupabase
      .from("events")
      .select("*")
      .gte("event_date", new Date().toISOString().split("T")[0])
      .order("event_date", { ascending: true })
      .limit(5)

    return Response.json({
      stats: {
        totalUsers,
        totalMembers,
        totalEvents,
        totalDonations,
      },
      recentActivities: recentActivities || [],
      recentDonations: recentDonations || [],
      upcomingEvents: upcomingEvents || [],
    })
  } catch (error) {
    console.error("Admin dashboard error:", error)
    return Response.json({ error: "Failed to fetch dashboard data" }, { status: 500 })
  }
}
