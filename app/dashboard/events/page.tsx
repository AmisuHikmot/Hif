import type { Metadata } from "next"
import Image from "next/image"
import { CalendarDays, Clock, MapPin, Search, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import DashboardNav from "@/components/dashboard/dashboard-nav"

export const metadata: Metadata = {
  title: "My Events | Hamduk Islamic Foundation",
  description: "Manage your event registrations and attendance",
}

export default function EventsPage() {
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
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                More Filters
              </Button>
            </div>
          </div>

          <Tabs defaultValue="upcoming">
            <TabsList className="mb-6 grid w-full grid-cols-3">
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="registered">Registered</TabsTrigger>
              <TabsTrigger value="past">Past Events</TabsTrigger>
            </TabsList>

            <TabsContent value="upcoming" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card className="overflow-hidden">
                  <div className="relative h-40 w-full">
                    <Image
                      src="/placeholder.svg?height=160&width=320"
                      alt="Ramadan Tafsir Program"
                      fill
                      className="object-cover"
                    />
                    <Badge className="absolute right-2 top-2 bg-emerald-500">Registered</Badge>
                  </div>
                  <CardHeader className="p-4">
                    <CardTitle className="text-lg">Ramadan Tafsir Program</CardTitle>
                    <CardDescription>Daily Quranic interpretation during Ramadan</CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 pt-0 space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <CalendarDays className="h-4 w-4 text-emerald-600" />
                      <span>March 23, 2025</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-emerald-600" />
                      <span>After Maghrib Prayer</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-emerald-600" />
                      <span>Hamduk Islamic Center, Lagos</span>
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 pt-0 flex gap-2">
                    <Button variant="outline" className="flex-1">
                      View Details
                    </Button>
                    <Button variant="outline" className="text-destructive hover:text-destructive">
                      Cancel
                    </Button>
                  </CardFooter>
                </Card>

                <Card className="overflow-hidden">
                  <div className="relative h-40 w-full">
                    <Image
                      src="/placeholder.svg?height=160&width=320"
                      alt="Islamic Leadership Conference"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <CardHeader className="p-4">
                    <CardTitle className="text-lg">Islamic Leadership Conference</CardTitle>
                    <CardDescription>Annual conference on Islamic leadership principles</CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 pt-0 space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <CalendarDays className="h-4 w-4 text-emerald-600" />
                      <span>June 15, 2025</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-emerald-600" />
                      <span>9:00 AM - 5:00 PM</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-emerald-600" />
                      <span>Hamduk Conference Center, Lagos</span>
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 pt-0">
                    <Button className="w-full">Register Now</Button>
                  </CardFooter>
                </Card>

                <Card className="overflow-hidden">
                  <div className="relative h-40 w-full">
                    <Image
                      src="/placeholder.svg?height=160&width=320"
                      alt="Youth Development Workshop"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <CardHeader className="p-4">
                    <CardTitle className="text-lg">Youth Development Workshop</CardTitle>
                    <CardDescription>Building the next generation of Muslim leaders</CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 pt-0 space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <CalendarDays className="h-4 w-4 text-emerald-600" />
                      <span>August 10, 2025</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-emerald-600" />
                      <span>2:00 PM - 6:00 PM</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-emerald-600" />
                      <span>Various locations across Lagos State</span>
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 pt-0">
                    <Button className="w-full">Register Now</Button>
                  </CardFooter>
                </Card>
              </div>

              <div className="flex justify-center">
                <Button variant="outline">View More Events</Button>
              </div>
            </TabsContent>

            <TabsContent value="registered" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card className="overflow-hidden">
                  <div className="relative h-40 w-full">
                    <Image
                      src="/placeholder.svg?height=160&width=320"
                      alt="Ramadan Tafsir Program"
                      fill
                      className="object-cover"
                    />
                    <Badge className="absolute right-2 top-2 bg-emerald-500">Registered</Badge>
                  </div>
                  <CardHeader className="p-4">
                    <CardTitle className="text-lg">Ramadan Tafsir Program</CardTitle>
                    <CardDescription>Daily Quranic interpretation during Ramadan</CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 pt-0 space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <CalendarDays className="h-4 w-4 text-emerald-600" />
                      <span>March 23, 2025</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-emerald-600" />
                      <span>After Maghrib Prayer</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-emerald-600" />
                      <span>Hamduk Islamic Center, Lagos</span>
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 pt-0 flex gap-2">
                    <Button variant="outline" className="flex-1">
                      View Details
                    </Button>
                    <Button variant="outline" className="text-destructive hover:text-destructive">
                      Cancel
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="past" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card className="overflow-hidden">
                  <div className="relative h-40 w-full">
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-10">
                      <Badge variant="secondary" className="text-lg font-semibold px-3 py-1.5">
                        Attended
                      </Badge>
                    </div>
                    <Image
                      src="/placeholder.svg?height=160&width=320"
                      alt="Youth Development Workshop"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <CardHeader className="p-4">
                    <CardTitle className="text-lg">Youth Development Workshop</CardTitle>
                    <CardDescription>Building the next generation of Muslim leaders</CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 pt-0 space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <CalendarDays className="h-4 w-4 text-emerald-600" />
                      <span>February 15, 2025</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-emerald-600" />
                      <span>2:00 PM - 6:00 PM</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-emerald-600" />
                      <span>Hamduk Islamic Center, Lagos</span>
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 pt-0">
                    <Button variant="outline" className="w-full">
                      View Certificate
                    </Button>
                  </CardFooter>
                </Card>

                <Card className="overflow-hidden">
                  <div className="relative h-40 w-full">
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-10">
                      <Badge variant="secondary" className="text-lg font-semibold px-3 py-1.5">
                        Attended
                      </Badge>
                    </div>
                    <Image
                      src="/placeholder.svg?height=160&width=320"
                      alt="Islamic Finance Workshop"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <CardHeader className="p-4">
                    <CardTitle className="text-lg">Islamic Finance Workshop</CardTitle>
                    <CardDescription>Introduction to Islamic banking principles</CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 pt-0 space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <CalendarDays className="h-4 w-4 text-emerald-600" />
                      <span>January 20, 2025</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-emerald-600" />
                      <span>10:00 AM - 1:00 PM</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-emerald-600" />
                      <span>Hamduk Islamic Center, Lagos</span>
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 pt-0">
                    <Button variant="outline" className="w-full">
                      View Certificate
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}
