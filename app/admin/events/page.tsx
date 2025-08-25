"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { CalendarIcon, PencilIcon, Trash2Icon, PlusCircle, Search, Calendar, Clock, MapPin } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import AdminNav from "@/components/admin/admin-nav"

// Mock event data
const mockEvents = [
  {
    id: 1,
    title: "Ramadan Tafsir Program",
    description: "Daily Quranic interpretation during Ramadan",
    date: "March 23, 2025",
    time: "After Maghrib Prayer",
    location: "Hamduk Islamic Center, Lagos",
    category: "Lectures",
    status: "upcoming",
    featured: true,
  },
  {
    id: 2,
    title: "Islamic Leadership Conference",
    description: "Annual conference on Islamic leadership principles",
    date: "June 15, 2025",
    time: "9:00 AM - 5:00 PM",
    location: "Hamduk Conference Center, Lagos",
    category: "Conferences",
    status: "upcoming",
    featured: false,
  },
  {
    id: 3,
    title: "Youth Development Workshop",
    description: "Building the next generation of Muslim leaders",
    date: "August 10, 2025",
    time: "2:00 PM - 6:00 PM",
    location: "Various locations across Lagos State",
    category: "Workshops",
    status: "upcoming",
    featured: true,
  },
  {
    id: 4,
    title: "Annual Islamic Conference 2024",
    description: "Exploring contemporary challenges facing Muslims",
    date: "January 12, 2024",
    time: "9:00 AM - 5:00 PM",
    location: "Hamduk Conference Center, Lagos",
    category: "Conferences",
    status: "past",
    featured: true,
  },
  {
    id: 5,
    title: "Ramadan Tafsir Series",
    description: "Daily Quranic interpretation during Ramadan",
    date: "March-April 2024",
    time: "8:00 PM - 10:00 PM",
    location: "Central Mosque, Lagos",
    category: "Lectures",
    status: "past",
    featured: true,
  },
]

export default function AdminEventsPage() {
  const { toast } = useToast()
  const [events, setEvents] = useState(mockEvents)
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddEventOpen, setIsAddEventOpen] = useState(false)
  const [editingEvent, setEditingEvent] = useState<any>(null)
  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    category: "",
    featured: false,
  })

  const handleAddEvent = () => {
    if (!newEvent.title || !newEvent.date || !newEvent.location) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    const eventToAdd = {
      ...newEvent,
      id: events.length + 1,
      status: "upcoming",
    }

    setEvents([eventToAdd, ...events])
    setNewEvent({
      title: "",
      description: "",
      date: "",
      time: "",
      location: "",
      category: "",
      featured: false,
    })
    setIsAddEventOpen(false)

    toast({
      title: "Event Added",
      description: "The event has been successfully added to the system",
    })
  }

  const handleEditEvent = (event: any) => {
    setEditingEvent(event)
    setNewEvent({
      title: event.title,
      description: event.description,
      date: event.date,
      time: event.time || "",
      location: event.location,
      category: event.category || "",
      featured: event.featured,
    })
  }

  const handleUpdateEvent = () => {
    if (!newEvent.title || !newEvent.date || !newEvent.location) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    const updatedEvents = events.map((event) => {
      if (event.id === editingEvent.id) {
        return {
          ...event,
          ...newEvent,
        }
      }
      return event
    })

    setEvents(updatedEvents)
    setEditingEvent(null)
    setNewEvent({
      title: "",
      description: "",
      date: "",
      time: "",
      location: "",
      category: "",
      featured: false,
    })

    toast({
      title: "Event Updated",
      description: "The event has been successfully updated",
    })
  }

  const handleDeleteEvent = (id: number) => {
    const updatedEvents = events.filter((event) => event.id !== id)
    setEvents(updatedEvents)

    toast({
      title: "Event Deleted",
      description: "The event has been successfully removed",
    })
  }

  const filteredEvents = events.filter((event) => {
    return (
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.location.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })

  const upcomingEvents = filteredEvents.filter((event) => event.status === "upcoming")
  const pastEvents = filteredEvents.filter((event) => event.status === "past")

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid gap-8 md:grid-cols-[240px_1fr]">
        <AdminNav />

        <main>
          <div className="mb-8 flex flex-col gap-2">
            <h1 className="text-3xl font-bold tracking-tight">Event Management</h1>
            <p className="text-muted-foreground">Create, edit, and manage events for Hamduk Islamic Foundation</p>
          </div>

          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search events..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Select defaultValue="all">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="lectures">Lectures</SelectItem>
                  <SelectItem value="workshops">Workshops</SelectItem>
                  <SelectItem value="conferences">Conferences</SelectItem>
                </SelectContent>
              </Select>
              <Dialog open={isAddEventOpen} onOpenChange={setIsAddEventOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Event
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle>Add New Event</DialogTitle>
                    <DialogDescription>Fill in the details to create a new event</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="title">Event Title *</Label>
                      <Input
                        id="title"
                        value={newEvent.title}
                        onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                        placeholder="Enter event title"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={newEvent.description}
                        onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                        placeholder="Enter event description"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="date">Date *</Label>
                        <Input
                          id="date"
                          value={newEvent.date}
                          onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                          placeholder="e.g., March 23, 2025"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="time">Time</Label>
                        <Input
                          id="time"
                          value={newEvent.time}
                          onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                          placeholder="e.g., 10:00 AM - 2:00 PM"
                        />
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="location">Location *</Label>
                      <Input
                        id="location"
                        value={newEvent.location}
                        onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                        placeholder="Enter event location"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="category">Category</Label>
                      <Select
                        value={newEvent.category}
                        onValueChange={(value) => setNewEvent({ ...newEvent, category: value })}
                      >
                        <SelectTrigger id="category">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Lectures">Lectures</SelectItem>
                          <SelectItem value="Workshops">Workshops</SelectItem>
                          <SelectItem value="Conferences">Conferences</SelectItem>
                          <SelectItem value="Community">Community Events</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="featured"
                        checked={newEvent.featured}
                        onCheckedChange={(checked) => setNewEvent({ ...newEvent, featured: checked as boolean })}
                      />
                      <Label htmlFor="featured">Featured Event</Label>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddEventOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleAddEvent}>Add Event</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <Tabs defaultValue="upcoming" className="w-full">
            <TabsList className="mb-6 grid w-full grid-cols-2">
              <TabsTrigger value="upcoming">Upcoming Events</TabsTrigger>
              <TabsTrigger value="past">Past Events</TabsTrigger>
            </TabsList>

            <TabsContent value="upcoming">
              {upcomingEvents.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-10">
                    <Calendar className="mb-4 h-12 w-12 text-muted-foreground" />
                    <p className="text-lg font-medium">No upcoming events found</p>
                    <p className="text-sm text-muted-foreground">
                      {searchQuery ? "Try a different search term" : "Add a new event to get started"}
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {upcomingEvents.map((event) => (
                    <Card key={event.id}>
                      <CardContent className="p-6">
                        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center gap-2">
                              <h3 className="text-xl font-bold">{event.title}</h3>
                              {event.featured && <Badge variant="secondary">Featured</Badge>}
                            </div>
                            <p className="text-muted-foreground">{event.description}</p>
                            <div className="flex flex-wrap gap-4 text-sm">
                              <div className="flex items-center gap-1">
                                <CalendarIcon className="h-4 w-4 text-emerald-600" />
                                <span>{event.date}</span>
                              </div>
                              {event.time && (
                                <div className="flex items-center gap-1">
                                  <Clock className="h-4 w-4 text-emerald-600" />
                                  <span>{event.time}</span>
                                </div>
                              )}
                              <div className="flex items-center gap-1">
                                <MapPin className="h-4 w-4 text-emerald-600" />
                                <span>{event.location}</span>
                              </div>
                            </div>
                            {event.category && <Badge variant="outline">{event.category}</Badge>}
                          </div>
                          <div className="flex gap-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="outline" size="icon" onClick={() => handleEditEvent(event)}>
                                  <PencilIcon className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-[600px]">
                                <DialogHeader>
                                  <DialogTitle>Edit Event</DialogTitle>
                                  <DialogDescription>Update the details of this event</DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                  <div className="grid gap-2">
                                    <Label htmlFor="edit-title">Event Title *</Label>
                                    <Input
                                      id="edit-title"
                                      value={newEvent.title}
                                      onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                                    />
                                  </div>
                                  <div className="grid gap-2">
                                    <Label htmlFor="edit-description">Description</Label>
                                    <Textarea
                                      id="edit-description"
                                      value={newEvent.description}
                                      onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                                    />
                                  </div>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                      <Label htmlFor="edit-date">Date *</Label>
                                      <Input
                                        id="edit-date"
                                        value={newEvent.date}
                                        onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                                      />
                                    </div>
                                    <div className="grid gap-2">
                                      <Label htmlFor="edit-time">Time</Label>
                                      <Input
                                        id="edit-time"
                                        value={newEvent.time}
                                        onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                                      />
                                    </div>
                                  </div>
                                  <div className="grid gap-2">
                                    <Label htmlFor="edit-location">Location *</Label>
                                    <Input
                                      id="edit-location"
                                      value={newEvent.location}
                                      onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                                    />
                                  </div>
                                  <div className="grid gap-2">
                                    <Label htmlFor="edit-category">Category</Label>
                                    <Select
                                      value={newEvent.category}
                                      onValueChange={(value) => setNewEvent({ ...newEvent, category: value })}
                                    >
                                      <SelectTrigger id="edit-category">
                                        <SelectValue placeholder="Select a category" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="Lectures">Lectures</SelectItem>
                                        <SelectItem value="Workshops">Workshops</SelectItem>
                                        <SelectItem value="Conferences">Conferences</SelectItem>
                                        <SelectItem value="Community">Community Events</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <Checkbox
                                      id="edit-featured"
                                      checked={newEvent.featured}
                                      onCheckedChange={(checked) =>
                                        setNewEvent({ ...newEvent, featured: checked as boolean })
                                      }
                                    />
                                    <Label htmlFor="edit-featured">Featured Event</Label>
                                  </div>
                                </div>
                                <DialogFooter>
                                  <Button variant="outline" onClick={() => setEditingEvent(null)}>
                                    Cancel
                                  </Button>
                                  <Button onClick={handleUpdateEvent}>Update Event</Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                            <Button variant="destructive" size="icon" onClick={() => handleDeleteEvent(event.id)}>
                              <Trash2Icon className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="past">
              {pastEvents.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-10">
                    <Calendar className="mb-4 h-12 w-12 text-muted-foreground" />
                    <p className="text-lg font-medium">No past events found</p>
                    <p className="text-sm text-muted-foreground">
                      {searchQuery ? "Try a different search term" : "Past events will appear here"}
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {pastEvents.map((event) => (
                    <Card key={event.id}>
                      <CardContent className="p-6">
                        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center gap-2">
                              <h3 className="text-xl font-bold">{event.title}</h3>
                              {event.featured && <Badge variant="secondary">Featured</Badge>}
                            </div>
                            <p className="text-muted-foreground">{event.description}</p>
                            <div className="flex flex-wrap gap-4 text-sm">
                              <div className="flex items-center gap-1">
                                <CalendarIcon className="h-4 w-4 text-emerald-600" />
                                <span>{event.date}</span>
                              </div>
                              {event.time && (
                                <div className="flex items-center gap-1">
                                  <Clock className="h-4 w-4 text-emerald-600" />
                                  <span>{event.time}</span>
                                </div>
                              )}
                              <div className="flex items-center gap-1">
                                <MapPin className="h-4 w-4 text-emerald-600" />
                                <span>{event.location}</span>
                              </div>
                            </div>
                            {event.category && <Badge variant="outline">{event.category}</Badge>}
                          </div>
                          <div className="flex gap-2">
                            <Button variant="destructive" size="icon" onClick={() => handleDeleteEvent(event.id)}>
                              <Trash2Icon className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}
