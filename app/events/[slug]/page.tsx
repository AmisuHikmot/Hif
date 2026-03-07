import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CalendarDays, Clock, MapPin, Users } from "lucide-react"
import Image from "next/image"
import EventRegistrationButton from "@/components/events/event-registration-button"
import EventShareButton from "@/components/events/event-share-button"

interface EventPageProps {
  params: Promise<{ slug: string }>
}

async function getEvent(slug: string) {
  const supabase = await createClient()

  // First try by ID (UUID)
  const { data: eventById } = await supabase
    .from("events")
    .select(`*, event_images!left(image_url, thumbnail_url, is_featured)`)
    .eq("id", slug)
    .single()

  if (eventById) return eventById

  // Fall back to title slug
  const { data: events } = await supabase
    .from("events")
    .select(`*, event_images!left(image_url, thumbnail_url, is_featured)`)

  return events?.find(
    (e) => e.title.toLowerCase().replace(/\s+/g, "-") === slug.toLowerCase()
  ) ?? null
}

// Pick the best image URL from the event's related images
function getFeaturedImage(event: any): string {
  const imgs = event?.event_images ?? []
  if (imgs.length === 0) return "/islamic-gathering.png"
  const featured = imgs.find((i: any) => i.is_featured)
  return featured?.image_url ?? imgs[0]?.image_url ?? event.image_url ?? "/islamic-gathering.png"
}

export async function generateMetadata({ params }: EventPageProps) {
  const { slug } = await params
  const event = await getEvent(slug)
  if (!event) return { title: "Event Not Found" }
  return {
    title: `${event.title} | Hamduk Islamic Foundation`,
    description: event.description,
    openGraph: {
      title: event.title,
      description: event.description,
      images: [getFeaturedImage(event)],
    },
  }
}

export default async function EventPage({ params }: EventPageProps) {
  const { slug } = await params
  const event = await getEvent(slug)

  if (!event) notFound()

  const eventDate  = new Date(event.event_date)
  const isPast     = eventDate < new Date()
  const spotsLeft  = event.max_attendees
    ? event.max_attendees - (event.current_attendees || 0)
    : null
  const imageUrl   = getFeaturedImage(event)

  const formattedDate = eventDate.toLocaleDateString("en-US", {
    weekday: "long",
    day:     "numeric",
    month:   "long",
    year:    "numeric",
  })

  const formattedTime = event.start_time
    ? `${event.start_time.substring(0, 5)}${event.end_time ? ` - ${event.end_time.substring(0, 5)}` : ""}`
    : undefined

  return (
    <main className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">

        {/* ── Hero image ── */}
        <div className="relative h-64 md:h-96 w-full rounded-xl overflow-hidden mb-8">
          <Image
            src={imageUrl}
            alt={event.title}
            fill
            className="object-cover"
            priority
          />
          {isPast && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <Badge variant="secondary" className="text-2xl font-semibold px-6 py-3">
                Past Event
              </Badge>
            </div>
          )}
        </div>

        <div className="grid gap-8 md:grid-cols-3">

          {/* ── Main content ── */}
          <div className="md:col-span-2 space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                {event.category && <Badge>{event.category}</Badge>}
                {event.is_featured && <Badge variant="secondary">Featured</Badge>}
              </div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{event.title}</h1>
            </div>

            <div className="prose dark:prose-invert max-w-none">
              <p className="text-lg text-muted-foreground">{event.description}</p>
            </div>

            <Separator />

            <div>
              <h2 className="text-xl font-semibold mb-4">Event Details</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex items-start gap-3">
                  <div className="rounded-full bg-emerald-100 p-2 dark:bg-emerald-900/20">
                    <CalendarDays className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <p className="font-medium">Date</p>
                    <p className="text-sm text-muted-foreground">{formattedDate}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="rounded-full bg-emerald-100 p-2 dark:bg-emerald-900/20">
                    <Clock className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <p className="font-medium">Time</p>
                    <p className="text-sm text-muted-foreground">
                      {formattedTime ?? "TBA"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="rounded-full bg-emerald-100 p-2 dark:bg-emerald-900/20">
                    <MapPin className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <p className="font-medium">Location</p>
                    <p className="text-sm text-muted-foreground">{event.location || "TBA"}</p>
                  </div>
                </div>

                {event.max_attendees && (
                  <div className="flex items-start gap-3">
                    <div className="rounded-full bg-emerald-100 p-2 dark:bg-emerald-900/20">
                      <Users className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <div>
                      <p className="font-medium">Capacity</p>
                      <p className="text-sm text-muted-foreground">
                        {event.current_attendees || 0} / {event.max_attendees} registered
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ── Sidebar ── */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Registration</CardTitle>
                <CardDescription>
                  {isPast
                    ? "This event has ended"
                    : event.registration_required
                      ? "Registration is required for this event"
                      : "Open to all — no registration required"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {!isPast && spotsLeft !== null && (
                  <div className="text-center p-3 rounded-lg bg-muted">
                    <p className="text-2xl font-bold text-emerald-600">{spotsLeft}</p>
                    <p className="text-sm text-muted-foreground">spots remaining</p>
                  </div>
                )}

                <EventRegistrationButton
                  eventId={event.id}
                  isPast={isPast}
                  spotsLeft={spotsLeft}
                />

                <Separator />

                {/* ── Share button ── */}
                <div className="flex justify-center">
                  <EventShareButton
                    title={event.title}
                    description={event.description ?? ''}
                    date={formattedDate}
                    time={formattedTime}
                    location={event.location ?? undefined}
                    slug={event.id}
                    imageUrl={imageUrl !== '/islamic-gathering.png' ? imageUrl : undefined}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  )
}
