import type { Metadata } from "next"
import type React from "react"
import Image from "next/image"
import Link from "next/link"
import { Play, FileText, ImageIcon, Video, Download } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { createAdminClient } from "@/lib/supabase/admin"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Media | Hamduk Islamic Foundation",
  description: "Browse photos, videos, audio recordings, and publications from Hamduk Islamic Foundation",
}

export default async function MediaPage() {
  const supabase = createAdminClient()
  const [{ data: media }, { data: publications }] = await Promise.all([
    supabase.from("media").select("*").order("created_at", { ascending: false }).limit(12),
    supabase
      .from("publications")
      .select("id, title, slug, description, cover_image_url, publication_type, published_at")
      .eq("is_published", true)
      .order("published_at", { ascending: false })
      .limit(6),
  ])

  const counts = {
    photos: media?.filter((item) => item.media_type === "image").length || 0,
    videos: media?.filter((item) => item.media_type === "video").length || 0,
    audio: media?.filter((item) => item.media_type === "audio").length || 0,
    downloads: media?.filter((item) => item.media_type === "document").length || 0,
  }

  return (
    <main className="container mx-auto px-4 py-12">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl md:text-5xl">
          Media Center
        </h1>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
          Browse our collection of photos, videos, audio recordings, and publications.
        </p>
      </div>

      <div className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MediaLink href="/media/gallery" icon={<ImageIcon />} label="Photos" count={counts.photos} />
        <MediaLink href="/media/videos" icon={<Video />} label="Videos" count={counts.videos} />
        <MediaLink href="/media/downloads" icon={<Download />} label="Downloads" count={counts.downloads} />
        <MediaLink href="/publications/papers" icon={<FileText />} label="Publications" count={publications?.length || 0} />
      </div>

      <section className="mb-12">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Latest Media</h2>
          <Button variant="outline" asChild>
            <Link href="/media/gallery">View Gallery</Link>
          </Button>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {(media || []).map((item) => (
            <Card key={item.id} className="overflow-hidden">
              <div className="relative h-48 bg-muted">
                <Image
                  src={item.thumbnail_url || item.file_url || "/placeholder.svg?height=300&width=500"}
                  alt={item.title}
                  fill
                  className="object-cover"
                />
                {item.media_type === "video" && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/25">
                    <div className="rounded-full bg-white/90 p-3">
                      <Play className="h-5 w-5 fill-emerald-600 text-emerald-600" />
                    </div>
                  </div>
                )}
              </div>
              <CardHeader>
                <CardTitle className="line-clamp-2 text-lg">{item.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="line-clamp-2 text-sm text-muted-foreground">{item.description}</p>
                <div className="mt-3 flex gap-2">
                  <Badge variant="secondary">{item.media_type}</Badge>
                  {item.category && <Badge variant="outline">{item.category}</Badge>}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Latest Publications</h2>
          <Button variant="outline" asChild>
            <Link href="/publications/papers">Browse Publications</Link>
          </Button>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {(publications || []).map((item) => (
            <Card key={item.id} className="overflow-hidden">
              <div className="relative h-44 bg-muted">
                <Image
                  src={item.cover_image_url || "/placeholder.svg?height=260&width=420"}
                  alt={item.title}
                  fill
                  className="object-cover"
                />
              </div>
              <CardHeader>
                <CardTitle className="line-clamp-2 text-lg">{item.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="line-clamp-2 text-sm text-muted-foreground">{item.description}</p>
                <Badge className="mt-3" variant="secondary">{item.publication_type}</Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </main>
  )
}

function MediaLink({ href, icon, label, count }: { href: string; icon: React.ReactNode; label: string; count: number }) {
  return (
    <Link href={href}>
      <Card className="transition-shadow hover:shadow-md">
        <CardContent className="flex items-center gap-4 p-5">
          <div className="rounded-full bg-emerald-100 p-3 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400 [&>svg]:h-5 [&>svg]:w-5">
            {icon}
          </div>
          <div>
            <p className="font-semibold">{label}</p>
            <p className="text-sm text-muted-foreground">{count} items</p>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
