"use client"

import { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { CalendarDays, MapPin, Clock } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"

interface EventCardProps {
  title: string
  description: string
  date: string
  location: string
  imageSrc: string
  time?: string
  isPast?: boolean
}

export default function EventCard({
  title,
  description,
  date,
  location,
  imageSrc,
  time,
  isPast = false,
}: EventCardProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoggedIn, setIsLoggedIn] = useState(false) // Mock auth state

  const handleRegister = () => {
    if (!isLoggedIn) {
      toast({
        title: "Authentication Required",
        description: "Please log in to register for this event",
        variant: "destructive",
      })
      router.push("/auth/login")
      return
    }

    // If logged in, navigate to event details
    const eventSlug = encodeURIComponent(title.toLowerCase().replace(/\s+/g, "-"))
    router.push(`/events/${eventSlug}`)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleViewDetails = () => {
    const eventSlug = encodeURIComponent(title.toLowerCase().replace(/\s+/g, "-"))
    router.push(`/events/${eventSlug}`)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <div className="relative">
        <div className="relative h-48 w-full">
          <Image src={imageSrc || "/placeholder.svg"} alt={title} fill className="object-cover" />
        </div>
        {isPast && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <Badge variant="secondary" className="text-lg font-semibold px-3 py-1.5">
              Past Event
            </Badge>
          </div>
        )}
      </div>
      <CardHeader className="p-4">
        <h3 className="font-bold text-lg line-clamp-2">{title}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
      </CardHeader>
      <CardContent className="p-4 pt-0 space-y-2">
        <div className="flex items-start gap-2">
          <CalendarDays className="h-4 w-4 mt-0.5 text-emerald-600" />
          <p className="text-sm">{date}</p>
        </div>
        {time && (
          <div className="flex items-start gap-2">
            <Clock className="h-4 w-4 mt-0.5 text-emerald-600" />
            <p className="text-sm">{time}</p>
          </div>
        )}
        <div className="flex items-start gap-2">
          <MapPin className="h-4 w-4 mt-0.5 text-emerald-600" />
          <p className="text-sm line-clamp-2">{location}</p>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button
          variant={isPast ? "outline" : "default"}
          className="w-full"
          onClick={isPast ? handleViewDetails : handleRegister}
        >
          {isPast ? "View Details" : "Register Now"}
        </Button>
      </CardFooter>
    </Card>
  )
}
