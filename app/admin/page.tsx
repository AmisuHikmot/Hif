import type { Metadata } from "next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarDays, Users, FileText, BarChart3, Clock, AlertCircle } from "lucide-react"
import AdminNav from "@/components/admin/admin-nav"
import AdminStats from "@/components/admin/admin-stats"
import AdminRecentActivity from "@/components/admin/admin-recent-activity"
import AdminEventsList from "@/components/admin/admin-events-list"

export const metadata: Metadata = {
  title: "Admin Dashboard | Hamduk Islamic Foundation",
  description: "Administrative dashboard for Hamduk Islamic Foundation",
}

export default function AdminDashboardPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid gap-8 md:grid-cols-[240px_1fr]">
        <AdminNav />

        <main>
          <div className="mb-8 flex flex-col gap-2">
            <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome to the administrative dashboard. Manage events, users, and content.
            </p>
          </div>

          <div className="mb-8 grid gap-4 md:grid-cols-4">
            <Card>
              <CardContent className="flex flex-col items-center justify-between p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/20">
                  <Users className="h-6 w-6 text-emerald-700 dark:text-emerald-500" />
                </div>
                <div className="mt-3 text-center">
                  <div className="text-2xl font-bold">1,248</div>
                  <p className="text-xs text-muted-foreground">Total Members</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex flex-col items-center justify-between p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/20">
                  <CalendarDays className="h-6 w-6 text-emerald-700 dark:text-emerald-500" />
                </div>
                <div className="mt-3 text-center">
                  <div className="text-2xl font-bold">24</div>
                  <p className="text-xs text-muted-foreground">Upcoming Events</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex flex-col items-center justify-between p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/20">
                  <FileText className="h-6 w-6 text-emerald-700 dark:text-emerald-500" />
                </div>
                <div className="mt-3 text-center">
                  <div className="text-2xl font-bold">156</div>
                  <p className="text-xs text-muted-foreground">Publications</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex flex-col items-center justify-between p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/20">
                  <BarChart3 className="h-6 w-6 text-emerald-700 dark:text-emerald-500" />
                </div>
                <div className="mt-3 text-center">
                  <div className="text-2xl font-bold">₦15.2M</div>
                  <p className="text-xs text-muted-foreground">Total Donations</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="events">Events</TabsTrigger>
              <TabsTrigger value="members">Members</TabsTrigger>
              <TabsTrigger value="donations">Donations</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="lg:col-span-4">
                  <CardHeader>
                    <CardTitle>Statistics</CardTitle>
                    <CardDescription>Overview of key metrics for the past 30 days</CardDescription>
                  </CardHeader>
                  <CardContent className="pl-2">
                    <AdminStats />
                  </CardContent>
                </Card>
                <Card className="lg:col-span-3">
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>Latest actions and updates</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <AdminRecentActivity />
                  </CardContent>
                </Card>
              </div>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="lg:col-span-3">
                  <CardHeader>
                    <CardTitle>Upcoming Events</CardTitle>
                    <CardDescription>Events scheduled in the next 30 days</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <AdminEventsList />
                  </CardContent>
                </Card>
                <Card className="lg:col-span-4">
                  <CardHeader>
                    <CardTitle>Pending Tasks</CardTitle>
                    <CardDescription>Items requiring your attention</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-start gap-4">
                        <div className="rounded-full bg-yellow-100 p-2 dark:bg-yellow-900/20">
                          <Clock className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                        </div>
                        <div>
                          <h3 className="font-medium">Event Approval Pending</h3>
                          <p className="text-sm text-muted-foreground">3 events are waiting for your approval</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="rounded-full bg-yellow-100 p-2 dark:bg-yellow-900/20">
                          <Users className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                        </div>
                        <div>
                          <h3 className="font-medium">New Member Registrations</h3>
                          <p className="text-sm text-muted-foreground">12 new member registrations need verification</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="rounded-full bg-red-100 p-2 dark:bg-red-900/20">
                          <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                        </div>
                        <div>
                          <h3 className="font-medium">Content Updates Required</h3>
                          <p className="text-sm text-muted-foreground">The Ramadan schedule needs to be updated</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            <TabsContent value="events">
              <Card>
                <CardHeader>
                  <CardTitle>Event Management</CardTitle>
                  <CardDescription>Create, edit, and manage events</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-center py-12 text-muted-foreground">
                    Visit the{" "}
                    <a href="/admin/events" className="text-emerald-600 hover:underline">
                      Events Management
                    </a>{" "}
                    page for full event administration capabilities.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="members">
              <Card>
                <CardHeader>
                  <CardTitle>Member Management</CardTitle>
                  <CardDescription>Manage member accounts and permissions</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-center py-12 text-muted-foreground">
                    Visit the{" "}
                    <a href="/admin/users" className="text-emerald-600 hover:underline">
                      User Management
                    </a>{" "}
                    page for full member administration capabilities.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="donations">
              <Card>
                <CardHeader>
                  <CardTitle>Donation Management</CardTitle>
                  <CardDescription>Track and manage donations</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-center py-12 text-muted-foreground">
                    Visit the{" "}
                    <a href="/admin/donations" className="text-emerald-600 hover:underline">
                      Donation Management
                    </a>{" "}
                    page for full donation administration capabilities.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}
