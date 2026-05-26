"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Skeleton } from "@/components/ui/skeleton"

export default function HomepageEvents() {
  const [upcomingEvents, setUpcomingEvents] = useState<any[]>([])
  const [pastEvents, setPastEvents] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const supabase = createClient()
        const today = new Date().toISOString().split("T")[0]

        // Fetch upcoming events
        const { data: upcoming } = await supabase
          .from("events")
          .select("*")
          .gte("event_date", today)
          .order("event_date")
          .limit(3)

        // Fetch past events
        const { data: past } = await supabase
          .from("events")
          .select("*")
          .lt("event_date", today)
          .order("event_date", { ascending: false })
          .limit(3)

        setUpcomingEvents(upcoming || [])
        setPastEvents(past || [])
      } catch (error) {
        console.error("Error fetching events:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchEvents()
  }, [])

  if (isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-64 rounded-lg" />
        ))}
      </div>
    )
  }

  return {
    upcomingEvents,
    pastEvents,
    isEmpty: upcomingEvents.length === 0 && pastEvents.length === 0,
  }
}
