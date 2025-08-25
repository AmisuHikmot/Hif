import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { CalendarDays, Clock, MapPin, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export const metadata: Metadata = {
  title: "Ramadan Tafsir | Hamduk Islamic Foundation",
  description: "Learn about our annual Ramadan Tafsir program featuring renowned Islamic scholars",
}

export default function RamadanTafsirPage() {
  return (
    <main className="container mx-auto px-4 py-12">
      <div className="mx-auto max-w-4xl">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl md:text-5xl">
            Ramadan Tafsir Program
          </h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
            Join us for our annual Ramadan Tafsir program, featuring renowned Islamic scholars and in-depth Quranic
            interpretation
          </p>
        </div>

        <div className="relative mb-12 h-[300px] w-full overflow-hidden rounded-xl sm:h-[400px]">
          <Image
            src="/placeholder.svg?height=400&width=1200"
            alt="Ramadan Tafsir Program"
            fill
            className="object-cover"
          />
        </div>

        <div className="prose prose-emerald mx-auto max-w-none dark:prose-invert">
          <h2>About Our Ramadan Tafsir Program</h2>
          <p>
            The Ramadan Tafsir Program is one of Hamduk Islamic Foundation's flagship initiatives. Every year during the
            holy month of Ramadan, we organize daily Quranic interpretation sessions led by renowned Islamic scholars.
            These sessions provide in-depth explanations of the Quran, helping Muslims understand and apply its
            teachings in their daily lives.
          </p>

          <p>
            Our Tafsir program is designed to be accessible to Muslims of all backgrounds, from beginners to those with
            advanced knowledge of Islamic teachings. The sessions are conducted in both Arabic and English, with
            translations provided to ensure everyone can benefit from the knowledge being shared.
          </p>

          <h2>Program Features</h2>
          <ul>
            <li>
              <strong>Daily Sessions:</strong> Tafsir sessions are held daily throughout the month of Ramadan, typically
              after Maghrib prayer.
            </li>
            <li>
              <strong>Renowned Scholars:</strong> Our program features respected Islamic scholars known for their
              knowledge and expertise in Quranic interpretation.
            </li>
            <li>
              <strong>Comprehensive Coverage:</strong> Each year, we focus on different parts of the Quran, ensuring
              comprehensive coverage over time.
            </li>
            <li>
              <strong>Interactive Format:</strong> Attendees have the opportunity to ask questions and engage in
              discussions with the scholars.
            </li>
            <li>
              <strong>Live Streaming:</strong> For those unable to attend in person, sessions are live-streamed on our
              social media platforms.
            </li>
            <li>
              <strong>Recorded Sessions:</strong> All sessions are recorded and made available on our website and
              YouTube channel for future reference.
            </li>
          </ul>
        </div>

        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Upcoming Ramadan Tafsir Program</h2>
          <Card className="overflow-hidden">
            <div className="relative h-64 w-full">
              <Image
                src="/placeholder.svg?height=256&width=768"
                alt="Ramadan Tafsir 2025"
                fill
                className="object-cover"
              />
              <div className="absolute top-4 right-4">
                <Badge className="bg-emerald-500">Upcoming</Badge>
              </div>
            </div>
            <CardHeader>
              <CardTitle>Ramadan Tafsir Program 2025</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Join us for our annual Ramadan Tafsir program, where we will explore the themes of mercy, forgiveness,
                and spiritual growth in the Quran. This year's program will feature renowned scholars including Sheikh
                Abdullah Ibrahim, Dr. Aisha Mohammed, and Imam Yusuf Musa.
              </p>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <CalendarDays className="h-5 w-5 text-emerald-600" />
                  <span>23rd of March 2025 - 23rd of April 2025 (Ramadan 1446 A.H)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-emerald-600" />
                  <span>Daily after Maghrib Prayer (approximately 7:00 PM)</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-emerald-600" />
                  <span>Hamduk Islamic Center, No. 1 Amusugbo Area, Gomajayi, Lagos, Nigeria</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button asChild>
                <Link href="/events/ramadan-tafsir-program-2025">
                  Register Now <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Past Ramadan Tafsir Programs</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <div className="relative h-48 w-full">
                <Image
                  src="/placeholder.svg?height=192&width=384"
                  alt="Ramadan Tafsir 2024"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                  <Badge variant="secondary" className="text-lg font-semibold px-3 py-1.5">
                    2024
                  </Badge>
                </div>
              </div>
              <CardContent className="p-4">
                <h3 className="text-xl font-bold">Ramadan Tafsir 2024</h3>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  Focused on the theme "Guidance in Challenging Times" with interpretations of selected surahs.
                </p>
                <Button variant="outline" className="mt-4 w-full" asChild>
                  <Link href="/media/videos?category=ramadan-tafsir-2024">View Recordings</Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <div className="relative h-48 w-full">
                <Image
                  src="/placeholder.svg?height=192&width=384"
                  alt="Ramadan Tafsir 2023"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                  <Badge variant="secondary" className="text-lg font-semibold px-3 py-1.5">
                    2023
                  </Badge>
                </div>
              </div>
              <CardContent className="p-4">
                <h3 className="text-xl font-bold">Ramadan Tafsir 2023</h3>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  Explored the theme "Building a Strong Muslim Community" through Quranic teachings.
                </p>
                <Button variant="outline" className="mt-4 w-full" asChild>
                  <Link href="/media/videos?category=ramadan-tafsir-2023">View Recordings</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="mt-12 bg-emerald-50 p-8 rounded-lg dark:bg-emerald-900/20">
          <h2 className="text-2xl font-bold mb-4">Get Involved</h2>
          <p className="mb-6">There are several ways you can get involved with our Ramadan Tafsir program:</p>
          <ul className="space-y-2 mb-6">
            <li className="flex items-start gap-2">
              <span className="bg-emerald-100 text-emerald-800 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5 dark:bg-emerald-800 dark:text-emerald-100">
                1
              </span>
              <span>
                <strong>Attend the sessions</strong> in person at Hamduk Islamic Center or watch online via our live
                streams.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="bg-emerald-100 text-emerald-800 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5 dark:bg-emerald-800 dark:text-emerald-100">
                2
              </span>
              <span>
                <strong>Volunteer</strong> to help with organization, logistics, or technical support during the
                program.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="bg-emerald-100 text-emerald-800 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5 dark:bg-emerald-800 dark:text-emerald-100">
                3
              </span>
              <span>
                <strong>Donate</strong> to support the program and help us reach more people with valuable Islamic
                knowledge.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="bg-emerald-100 text-emerald-800 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5 dark:bg-emerald-800 dark:text-emerald-100">
                4
              </span>
              <span>
                <strong>Share</strong> our content on social media to help spread beneficial knowledge to others.
              </span>
            </li>
          </ul>
          <div className="flex flex-wrap gap-4">
            <Button asChild>
              <Link href="/events">Register for Upcoming Program</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/contact-us">Contact Us for More Information</Link>
            </Button>
          </div>
        </div>
      </div>
    </main>
  )
}
