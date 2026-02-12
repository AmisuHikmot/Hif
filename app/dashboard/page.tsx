"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Download, FileText, Gift, Bell, TrendingUp, CheckCircle, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import DashboardNav from "@/components/dashboard/dashboard-nav"
import { useAuth } from "@/contexts/auth-context"
import { supabase } from "@/lib/supabase/client"

type DashboardData = {
  profile: any
  membership: any
  registrations: any[]
  donations: any[]
  totalDonationsThisYear: number
  totalAllTimeDonations: number
  activities: any[]
  notifications: any[]
  upcomingEvents: any[]
  attendedEventsCount: number
}

export default function DashboardPage() {
  const { user, profile, isLoading: authLoading } = useAuth()
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchDashboardData() {
      if (!user?.id || authLoading) return

      try {
        console.log("[Dashboard] Loading data for user:", user.id)

        // Get membership info
        const { data: membership } = await supabase
          .from("memberships")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle()

        // Get user's event registrations
        const { data: registrations } = await supabase
          .from("event_registrations")
          .select("*, events(*)")
          .eq("user_id", user.id)
          .order("registration_date", { ascending: false })
          .limit(5)

        // Get user's donations
        const { data: donations } = await supabase
          .from("donations")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(5)

        // Get total donations this year
        const currentYear = new Date().getFullYear()
        const { data: yearlyDonations } = await supabase
          .from("donations")
          .select("amount")
          .eq("user_id", user.id)
          .gte("created_at", `${currentYear}-01-01`)
          .eq("payment_status", "completed")

        const totalDonationsThisYear = yearlyDonations?.reduce((sum, d) => sum + Number(d.amount), 0) || 0

        // Get total all-time donations
        const { data: allDonations } = await supabase
          .from("donations")
          .select("amount")
          .eq("user_id", user.id)
          .eq("payment_status", "completed")

        const totalAllTimeDonations = allDonations?.reduce((sum, d) => sum + Number(d.amount), 0) || 0

        // Get activity logs
        const { data: activities } = await supabase
          .from("activity_logs")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(5)

        // Get notifications
        const { data: notifications } = await supabase
          .from("notifications")
          .select("*")
          .eq("user_id", user.id)
          .eq("is_read", false)
          .order("created_at", { ascending: false })
          .limit(5)

        // Get upcoming events
        const today = new Date().toISOString().split("T")[0]
        const { data: upcomingEvents } = await supabase
          .from("events")
          .select("*")
          .gte("event_date", today)
          .order("event_date", { ascending: true })
          .limit(3)

        // Get event attendance count
        const { data: eventAttendance } = await supabase
          .from("event_registrations")
          .select("id")
          .eq("user_id", user.id)
          .eq("status", "confirmed")

        const attendedEventsCount = eventAttendance?.length || 0

        setDashboardData({
          profile,
          membership: membership || null,
          registrations: registrations || [],
          donations: donations || [],
          totalDonationsThisYear,
          totalAllTimeDonations,
          activities: activities || [],
          notifications: notifications || [],
          upcomingEvents: upcomingEvents || [],
          attendedEventsCount,
        })
      } catch (error) {
        console.error("[Dashboard] Error fetching data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchDashboardData()
  }, [user, profile, authLoading])

  if (isLoading || authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-emerald-200 border-t-emerald-600"></div>
          <p className="mt-2 text-sm text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (!dashboardData) {
    return <div>Error loading dashboard data</div>
  }

  const donationGoal = 100000
  const donationProgress = Math.min((dashboardData.totalDonationsThisYear / donationGoal) * 100, 100)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid gap-8">
        <DashboardNav />

        <main>
          <div className="mb-8 flex flex-col gap-2">
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back, {profile?.first_name || user?.email?.split("@")[0]}! Here's an overview of your membership
              and activities.
            </p>
          </div>

          {dashboardData.notifications && dashboardData.notifications.length > 0 && (
            <div className="mb-6 p-4 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800">
              <div className="flex items-center gap-2 mb-2">
                <Bell className="h-4 w-4 text-emerald-600" />
                <span className="font-medium text-emerald-800 dark:text-emerald-400">
                  You have {dashboardData.notifications.length} unread notification{dashboardData.notifications.length > 1 ? "s" : ""}
                </span>
              </div>
              <Link href="/dashboard/notifications" className="text-sm text-emerald-600 hover:underline">
                View all notifications
              </Link>
            </div>
          )}

          <div className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Membership Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <Badge className={dashboardData.membership?.status === "active" ? "bg-emerald-500" : "bg-yellow-500"}>
                    {dashboardData.membership?.status || "Pending"}
                  </Badge>
                  <CheckCircle className="h-4 w-4 text-emerald-600" />
                </div>
                <Separator className="my-3" />
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Member ID:</span>
                    <span className="font-medium">HIF-{user?.id.substring(0, 8).toUpperCase()}</span>
                  </div>
                  {dashboardData.membership?.start_date && (
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Since:</span>
                      <span className="font-medium">{new Date(dashboardData.membership.start_date).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Donations This Year</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₦{dashboardData.totalDonationsThisYear.toLocaleString()}</div>
                <Progress value={donationProgress} className="mt-2" />
                <p className="mt-2 text-xs text-muted-foreground">
                  {Math.round(donationProgress)}% of ₦{donationGoal.toLocaleString()} goal
                </p>
                <Button asChild size="sm" className="mt-3 w-full">
                  <Link href="/donate">Donate</Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">All-Time Donations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₦{dashboardData.totalAllTimeDonations.toLocaleString()}</div>
                <Separator className="my-3" />
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Total Donations:</span>
                    <span className="font-medium">
                      {dashboardData.donations.filter((d) => d.payment_status === "completed").length}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Avg per Donation:</span>
                    <span className="font-medium">
                      ₦
                      {dashboardData.donations.length > 0
                        ? Math.round(dashboardData.totalAllTimeDonations / dashboardData.donations.length).toLocaleString()
                        : "0"}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Event Participation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dashboardData.attendedEventsCount}</div>
                <p className="mt-2 text-xs text-muted-foreground">events attended</p>
                <Separator className="my-3" />
                {dashboardData.upcomingEvents.length > 0 ? (
                  <Button asChild size="sm" className="w-full">
                    <Link href="/events">View Events</Link>
                  </Button>
                ) : (
                  <p className="text-xs text-muted-foreground">No upcoming events</p>
                )}
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="activities" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="activities">Recent Activities</TabsTrigger>
              <TabsTrigger value="resources">Resources</TabsTrigger>
              <TabsTrigger value="donations">Donations</TabsTrigger>
            </TabsList>

            <TabsContent value="activities" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activities</CardTitle>
                  <CardDescription>Your recent interactions with Hamduk Islamic Foundation</CardDescription>
                </CardHeader>
                <CardContent>
                  {dashboardData.activities.length > 0 ? (
                    <div className="space-y-4">
                      {dashboardData.activities.map((activity) => (
                        <div key={activity.id}>
                          <div className="flex items-start gap-4">
                            <div className="rounded-full bg-emerald-100 p-2 dark:bg-emerald-900/20">
                              <TrendingUp className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <h3 className="font-medium">{activity.action}</h3>
                                <span className="text-xs text-muted-foreground">
                                  {new Date(activity.created_at).toLocaleDateString()}
                                </span>
                              </div>
                              <p className="text-sm text-muted-foreground line-clamp-2">{activity.description}</p>
                            </div>
                          </div>
                          <Separator className="mt-4" />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">No recent activities</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="resources" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Member Resources</CardTitle>
                  <CardDescription>Access exclusive resources for members</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Card className="bg-muted/50">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                          <FileText className="h-8 w-8 text-emerald-600" />
                          <div className="flex-1">
                            <h3 className="font-medium">Publications</h3>
                            <p className="text-xs text-muted-foreground">Research papers and journals</p>
                            <Button variant="link" size="sm" className="h-auto p-0 mt-2" asChild>
                              <Link href="/publications/papers">Browse</Link>
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-muted/50">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                          <Download className="h-8 w-8 text-blue-600" />
                          <div className="flex-1">
                            <h3 className="font-medium">Downloads</h3>
                            <p className="text-xs text-muted-foreground">Educational materials</p>
                            <Button variant="link" size="sm" className="h-auto p-0 mt-2" asChild>
                              <Link href="/media/downloads">Browse</Link>
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="donations" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Donation History</CardTitle>
                  <CardDescription>Your recent donation records</CardDescription>
                </CardHeader>
                <CardContent>
                  {dashboardData.donations.length > 0 ? (
                    <div className="space-y-4">
                      {dashboardData.donations.slice(0, 5).map((donation) => (
                        <div key={donation.id}>
                          <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                            <div>
                              <h3 className="font-medium">{donation.project_name || "General Donation"}</h3>
                              <p className="text-sm text-muted-foreground">{donation.donation_type} donation</p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold">₦{Number(donation.amount).toLocaleString()}</p>
                              <Badge
                                variant={donation.payment_status === "completed" ? "default" : "outline"}
                                className="mt-1"
                              >
                                {donation.payment_status}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Gift className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">No donations yet</p>
                      <Button asChild className="mt-4">
                        <Link href="/donate">Make Your First Donation</Link>
                      </Button>
                    </div>
                  )}
                </CardContent>
                {dashboardData.donations.length > 0 && (
                  <CardFooter>
                    <Button variant="outline" className="w-full bg-transparent" asChild>
                      <Link href="/dashboard/donations">View All Donations</Link>
                    </Button>
                  </CardFooter>
                )}
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}
