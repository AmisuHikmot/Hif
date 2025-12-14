"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
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
import {
  CalendarIcon,
  PencilIcon,
  Trash2Icon,
  PlusCircle,
  Search,
  Calendar,
  MapPin,
  Loader2,
  Users,
} from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import AdminNav from "@/components/admin/admin-nav"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "@/contexts/auth-context"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface Event {
  id: string
  title: string
  slug: string
  description: string
  start_date: string
  end_date: string
  location: string
  category: string
  status: string
  is_featured: boolean
  max_attendees: number
  current_attendees: number
  image_url: string | null
  created_at: string
}

export default function AdminEventsPage() {
  const { toast } = useToast()
  const router = useRouter()
  const { user, profile } = useAuth()
  const [events, setEvents] = useState<Event[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [isAddEventOpen, setIsAddEventOpen] = useState(false)
  const [editingEvent, setEditingEvent] = useState<Event | null>(null)
  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    start_date: "",
    end_date: "",
    location: "",
    category: "",
    is_featured: false,
    max_attendees: 100,
  })

  // Check admin access
  useEffect(() => {
    if (profile && profile.role !== "admin") {
      router.push("/dashboard")
    }
  }, [profile, router])

  // Fetch events from database
  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    setIsLoading(true)
    try {
      const supabase = createClient()
      const { data, error } = await supabase.from("events").select("*").order("start_date", { ascending: false })

      if (error) throw error
      setEvents(data || [])
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch events",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
  }

  const handleAddEvent = async () => {
    if (!newEvent.title || !newEvent.start_date || !newEvent.location) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    setIsSaving(true)
    try {
      const supabase = createClient()
      const slug = generateSlug(newEvent.title)

      const { data, error } = await supabase
        .from("events")
        .insert({
          ...newEvent,
          slug,
          status: "upcoming",
          current_attendees: 0,
          created_by: user?.id,
        })
        .select()
        .single()

      if (error) throw error

      setEvents([data, ...events])
      setNewEvent({
        title: "",
        description: "",
        start_date: "",
        end_date: "",
        location: "",
        category: "",
        is_featured: false,
        max_attendees: 100,
      })
      setIsAddEventOpen(false)

      toast({
        title: "Event Added",
        description: "The event has been successfully created",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add event",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleEditEvent = (event: Event) => {
    setEditingEvent(event)
    setNewEvent({
      title: event.title,
      description: event.description || "",
      start_date: event.start_date ? event.start_date.split("T")[0] : "",
      end_date: event.end_date ? event.end_date.split("T")[0] : "",
      location: event.location,
      category: event.category || "",
      is_featured: event.is_featured,
      max_attendees: event.max_attendees || 100,
    })
  }

  const handleUpdateEvent = async () => {
    if (!editingEvent || !newEvent.title || !newEvent.start_date || !newEvent.location) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    setIsSaving(true)
    try {
      const supabase = createClient()
      const slug = generateSlug(newEvent.title)

      const { error } = await supabase
        .from("events")
        .update({
          ...newEvent,
          slug,
          updated_at: new Date().toISOString(),
        })
        .eq("id", editingEvent.id)

      if (error) throw error

      setEvents(
        events.map((event) =>
          event.id === editingEvent.id ? { ...event, ...newEvent, slug, updated_at: new Date().toISOString() } : event,
        ),
      )

      setEditingEvent(null)
      setNewEvent({
        title: "",
        description: "",
        start_date: "",
        end_date: "",
        location: "",
        category: "",
        is_featured: false,
        max_attendees: 100,
      })

      toast({
        title: "Event Updated",
        description: "The event has been successfully updated",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update event",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteEvent = async (id: string) => {
    try {
      const supabase = createClient()
      const { error } = await supabase.from("events").delete().eq("id", id)

      if (error) throw error

      setEvents(events.filter((event) => event.id !== id))

      toast({
        title: "Event Deleted",
        description: "The event has been successfully removed",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete event",
        variant: "destructive",
      })
    }
  }

  const handleStatusChange = async (id: string, status: string) => {
    try {
      const supabase = createClient()
      const { error } = await supabase.from("events").update({ status }).eq("id", id)

      if (error) throw error

      setEvents(events.map((event) => (event.id === id ? { ...event, status } : event)))

      toast({
        title: "Status Updated",
        description: `Event status changed to ${status}`,
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update status",
        variant: "destructive",
      })
    }
  }

  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.location.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCategory = categoryFilter === "all" || event.category === categoryFilter

    return matchesSearch && matchesCategory
  })

  const upcomingEvents = filteredEvents.filter((event) => event.status === "upcoming" || event.status === "ongoing")
  const pastEvents = filteredEvents.filter((event) => event.status === "completed" || event.status === "cancelled")

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-NG", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  if (!user || (profile && profile.role !== "admin")) {
    return null
  }

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
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="lectures">Lectures</SelectItem>
                  <SelectItem value="workshops">Workshops</SelectItem>
                  <SelectItem value="conferences">Conferences</SelectItem>
                  <SelectItem value="community">Community</SelectItem>
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
                        rows={3}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="start_date">Start Date *</Label>
                        <Input
                          id="start_date"
                          type="date"
                          value={newEvent.start_date}
                          onChange={(e) => setNewEvent({ ...newEvent, start_date: e.target.value })}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="end_date">End Date</Label>
                        <Input
                          id="end_date"
                          type="date"
                          value={newEvent.end_date}
                          onChange={(e) => setNewEvent({ ...newEvent, end_date: e.target.value })}
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
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="category">Category</Label>
                        <Select
                          value={newEvent.category}
                          onValueChange={(value) => setNewEvent({ ...newEvent, category: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="lectures">Lectures</SelectItem>
                            <SelectItem value="workshops">Workshops</SelectItem>
                            <SelectItem value="conferences">Conferences</SelectItem>
                            <SelectItem value="community">Community</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="max_attendees">Max Attendees</Label>
                        <Input
                          id="max_attendees"
                          type="number"
                          value={newEvent.max_attendees}
                          onChange={(e) =>
                            setNewEvent({ ...newEvent, max_attendees: Number.parseInt(e.target.value) || 100 })
                          }
                        />
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="is_featured"
                        checked={newEvent.is_featured}
                        onCheckedChange={(checked) => setNewEvent({ ...newEvent, is_featured: checked as boolean })}
                      />
                      <Label htmlFor="is_featured">Featured Event</Label>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddEventOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleAddEvent} disabled={isSaving}>
                      {isSaving ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Adding...
                        </>
                      ) : (
                        "Add Event"
                      )}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
            </div>
          ) : (
            <Tabs defaultValue="upcoming" className="w-full">
              <TabsList className="mb-6 grid w-full grid-cols-2">
                <TabsTrigger value="upcoming">Upcoming ({upcomingEvents.length})</TabsTrigger>
                <TabsTrigger value="past">Past ({pastEvents.length})</TabsTrigger>
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
                              <div className="flex items-center gap-2 flex-wrap">
                                <h3 className="text-xl font-bold">{event.title}</h3>
                                {event.is_featured && <Badge className="bg-amber-100 text-amber-800">Featured</Badge>}
                                <Badge variant={event.status === "ongoing" ? "default" : "secondary"}>
                                  {event.status}
                                </Badge>
                              </div>
                              <p className="text-muted-foreground line-clamp-2">{event.description}</p>
                              <div className="flex flex-wrap gap-4 text-sm">
                                <div className="flex items-center gap-1">
                                  <CalendarIcon className="h-4 w-4 text-emerald-600" />
                                  <span>{formatDate(event.start_date)}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <MapPin className="h-4 w-4 text-emerald-600" />
                                  <span>{event.location}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Users className="h-4 w-4 text-emerald-600" />
                                  <span>
                                    {event.current_attendees || 0}/{event.max_attendees || 100}
                                  </span>
                                </div>
                              </div>
                              {event.category && <Badge variant="outline">{event.category}</Badge>}
                            </div>
                            <div className="flex gap-2">
                              <Select
                                defaultValue={event.status}
                                onValueChange={(value) => handleStatusChange(event.id, value)}
                              >
                                <SelectTrigger className="w-[130px]">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="upcoming">Upcoming</SelectItem>
                                  <SelectItem value="ongoing">Ongoing</SelectItem>
                                  <SelectItem value="completed">Completed</SelectItem>
                                  <SelectItem value="cancelled">Cancelled</SelectItem>
                                </SelectContent>
                              </Select>
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button variant="outline" size="icon" onClick={() => handleEditEvent(event)}>
                                    <PencilIcon className="h-4 w-4" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[600px]">
                                  <DialogHeader>
                                    <DialogTitle>Edit Event</DialogTitle>
                                    <DialogDescription>Update the event details</DialogDescription>
                                  </DialogHeader>
                                  <div className="grid gap-4 py-4">
                                    <div className="grid gap-2">
                                      <Label>Event Title *</Label>
                                      <Input
                                        value={newEvent.title}
                                        onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                                      />
                                    </div>
                                    <div className="grid gap-2">
                                      <Label>Description</Label>
                                      <Textarea
                                        value={newEvent.description}
                                        onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                                        rows={3}
                                      />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                      <div className="grid gap-2">
                                        <Label>Start Date *</Label>
                                        <Input
                                          type="date"
                                          value={newEvent.start_date}
                                          onChange={(e) => setNewEvent({ ...newEvent, start_date: e.target.value })}
                                        />
                                      </div>
                                      <div className="grid gap-2">
                                        <Label>End Date</Label>
                                        <Input
                                          type="date"
                                          value={newEvent.end_date}
                                          onChange={(e) => setNewEvent({ ...newEvent, end_date: e.target.value })}
                                        />
                                      </div>
                                    </div>
                                    <div className="grid gap-2">
                                      <Label>Location *</Label>
                                      <Input
                                        value={newEvent.location}
                                        onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                                      />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                      <div className="grid gap-2">
                                        <Label>Category</Label>
                                        <Select
                                          value={newEvent.category}
                                          onValueChange={(value) => setNewEvent({ ...newEvent, category: value })}
                                        >
                                          <SelectTrigger>
                                            <SelectValue />
                                          </SelectTrigger>
                                          <SelectContent>
                                            <SelectItem value="lectures">Lectures</SelectItem>
                                            <SelectItem value="workshops">Workshops</SelectItem>
                                            <SelectItem value="conferences">Conferences</SelectItem>
                                            <SelectItem value="community">Community</SelectItem>
                                          </SelectContent>
                                        </Select>
                                      </div>
                                      <div className="grid gap-2">
                                        <Label>Max Attendees</Label>
                                        <Input
                                          type="number"
                                          value={newEvent.max_attendees}
                                          onChange={(e) =>
                                            setNewEvent({
                                              ...newEvent,
                                              max_attendees: Number.parseInt(e.target.value) || 100,
                                            })
                                          }
                                        />
                                      </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <Checkbox
                                        checked={newEvent.is_featured}
                                        onCheckedChange={(checked) =>
                                          setNewEvent({ ...newEvent, is_featured: checked as boolean })
                                        }
                                      />
                                      <Label>Featured Event</Label>
                                    </div>
                                  </div>
                                  <DialogFooter>
                                    <Button variant="outline" onClick={() => setEditingEvent(null)}>
                                      Cancel
                                    </Button>
                                    <Button onClick={handleUpdateEvent} disabled={isSaving}>
                                      {isSaving ? (
                                        <>
                                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                          Saving...
                                        </>
                                      ) : (
                                        "Save Changes"
                                      )}
                                    </Button>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="outline" size="icon" className="text-destructive bg-transparent">
                                    <Trash2Icon className="h-4 w-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Delete Event?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      This will permanently delete &quot;{event.title}&quot;. This action cannot be
                                      undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => handleDeleteEvent(event.id)}
                                      className="bg-destructive text-destructive-foreground"
                                    >
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </div>
                          <div className="mt-4 w-full bg-muted rounded-full h-2">
                            <div
                              className="bg-emerald-600 h-2 rounded-full transition-all"
                              style={{
                                width: `${Math.min(((event.current_attendees || 0) / (event.max_attendees || 100)) * 100, 100)}%`,
                              }}
                            />
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
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {pastEvents.map((event) => (
                      <Card key={event.id} className="opacity-75">
                        <CardContent className="p-6">
                          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                            <div className="flex-1 space-y-2">
                              <div className="flex items-center gap-2 flex-wrap">
                                <h3 className="text-xl font-bold">{event.title}</h3>
                                <Badge variant="secondary">{event.status}</Badge>
                              </div>
                              <p className="text-muted-foreground line-clamp-2">{event.description}</p>
                              <div className="flex flex-wrap gap-4 text-sm">
                                <div className="flex items-center gap-1">
                                  <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                                  <span>{formatDate(event.start_date)}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <MapPin className="h-4 w-4 text-muted-foreground" />
                                  <span>{event.location}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Users className="h-4 w-4 text-muted-foreground" />
                                  <span>{event.current_attendees || 0} attended</span>
                                </div>
                              </div>
                            </div>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="outline" size="icon" className="text-destructive bg-transparent">
                                  <Trash2Icon className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete Event?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This will permanently delete &quot;{event.title}&quot;.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDeleteEvent(event.id)}
                                    className="bg-destructive text-destructive-foreground"
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          )}
        </main>
      </div>
    </div>
  )
}
