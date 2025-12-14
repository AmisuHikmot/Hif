import type { Metadata } from "next"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Download, Calendar, User, FileText, ExternalLink } from "lucide-react"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Research Papers | Hamduk Islamic Foundation",
  description: "Access research papers and academic publications from Hamduk Islamic Foundation",
}

async function getPapers() {
  const supabase = await createClient()
  const { data } = await supabase
    .from("media")
    .select("*")
    .eq("category", "research")
    .order("created_at", { ascending: false })

  return data || []
}

export default async function PapersPage() {
  const papers = await getPapers()

  return (
    <main className="container mx-auto px-4 py-12">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl md:text-5xl">
          Research Papers
        </h1>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
          Explore academic research and scholarly publications on Islamic topics.
        </p>
      </div>

      <div className="mb-8 flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <Input placeholder="Search research papers..." className="pl-10" />
        </div>
      </div>

      {papers.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {papers.map((paper) => (
            <Card key={paper.id} className="flex flex-col">
              <CardHeader>
                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-emerald-100 p-2 dark:bg-emerald-900/20">
                    <FileText className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg line-clamp-2">{paper.title}</CardTitle>
                    {paper.speaker_name && (
                      <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                        <User className="h-3 w-3" />
                        <span>{paper.speaker_name}</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-1">
                <CardDescription className="line-clamp-3">{paper.description}</CardDescription>
                <div className="flex flex-wrap gap-2 mt-4">
                  {paper.tags?.map((tag: string) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-3">
                <div className="flex items-center justify-between w-full text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>{new Date(paper.created_at).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Download className="h-3 w-3" />
                    <span>{paper.download_count || 0} downloads</span>
                  </div>
                </div>
                <div className="flex gap-2 w-full">
                  {paper.file_url && (
                    <Button asChild className="flex-1">
                      <a href={paper.file_url} download target="_blank" rel="noopener noreferrer">
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </a>
                    </Button>
                  )}
                  <Button variant="outline" asChild>
                    <Link href={`/publications/papers/${paper.id}`}>
                      <ExternalLink className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="text-center py-12">
          <CardContent>
            <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">No research papers available</h3>
            <p className="text-muted-foreground mt-2">Check back soon for new publications.</p>
          </CardContent>
        </Card>
      )}
    </main>
  )
}
