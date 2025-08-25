import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { CalendarDays, Clock, MapPin, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

export const metadata: Metadata = {
  title: "Periodic Lectures | Hamduk Islamic Foundation",
  description: "Learn about our regular lecture series on various Islamic topics",
}

export default function PeriodicLecturesPage() {
  return (
    <main className="container mx-auto px-4 py-12">
      <div className="mx-auto max-w-4xl">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl md:text-5xl">
            Periodic Lectures
          </h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
            Regular lectures on various Islamic topics to educate and inspire our community
          </p>
        </div>

        <div className="relative mb-12 h-[300px] w-full overflow-hidden rounded-xl sm:h-[400px]">
          <Image src="/placeholder.svg?height=400&width=1200" alt="Islamic Lectures" fill className="object-cover" />
        </div>

        <div className="prose prose-emerald mx-auto max-w-none dark:prose-invert">
          <h2>About Our Lecture Series</h2>
          <p>
            Hamduk Islamic Foundation organizes regular lectures on various Islamic topics to educate and inspire our
            community. These lectures address contemporary issues from an Islamic perspective, providing guidance on how
            to apply Islamic principles in today's world.
          </p>

          <p>
            Our lectures are delivered by knowledgeable scholars and speakers who are experts in their respective
            fields. They cover a wide range of topics, including Islamic jurisprudence, spirituality, family life,
            social issues, and more. The lectures are designed to be accessible to Muslims of all backgrounds, from
            beginners to those with advanced knowledge of Islamic teachings.
          </p>

          <h2>Lecture Series Categories</h2>
          <ul>
            <li>
              <strong>Weekly Friday Lectures:</strong> Held after Jumu'ah prayers, these lectures focus on practical
              aspects of Islamic living.
            </li>
            <li>
              <strong>Monthly Thematic Lectures:</strong> In-depth discussions on specific themes or topics in Islam.
            </li>
            <li>
              <strong>Quarterly Seminars:</strong> Comprehensive seminars on major aspects of Islamic knowledge.
            </li>
            <li>
              <strong>Special Occasion Lectures:</strong> Lectures organized for Islamic holidays and special occasions.
            </li>
          </ul>
        </div>

        <div className="mt-12">
          <Tabs defaultValue="upcoming" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="upcoming">Upcoming Lectures</TabsTrigger>
              <TabsTrigger value="past">Past Lectures</TabsTrigger>
            </TabsList>
            <TabsContent value="upcoming" className="mt-6 space-y-6">
              <Card className="overflow-hidden">
                <div className="relative h-48 w-full">
                  <Image
                    src="/placeholder.svg?height=192&width=768"
                    alt="Islamic Finance Lecture"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-emerald-500">Upcoming</Badge>
                  </div>
                </div>
                <CardHeader>
                  <CardTitle>Understanding Islamic Finance in Modern Economy</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>
                    This lecture will explore the principles of Islamic finance and how they can be applied in today's
                    economic landscape. Topics will include halal investments, interest-free banking, and ethical
                    financial practices.
                  </p>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <CalendarDays className="h-5 w-5 text-emerald-600" />
                      <span>June 15, 2025</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-emerald-600" />
                      <span>10:00 AM - 1:00 PM</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-emerald-600" />
                      <span>Hamduk Islamic Center, Lagos</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button asChild>
                    <Link href="/events/islamic-finance-lecture">
                      Register Now <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>

              <Card className="overflow-hidden">
                <div className="relative h-48 w-full">
                  <Image
                    src="/placeholder.svg?height=192&width=768"
                    alt="Family in Islam Lecture"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-emerald-500">Upcoming</Badge>
                  </div>
                </div>
                <CardHeader>
                  <CardTitle>Building Strong Muslim Families</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>
                    This lecture will discuss the Islamic perspective on family life, including the roles and
                    responsibilities of family members, parenting in the modern age, and maintaining Islamic values in
                    the family.
                  </p>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <CalendarDays className="h-5 w-5 text-emerald-600" />
                      <span>July 20, 2025</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-emerald-600" />
                      <span>2:00 PM - 5:00 PM</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-emerald-600" />
                      <span>Hamduk Islamic Center, Lagos</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button asChild>
                    <Link href="/events/muslim-families-lecture">
                      Register Now <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            <TabsContent value="past" className="mt-6 space-y-6">
              <Card className="overflow-hidden">
                <div className="relative h-48 w-full">
                  <Image
                    src="/placeholder.svg?height=192&width=768"
                    alt="Islamic Ethics Lecture"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <Badge variant="secondary" className="text-lg font-semibold px-3 py-1.5">
                      Past Event
                    </Badge>
                  </div>
                </div>
                <CardHeader>
                  <CardTitle>Islamic Ethics in Professional Life</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>
                    This lecture explored how Islamic ethics can guide Muslims in their professional lives, covering
                    topics such as honesty, integrity, fairness, and excellence in work.
                  </p>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <CalendarDays className="h-5 w-5 text-emerald-600" />
                      <span>April 10, 2024</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" asChild>
                    <Link href="/media/videos/islamic-ethics-lecture">
                      Watch Recording <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>

              <Card className="overflow-hidden">
                <div className="relative h-48 w-full">
                  <Image
                    src="/placeholder.svg?height=192&width=768"
                    alt="Islamic History Lecture"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <Badge variant="secondary" className="text-lg font-semibold px-3 py-1.5">
                      Past Event
                    </Badge>
                  </div>
                </div>
                <CardHeader>
                  <CardTitle>The Golden Age of Islamic Civilization</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>
                    This lecture highlighted the contributions of Islamic civilization to science, medicine,
                    mathematics, and other fields during its golden age, and discussed lessons for Muslims today.
                  </p>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <CalendarDays className="h-5 w-5 text-emerald-600" />
                      <span>February 25, 2024</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" asChild>
                    <Link href="/media/videos/islamic-civilization-lecture">
                      Watch Recording <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="mt-12 bg-emerald-50 p-8 rounded-lg dark:bg-emerald-900/20">
          <h2 className="text-2xl font-bold mb-4">Participate in Our Lecture Series</h2>
          <p className="mb-6">
            We welcome all members of the community to attend our lectures. Here's how you can participate:
          </p>
          <ul className="space-y-2 mb-6">
            <li className="flex items-start gap-2">
              <span className="bg-emerald-100 text-emerald-800 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5 dark:bg-emerald-800 dark:text-emerald-100">
                1
              </span>
              <span>
                <strong>Attend in person</strong> at Hamduk Islamic Center. All lectures are free and open to the
                public.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="bg-emerald-100 text-emerald-800 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5 dark:bg-emerald-800 dark:text-emerald-100">
                2
              </span>
              <span>
                <strong>Watch online</strong> via our live streams on social media platforms.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="bg-emerald-100 text-emerald-800 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5 dark:bg-emerald-800 dark:text-emerald-100">
                3
              </span>
              <span>
                <strong>Access recordings</strong> of past lectures on our website and YouTube channel.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="bg-emerald-100 text-emerald-800 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5 dark:bg-emerald-800 dark:text-emerald-100">
                4
              </span>
              <span>
                <strong>Suggest topics</strong> for future lectures by contacting our education committee.
              </span>
            </li>
          </ul>
          <div className="flex flex-wrap gap-4">
            <Button asChild>
              <Link href="/events">View All Upcoming Lectures</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/media/videos">Access Lecture Recordings</Link>
            </Button>
          </div>
        </div>
      </div>
    </main>
  )
}
