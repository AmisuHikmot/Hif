import type { Metadata } from "next"
import Image from "next/image"
import { Mail, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { getLeadershipProfiles } from "@/lib/content"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "National Executives | Hamduk Islamic Foundation",
  description: "Meet the current national executive members of Hamduk Islamic Foundation",
}

const fallbackExecutives = [
  {
    id: "fallback-president",
    name: "National President",
    title: "Executive Committee",
    bio: "Leadership profile will appear here once added in the database.",
    image_url: "/placeholder.svg?height=256&width=384",
    email: "executives@hamdukislamicfoundation.org",
    phone: "+234 706 227 3586",
  },
]

export default async function NationalExecutivesPage() {
  const executives = await getLeadershipProfiles("executives")
  const profiles = executives.length ? executives : fallbackExecutives

  return (
    <main className="container mx-auto px-4 py-12">
      <div className="mx-auto max-w-5xl">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl md:text-5xl">
            National Executives
          </h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
            Meet the dedicated team leading Hamduk Islamic Foundation
          </p>
        </div>

        <div className="prose prose-emerald mx-auto mb-12 max-w-none dark:prose-invert">
          <p>
            The National Executive Committee is responsible for strategic direction, governance, and the day-to-day
            leadership of the foundation.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {profiles.map((profile: any) => (
            <Card key={profile.id} className="overflow-hidden">
              <div className="relative h-56 w-full">
                <Image
                  src={profile.image_url || "/placeholder.svg?height=256&width=384"}
                  alt={profile.name}
                  fill
                  className="object-cover"
                />
              </div>
              <CardContent className="p-5">
                <h2 className="text-xl font-bold">{profile.name}</h2>
                <p className="font-medium text-emerald-600 dark:text-emerald-400">{profile.title}</p>
                {profile.bio && <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{profile.bio}</p>}
                <div className="mt-4 flex flex-col gap-2 text-sm">
                  {profile.email && (
                    <a className="flex items-center hover:text-emerald-700" href={`mailto:${profile.email}`}>
                      <Mail className="mr-2 h-4 w-4 text-emerald-600" />
                      {profile.email}
                    </a>
                  )}
                  {profile.phone && (
                    <a className="flex items-center hover:text-emerald-700" href={`tel:${profile.phone}`}>
                      <Phone className="mr-2 h-4 w-4 text-emerald-600" />
                      {profile.phone}
                    </a>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <h2 className="mb-4 text-2xl font-bold">Contact the Executive Committee</h2>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
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
