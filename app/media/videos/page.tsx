import Image from "next/image"
import type { Metadata } from "next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Play, Clock, Calendar, User } from "lucide-react"
import { createAdminClient } from "@/lib/supabase/admin"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Videos | Hamduk Islamic Foundation",
  description: "Video library of lectures, events, and programs by Hamduk Islamic Foundation",
}

export default async function VideosPage() {
  const supabase = createAdminClient()
  const { data: videos } = await supabase
    .from("media")
    .select("*")
    .eq("media_type", "video")
    .order("created_at", { ascending: false })

  const featured = videos?.find((video) => video.is_featured) || videos?.[0]
  const categories = [...new Set((videos || []).map((video) => video.category).filter(Boolean))]

  return (
    <main className="container mx-auto px-4 py-12">
      <div className="mb-12 text-center">
        <h1 className="mb-4 text-4xl font-bold tracking-tight text-emerald-900 dark:text-emerald-500">Video Library</h1>
        <p className="mx-auto max-w-3xl text-lg text-gray-600 dark:text-gray-400">
          Explore our collection of lectures, events, tutorials, and interviews.
        </p>
      </div>

      {featured && (
        <a href={featured.file_url} target="_blank" rel="noopener noreferrer" className="group mb-12 block">
          <div className="relative h-80 w-full overflow-hidden rounded-lg">
            <Image
              src={featured.thumbnail_url || "/placeholder.svg?height=600&width=1200"}
              alt={featured.title}
              fill
              className="object-cover transition-transform group-hover:scale-105"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-emerald-900/55">
              <div className="max-w-2xl p-6 text-center text-white">
                <span className="mb-4 inline-block rounded-full bg-emerald-600 px-2.5 py-0.5 text-xs font-medium">
                  Featured
                </span>
                <h2 className="mb-2 text-3xl font-bold">{featured.title}</h2>
                {featured.description && <p className="mb-6 text-lg">{featured.description}</p>}
                <span className="inline-flex items-center rounded-full bg-white px-6 py-2 font-medium text-emerald-900">
                  <Play className="mr-2 h-5 w-5" />
                  Watch Now
                </span>
              </div>
            </div>
          </div>
        </a>
      )}

      {videos?.length ? (
        <div className="space-y-10">
          {(categories.length ? categories : ["Videos"]).map((category) => {
            const list = categories.length ? videos.filter((video) => video.category === category) : videos
            return (
              <section key={category}>
                <h2 className="mb-6 text-2xl font-bold capitalize">{category}</h2>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {list.map((video) => (
                    <Card key={video.id} className="overflow-hidden">
                      <a href={video.file_url} target="_blank" rel="noopener noreferrer">
                        <div className="relative h-48">
                          <Image
                            src={video.thumbnail_url || "/placeholder.svg?height=400&width=600"}
                            alt={video.title}
                            fill
                            className="object-cover"
                          />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                            <div className="rounded-full bg-white/90 p-3">
                              <Play className="h-6 w-6 fill-emerald-600 text-emerald-600" />
                            </div>
                          </div>
                        </div>
                      </a>
                      <CardHeader>
                        <CardTitle className="line-clamp-2 text-lg">{video.title}</CardTitle>
                        <CardDescription className="line-clamp-2">{video.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                          {video.speaker_name && (
                            <span className="flex items-center gap-1">
                              <User className="h-3.5 w-3.5" />
                              {video.speaker_name}
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5" />
                            {new Date(video.upload_date || video.created_at).toLocaleDateString()}
                          </span>
                          {video.duration && (
                            <span className="flex items-center gap-1">
                              <Clock className="h-3.5 w-3.5" />
                              {Math.round(video.duration / 60)} min
                            </span>
                          )}
                          {video.category && <Badge variant="secondary">{video.category}</Badge>}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>
            )
          })}
        </div>
      ) : (
        <Card className="p-12 text-center text-muted-foreground">No videos are available yet.</Card>
      )}
    </main>
  )
}
