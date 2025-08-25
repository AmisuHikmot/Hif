import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { CalendarDays, Clock, MapPin, ArrowRight, BookOpen, GraduationCap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export const metadata: Metadata = {
  title: "Islam and Education Conference | Hamduk Islamic Foundation",
  description: "Annual conference exploring Islamic education, its principles, challenges, and innovations",
}

export default function IslamAndEducationPage() {
  return (
    <main className="container mx-auto px-4 py-12">
      <div className="mx-auto max-w-4xl">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl md:text-5xl">
            Islam and Education Conference
          </h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
            Exploring Islamic education principles, challenges, and innovations
          </p>
        </div>

        <div className="relative mb-12 h-[300px] w-full overflow-hidden rounded-xl sm:h-[400px]">
          <Image
            src="/placeholder.svg?height=400&width=1200"
            alt="Islam and Education Conference"
            fill
            className="object-cover"
          />
        </div>

        <div className="prose prose-emerald mx-auto max-w-none dark:prose-invert">
          <h2>About the Conference</h2>
          <p>
            The Islam and Education Conference is an annual event organized by Hamduk Islamic Foundation to explore the
            principles, challenges, and innovations in Islamic education. The conference brings together educators,
            scholars, researchers, and policymakers to discuss various aspects of Islamic education in contemporary
            society.
          </p>

          <p>
            Education has always been central to Islamic tradition, with the first revelation to Prophet Muhammad (PBUH)
            beginning with the command "Read!" This conference aims to honor this tradition while addressing modern
            educational challenges and opportunities for Muslims worldwide.
          </p>

          <h2>Conference Themes</h2>
          <p>
            Each year, the conference focuses on specific themes related to Islam and education. Some of the recurring
            themes include:
          </p>
          <ul>
            <li>
              <strong>Islamic Educational Philosophy:</strong> Exploring the foundational principles of Islamic
              education.
            </li>
            <li>
              <strong>Curriculum Development:</strong> Designing comprehensive Islamic curricula for various age groups.
            </li>
            <li>
              <strong>Integration of Islamic and Modern Sciences:</strong> Bridging traditional Islamic knowledge with
              contemporary sciences.
            </li>
            <li>
              <strong>Technology in Islamic Education:</strong> Leveraging digital tools for effective Islamic
              education.
            </li>
            <li>
              <strong>Teacher Training:</strong> Developing competent educators for Islamic subjects.
            </li>
            <li>
              <strong>Educational Institutions:</strong> Building and managing effective Islamic schools and
              universities.
            </li>
          </ul>
        </div>

        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Upcoming Conference</h2>
          <Card className="overflow-hidden">
            <div className="relative h-64 w-full">
              <Image
                src="/placeholder.svg?height=256&width=768"
                alt="Islam and Education Conference 2025"
                fill
                className="object-cover"
              />
              <div className="absolute top-4 right-4">
                <Badge className="bg-emerald-500">Upcoming</Badge>
              </div>
            </div>
            <CardHeader>
              <CardTitle>Islam and Education Conference 2025: Digital Transformation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                The 2025 Islam and Education Conference will focus on the theme "Digital Transformation in Islamic
                Education: Opportunities and Challenges." The conference will explore how digital technologies are
                transforming Islamic education and how educators can leverage these technologies while maintaining the
                core values and principles of Islamic education.
              </p>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <CalendarDays className="h-5 w-5 text-emerald-600" />
                  <span>October 10-12, 2025</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-emerald-600" />
                  <span>9:00 AM - 5:00 PM daily</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-emerald-600" />
                  <span>Hamduk Conference Center, Abuja, Nigeria</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button asChild>
                <Link href="/conference/islam-and-education/2025">
                  Register Now <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-2">
          <div>
            <h2 className="text-2xl font-bold mb-6">Key Topics</h2>
            <ul className="space-y-4">
              <li className="flex gap-3">
                <div className="flex-shrink-0 mt-1">
                  <div className="bg-emerald-100 text-emerald-700 p-2 rounded-full dark:bg-emerald-900 dark:text-emerald-100">
                    <BookOpen className="h-5 w-5" />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Quranic Education</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Methods and approaches for teaching Quran memorization, recitation, and understanding.
                  </p>
                </div>
              </li>
              <li className="flex gap-3">
                <div className="flex-shrink-0 mt-1">
                  <div className="bg-emerald-100 text-emerald-700 p-2 rounded-full dark:bg-emerald-900 dark:text-emerald-100">
                    <GraduationCap className="h-5 w-5" />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Higher Islamic Education</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Developing Islamic universities and research institutions for advanced Islamic studies.
                  </p>
                </div>
              </li>
              <li className="flex gap-3">
                <div className="flex-shrink-0 mt-1">
                  <div className="bg-emerald-100 text-emerald-700 p-2 rounded-full dark:bg-emerald-900 dark:text-emerald-100">
                    <BookOpen className="h-5 w-5" />
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Islamic Ethics and Character Development</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Integrating character development and ethical teachings in educational curricula.
                  </p>
                </div>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-6">Past Conferences</h2>
            <div className="space-y-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-bold">2024 Conference</h3>
                    <Badge>Past</Badge>
                  </div>
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    Theme: "Islamic Education for the 21st Century: Balancing Tradition and Innovation"
                  </p>
                  <Button variant="outline" className="mt-4 w-full" asChild>
                    <Link href="/media/videos?category=education-conference-2024">View Recordings</Link>
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-bold">2023 Conference</h3>
                    <Badge>Past</Badge>
                  </div>
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    Theme: "Reviving the Islamic Educational Heritage in Contemporary Context"
                  </p>
                  <Button variant="outline" className="mt-4 w-full" asChild>
                    <Link href="/media/videos?category=education-conference-2023">View Recordings</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        <div className="mt-12 bg-emerald-50 p-8 rounded-lg dark:bg-emerald-900/20">
          <h2 className="text-2xl font-bold mb-4">Call for Papers</h2>
          <p className="mb-6">
            We invite scholars, educators, researchers, and practitioners to submit papers for presentation at the
            upcoming Islam and Education Conference. Papers should address one of the conference themes and provide
            insights, research findings, or practical solutions related to Islamic education.
          </p>
          <div className="mb-6">
            <h3 className="font-semibold text-lg mb-2">Important Dates</h3>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <CalendarDays className="h-5 w-5 text-emerald-600" />
                <span>
                  <strong>Abstract Submission Deadline:</strong> May 15, 2025
                </span>
              </li>
              <li className="flex items-center gap-2">
                <CalendarDays className="h-5 w-5 text-emerald-600" />
                <span>
                  <strong>Notification of Acceptance:</strong> June 30, 2025
                </span>
              </li>
              <li className="flex items-center gap-2">
                <CalendarDays className="h-5 w-5 text-emerald-600" />
                <span>
                  <strong>Full Paper Submission:</strong> August 15, 2025
                </span>
              </li>
            </ul>
          </div>
          <Button asChild>
            <Link href="/conference/islam-and-education/call-for-papers">Submit Abstract</Link>
          </Button>
        </div>
      </div>
    </main>
  )
}
