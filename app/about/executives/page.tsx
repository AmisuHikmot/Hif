import type { Metadata } from "next"
import Image from "next/image"
import { Mail, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export const metadata: Metadata = {
  title: "National Executives | Hamduk Islamic Foundation",
  description: "Meet the current national executive members of Hamduk Islamic Foundation",
}

export default function NationalExecutivesPage() {
  return (
    <main className="container mx-auto px-4 py-12">
      <div className="mx-auto max-w-4xl">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl md:text-5xl">
            National Executives
          </h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
            Meet the dedicated team leading Hamduk Islamic Foundation
          </p>
        </div>

        <div className="prose prose-emerald mx-auto max-w-none dark:prose-invert mb-12">
          <p>
            The National Executive Committee of Hamduk Islamic Foundation is responsible for the overall management and
            strategic direction of the organization. Comprising dedicated professionals from various fields, the
            committee works tirelessly to ensure that the foundation fulfills its mission of promoting Islamic
            education, community development, and humanitarian services.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          <Card className="overflow-hidden">
            <div className="relative h-64 w-full">
              <Image
                src="/placeholder.svg?height=256&width=384"
                alt="Dr. Ahmed Ibrahim"
                fill
                className="object-cover"
              />
            </div>
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold">Dr. Ahmed Ibrahim</h2>
              <p className="text-emerald-600 dark:text-emerald-400 font-medium">National President</p>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Dr. Ahmed Ibrahim is a renowned Islamic scholar and educator with over 25 years of experience in Islamic
                education and community development. He has been leading Hamduk Islamic Foundation since 2018.
              </p>
              <div className="mt-4 flex flex-col space-y-2">
                <div className="flex items-center">
                  <Mail className="mr-2 h-4 w-4 text-emerald-600" />
                  <span>president@hamdukislamicfoundation.org</span>
                </div>
                <div className="flex items-center">
                  <Phone className="mr-2 h-4 w-4 text-emerald-600" />
                  <span>+234 706 123 4567</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden">
            <div className="relative h-64 w-full">
              <Image
                src="/placeholder.svg?height=256&width=384"
                alt="Hajiya Maryam Yusuf"
                fill
                className="object-cover"
              />
            </div>
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold">Hajiya Maryam Yusuf</h2>
              <p className="text-emerald-600 dark:text-emerald-400 font-medium">National Secretary</p>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Hajiya Maryam Yusuf is a dedicated administrator with extensive experience in non-profit management. She
                oversees the day-to-day operations of the foundation and coordinates its various programs.
              </p>
              <div className="mt-4 flex flex-col space-y-2">
                <div className="flex items-center">
                  <Mail className="mr-2 h-4 w-4 text-emerald-600" />
                  <span>secretary@hamdukislamicfoundation.org</span>
                </div>
                <div className="flex items-center">
                  <Phone className="mr-2 h-4 w-4 text-emerald-600" />
                  <span>+234 706 234 5678</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          <Card className="overflow-hidden">
            <div className="relative h-48 w-full">
              <Image
                src="/placeholder.svg?height=192&width=288"
                alt="Alhaji Usman Mohammed"
                fill
                className="object-cover"
              />
            </div>
            <CardContent className="p-4">
              <h3 className="text-xl font-bold">Alhaji Usman Mohammed</h3>
              <p className="text-emerald-600 dark:text-emerald-400 font-medium">National Treasurer</p>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                A financial expert responsible for managing the foundation's finances with transparency and
                accountability.
              </p>
            </CardContent>
          </Card>

          <Card className="overflow-hidden">
            <div className="relative h-48 w-full">
              <Image
                src="/placeholder.svg?height=192&width=288"
                alt="Dr. Fatima Hassan"
                fill
                className="object-cover"
              />
            </div>
            <CardContent className="p-4">
              <h3 className="text-xl font-bold">Dr. Fatima Hassan</h3>
              <p className="text-emerald-600 dark:text-emerald-400 font-medium">Education Director</p>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                An education specialist who oversees the foundation's educational programs and curriculum development.
              </p>
            </CardContent>
          </Card>

          <Card className="overflow-hidden">
            <div className="relative h-48 w-full">
              <Image
                src="/placeholder.svg?height=192&width=288"
                alt="Sheikh Abdullah Ibrahim"
                fill
                className="object-cover"
              />
            </div>
            <CardContent className="p-4">
              <h3 className="text-xl font-bold">Sheikh Abdullah Ibrahim</h3>
              <p className="text-emerald-600 dark:text-emerald-400 font-medium">Spiritual Advisor</p>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                A respected Islamic scholar who provides spiritual guidance and ensures the foundation's activities
                align with Islamic principles.
              </p>
            </CardContent>
          </Card>

          <Card className="overflow-hidden">
            <div className="relative h-48 w-full">
              <Image
                src="/placeholder.svg?height=192&width=288"
                alt="Alhaji Yusuf Musa"
                fill
                className="object-cover"
              />
            </div>
            <CardContent className="p-4">
              <h3 className="text-xl font-bold">Alhaji Yusuf Musa</h3>
              <p className="text-emerald-600 dark:text-emerald-400 font-medium">Public Relations Officer</p>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                A communications expert who manages the foundation's public relations and media engagements.
              </p>
            </CardContent>
          </Card>

          <Card className="overflow-hidden">
            <div className="relative h-48 w-full">
              <Image
                src="/placeholder.svg?height=192&width=288"
                alt="Hajiya Aisha Abdullahi"
                fill
                className="object-cover"
              />
            </div>
            <CardContent className="p-4">
              <h3 className="text-xl font-bold">Hajiya Aisha Abdullahi</h3>
              <p className="text-emerald-600 dark:text-emerald-400 font-medium">Women Affairs Coordinator</p>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Coordinates programs and initiatives focused on women's education, empowerment, and welfare.
              </p>
            </CardContent>
          </Card>

          <Card className="overflow-hidden">
            <div className="relative h-48 w-full">
              <Image src="/placeholder.svg?height=192&width=288" alt="Br. Ismail Yusuf" fill className="object-cover" />
            </div>
            <CardContent className="p-4">
              <h3 className="text-xl font-bold">Br. Ismail Yusuf</h3>
              <p className="text-emerald-600 dark:text-emerald-400 font-medium">Youth Development Coordinator</p>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Leads initiatives aimed at developing leadership skills and Islamic knowledge among Muslim youth.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 text-center">
          <h2 className="text-2xl font-bold mb-4">Contact the Executive Committee</h2>
          <p className="mb-6 text-gray-600 dark:text-gray-400">
            For inquiries related to the National Executive Committee, please contact:
          </p>
          <div className="flex justify-center gap-4">
            <Button asChild>
              <a href="mailto:executives@hamdukislamicfoundation.org">
                <Mail className="mr-2 h-4 w-4" />
                Email the Committee
              </a>
            </Button>
            <Button variant="outline">
              <Phone className="mr-2 h-4 w-4" />
              +234 706 227 3586
            </Button>
          </div>
        </div>
      </div>
    </main>
  )
}
