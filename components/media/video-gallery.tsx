"use client"

import { useState } from "react"
import Image from "next/image"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Play, Clock, Calendar } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const videos = [
  {
    id: 1,
    title: "Understanding Islamic Finance",
    description: "A comprehensive guide to Islamic banking and finance principles",
    thumbnail: "/placeholder.svg?height=200&width=350",
    duration: "45:20",
    date: "April 15, 2024",
    category: "Education",
    videoUrl: "https://example.com/video1",
  },
  {
    id: 2,
    title: "Ramadan Tafsir Series - Day 1",
    description: "Interpretation of Surah Al-Baqarah",
    thumbnail: "/placeholder.svg?height=200&width=350",
    duration: "1:12:45",
    date: "March 12, 2024",
    category: "Lectures",
    videoUrl: "https://example.com/video2",
  },
  {
    id: 3,
    title: "Youth Leadership Workshop Highlights",
    description: "Key moments from our recent youth development program",
    thumbnail: "/placeholder.svg?height=200&width=350",
    duration: "15:30",
    date: "February 28, 2024",
    category: "Events",
    videoUrl: "https://example.com/video3",
  },
  {
    id: 4,
    title: "Islamic History Series - Part 1",
    description: "The early years of Islam and the Prophet Muhammad (PBUH)",
    thumbnail: "/placeholder.svg?height=200&width=350",
    duration: "52:15",
    date: "January 20, 2024",
    category: "Education",
    videoUrl: "https://example.com/video4",
  },
  {
    id: 5,
    title: "Annual Conference 2024 - Opening Ceremony",
    description: "Highlights from the opening of our annual conference",
    thumbnail: "/placeholder.svg?height=200&width=350",
    duration: "28:45",
    date: "January 12, 2024",
    category: "Events",
    videoUrl: "https://example.com/video5",
  },
  {
    id: 6,
    title: "Q&A Session with Islamic Scholars",
    description: "Addressing common questions about Islamic practices",
    thumbnail: "/placeholder.svg?height=200&width=350",
    duration: "1:05:30",
    date: "December 15, 2023",
    category: "Lectures",
    videoUrl: "https://example.com/video6",
  },
]

export default function VideoGallery() {
  const [selectedVideo, setSelectedVideo] = useState<(typeof videos)[0] | null>(null)

  return (
    <div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {videos.map((video) => (
          <Card key={video.id} className="overflow-hidden">
            <div className="relative cursor-pointer" onClick={() => setSelectedVideo(video)}>
              <div className="relative h-48 w-full overflow-hidden">
                <Image
                  src={video.thumbnail || "/placeholder.svg"}
                  alt={video.title}
                  fill
                  className="object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="rounded-full bg-black/50 p-3 text-white transition-transform hover:scale-110">
                  <Play className="h-6 w-6 fill-current" />
                </div>
              </div>
              <div className="absolute bottom-2 right-2 rounded bg-black/70 px-2 py-1 text-xs text-white">
                {video.duration}
              </div>
            </div>
            <CardHeader className="p-4">
              <CardTitle className="line-clamp-1 text-lg">{video.title}</CardTitle>
              <CardDescription className="line-clamp-2">{video.description}</CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>{video.date}</span>
                </div>
                <Badge>{video.category}</Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={!!selectedVideo} onOpenChange={(open) => !open && setSelectedVideo(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{selectedVideo?.title}</DialogTitle>
          </DialogHeader>
          <div className="aspect-video overflow-hidden rounded-md bg-black">
            <div className="flex h-full items-center justify-center">
              <Play className="h-16 w-16 text-white/50" />
            </div>
          </div>
          <div>
            <p className="text-muted-foreground">{selectedVideo?.description}</p>
            <div className="mt-4 flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>{selectedVideo?.date}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>{selectedVideo?.duration}</span>
              </div>
              <Badge>{selectedVideo?.category}</Badge>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <div className="mt-8 flex justify-center">
        <Button variant="outline">Load More Videos</Button>
      </div>
    </div>
  )
}
