import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { CalendarDays, Clock, MapPin, ArrowRight, DollarSign, Landmark, LineChart, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export const metadata: Metadata = {
  title: "Islam and Economy Conference | Hamduk Islamic Foundation",
  description: "Annual conference exploring Islamic economics, finance, and sustainable development",
}

export default function IslamAndEconomyPage() {
  return (
    <main className="container mx-auto px-4 py-12">
      <div className="mx-auto max-w-4xl">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl md:text-5xl">
            Islam and Economy Conference
          </h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
            Exploring Islamic economics, finance, and sustainable development
          </p>
        </div>

        <div className="relative mb-12 h-[300px] w-full overflow-hidden rounded-xl sm:h-[400px]">
          <Image
            src="/placeholder.svg?height=400&width=1200"
            alt="Islam and Economy Conference"
            fill
            className="object-cover"
          />
        </div>

        <div className="prose prose-emerald mx-auto max-w-none dark:prose-invert">
          <h2>About the Conference</h2>
          <p>
            The Islam and Economy Conference is an annual event organized by Hamduk Islamic Foundation to explore
            Islamic economics, finance, and sustainable development. The conference brings together economists,
            financial experts, scholars, business leaders, and policymakers to discuss various aspects of Islamic
            economic thought and practice.
          </p>

          <p>
            Islam provides a comprehensive framework for economic activities based on principles of justice, equity, and
            ethical conduct. This conference aims to examine how these principles can be applied in contemporary
            economic contexts to address global challenges such as poverty, inequality, and environmental degradation.
          </p>

          <h2>Conference Themes</h2>
          <p>
            Each year, the conference focuses on specific themes related to Islam and economy. Some of the recurring
            themes include:
          </p>
          <ul>
            <li>
              <strong>Islamic Banking and Finance:</strong> Exploring principles and practices of interest-free banking.
            </li>
            <li>
              <strong>Zakat and Poverty Alleviation:</strong> Examining the role of zakat in addressing poverty.
            </li>
            <li>
              <strong>Islamic Business Ethics:</strong> Discussing ethical principles for business conduct.
            </li>
            <li>
              <strong>Sustainable Development:</strong> Exploring Islamic perspectives on environmental stewardship.
            </li>
            <li>
              <strong>Economic Justice:</strong> Addressing inequality and promoting fair distribution of wealth.
            </li>
            <li>
              <strong>Entrepreneurship:</strong> Fostering entrepreneurship within Islamic ethical frameworks.
            </li>
          </ul>
        </div>

        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Upcoming Conference</h2>
          <Card className="overflow-hidden">
            <div className="relative h-64 w-full">
              <Image
                src="/placeholder.svg?height=256&width=768"
                alt="Islam and Economy Conference 2025"
                fill
                className="object-cover"
              />
              <div className="absolute top-4 right-4">
                <Badge className="bg-emerald-500">Upcoming</Badge>
              </div>
            </div>
            <CardHeader>
              <CardTitle>Islam and Economy Conference 2025: Sustainable Finance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                The 2025 Islam and Economy Conference will focus on the theme "Islamic Finance for Sustainable
                Development: Bridging Faith and Sustainability." The conference will explore how Islamic financial
                principles can contribute to sustainable development goals and address global challenges such as climate
                change, poverty, and inequality.
              </p>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <CalendarDays className="h-5 w-5 text-emerald-600" />
                  <span>December 8-10, 2025</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-emerald-600" />
                  <span>9:00 AM - 5:00 PM daily</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-emerald-600" />
                  <span>Hamduk Conference Center, Kaduna, Nigeria</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button asChild>
                <Link href="/conference/islam-and-economy/2025">
                  Register Now <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-3">
          <div className="flex flex-col items-center text-center p-6 bg-white rounded-lg shadow-sm dark:bg-gray-800">
            <div className="bg-emerald-100 text-emerald-700 p-3 rounded-full mb-4 dark:bg-emerald-900 dark:text-emerald-100">
              <DollarSign className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold mb-2">Islamic Finance</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Exploring interest-free banking, sukuk, and other Islamic financial instruments.
            </p>
          </div>

          <div className="flex flex-col items-center text-center p-6 bg-white rounded-lg shadow-sm dark:bg-gray-800">
            <div className="bg-emerald-100 text-emerald-700 p-3 rounded-full mb-4 dark:bg-emerald-900 dark:text-emerald-100">
              <Landmark className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold mb-2">Economic Justice</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Examining Islamic principles for fair distribution of wealth and resources.
            </p>
          </div>

          <div className="flex flex-col items-center text-center p-6 bg-white rounded-lg shadow-sm dark:bg-gray-800">
            <div className="bg-emerald-100 text-emerald-700 p-3 rounded-full mb-4 dark:bg-emerald-900 dark:text-emerald-100">
              <LineChart className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold mb-2">Sustainable Growth</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Developing economic models that balance growth with environmental and social responsibility.
            </p>
          </div>
        </div>

        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Past Conferences</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <div className="relative h-48 w-full">
                <Image
                  src="/placeholder.svg?height=192&width=384"
                  alt="Islam and Economy Conference 2024"
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
                <h3 className="text-xl font-bold">Islam and Economy Conference 2024</h3>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  Theme: "Islamic Fintech: Innovation and Inclusion in the Digital Economy"
                </p>
                <Button variant="outline" className="mt-4 w-full" asChild>
                  <Link href="/media/videos?category=economy-conference-2024">View Recordings</Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <div className="relative h-48 w-full">
                <Image
                  src="/placeholder.svg?height=192&width=384"
                  alt="Islam and Economy Conference 2023"
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
                <h3 className="text-xl font-bold">Islam and Economy Conference 2023</h3>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                  Theme: "Zakat and Waqf: Revitalizing Traditional Islamic Institutions for Modern Economic Challenges"
                </p>
                <Button variant="outline" className="mt-4 w-full" asChild>
                  <Link href="/media/videos?category=economy-conference-2023">View Recordings</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="mt-12 bg-emerald-50 p-8 rounded-lg dark:bg-emerald-900/20">
          <h2 className="text-2xl font-bold mb-4">Special Features</h2>
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-shrink-0">
                <div className="bg-emerald-100 text-emerald-700 p-3 rounded-full dark:bg-emerald-900 dark:text-emerald-100">
                  <Users className="h-6 w-6" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold">Islamic Finance Exhibition</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  The conference features an exhibition where Islamic financial institutions showcase their products and
                  services.
                </p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-shrink-0">
                <div className="bg-emerald-100 text-emerald-700 p-3 rounded-full dark:bg-emerald-900 dark:text-emerald-100">
                  <Users className="h-6 w-6" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold">Business Networking</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Special networking sessions for entrepreneurs, investors, and business leaders to connect and explore
                  opportunities.
                </p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-shrink-0">
                <div className="bg-emerald-100 text-emerald-700 p-3 rounded-full dark:bg-emerald-900 dark:text-emerald-100">
                  <Users className="h-6 w-6" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold">Workshops and Training</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Practical workshops on Islamic finance, entrepreneurship, and sustainable business practices.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
