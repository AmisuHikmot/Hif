import type { Metadata } from "next"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Search, Calendar } from "lucide-react"
import Image from "next/image"

export const metadata: Metadata = {
  title: "Photo Gallery | Hamduk Islamic Foundation",
  description: "Browse photos from events, programs, and activities of Hamduk Islamic Foundation",
}

async function getGalleryImages() {
  const supabase = await createClient()
  const { data } = await supabase
    .from("media")
    .select("*")
    .eq("media_type", "image")
    .order("created_at", { ascending: false })

  return data || []
}

async function getCategories() {
  const supabase = await createClient()
  const { data } = await supabase.from("media").select("category").eq("media_type", "image")

  const categories = [...new Set(data?.map((item) => item.category).filter(Boolean))]
  return categories as string[]
}

export default async function GalleryPage() {
  const images = await getGalleryImages()
  const categories = await getCategories()

  return (
    <main className="container mx-auto px-4 py-12">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl md:text-5xl">
          Photo Gallery
        </h1>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
          Browse photos from our events, programs, and community activities.
        </p>
      </div>

      <div className="mb-8 flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <Input placeholder="Search photos..." className="pl-10" />
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-8 flex flex-wrap">
          <TabsTrigger value="all">All Photos</TabsTrigger>
          {categories.map((category) => (
            <TabsTrigger key={category} value={category}>
              {category}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="all">
          {images.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {images.map((image) => (
                <Card key={image.id} className="overflow-hidden group cursor-pointer">
                  <CardContent className="p-0 relative">
                    <div className="aspect-square relative">
                      <Image
                        src={image.thumbnail_url || image.file_url || "/placeholder.svg?height=300&width=300"}
                        alt={image.title}
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                      />
                    </div>
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                      <h3 className="text-white font-medium">{image.title}</h3>
                      {image.description && <p className="text-white/80 text-sm line-clamp-2">{image.description}</p>}
                      <div className="flex items-center gap-2 mt-2 text-white/60 text-xs">
                        <Calendar className="h-3 w-3" />
                        <span>{new Date(image.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No photos available yet. Check back soon!</p>
            </div>
          )}
        </TabsContent>

        {categories.map((category) => (
          <TabsContent key={category} value={category}>
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {images
                .filter((img) => img.category === category)
                .map((image) => (
                  <Card key={image.id} className="overflow-hidden group cursor-pointer">
                    <CardContent className="p-0 relative">
                      <div className="aspect-square relative">
                        <Image
                          src={image.thumbnail_url || image.file_url || "/placeholder.svg?height=300&width=300"}
                          alt={image.title}
                          fill
                          className="object-cover transition-transform group-hover:scale-105"
                        />
                      </div>
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                        <h3 className="text-white font-medium">{image.title}</h3>
                        <p className="text-white/80 text-sm line-clamp-2">{image.description}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </main>
  )
}
