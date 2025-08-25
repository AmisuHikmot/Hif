import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { CalendarDays, Clock, MapPin, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export const metadata: Metadata = {
  title: "Islam in Nigeria Conference | Hamduk Islamic Foundation",
  description: "Annual conference exploring the history, challenges, and future of Islam in Nigeria",
}

export default function IslamInNigeriaPage() {
  return (
    <main className="container mx-auto px-4 py-12">
      <div className="mx-auto max-w-4xl">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl md:text-5xl">
            Islam in Nigeria Conference
          </h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
            Exploring the history, challenges, and future of Islam in Nigeria
          </p>
        </div>

        <div className="relative mb-12 h-[300px] w-full overflow-hidden rounded-xl sm:h-[400px]">
          <Image
            src="/placeholder.svg?height=400&width=1200"
            alt="Islam in Nigeria Conference"
            fill
            className="object-cover"
          />
        </div>

        <div className="prose prose-emerald mx-auto max-w-none dark:prose-invert">
          <h2>About the Conference</h2>
          <p>
            The Islam in Nigeria Conference is an annual event organized by Hamduk Islamic Foundation to explore the
            rich history, current challenges, and future prospects of Islam in Nigeria. The conference brings together
            scholars, researchers, community leaders, and policymakers to discuss various aspects of Islam in the
            Nigerian context.
          </p>

          <p>
            Nigeria has one of the largest Muslim populations in Africa, with a rich Islamic heritage dating back
            centuries. The conference provides a platform to celebrate this heritage, address contemporary challenges
            facing Nigerian Muslims, and develop strategies for the future growth and development of the Muslim
            community in Nigeria.
          </p>

          <h2>Conference Themes</h2>
          <p>
            Each year, the conference focuses on specific themes related to Islam in Nigeria. Some of the recurring
            themes include:
          </p>
          <ul>
            <li>
              <strong>Islamic History in Nigeria:</strong> Exploring the spread and development of Islam in different
              regions of Nigeria.
            </li>
            <li>
              <strong>Islamic Education:</strong> Discussing the state and future of Islamic education in Nigeria.
            </li>
            <li>
              <strong>Islamic Law and Governance:</strong> Examining the application of Islamic law and principles in
              governance.
            </li>
            <li>
              <strong>Interfaith Relations:</strong> Exploring relations between Muslims and people of other faiths in
              Nigeria.
            </li>
            <li>
              <strong>Contemporary Challenges:</strong> Addressing current challenges facing Nigerian Muslims and
              developing solutions.
            </li>
            <li>
              <strong>Islamic Culture and Arts:</strong> Celebrating the rich Islamic cultural and artistic heritage of
              Nigeria.
            </li>
          </ul>
        </div>

        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Upcoming Conference</h2>
          <Card className="overflow-hidden">
            <div className="relative h-64 w-full">
              <Image
                src="/placeholder.svg?height=256&width=768"
                alt="Islam in Nigeria Conference 2025"
                fill
                className="object-cover"
              />
              <div className="absolute top-4 right-4">
                <Badge className="bg-emerald-500">Upcoming</Badge>
              </div>
            </div>
            <CardHeader>
              <CardTitle>Islam in Nigeria Conference 2025: Unity in Diversity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                The 2025 Islam in Nigeria Conference will focus on the theme "Unity in Diversity: Celebrating the
                Richness of Islamic Traditions in Nigeria." The conference will explore the diverse Islamic traditions
                and practices across different regions of Nigeria, highlighting how this diversity enriches the Muslim
                community while emphasizing the core Islamic principles that unite all Muslims.
              </p>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <CalendarDays className="h-5 w-5 text-emerald-600" />
                  <span>September 15-17, 2025</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-emerald-600" />
                  <span>9:00 AM - 5:00 PM daily</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-emerald-600" />
                  <span>Hamduk Conference Center, Lagos, Nigeria</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button asChild>
                <Link href="/conference/islam-in-nigeria/2025">
                  Register Now <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Past Conferences</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <div className="relative h-48 w-full">
                <Image
                  src="/placeholder.svg?height=192&width=384"
                  alt="Islam in Nigeria Conference 2024"
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
                <h3 className="text-xl font-bold">Islam in Nigeria Conference 2024</h3>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  Theme: "Islamic Education in the Digital Age: Challenges and Opportunities"
                </p>
                <Button variant="outline" className="mt-4 w-full" asChild>
                  <Link href="/media/videos?category=conference-2024">View Recordings</Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <div className="relative h-48 w-full">
                <Image
                  src="/placeholder.svg?height=192&width=384"
                  alt="Islam in Nigeria Conference 2023"
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
                <h3 className="text-xl font-bold">Islam in Nigeria Conference 2023</h3>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  Theme: "Islamic Perspectives on Social Justice and Community Development"
                </p>
                <Button variant="outline" className="mt-4 w-full" asChild>
                  <Link href="/media/videos?category=conference-2023">View Recordings</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="mt-12 bg-emerald-50 p-8 rounded-lg dark:bg-emerald-900/20">
          <h2 className="text-2xl font-bold mb-4">Participate in the Conference</h2>
          <p className="mb-6">There are several ways you can participate in the Islam in Nigeria Conference:</p>
          <ul className="space-y-2 mb-6">
            <li className="flex items-start gap-2">
              <span className="bg-emerald-100 text-emerald-800 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5 dark:bg-emerald-800 dark:text-emerald-100">
                1
              </span>
              <span>
                <strong>Attend as a participant</strong> to learn from scholars and engage in discussions.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="bg-emerald-100 text-emerald-800 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5 dark:bg-emerald-800 dark:text-emerald-100">
                2
              </span>
              <span>
                <strong>Submit a paper</strong> to present your research on Islam in Nigeria.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="bg-emerald-100 text-emerald-800 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5 dark:bg-emerald-800 dark:text-emerald-100">
                3
              </span>
              <span>
                <strong>Volunteer</strong> to help with organization and logistics.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="bg-emerald-100 text-emerald-800 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5 dark:bg-emerald-800 dark:text-emerald-100">
                4
              </span>
              <span>
                <strong>Sponsor the conference</strong> to support this important initiative.
              </span>
            </li>
          </ul>
          <div className="flex flex-wrap gap-4">
            <Button asChild>
              <Link href="/conference/islam-in-nigeria/register">Register for the Conference</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/conference/islam-in-nigeria/call-for-papers">Submit a Paper</Link>
            </Button>
          </div>
        </div>
      </div>
    </main>
  )
}
