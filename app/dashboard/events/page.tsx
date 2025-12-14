import { redirect } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { createClient } from "@/lib/supabase/server"
import { CalendarDays, Clock, MapPin, Search, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import DashboardNav from "@/components/dashboard/dashboard-nav"
import CancelRegistrationButton from "@/components/events/cancel-registration-button"

export const metadata = {
  title: "My Events | Hamduk Islamic Foundation",
  description: "Manage your event registrations and attendance",
}

async function getUserEvents(userId: string) {
  const supabase = await createClient()
  const today = new Date().toISOString().split("T")[0]

  // Get user's registered events
  const { data: registrations } = await supabase
    .from("event_registrations")
    .select("*, events(*)")
    .eq("user_id", userId)
    .order("registration_date", { ascending: false })

  const registeredEvents =
    registrations?.filter((r) => r.events && new Date(r.events.event_date) >= new Date()).map((r) => r.events) || []

  const pastRegistrations = registrations?.filter((r) => r.events && new Date(r.events.event_date) < new Date()) || []

  // Get all upcoming events
  const { data: upcomingEvents } = await supabase
    .from("events")
    .select("*")
    .gte("event_date", today)
    .order("event_date", { ascending: true })
    .limit(12)

  const registeredEventIds = registrations?.map((r) => r.event_id) || []

  return {
    registeredEvents: registrations?.filter((r) => r.events && new Date(r.events.event_date) >= new Date()) || [],
    pastRegistrations,
    upcomingEvents: upcomingEvents || [],
    registeredEventIds,
  }
}

export default async function EventsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login?redirect=/dashboard/events")
  }

  const { registeredEvents, pastRegistrations, upcomingEvents, registeredEventIds } = await getUserEvents(user.id)

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })

  const formatTime = (start?: string, end?: string) => {
    if (!start) return "TBA"
    const startTime = start.substring(0, 5)
    return end ? `${startTime} - ${end.substring(0, 5)}` : startTime
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid gap-8 md:grid-cols-[240px_1fr]">
        <DashboardNav />

        <main>
          <div className="mb-8 flex flex-col gap-2">
            <h1 className="text-3xl font-bold tracking-tight">My Events</h1>
            <p className="text-muted-foreground">Manage your event registrations and view your attendance history</p>
          </div>

          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search events..." className="pl-10" />
            </div>
            <div className="flex gap-2">
              <Select defaultValue="all">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Events</SelectItem>
                  <SelectItem value="registered">Registered</SelectItem>
                  <SelectItem value="attended">Attended</SelectItem>
                  <SelectItem value="upcoming">Upcoming</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" className="bg-transparent">
                <Filter className="mr-2 h-4 w-4" />
                More Filters
              </Button>
            </div>
          </div>

          <Tabs defaultValue="upcoming">
            <TabsList className="mb-6 grid w-full grid-cols-3">
              <TabsTrigger value="upcoming">Upcoming ({upcomingEvents.length})</TabsTrigger>
              <TabsTrigger value="registered">Registered ({registeredEvents.length})</TabsTrigger>
              <TabsTrigger value="past">Past ({pastRegistrations.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="upcoming" className="space-y-6">
              {upcomingEvents.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {upcomingEvents.map((event) => {
                    const isRegistered = registeredEventIds.includes(event.id)
                    return (
                      <Card key={event.id} className="overflow-hidden">
                        <div className="relative h-40 w-full">
                          <Image src="/islamic-gathering.png" alt={event.title} fill className="object-cover" />
                          {isRegistered && <Badge className="absolute right-2 top-2 bg-emerald-500">Registered</Badge>}
                        </div>
                        <CardHeader className="p-4">
                          <CardTitle className="text-lg line-clamp-1">{event.title}</CardTitle>
                          <CardDescription className="line-clamp-2">{event.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="p-4 pt-0 space-y-2">
                          <div className="flex items-center gap-2 text-sm">
                            <CalendarDays className="h-4 w-4 text-emerald-600" />
                            <span>{formatDate(event.event_date)}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Clock className="h-4 w-4 text-emerald-600" />
                            <span>{formatTime(event.start_time, event.end_time)}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <MapPin className="h-4 w-4 text-emerald-600" />
                            <span className="line-clamp-1">{event.location || "TBA"}</span>
                          </div>
                        </CardContent>
                        <CardFooter className="p-4 pt-0 flex gap-2">
                          {isRegistered ? (
                            <>
                              <Button variant="outline" className="flex-1 bg-transparent" asChild>
                                <Link href={`/events/${event.id}`}>View Details</Link>
                              </Button>
                              <CancelRegistrationButton eventId={event.id} />
                            </>
                          ) : (
                            <Button className="w-full" asChild>
                              <Link href={`/events/${event.id}`}>Register Now</Link>
                            </Button>
                          )}
                        </CardFooter>
                      </Card>
                    )
                  })}
                </div>
              ) : (
                <div className="text-center py-12">
                  <CalendarDays className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No upcoming events at the moment.</p>
                  <Button className="mt-4" asChild>
                    <Link href="/events">Browse All Events</Link>
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="registered" className="space-y-6">
              {registeredEvents.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {registeredEvents.map((registration: any) => (
                    <Card key={registration.id} className="overflow-hidden">
                      <div className="relative h-40 w-full">
                        <Image
                          src="/islamic-gathering.png"
                          alt={registration.events.title}
                          fill
                          className="object-cover"
                        />
                        <Badge className="absolute right-2 top-2 bg-emerald-500">Registered</Badge>
                      </div>
                      <CardHeader className="p-4">
                        <CardTitle className="text-lg line-clamp-1">{registration.events.title}</CardTitle>
                        <CardDescription className="line-clamp-2">{registration.events.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="p-4 pt-0 space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <CalendarDays className="h-4 w-4 text-emerald-600" />
                          <span>{formatDate(registration.events.event_date)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="h-4 w-4 text-emerald-600" />
                          <span>{formatTime(registration.events.start_time, registration.events.end_time)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="h-4 w-4 text-emerald-600" />
                          <span className="line-clamp-1">{registration.events.location || "TBA"}</span>
                        </div>
                      </CardContent>
                      <CardFooter className="p-4 pt-0 flex gap-2">
                        <Button variant="outline" className="flex-1 bg-transparent" asChild>
                          <Link href={`/events/${registration.events.id}`}>View Details</Link>
                        </Button>
                        <CancelRegistrationButton eventId={registration.events.id} />
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <CalendarDays className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">You haven't registered for any upcoming events.</p>
                  <Button className="mt-4" asChild>
                    <Link href="/events">Browse Events</Link>
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="past" className="space-y-6">
              {pastRegistrations.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {pastRegistrations.map((registration: any) => (
                    <Card key={registration.id} className="overflow-hidden">
                      <div className="relative h-40 w-full">
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-10">
                          <Badge variant="secondary" className="text-lg font-semibold px-3 py-1.5">
                            {registration.attendance_status === "attended" ? "Attended" : "Registered"}
                          </Badge>
                        </div>
                        <Image
                          src="/past-islamic-event.jpg"
                          alt={registration.events.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <CardHeader className="p-4">
                        <CardTitle className="text-lg line-clamp-1">{registration.events.title}</CardTitle>
                        <CardDescription className="line-clamp-2">{registration.events.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="p-4 pt-0 space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <CalendarDays className="h-4 w-4 text-emerald-600" />
                          <span>{formatDate(registration.events.event_date)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="h-4 w-4 text-emerald-600" />
                          <span className="line-clamp-1">{registration.events.location || "TBA"}</span>
                        </div>
                      </CardContent>
                      <CardFooter className="p-4 pt-0">
                        <Button variant="outline" className="w-full bg-transparent" asChild>
                          <Link href={`/events/${registration.events.id}`}>View Details</Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <CalendarDays className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No past events to display.</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}
