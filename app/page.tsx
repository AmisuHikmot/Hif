"use client"

import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import {
  ArrowRight,
  Calendar,
  Users,
  BookOpen,
  MSquare as Mosque,
  GraduationCap,
  Book,
  Presentation,
  Users2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import EventCard from "@/components/event-card"
import NewsletterSignup from "@/components/newsletter-signup"
import FeaturedPrograms from "@/components/featured-programs"
import { useLanguage } from "@/contexts/language-context"
import { createClient } from "@/lib/supabase/client"

export default function Home() {
  const { t } = useLanguage()
  const [events, setEvents] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const supabase = createClient()
        const today = new Date().toISOString().split("T")[0]

        const { data, error } = await supabase.from("events").select("*").order("event_date")

        if (error) throw error
        setEvents(data || [])
      } catch (error) {
        console.error("Error fetching events:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchEvents()
  }, [])

  const upcomingEvents = events.filter((e) => e.event_date >= new Date().toISOString().split("T")[0])
  const pastEvents = events.filter((e) => e.event_date < new Date().toISOString().split("T")[0])

  return (
    <main className="flex-1">
      {/* Hero Section */}
      <section className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/90 to-emerald-800/80 z-10" />
        <Image
          src="/placeholder.svg?height=800&width=1920"
          alt={t("site.name")}
          width={1920}
          height={800}
          priority
          className="h-[600px] w-full object-cover"
        />
        <div className="container relative z-20 mx-auto px-4 py-24 sm:py-32 md:py-40">
          <div className="max-w-3xl">
            <Badge className="mb-4 bg-white/20 text-white hover:bg-white/30">{t("home.hero.established")}</Badge>
            <h1 className="mb-6 text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
              {t("home.hero.title")}
            </h1>
            <p className="mb-8 text-xl text-white/90">{t("home.hero.description")}</p>
            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg" className="bg-white text-emerald-900 hover:bg-white/90">
                <Link href="/about/history">
                  {t("home.hero.learnAboutUs")} <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/10 bg-transparent"
              >
                <Link href="/events">{t("home.hero.upcomingEvents")}</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="bg-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">{t("home.mission.title")}</h2>
            <p className="mt-4 text-lg text-gray-600">{t("home.mission.description")}</p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            <Card className="border-none shadow-md">
              <CardContent className="flex flex-col items-center p-6 text-center">
                <div className="mb-4 rounded-full bg-emerald-100 p-3">
                  <BookOpen className="h-6 w-6 text-emerald-700" />
                </div>
                <h3 className="mb-2 text-xl font-bold">{t("home.mission.education.title")}</h3>
                <p className="text-gray-600">{t("home.mission.education.description")}</p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-md">
              <CardContent className="flex flex-col items-center p-6 text-center">
                <div className="mb-4 rounded-full bg-emerald-100 p-3">
                  <Users className="h-6 w-6 text-emerald-700" />
                </div>
                <h3 className="mb-2 text-xl font-bold">{t("home.mission.community.title")}</h3>
                <p className="text-gray-600">{t("home.mission.community.description")}</p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-md">
              <CardContent className="flex flex-col items-center p-6 text-center">
                <div className="mb-4 rounded-full bg-emerald-100 p-3">
                  <Mosque className="h-6 w-6 text-emerald-700" />
                </div>
                <h3 className="mb-2 text-xl font-bold">{t("home.mission.advocacy.title")}</h3>
                <p className="text-gray-600">{t("home.mission.advocacy.description")}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Programs & Events */}
      <section className="bg-gray-50 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">{t("home.programs.title")}</h2>
            <p className="mt-4 text-lg text-gray-600">{t("home.programs.description")}</p>
          </div>

          <div className="mt-12">
            <Tabs defaultValue="featured" className="w-full">
              <div className="flex justify-center">
                <TabsList className="mb-8">
                  <TabsTrigger value="featured">{t("home.programs.tab.featured")}</TabsTrigger>
                  <TabsTrigger value="upcoming">{t("home.programs.tab.upcoming")}</TabsTrigger>
                  <TabsTrigger value="past">{t("home.programs.tab.past")}</TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="featured">
                <FeaturedPrograms />
              </TabsContent>

              <TabsContent value="upcoming">
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {isLoading ? (
                    <p className="text-center col-span-full">Loading events...</p>
                  ) : upcomingEvents.length > 0 ? (
                    upcomingEvents
                      .slice(0, 3)
                      .map((event) => (
                        <EventCard
                          key={event.id}
                          title={event.title}
                          description={event.description}
                          date={new Date(event.event_date).toLocaleDateString()}
                          location={event.location}
                          imageSrc={event.image_url || "/placeholder.svg?height=200&width=400"}
                        />
                      ))
                  ) : (
                    <p className="text-center col-span-full text-gray-500">No upcoming events</p>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="past">
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {pastEvents.length > 0 ? (
                    pastEvents
                      .slice(0, 3)
                      .map((event) => (
                        <EventCard
                          key={event.id}
                          title={event.title}
                          description={event.description}
                          date={new Date(event.event_date).toLocaleDateString()}
                          location={event.location}
                          imageSrc={event.image_url || "/placeholder.svg?height=200&width=400"}
                          isPast={true}
                        />
                      ))
                  ) : (
                    <p className="text-center col-span-full text-gray-500">No past events</p>
                  )}
                </div>
              </TabsContent>
            </Tabs>

            <div className="mt-10 text-center">
              <Button asChild size="lg">
                <Link href="/events">
                  {t("home.programs.viewAll")} <Calendar className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Statistics */}
      <section className="bg-emerald-800 py-16 text-white md:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold sm:text-4xl">{t("home.impact.title")}</h2>
            <p className="mt-4 text-lg text-white/80">{t("home.impact.description")}</p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-4">
            <div className="text-center">
              <p className="text-4xl font-bold md:text-5xl">25+</p>
              <p className="mt-2 text-white/80">{t("home.impact.years")}</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold md:text-5xl">10,000+</p>
              <p className="mt-2 text-white/80">{t("home.impact.people")}</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold md:text-5xl">500+</p>
              <p className="mt-2 text-white/80">{t("home.impact.events")}</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold md:text-5xl">15+</p>
              <p className="mt-2 text-white/80">{t("home.impact.branches")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              {t("home.testimonials.title")}
            </h2>
            <p className="mt-4 text-lg text-gray-600">{t("home.testimonials.description")}</p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            <Card className="border-none shadow-md">
              <CardContent className="p-6">
                <div className="mb-4 text-4xl text-emerald-600">"</div>
                <p className="mb-6 text-gray-700">
                  I am deeply impressed by the remarkable work of the Hamduk Islamic Foundation in promoting education,
                  humanitarian support, and community development. Their unwavering commitment to uplifting individuals
                  is truly commendable.
                </p>
                <div className="flex items-center">
                  <div className="h-12 w-12 overflow-hidden rounded-full bg-gray-200">
                    <Image
                      src="/placeholder.svg?height=48&width=48"
                      alt="Prof. Qudus Amuni"
                      width={48}
                      height={48}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="ml-4">
                    <p className="font-medium">Prof. Qudus Amuni</p>
                    <p className="text-sm text-gray-600">HOD Dept. of Foreign Affairs</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-md">
              <CardContent className="p-6">
                <div className="mb-4 text-4xl text-emerald-600">"</div>
                <p className="mb-6 text-gray-700">
                  The Hamduk Islamic Foundation has been instrumental in providing educational resources to our
                  community. Their dedication to Islamic education and values has made a significant impact on our
                  youth.
                </p>
                <div className="flex items-center">
                  <div className="h-12 w-12 overflow-hidden rounded-full bg-gray-200">
                    <Image
                      src="/placeholder.svg?height=48&width=48"
                      alt="Dr. Aisha Mohammed"
                      width={48}
                      height={48}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="ml-4">
                    <p className="font-medium">Dr. Aisha Mohammed</p>
                    <p className="text-sm text-gray-600">Education Specialist</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-md">
              <CardContent className="p-6">
                <div className="mb-4 text-4xl text-emerald-600">"</div>
                <p className="mb-6 text-gray-700">
                  As a community leader, I've witnessed firsthand the positive influence of Hamduk Islamic Foundation's
                  outreach programs. Their commitment to serving the community is exemplary.
                </p>
                <div className="flex items-center">
                  <div className="h-12 w-12 overflow-hidden rounded-full bg-gray-200">
                    <Image
                      src="/placeholder.svg?height=48&width=48"
                      alt="Imam Ibrahim Yusuf"
                      width={48}
                      height={48}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="ml-4">
                    <p className="font-medium">Imam Ibrahim Yusuf</p>
                    <p className="text-sm text-gray-600">Community Leader</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Training & Education Programs Section */}
      <section className="bg-gray-50 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">{t("home.training.title")}</h2>
            <p className="mt-4 text-lg text-gray-600">{t("home.training.description")}</p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <Card className="border-none shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="mb-4 rounded-full bg-emerald-100 p-3">
                  <GraduationCap className="h-6 w-6 text-emerald-700" />
                </div>
                <h3 className="mb-2 text-xl font-bold">{t("home.training.islamic.title")}</h3>
                <p className="mb-4 text-gray-600">{t("home.training.islamic.description")}</p>
                <Button asChild variant="link" className="mt-auto">
                  <Link href="/focus/training">
                    {t("button.learnMore")} <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="border-none shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="mb-4 rounded-full bg-emerald-100 p-3">
                  <Book className="h-6 w-6 text-emerald-700" />
                </div>
                <h3 className="mb-2 text-xl font-bold">{t("home.training.lectures.title")}</h3>
                <p className="mb-4 text-gray-600">{t("home.training.lectures.description")}</p>
                <Button asChild variant="link" className="mt-auto">
                  <Link href="/focus/lectures">
                    {t("button.learnMore")} <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="border-none shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="mb-4 rounded-full bg-emerald-100 p-3">
                  <Presentation className="h-6 w-6 text-emerald-700" />
                </div>
                <h3 className="mb-2 text-xl font-bold">{t("home.training.tafsir.title")}</h3>
                <p className="mb-4 text-gray-600">{t("home.training.tafsir.description")}</p>
                <Button asChild variant="link" className="mt-auto">
                  <Link href="/focus/ramadan-tafsir">
                    {t("button.learnMore")} <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="border-none shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="mb-4 rounded-full bg-emerald-100 p-3">
                  <Users2 className="h-6 w-6 text-emerald-700" />
                </div>
                <h3 className="mb-2 text-xl font-bold">{t("home.training.youth.title")}</h3>
                <p className="mb-4 text-gray-600">{t("home.training.youth.description")}</p>
                <Button asChild variant="link" className="mt-auto">
                  <Link href="/focus/youth-development">
                    {t("button.learnMore")} <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <NewsletterSignup />
    </main>
  )
}
