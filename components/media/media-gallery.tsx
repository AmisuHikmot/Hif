"use client"

import { useState } from "react"
import Image from "next/image"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Download, Share2, X } from "lucide-react"

const photos = [
  {
    id: 1,
    title: "Annual Islamic Conference 2024",
    description: "Opening ceremony of our annual conference",
    src: "/placeholder.svg?height=400&width=600",
    category: "Events",
    date: "January 12, 2024",
  },
  {
    id: 2,
    title: "Ramadan Tafsir Program",
    description: "Daily Quranic interpretation during Ramadan",
    src: "/placeholder.svg?height=400&width=600",
    category: "Lectures",
    date: "March 15, 2024",
  },
  {
    id: 3,
    title: "Youth Development Workshop",
    description: "Building the next generation of Muslim leaders",
    src: "/placeholder.svg?height=400&width=600",
    category: "Workshops",
    date: "February 20, 2024",
  },
  {
    id: 4,
    title: "Community Iftar Program",
    description: "Breaking fast together during Ramadan",
    src: "/placeholder.svg?height=400&width=600",
    category: "Events",
    date: "March 25, 2024",
  },
  {
    id: 5,
    title: "Islamic Education Symposium",
    description: "Discussing the future of Islamic education",
    src: "/placeholder.svg?height=400&width=600",
    category: "Conferences",
    date: "April 5, 2024",
  },
  {
    id: 6,
    title: "Charity Drive for Orphans",
    description: "Fundraising event for local orphanages",
    src: "/placeholder.svg?height=400&width=600",
    category: "Events",
    date: "March 10, 2024",
  },
  {
    id: 7,
    title: "Islamic Finance Workshop",
    description: "Introduction to Islamic banking principles",
    src: "/placeholder.svg?height=400&width=600",
    category: "Workshops",
    date: "April 15, 2024",
  },
  {
    id: 8,
    title: "Eid Celebration",
    description: "Community gathering for Eid-ul-Fitr",
    src: "/placeholder.svg?height=400&width=600",
    category: "Events",
    date: "April 10, 2024",
  },
  {
    id: 9,
    title: "Board Meeting",
    description: "Quarterly meeting of the foundation's board",
    src: "/placeholder.svg?height=400&width=600",
    category: "Events",
    date: "March 1, 2024",
  },
]

export default function MediaGallery() {
  const [selectedPhoto, setSelectedPhoto] = useState<(typeof photos)[0] | null>(null)

  const handlePrevious = () => {
    if (!selectedPhoto) return
    const currentIndex = photos.findIndex((photo) => photo.id === selectedPhoto.id)
    const previousIndex = (currentIndex - 1 + photos.length) % photos.length
    setSelectedPhoto(photos[previousIndex])
  }

  const handleNext = () => {
    if (!selectedPhoto) return
    const currentIndex = photos.findIndex((photo) => photo.id === selectedPhoto.id)
    const nextIndex = (currentIndex + 1) % photos.length
    setSelectedPhoto(photos[nextIndex])
  }

  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {photos.map((photo) => (
          <div
            key={photo.id}
            className="group relative cursor-pointer overflow-hidden rounded-lg"
            onClick={() => setSelectedPhoto(photo)}
          >
            <div className="absolute inset-0 bg-black/0 transition-all group-hover:bg-black/40 z-10" />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100 z-20">
              <Button variant="secondary" size="sm">
                View
              </Button>
            </div>
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3 text-white z-10">
              <h3 className="text-sm font-medium">{photo.title}</h3>
              <p className="text-xs text-white/80">{photo.date}</p>
            </div>
            <div className="relative h-48 w-full">
              <Image
                src={photo.src || "/placeholder.svg"}
                alt={photo.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
          </div>
        ))}
      </div>

      <Dialog open={!!selectedPhoto} onOpenChange={(open) => !open && setSelectedPhoto(null)}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden">
          <div className="relative">
            <div className="absolute right-2 top-2 z-10">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSelectedPhoto(null)}
                className="rounded-full bg-black/20 text-white hover:bg-black/40"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="relative h-[60vh] w-full">
              {selectedPhoto && (
                <Image
                  src={selectedPhoto.src || "/placeholder.svg"}
                  alt={selectedPhoto.title}
                  fill
                  className="object-contain"
                />
              )}
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/20 text-white hover:bg-black/40"
              onClick={handlePrevious}
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/20 text-white hover:bg-black/40"
              onClick={handleNext}
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          </div>

          {selectedPhoto && (
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold">{selectedPhoto.title}</h2>
                  <p className="text-muted-foreground">{selectedPhoto.description}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                  <Button variant="outline" size="sm">
                    <Share2 className="mr-2 h-4 w-4" />
                    Share
                  </Button>
                </div>
              </div>
              <div className="mt-2 flex items-center gap-2">
                <Badge>{selectedPhoto.category}</Badge>
                <span className="text-sm text-muted-foreground">{selectedPhoto.date}</span>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <div className="mt-8 flex justify-center">
        <Button variant="outline">Load More Photos</Button>
      </div>
    </div>
  )
}
