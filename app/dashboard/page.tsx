import { redirect } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { CalendarDays, Clock, Download, FileText, Gift, Bell, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import DashboardNav from "@/components/dashboard/dashboard-nav"

export const metadata = {
  title: "Member Dashboard | Hamduk Islamic Foundation",
  description: "Access your personalized dashboard as a member of Hamduk Islamic Foundation",
}

async function getDashboardData(userId: string) {
  const supabase = await createClient()

  // Get user profile
  const { data: profile } = await supabase.from("users").select("*").eq("id", userId).single()

  // Get membership info
  const { data: membership } = await supabase
    .from("memberships")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .single()

  // Get user's event registrations
  const { data: registrations } = await supabase
    .from("event_registrations")
    .select("*, events(*)")
    .eq("user_id", userId)
    .order("registration_date", { ascending: false })
    .limit(5)

  // Get user's donations
  const { data: donations } = await supabase
    .from("donations")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(5)

  // Get total donations this year
  const currentYear = new Date().getFullYear()
  const { data: yearlyDonations } = await supabase
    .from("donations")
    .select("amount")
    .eq("user_id", userId)
    .gte("created_at", `${currentYear}-01-01`)
    .eq("payment_status", "completed")

  const totalDonationsThisYear = yearlyDonations?.reduce((sum, d) => sum + Number(d.amount), 0) || 0

  // Get activity logs
  const { data: activities } = await supabase
    .from("activity_logs")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(5)

  // Get notifications
  const { data: notifications } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", userId)
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

  return {
    profile,
    membership,
    registrations: registrations || [],
    donations: donations || [],
    totalDonationsThisYear,
    activities: activities || [],
    notifications: notifications || [],
    upcomingEvents: upcomingEvents || [],
  }
}

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login?redirect=/dashboard")
  }

  const {
    profile,
    membership,
    registrations,
    donations,
    totalDonationsThisYear,
    activities,
    notifications,
    upcomingEvents,
  } = await getDashboardData(user.id)

  const donationGoal = 100000
  const donationProgress = Math.min((totalDonationsThisYear / donationGoal) * 100, 100)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid gap-8 md:grid-cols-[240px_1fr]">
        <DashboardNav />

        <main>
          <div className="mb-8 flex flex-col gap-2">
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back, {profile?.first_name || user.email?.split("@")[0]}! Here's an overview of your membership
              and activities.
            </p>
          </div>

          {notifications.length > 0 && (
            <div className="mb-6 p-4 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800">
              <div className="flex items-center gap-2 mb-2">
                <Bell className="h-4 w-4 text-emerald-600" />
                <span className="font-medium text-emerald-800 dark:text-emerald-400">
                  You have {notifications.length} unread notification{notifications.length > 1 ? "s" : ""}
                </span>
              </div>
              <Link href="/dashboard/notifications" className="text-sm text-emerald-600 hover:underline">
                View all notifications
              </Link>
            </div>
          )}

          <div className="mb-8 grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Membership Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <Badge className={membership?.status === "active" ? "bg-emerald-500" : "bg-yellow-500"}>
                    {membership?.status || "Pending"}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {membership?.end_date ? `Expires: ${new Date(membership.end_date).toLocaleDateString()}` : "N/A"}
                  </span>
                </div>
                <Separator className="my-4" />
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Member since:</span>
                    <span className="font-medium">
                      {membership?.start_date
                        ? new Date(membership.start_date).toLocaleDateString()
                        : new Date(profile?.created_at || Date.now()).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Member ID:</span>
                    <span className="font-medium">HIF-{user.id.substring(0, 8).toUpperCase()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Type:</span>
                    <span className="font-medium">{membership?.membership_type || "Standard"}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Donation Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold">₦{totalDonationsThisYear.toLocaleString()}</span>
                  <span className="text-xs text-muted-foreground">Goal: ₦{donationGoal.toLocaleString()}</span>
                </div>
                <Progress value={donationProgress} className="mt-2" />
                <p className="mt-2 text-xs text-muted-foreground">
                  {Math.round(donationProgress)}% of your annual goal
                </p>
                <Button asChild className="mt-4 w-full" size="sm">
                  <Link href="/donate">Make a Donation</Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Upcoming Events</CardTitle>
              </CardHeader>
              <CardContent>
                {upcomingEvents.length > 0 ? (
                  <div className="space-y-4">
                    {upcomingEvents.slice(0, 2).map((event) => (
                      <div key={event.id}>
                        <h3 className="font-medium line-clamp-1">{event.title}</h3>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <CalendarDays className="h-3 w-3" />
                          <span>{new Date(event.event_date).toLocaleDateString()}</span>
                        </div>
                        {registrations.some((r) => r.event_id === event.id) ? (
                          <Badge variant="outline" className="mt-1">
                            Registered
                          </Badge>
                        ) : (
                          <Button variant="outline" size="sm" className="mt-1 bg-transparent" asChild>
                            <Link href={`/events/${event.id}`}>Register</Link>
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No upcoming events</p>
                )}
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="activities">
            <TabsList className="mb-4">
              <TabsTrigger value="activities">Recent Activities</TabsTrigger>
              <TabsTrigger value="resources">Resources</TabsTrigger>
              <TabsTrigger value="donations">Donation History</TabsTrigger>
            </TabsList>

            <TabsContent value="activities" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activities</CardTitle>
                  <CardDescription>Your recent interactions with Hamduk Islamic Foundation</CardDescription>
                </CardHeader>
                <CardContent>
                  {activities.length > 0 ? (
                    <div className="space-y-6">
                      {activities.map((activity) => (
                        <div key={activity.id} className="flex items-start gap-4">
                          <div className="rounded-full bg-emerald-100 p-2 dark:bg-emerald-900/20">
                            {activity.entity_type === "event" && (
                              <CalendarDays className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                            )}
                            {activity.entity_type === "donation" && (
                              <Gift className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                            )}
                            {activity.entity_type === "resource" && (
                              <Download className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                            )}
                            {!["event", "donation", "resource"].includes(activity.entity_type) && (
                              <Clock className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h3 className="font-medium">{activity.action}</h3>
                              <span className="text-xs text-muted-foreground">
                                {new Date(activity.created_at).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {activity.details?.description || `${activity.entity_type} activity`}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <TrendingUp className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">No recent activities to display.</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Start by registering for an event or making a donation!
                      </p>
                    </div>
                  )}
                </CardContent>
                {activities.length > 0 && (
                  <CardFooter>
                    <Button variant="outline" className="w-full bg-transparent">
                      View All Activities
                    </Button>
                  </CardFooter>
                )}
              </Card>
            </TabsContent>

            <TabsContent value="resources" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Member Resources</CardTitle>
                  <CardDescription>Access exclusive resources for Hamduk Islamic Foundation members</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                          <div className="rounded-md bg-emerald-100 p-2 dark:bg-emerald-900/20">
                            <FileText className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                          </div>
                          <div>
                            <h3 className="font-medium">Islamic Finance Guide</h3>
                            <p className="text-xs text-muted-foreground">PDF • 2.4 MB</p>
                            <Button variant="link" className="h-auto p-0 text-xs" asChild>
                              <Link href="/media/downloads">Download</Link>
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                          <div className="rounded-md bg-emerald-100 p-2 dark:bg-emerald-900/20">
                            <FileText className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                          </div>
                          <div>
                            <h3 className="font-medium">Ramadan Prayer Timetable</h3>
                            <p className="text-xs text-muted-foreground">PDF • 1.2 MB</p>
                            <Button variant="link" className="h-auto p-0 text-xs" asChild>
                              <Link href="/media/downloads">Download</Link>
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full bg-transparent" asChild>
                    <Link href="/media/downloads">View All Resources</Link>
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="donations" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Donation History</CardTitle>
                  <CardDescription>Record of your contributions to Hamduk Islamic Foundation</CardDescription>
                </CardHeader>
                <CardContent>
                  {donations.length > 0 ? (
                    <div className="space-y-4">
                      {donations.map((donation) => (
                        <div key={donation.id}>
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="font-medium">{donation.project_name || "General Donation"}</h3>
                              <p className="text-sm text-muted-foreground">{donation.donation_type} donation</p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">
                                {donation.currency} {Number(donation.amount).toLocaleString()}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(donation.created_at).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <Separator className="mt-4" />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Gift className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">No donations yet.</p>
                      <Button className="mt-4" asChild>
                        <Link href="/donate">Make Your First Donation</Link>
                      </Button>
                    </div>
                  )}
                </CardContent>
                {donations.length > 0 && (
                  <CardFooter className="flex flex-col gap-4">
                    <div className="flex w-full items-center justify-between rounded-lg bg-muted p-4">
                      <span className="font-medium">Total Donations ({new Date().getFullYear()})</span>
                      <span className="text-xl font-bold">₦{totalDonationsThisYear.toLocaleString()}</span>
                    </div>
                    <Button className="w-full" asChild>
                      <Link href="/donate">Make a New Donation</Link>
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
