import type { Metadata } from "next"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Download, Calendar, BookOpen } from "lucide-react"
import Image from "next/image"

export const metadata: Metadata = {
  title: "Journals | Hamduk Islamic Foundation",
  description: "Browse journals and periodicals from Hamduk Islamic Foundation",
}

async function getJournals() {
  const supabase = await createClient()
  const { data } = await supabase
    .from("media")
    .select("*")
    .eq("category", "journal")
    .order("created_at", { ascending: false })

  return data || []
}

export default async function JournalsPage() {
  const journals = await getJournals()

  return (
    <main className="container mx-auto px-4 py-12">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl md:text-5xl">
          Journals & Periodicals
        </h1>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
          Access our collection of Islamic journals, newsletters, and periodical publications.
        </p>
      </div>

      <div className="mb-8 flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <Input placeholder="Search journals..." className="pl-10" />
        </div>
      </div>

      {journals.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {journals.map((journal) => (
            <Card key={journal.id} className="flex flex-col overflow-hidden">
              <div className="aspect-[3/4] relative bg-muted">
                <Image
                  src={journal.thumbnail_url || "/placeholder.svg?height=400&width=300&query=journal cover"}
                  alt={journal.title}
                  fill
                  className="object-cover"
                />
              </div>
              <CardHeader className="pb-2">
                <CardTitle className="text-base line-clamp-2">{journal.title}</CardTitle>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  <span>{new Date(journal.created_at).toLocaleDateString()}</span>
                </div>
              </CardHeader>
              <CardContent className="flex-1 pb-2">
                <CardDescription className="line-clamp-2">{journal.description}</CardDescription>
              </CardContent>
              <CardFooter>
                {journal.file_url ? (
                  <Button asChild className="w-full">
                    <a href={journal.file_url} download target="_blank" rel="noopener noreferrer">
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </a>
                  </Button>
                ) : (
                  <Button variant="outline" className="w-full bg-transparent" disabled>
                    Coming Soon
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="text-center py-12">
          <CardContent>
            <BookOpen className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">No journals available</h3>
            <p className="text-muted-foreground mt-2">Check back soon for new publications.</p>
          </CardContent>
        </Card>
      )}
    </main>
  )
}
