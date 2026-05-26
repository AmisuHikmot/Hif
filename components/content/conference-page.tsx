import Image from "next/image"
import Link from "next/link"
import { CalendarDays, Clock, MapPin, ArrowRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { getPageContent } from "@/lib/content"

type ConferencePageProps = {
  pageKey: string
  fallback: {
    title: string
    subtitle: string
    alt: string
    sections: Array<{ heading: string; paragraphs: string[] }>
    themes: string[]
  }
}

export async function ConferencePage({ pageKey, fallback }: ConferencePageProps) {
  const content = await getPageContent(pageKey)
  const title = content?.title || fallback.title
  const subtitle = content?.subtitle || fallback.subtitle
  const sections = content?.body?.sections?.length ? content.body.sections : fallback.sections
  const themes = content?.body?.themes?.length ? content.body.themes : fallback.themes
  const upcoming = content?.body?.upcoming

  return (
    <main className="container mx-auto px-4 py-12">
      <div className="mx-auto max-w-4xl">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl md:text-5xl">
            {title}
          </h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">{subtitle}</p>
        </div>

        <div className="relative mb-12 h-[300px] w-full overflow-hidden rounded-xl sm:h-[400px]">
          <Image
            src={content?.hero_image_url || "/placeholder.svg?height=400&width=1200"}
            alt={fallback.alt}
            fill
            className="object-cover"
          />
        </div>

        <div className="prose prose-emerald mx-auto max-w-none dark:prose-invert">
          {sections.map((section, index) => (
            <section key={`${section.heading}-${index}`}>
              {section.heading && <h2>{section.heading}</h2>}
              {(section.paragraphs || []).map((paragraph, paragraphIndex) => (
                <p key={paragraphIndex}>{paragraph}</p>
              ))}
            </section>
          ))}
          {themes.length > 0 && (
            <>
              <h2>Conference Themes</h2>
              <ul>
                {themes.map((theme) => (
                  <li key={theme}>{theme}</li>
                ))}
              </ul>
            </>
          )}
        </div>

        <div className="mt-12">
          <h2 className="mb-6 text-2xl font-bold">Upcoming Conference</h2>
          <Card className="overflow-hidden">
            <div className="relative h-64 w-full">
              <Image
                src={upcoming?.image_url || content?.hero_image_url || "/placeholder.svg?height=256&width=768"}
                alt={upcoming?.title || title}
                fill
                className="object-cover"
              />
              <div className="absolute right-4 top-4">
                <Badge className="bg-emerald-500">Upcoming</Badge>
              </div>
            </div>
            <CardHeader>
              <CardTitle>{upcoming?.title || title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>{upcoming?.description || subtitle}</p>
              <div className="flex flex-col gap-2">
                {upcoming?.date && (
                  <div className="flex items-center gap-2">
                    <CalendarDays className="h-5 w-5 text-emerald-600" />
                    <span>{upcoming.date}</span>
                  </div>
                )}
                {upcoming?.time && (
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-emerald-600" />
                    <span>{upcoming.time}</span>
                  </div>
                )}
                {upcoming?.location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-emerald-600" />
                    <span>{upcoming.location}</span>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button asChild>
                <Link href="/events">
                  View Events <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </main>
  )
}
