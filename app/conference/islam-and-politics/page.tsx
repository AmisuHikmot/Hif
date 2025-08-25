import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { CalendarDays, Clock, MapPin, ArrowRight, Users, Globe, Scale } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export const metadata: Metadata = {
  title: "Islam and Politics Conference | Hamduk Islamic Foundation",
  description: "Annual conference exploring the relationship between Islam and politics in contemporary society",
}

export default function IslamAndPoliticsPage() {
  return (
    <main className="container mx-auto px-4 py-12">
      <div className="mx-auto max-w-4xl">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl md:text-5xl">
            Islam and Politics Conference
          </h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
            Exploring the relationship between Islam and politics in contemporary society
          </p>
        </div>

        <div className="relative mb-12 h-[300px] w-full overflow-hidden rounded-xl sm:h-[400px]">
          <Image
            src="/placeholder.svg?height=400&width=1200"
            alt="Islam and Politics Conference"
            fill
            className="object-cover"
          />
        </div>

        <div className="prose prose-emerald mx-auto max-w-none dark:prose-invert">
          <h2>About the Conference</h2>
          <p>
            The Islam and Politics Conference is an annual event organized by Hamduk Islamic Foundation to explore the
            complex relationship between Islam and politics in contemporary society. The conference brings together
            scholars, political scientists, policymakers, and community leaders to discuss various aspects of Islamic
            political thought and practice.
          </p>

          <p>
            The relationship between religion and politics has always been a topic of significant debate within Islamic
            discourse. This conference aims to provide a platform for thoughtful and nuanced discussions on how Islamic
            principles can inform political thought and practice in modern contexts, while addressing contemporary
            challenges facing Muslim communities worldwide.
          </p>

          <h2>Conference Themes</h2>
          <p>
            Each year, the conference focuses on specific themes related to Islam and politics. Some of the recurring
            themes include:
          </p>
          <ul>
            <li>
              <strong>Islamic Political Thought:</strong> Exploring classical and contemporary Islamic political
              theories.
            </li>
            <li>
              <strong>Governance and Leadership:</strong> Examining principles of good governance from an Islamic
              perspective.
            </li>
            <li>
              <strong>Democracy and Islam:</strong> Discussing the compatibility of democratic principles with Islamic
              values.
            </li>
            <li>
              <strong>Human Rights:</strong> Exploring Islamic perspectives on human rights and civil liberties.
            </li>
            <li>
              <strong>International Relations:</strong> Examining Islamic principles in international relations and
              diplomacy.
            </li>
            <li>
              <strong>Political Participation:</strong> Discussing Muslim political participation in pluralistic
              societies.
            </li>
          </ul>
        </div>

        <div className="mt-12">
          <Tabs defaultValue="upcoming" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="upcoming">Upcoming Conference</TabsTrigger>
              <TabsTrigger value="past">Past Conferences</TabsTrigger>
            </TabsList>
            <TabsContent value="upcoming" className="mt-6">
              <Card className="overflow-hidden">
                <div className="relative h-64 w-full">
                  <Image
                    src="/placeholder.svg?height=256&width=768"
                    alt="Islam and Politics Conference 2025"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-emerald-500">Upcoming</Badge>
                  </div>
                </div>
                <CardHeader>
                  <CardTitle>Islam and Politics Conference 2025: Ethical Governance</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>
                    The 2025 Islam and Politics Conference will focus on the theme "Ethical Governance: Islamic
                    Principles for Just and Accountable Leadership." The conference will explore how Islamic ethical
                    principles can inform governance practices to promote justice, accountability, and the common good
                    in contemporary political contexts.
                  </p>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <CalendarDays className="h-5 w-5 text-emerald-600" />
                      <span>November 5-7, 2025</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-emerald-600" />
                      <span>9:00 AM - 5:00 PM daily</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-emerald-600" />
                      <span>Hamduk Conference Center, Kano, Nigeria</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button asChild>
                    <Link href="/conference/islam-and-politics/2025">
                      Register Now <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            <TabsContent value="past" className="mt-6">
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <div className="relative h-48 w-full">
                    <Image
                      src="/placeholder.svg?height=192&width=384"
                      alt="Islam and Politics Conference 2024"
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
                    <h3 className="text-xl font-bold">Islam and Politics Conference 2024</h3>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                      Theme: "Islam and Democracy: Navigating Pluralism in Muslim-Majority Societies"
                    </p>
                    <Button variant="outline" className="mt-4 w-full" asChild>
                      <Link href="/media/videos?category=politics-conference-2024">View Recordings</Link>
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <div className="relative h-48 w-full">
                    <Image
                      src="/placeholder.svg?height=192&width=384"
                      alt="Islam and Politics Conference 2023"
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
                    <h3 className="text-xl font-bold">Islam and Politics Conference 2023</h3>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                      Theme: "Islamic Political Ethics in a Globalized World"
                    </p>
                    <Button variant="outline" className="mt-4 w-full" asChild>
                      <Link href="/media/videos?category=politics-conference-2023">View Recordings</Link>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-3">
          <div className="flex flex-col items-center text-center p-6 bg-white rounded-lg shadow-sm dark:bg-gray-800">
            <div className="bg-emerald-100 text-emerald-700 p-3 rounded-full mb-4 dark:bg-emerald-900 dark:text-emerald-100">
              <Users className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold mb-2">Diverse Perspectives</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Bringing together scholars from various schools of thought to foster rich dialogue.
            </p>
          </div>

          <div className="flex flex-col items-center text-center p-6 bg-white rounded-lg shadow-sm dark:bg-gray-800">
            <div className="bg-emerald-100 text-emerald-700 p-3 rounded-full mb-4 dark:bg-emerald-900 dark:text-emerald-100">
              <Globe className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold mb-2">Global Context</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Examining Islamic political thought in the context of global challenges and opportunities.
            </p>
          </div>

          <div className="flex flex-col items-center text-center p-6 bg-white rounded-lg shadow-sm dark:bg-gray-800">
            <div className="bg-emerald-100 text-emerald-700 p-3 rounded-full mb-4 dark:bg-emerald-900 dark:text-emerald-100">
              <Scale className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold mb-2">Ethical Framework</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Exploring how Islamic ethics can inform political decisions and governance structures.
            </p>
          </div>
        </div>

        <div className="mt-12 bg-emerald-50 p-8 rounded-lg dark:bg-emerald-900/20">
          <h2 className="text-2xl font-bold mb-4">Participate in the Conference</h2>
          <p className="mb-6">There are several ways you can participate in the Islam and Politics Conference:</p>
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
                <strong>Submit a paper</strong> to present your research on Islam and politics.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="bg-emerald-100 text-emerald-800 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5 dark:bg-emerald-800 dark:text-emerald-100">
                3
              </span>
              <span>
                <strong>Organize a panel</strong> on a specific topic related to Islam and politics.
              </span>
            </li>
          </ul>
          <div className="flex flex-wrap gap-4">
            <Button asChild>
              <Link href="/conference/islam-and-politics/register">Register for the Conference</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/conference/islam-and-politics/call-for-papers">Submit a Paper</Link>
            </Button>
          </div>
        </div>
      </div>
    </main>
  )
}
