"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarDays, Users, FileText, BarChart3, Clock, DollarSign } from "lucide-react"
import AdminNav from "@/components/admin/admin-nav"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { formatDistanceToNow } from "date-fns"

interface AdminDashboardClientProps {
  stats: {
    totalMembers: number
    activeEvents: number
    totalPublications: number
    totalDonations: number
    pendingRegistrations: number
  }
  recentActivity: any[]
  upcomingEvents: any[]
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

const getActivityBadge = (type: string) => {
  const badges: Record<string, { bg: string; text: string; label: string }> = {
    registration: { bg: "bg-blue-100", text: "text-blue-800", label: "Registration" },
    donation: { bg: "bg-green-100", text: "text-green-800", label: "Donation" },
    membership: { bg: "bg-purple-100", text: "text-purple-800", label: "Membership" },
    event: { bg: "bg-orange-100", text: "text-orange-800", label: "Event" },
    login: { bg: "bg-gray-100", text: "text-gray-800", label: "Login" },
  }
  const badge = badges[type] || { bg: "bg-gray-100", text: "text-gray-800", label: type }
  return <Badge className={`${badge.bg} ${badge.text}`}>{badge.label}</Badge>
}

export default function AdminDashboardClient({ stats, recentActivity, upcomingEvents }: AdminDashboardClientProps) {
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
                  <div className="text-2xl font-bold">{stats.totalMembers.toLocaleString()}</div>
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
                  <div className="text-2xl font-bold">{stats.activeEvents}</div>
                  <p className="text-xs text-muted-foreground">Active Events</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex flex-col items-center justify-between p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/20">
                  <FileText className="h-6 w-6 text-emerald-700 dark:text-emerald-500" />
                </div>
                <div className="mt-3 text-center">
                  <div className="text-2xl font-bold">{stats.totalPublications}</div>
                  <p className="text-xs text-muted-foreground">Publications</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex flex-col items-center justify-between p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/20">
                  <DollarSign className="h-6 w-6 text-emerald-700 dark:text-emerald-500" />
                </div>
                <div className="mt-3 text-center">
                  <div className="text-2xl font-bold">{formatCurrency(stats.totalDonations)}</div>
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
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>Latest actions and updates from users</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {recentActivity.length > 0 ? (
                      recentActivity.map((activity) => (
                        <div key={activity.id} className="flex items-center space-x-4 p-3 rounded-lg bg-muted/50">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={activity.user?.avatar_url || ""} />
                            <AvatarFallback className="bg-emerald-100 text-emerald-800">
                              {activity.user?.first_name?.[0]}
                              {activity.user?.last_name?.[0]}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-1">
                              <p className="text-sm font-medium truncate">
                                {activity.user?.first_name} {activity.user?.last_name}
                              </p>
                              {getActivityBadge(activity.action_type)}
                            </div>
                            <p className="text-sm text-muted-foreground">{activity.description}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                              {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-center text-muted-foreground py-8">No recent activity</p>
                    )}
                  </CardContent>
                </Card>

                <Card className="lg:col-span-3">
                  <CardHeader>
                    <CardTitle>Upcoming Events</CardTitle>
                    <CardDescription>Events scheduled soon</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {upcomingEvents.length > 0 ? (
                      upcomingEvents.map((event) => (
                        <div key={event.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                          <CalendarDays className="h-5 w-5 text-emerald-600 mt-0.5" />
                          <div className="flex-1">
                            <h4 className="font-medium text-sm">{event.title}</h4>
                            <p className="text-xs text-muted-foreground">
                              {new Date(event.start_date).toLocaleDateString("en-NG", {
                                weekday: "short",
                                month: "short",
                                day: "numeric",
                              })}
                            </p>
                            <p className="text-xs text-muted-foreground">{event.location}</p>
                          </div>
                          <Badge variant={event.status === "ongoing" ? "default" : "secondary"}>{event.status}</Badge>
                        </div>
                      ))
                    ) : (
                      <p className="text-center text-muted-foreground py-8">No upcoming events</p>
                    )}
                    <Link href="/admin/events" className="block text-center text-sm text-emerald-600 hover:underline">
                      View all events
                    </Link>
                  </CardContent>
                </Card>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Pending Tasks</CardTitle>
                    <CardDescription>Items requiring your attention</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {stats.pendingRegistrations > 0 && (
                        <div className="flex items-start gap-4">
                          <div className="rounded-full bg-yellow-100 p-2 dark:bg-yellow-900/20">
                            <Users className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                          </div>
                          <div>
                            <h3 className="font-medium">Pending Registrations</h3>
                            <p className="text-sm text-muted-foreground">
                              {stats.pendingRegistrations} member registration(s) need verification
                            </p>
                          </div>
                        </div>
                      )}
                      <div className="flex items-start gap-4">
                        <div className="rounded-full bg-blue-100 p-2 dark:bg-blue-900/20">
                          <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <h3 className="font-medium">Content Review</h3>
                          <p className="text-sm text-muted-foreground">Review and update website content</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                    <CardDescription>Common administrative tasks</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-3">
                      <Link
                        href="/admin/events/new"
                        className="flex flex-col items-center p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                      >
                        <CalendarDays className="h-6 w-6 text-emerald-600 mb-2" />
                        <span className="text-sm font-medium">Create Event</span>
                      </Link>
                      <Link
                        href="/admin/users"
                        className="flex flex-col items-center p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                      >
                        <Users className="h-6 w-6 text-emerald-600 mb-2" />
                        <span className="text-sm font-medium">Manage Users</span>
                      </Link>
                      <Link
                        href="/admin/content"
                        className="flex flex-col items-center p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                      >
                        <FileText className="h-6 w-6 text-emerald-600 mb-2" />
                        <span className="text-sm font-medium">Edit Content</span>
                      </Link>
                      <Link
                        href="/admin/analytics"
                        className="flex flex-col items-center p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                      >
                        <BarChart3 className="h-6 w-6 text-emerald-600 mb-2" />
                        <span className="text-sm font-medium">View Analytics</span>
                      </Link>
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
                    <Link href="/admin/events" className="text-emerald-600 hover:underline">
                      Events Management
                    </Link>{" "}
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
                    <Link href="/admin/users" className="text-emerald-600 hover:underline">
                      User Management
                    </Link>{" "}
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
                    <Link href="/admin/donations" className="text-emerald-600 hover:underline">
                      Donation Management
                    </Link>{" "}
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
