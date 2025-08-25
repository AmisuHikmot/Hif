import type { Metadata } from "next"
import { Calendar, Filter, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import EventCard from "@/components/event-card"

export const metadata: Metadata = {
  title: "Events | Hamduk Islamic Foundation",
  description: "Upcoming and past events organized by Hamduk Islamic Foundation.",
}

export default function EventsPage() {
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
              <SelectItem value="lectures">Lectures</SelectItem>
              <SelectItem value="workshops">Workshops</SelectItem>
              <SelectItem value="conferences">Conferences</SelectItem>
              <SelectItem value="community">Community Events</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Calendar className="mr-2 h-4 w-4" />
            Calendar View
          </Button>
        </div>
      </div>

      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="mb-8 grid w-full grid-cols-2 md:w-auto md:grid-cols-3">
          <TabsTrigger value="upcoming">Upcoming Events</TabsTrigger>
          <TabsTrigger value="ongoing">Ongoing Programs</TabsTrigger>
          <TabsTrigger value="past">Past Events</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <EventCard
              title="RAMADAN LECTURE AND QUIZ COMPETITION"
              description="Event is in memory of Alhaja H.A Raji"
              date="23rd of March 2025; 23rd of Ramadan 1446A.H"
              time="10:00 AM - 2:00 PM"
              location="No. 1 Amusugbo Area, Gomajayi, Lagos State"
              imageSrc="/placeholder.svg?height=200&width=400"
            />
            <EventCard
              title="Islamic Leadership Conference"
              description="Annual conference on Islamic leadership principles"
              date="15th of June 2025"
              time="9:00 AM - 5:00 PM"
              location="Hamduk Islamic Center, Lagos"
              imageSrc="/placeholder.svg?height=200&width=400"
            />
            <EventCard
              title="Youth Development Workshop"
              description="Building the next generation of Muslim leaders"
              date="10th of August 2025"
              time="2:00 PM - 6:00 PM"
              location="Various locations across Lagos State"
              imageSrc="/placeholder.svg?height=200&width=400"
            />
            <EventCard
              title="Islamic Finance Seminar"
              description="Understanding Islamic banking and finance principles"
              date="5th of September 2025"
              time="10:00 AM - 1:00 PM"
              location="Hamduk Conference Hall, Lagos"
              imageSrc="/placeholder.svg?height=200&width=400"
            />
            <EventCard
              title="Women in Islam Conference"
              description="Celebrating the role of women in Islamic history and society"
              date="20th of October 2025"
              time="11:00 AM - 4:00 PM"
              location="Central Mosque, Lagos"
              imageSrc="/placeholder.svg?height=200&width=400"
            />
            <EventCard
              title="Islamic Art Exhibition"
              description="Showcasing Islamic calligraphy, architecture, and visual arts"
              date="15th of November 2025"
              time="10:00 AM - 6:00 PM"
              location="National Museum, Lagos"
              imageSrc="/placeholder.svg?height=200&width=400"
            />
          </div>
        </TabsContent>

        <TabsContent value="ongoing">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <EventCard
              title="Weekly Tafsir Program"
              description="Regular Quranic interpretation sessions"
              date="Every Saturday"
              time="4:00 PM - 6:00 PM"
              location="Hamduk Islamic Center, Lagos"
              imageSrc="/placeholder.svg?height=200&width=400"
            />
            <EventCard
              title="Islamic Education Classes"
              description="Ongoing classes for children and adults"
              date="Every Sunday"
              time="10:00 AM - 12:00 PM"
              location="Multiple Branches"
              imageSrc="/placeholder.svg?height=200&width=400"
            />
            <EventCard
              title="Arabic Language Course"
              description="Learn to read, write and speak Arabic"
              date="Tuesdays and Thursdays"
              time="5:00 PM - 7:00 PM"
              location="Hamduk Education Center"
              imageSrc="/placeholder.svg?height=200&width=400"
            />
          </div>
        </TabsContent>

        <TabsContent value="past">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <EventCard
              title="Annual Islamic Conference 2024"
              description="Exploring contemporary challenges facing Muslims"
              date="12th of January 2024"
              time="9:00 AM - 5:00 PM"
              location="Hamduk Conference Center, Lagos"
              imageSrc="/placeholder.svg?height=200&width=400"
              isPast={true}
            />
            <EventCard
              title="Ramadan Tafsir Series"
              description="Daily Quranic interpretation during Ramadan"
              date="March-April 2024"
              time="8:00 PM - 10:00 PM"
              location="Central Mosque, Lagos"
              imageSrc="/placeholder.svg?height=200&width=400"
              isPast={true}
            />
            <EventCard
              title="Islamic Education Symposium"
              description="Strategies for modern Islamic education"
              date="5th of February 2024"
              time="10:00 AM - 3:00 PM"
              location="University of Lagos"
              imageSrc="/placeholder.svg?height=200&width=400"
              isPast={true}
            />
            <EventCard
              title="Charity Drive for Orphans"
              description="Fundraising event for local orphanages"
              date="20th of March 2024"
              time="2:00 PM - 6:00 PM"
              location="Community Hall, Lagos"
              imageSrc="/placeholder.svg?height=200&width=400"
              isPast={true}
            />
            <EventCard
              title="Islamic Finance Workshop"
              description="Introduction to Islamic banking principles"
              date="15th of April 2024"
              time="10:00 AM - 1:00 PM"
              location="Hamduk Islamic Center"
              imageSrc="/placeholder.svg?height=200&width=400"
              isPast={true}
            />
            <EventCard
              title="Eid Celebration"
              description="Community gathering for Eid-ul-Fitr"
              date="10th of April 2024"
              time="9:00 AM - 2:00 PM"
              location="Central Prayer Ground, Lagos"
              imageSrc="/placeholder.svg?height=200&width=400"
              isPast={true}
            />
          </div>
        </TabsContent>
      </Tabs>
    </main>
  )
}
