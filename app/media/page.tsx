import type { Metadata } from "next"
import { Play, FileText, ImageIcon, Video } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import MediaGallery from "@/components/media/media-gallery"
import VideoGallery from "@/components/media/video-gallery"
import AudioGallery from "@/components/media/audio-gallery"
import PublicationsGallery from "@/components/media/publications-gallery"

export const metadata: Metadata = {
  title: "Media | Hamduk Islamic Foundation",
  description: "Browse photos, videos, audio recordings, and publications from Hamduk Islamic Foundation",
}

export default function MediaPage() {
  return (
    <main className="container mx-auto px-4 py-12">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl md:text-5xl">
          Media Center
        </h1>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
          Browse our collection of photos, videos, audio recordings, and publications
        </p>
      </div>

      <Tabs defaultValue="photos" className="w-full">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <TabsList className="w-full sm:w-auto">
            <TabsTrigger value="photos" className="flex items-center gap-2">
              <ImageIcon className="h-4 w-4" />
              Photos
            </TabsTrigger>
            <TabsTrigger value="videos" className="flex items-center gap-2">
              <Video className="h-4 w-4" />
              Videos
            </TabsTrigger>
            <TabsTrigger value="audio" className="flex items-center gap-2">
              <Play className="h-4 w-4" />
              Audio
            </TabsTrigger>
            <TabsTrigger value="publications" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Publications
            </TabsTrigger>
          </TabsList>

          <div className="flex gap-2">
            <Input placeholder="Search media..." className="w-full sm:w-[250px]" />
            <Select defaultValue="all">
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="events">Events</SelectItem>
                <SelectItem value="lectures">Lectures</SelectItem>
                <SelectItem value="workshops">Workshops</SelectItem>
                <SelectItem value="conferences">Conferences</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <TabsContent value="photos">
          <MediaGallery />
        </TabsContent>

        <TabsContent value="videos">
          <VideoGallery />
        </TabsContent>

        <TabsContent value="audio">
          <AudioGallery />
        </TabsContent>

        <TabsContent value="publications">
          <PublicationsGallery />
        </TabsContent>
      </Tabs>
    </main>
  )
}
