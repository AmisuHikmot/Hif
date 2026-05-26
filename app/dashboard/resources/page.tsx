import type { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import DashboardNav from "@/components/dashboard/dashboard-nav"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Download, FileAudio, FileText, FileVideo, Library } from "lucide-react"

export const metadata: Metadata = {
  title: "Member Resources | Hamduk Islamic Foundation",
  description: "Access member resources, downloads, publications, lectures, and learning materials.",
}

async function getResources() {
  const supabase = createAdminClient()

  const [{ data: downloads }, { data: publications }] = await Promise.all([
    supabase
      .from("media")
      .select("*")
      .in("media_type", ["document", "pdf", "audio", "video"])
      .order("created_at", { ascending: false })
      .limit(6),
    supabase
      .from("publications")
      .select("*")
      .eq("is_published", true)
      .order("published_at", { ascending: false })
      .limit(6),
  ])

  return {
    downloads: downloads || [],
    publications: publications || [],
  }
}

function getResourceIcon(mediaType?: string) {
  switch (mediaType) {
    case "audio":
      return <FileAudio className="h-5 w-5 text-purple-600" />
    case "video":
      return <FileVideo className="h-5 w-5 text-blue-600" />
    default:
      return <FileText className="h-5 w-5 text-emerald-600" />
  }
}

export default async function DashboardResourcesPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login?redirect=/dashboard/resources")
  }

  const { downloads, publications } = await getResources()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid gap-8 md:grid-cols-[240px_1fr]">
        <DashboardNav />

        <main>
          <div className="mb-8 flex flex-col gap-2">
            <h1 className="text-3xl font-bold tracking-tight">Member Resources</h1>
            <p className="text-muted-foreground">Browse learning materials, publications, downloads, and media.</p>
          </div>

          <div className="mb-8 grid gap-4 md:grid-cols-3">
            <Card>
              <CardContent className="flex items-center gap-4 p-6">
                <div className="rounded-full bg-emerald-100 p-3 dark:bg-emerald-900/20">
                  <Library className="h-6 w-6 text-emerald-700 dark:text-emerald-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{downloads.length + publications.length}</p>
                  <p className="text-sm text-muted-foreground">Featured items</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-4 p-6">
                <div className="rounded-full bg-blue-100 p-3 dark:bg-blue-900/20">
                  <Download className="h-6 w-6 text-blue-700 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{downloads.length}</p>
                  <p className="text-sm text-muted-foreground">Recent downloads</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="flex items-center gap-4 p-6">
                <div className="rounded-full bg-purple-100 p-3 dark:bg-purple-900/20">
                  <BookOpen className="h-6 w-6 text-purple-700 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{publications.length}</p>
                  <p className="text-sm text-muted-foreground">Publications</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <section>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-semibold">Downloads</h2>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/media/downloads">View all</Link>
                </Button>
              </div>
              <div className="space-y-3">
                {downloads.length > 0 ? (
                  downloads.map((item) => (
                    <Card key={item.id}>
                      <CardHeader className="pb-3">
                        <div className="flex items-start gap-3">
                          <div className="rounded-md bg-muted p-2">{getResourceIcon(item.media_type)}</div>
                          <div className="min-w-0 flex-1">
                            <CardTitle className="line-clamp-1 text-base">{item.title}</CardTitle>
                            <CardDescription className="line-clamp-2">{item.description}</CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="flex items-center justify-between gap-3">
                        <div className="flex flex-wrap gap-2">
                          {item.category && <Badge variant="secondary">{item.category}</Badge>}
                          <Badge variant="outline">{item.media_type || "resource"}</Badge>
                        </div>
                        {item.file_url && (
                          <Button size="sm" asChild>
                            <a href={item.file_url} target="_blank" rel="noopener noreferrer">
                              <Download className="mr-2 h-4 w-4" />
                              Open
                            </a>
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <Card>
                    <CardContent className="py-10 text-center text-muted-foreground">
                      No member downloads are available yet.
                    </CardContent>
                  </Card>
                )}
              </div>
            </section>

            <section>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-semibold">Publications</h2>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/publications/papers">View all</Link>
                </Button>
              </div>
              <div className="space-y-3">
                {publications.length > 0 ? (
                  publications.map((item) => (
                    <Card key={item.id}>
                      <CardHeader>
                        <div className="flex items-start gap-3">
                          <div className="rounded-md bg-muted p-2">
                            <FileText className="h-5 w-5 text-emerald-600" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <CardTitle className="line-clamp-1 text-base">{item.title}</CardTitle>
                            <CardDescription className="line-clamp-2">{item.description}</CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="flex items-center justify-between gap-3">
                        <div className="flex flex-wrap gap-2">
                          {item.category && <Badge variant="secondary">{item.category}</Badge>}
                          {item.publication_type && <Badge variant="outline">{item.publication_type}</Badge>}
                        </div>
                        {item.file_url ? (
                          <Button size="sm" variant="outline" asChild>
                            <a href={item.file_url} target="_blank" rel="noopener noreferrer">
                              Read
                            </a>
                          </Button>
                        ) : (
                          <Button size="sm" variant="outline" asChild>
                            <Link href="/publications/papers">Read</Link>
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <Card>
                    <CardContent className="py-10 text-center text-muted-foreground">
                      No publications are available yet.
                    </CardContent>
                  </Card>
                )}
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  )
}
