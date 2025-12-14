import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Bell, Calendar, Gift, MessageSquare, Settings, CheckCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import DashboardNav from "@/components/dashboard/dashboard-nav"
import NotificationActions from "@/components/dashboard/notification-actions"

export const metadata = {
  title: "Notifications | Hamduk Islamic Foundation",
  description: "View and manage your notifications",
}

async function getUserNotifications(userId: string) {
  const supabase = await createClient()

  const { data: notifications } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(50)

  const unreadCount = notifications?.filter((n) => !n.is_read).length || 0

  return {
    notifications: notifications || [],
    unreadCount,
  }
}

export default async function NotificationsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login?redirect=/dashboard/notifications")
  }

  const { notifications, unreadCount } = await getUserNotifications(user.id)

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "event":
        return <Calendar className="h-4 w-4 text-blue-600" />
      case "donation":
        return <Gift className="h-4 w-4 text-emerald-600" />
      case "message":
        return <MessageSquare className="h-4 w-4 text-purple-600" />
      case "system":
        return <Settings className="h-4 w-4 text-gray-600" />
      default:
        return <Bell className="h-4 w-4 text-emerald-600" />
    }
  }

  const unreadNotifications = notifications.filter((n) => !n.is_read)
  const readNotifications = notifications.filter((n) => n.is_read)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid gap-8 md:grid-cols-[240px_1fr]">
        <DashboardNav />

        <main>
          <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
              <p className="text-muted-foreground">
                {unreadCount > 0
                  ? `You have ${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}`
                  : "All caught up!"}
              </p>
            </div>
            <NotificationActions userId={user.id} hasNotifications={notifications.length > 0} />
          </div>

          <Tabs defaultValue="all">
            <TabsList className="mb-6">
              <TabsTrigger value="all">All ({notifications.length})</TabsTrigger>
              <TabsTrigger value="unread">
                Unread
                {unreadCount > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {unreadCount}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="read">Read ({readNotifications.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              <Card>
                <CardHeader>
                  <CardTitle>All Notifications</CardTitle>
                  <CardDescription>Your complete notification history</CardDescription>
                </CardHeader>
                <CardContent>
                  {notifications.length > 0 ? (
                    <div className="space-y-4">
                      {notifications.map((notification) => (
                        <div key={notification.id}>
                          <div
                            className={`flex items-start gap-4 p-3 rounded-lg ${!notification.is_read ? "bg-muted/50" : ""}`}
                          >
                            <div className="rounded-full bg-muted p-2">
                              {getNotificationIcon(notification.notification_type)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <h3 className="font-medium">{notification.title}</h3>
                                {!notification.is_read && (
                                  <Badge variant="secondary" className="text-xs">
                                    New
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground">{notification.message}</p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {new Date(notification.created_at).toLocaleDateString("en-US", {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </p>
                            </div>
                          </div>
                          <Separator className="mt-4" />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Bell className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">No notifications yet.</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        We'll notify you about important updates and activities.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="unread">
              <Card>
                <CardHeader>
                  <CardTitle>Unread Notifications</CardTitle>
                  <CardDescription>Notifications you haven't read yet</CardDescription>
                </CardHeader>
                <CardContent>
                  {unreadNotifications.length > 0 ? (
                    <div className="space-y-4">
                      {unreadNotifications.map((notification) => (
                        <div key={notification.id}>
                          <div className="flex items-start gap-4 p-3 rounded-lg bg-muted/50">
                            <div className="rounded-full bg-muted p-2">
                              {getNotificationIcon(notification.notification_type)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <h3 className="font-medium">{notification.title}</h3>
                                <Badge variant="secondary" className="text-xs">
                                  New
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">{notification.message}</p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {new Date(notification.created_at).toLocaleDateString("en-US", {
                                  day: "numeric",
                                  month: "short",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </p>
                            </div>
                          </div>
                          <Separator className="mt-4" />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <CheckCircle className="mx-auto h-12 w-12 text-emerald-600 mb-4" />
                      <p className="text-muted-foreground">All caught up!</p>
                      <p className="text-sm text-muted-foreground mt-1">You've read all your notifications.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="read">
              <Card>
                <CardHeader>
                  <CardTitle>Read Notifications</CardTitle>
                  <CardDescription>Previously viewed notifications</CardDescription>
                </CardHeader>
                <CardContent>
                  {readNotifications.length > 0 ? (
                    <div className="space-y-4">
                      {readNotifications.map((notification) => (
                        <div key={notification.id}>
                          <div className="flex items-start gap-4 p-3 rounded-lg">
                            <div className="rounded-full bg-muted p-2">
                              {getNotificationIcon(notification.notification_type)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-medium">{notification.title}</h3>
                              <p className="text-sm text-muted-foreground">{notification.message}</p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {new Date(notification.created_at).toLocaleDateString("en-US", {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                })}
                              </p>
                            </div>
                          </div>
                          <Separator className="mt-4" />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Bell className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">No read notifications.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}
