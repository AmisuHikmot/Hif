import type { Metadata } from "next"
import { createClient } from "@/lib/supabase/server"
import { Calendar, Filter, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import EventCard from "@/components/event-card"

export const metadata: Metadata = {
  title: "Islamic Events & Conferences | Register for Upcoming Programs | Hamduk Foundation",
  description: "Discover upcoming Islamic events, conferences, and community programs organized by Hamduk Islamic Foundation. Register now for educational lectures, Ramadan programs, and cultural events.",
  keywords: ["Islamic events", "conferences", "lectures", "Islamic programs", "community events", "Hamduk", "Nigeria"],
  openGraph: {
    title: "Islamic Events & Conferences - Hamduk Foundation",
    description: "Join our community for inspiring Islamic events and educational programs",
    url: "https://hamdukislamicfoundation.org/events",
    type: "website",
  },
}

async function getEvents() {
  const supabase = await createClient()
  const today = new Date().toISOString().split("T")[0]

  // Fetch events with their featured images
  const { data: upcomingEvents } = await supabase
    .from("events")
    .select(
      `*,
      event_images!left(image_url, thumbnail_url, is_featured)`
    )
    .gte("event_date", today)
    .order("event_date", { ascending: true })

  const { data: pastEvents } = await supabase
    .from("events")
    .select(
      `*,
      event_images!left(image_url, thumbnail_url, is_featured)`
    )
    .lt("event_date", today)
    .order("event_date", { ascending: false })
    .limit(12)

  const { data: ongoingEvents } = await supabase
    .from("events")
    .select(
      `*,
      event_images!left(image_url, thumbnail_url, is_featured)`
    )
    .eq("status", "ongoing")
    .order("event_date", { ascending: true })

  return {
    upcoming: upcomingEvents || [],
    past: pastEvents || [],
    ongoing: ongoingEvents || [],
  }
}

async function getCategories() {
  const supabase = await createClient()
  const { data } = await supabase.from("events").select("category")

  const categories = [...new Set(data?.map((item) => item.category).filter(Boolean))]
  return categories as string[]
}

export default async function EventsPage() {
  const { upcoming, past, ongoing } = await getEvents()
  const categories = await getCategories()

  const formatEventDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  }

  const formatEventTime = (start: string, end?: string) => {
    const startTime = start?.substring(0, 5) || "TBA"
    const endTime = end?.substring(0, 5)
    return endTime ? `${startTime} - ${endTime}` : startTime
  }

  // Get featured image for event from database
  const getFeaturedImage = (event: any) => {
    if (!event.event_images || event.event_images.length === 0) {
      return "/placeholder.svg"
    }
    
    // Look for featured image first
    const featuredImage = event.event_images.find((img: any) => img.is_featured)
    if (featuredImage?.image_url) return featuredImage.image_url
    
    // Fall back to first image
    if (event.event_images[0]?.image_url) return event.event_images[0].image_url
    
    // Fall back to event's image_url if exists
    if (event.image_url) return event.image_url
    
    return "/placeholder.svg"
  }

  return (
    <main className="container mx-auto px-4 py-12">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl md:text-5xl">
          Events & Programs
        </h1>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
          Join us for our upcoming events and programs designed to educate, inspire, and strengthen our community.
        </p>
      </div>

      <div className="mb-8 flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <Input placeholder="Search events..." className="pl-10" />
        </div>
        <div className="flex gap-4">
          <Select defaultValue="all">
            <SelectTrigger className="w-[180px]">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" className="bg-transparent">
            <Calendar className="mr-2 h-4 w-4" />
            Calendar View
          </Button>
        </div>
      </div>

      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="mb-8 grid w-full grid-cols-2 md:w-auto md:grid-cols-3">
          <TabsTrigger value="upcoming">Upcoming Events ({upcoming.length})</TabsTrigger>
          <TabsTrigger value="ongoing">Ongoing Programs ({ongoing.length})</TabsTrigger>
          <TabsTrigger value="past">Past Events ({past.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming">
          {upcoming.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {upcoming.map((event) => (
                <EventCard
                  key={event.id}
                  title={event.title}
                  description={event.description}
                  date={formatEventDate(event.event_date)}
                  time={formatEventTime(event.start_time, event.end_time)}
                  location={event.location}
                  imageSrc={getFeaturedImage(event)}
                  slug={event.id}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No upcoming events at the moment. Check back soon!</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="ongoing">
          {ongoing.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {ongoing.map((event) => (
                <EventCard
                  key={event.id}
                  title={event.title}
                  description={event.description}
                  date={formatEventDate(event.event_date)}
                  time={formatEventTime(event.start_time, event.end_time)}
                  location={event.location}
                  imageSrc={getFeaturedImage(event)}
                  slug={event.id}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No ongoing programs at the moment.</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="past">
          {past.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {past.map((event) => (
                <EventCard
                  key={event.id}
                  title={event.title}
                  description={event.description}
                  date={formatEventDate(event.event_date)}
                  time={formatEventTime(event.start_time, event.end_time)}
                  location={event.location}
                  imageSrc={getFeaturedImage(event)}
                  isPast={true}
                  slug={event.id}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No past events to display.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </main>
  )
}
