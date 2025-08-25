import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Users, Edit, Trash2, Plus } from "lucide-react"

const events = [
  {
    id: 1,
    title: "Annual Islamic Conference 2024",
    date: "March 15, 2024",
    time: "9:00 AM - 5:00 PM",
    location: "Lagos Central Mosque",
    attendees: 450,
    maxAttendees: 500,
    status: "upcoming",
  },
  {
    id: 2,
    title: "Friday Lecture Series",
    date: "March 8, 2024",
    time: "2:00 PM - 4:00 PM",
    location: "Kano Branch",
    attendees: 120,
    maxAttendees: 150,
    status: "ongoing",
  },
  {
    id: 3,
    title: "Youth Islamic Camp",
    date: "March 22, 2024",
    time: "8:00 AM - 6:00 PM",
    location: "Abuja Branch",
    attendees: 85,
    maxAttendees: 100,
    status: "upcoming",
  },
  {
    id: 4,
    title: "Ramadan Preparation Workshop",
    date: "March 1, 2024",
    time: "6:00 PM - 8:00 PM",
    location: "Port Harcourt Branch",
    attendees: 65,
    maxAttendees: 80,
    status: "completed",
  },
  {
    id: 5,
    title: "Islamic Finance Seminar",
    date: "March 29, 2024",
    time: "10:00 AM - 3:00 PM",
    location: "Kaduna Branch",
    attendees: 35,
    maxAttendees: 60,
    status: "upcoming",
  },
]

const getStatusBadge = (status: string) => {
  switch (status) {
    case "upcoming":
      return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Upcoming</Badge>
    case "ongoing":
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Ongoing</Badge>
    case "completed":
      return <Badge variant="secondary">Completed</Badge>
    default:
      return <Badge variant="secondary">{status}</Badge>
  }
}

export default function AdminEventsList() {
  return (
    <Card className="border-emerald-200 dark:border-emerald-900">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-emerald-900 dark:text-emerald-500">Upcoming Events</CardTitle>
            <CardDescription>Manage and monitor your events</CardDescription>
          </div>
          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
            <Plus className="h-4 w-4 mr-2" />
            Add Event
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {events.map((event) => (
          <div
            key={event.id}
            className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">{event.title}</h3>
                  {getStatusBadge(event.status)}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MapPin className="h-4 w-4" />
                    <span>{event.location}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="h-4 w-4" />
                    <span>
                      {event.attendees}/{event.maxAttendees} attendees
                    </span>
                  </div>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">{event.time}</p>
              </div>
              <div className="flex space-x-2 ml-4">
                <Button
                  size="sm"
                  variant="outline"
                  className="border-emerald-600 text-emerald-600 hover:bg-emerald-50 bg-transparent"
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-red-600 text-red-600 hover:bg-red-50 bg-transparent"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-emerald-600 h-2 rounded-full"
                style={{ width: `${(event.attendees / event.maxAttendees) * 100}%` }}
              ></div>
            </div>
          </div>
        ))}
        <div className="text-center pt-4">
          <button className="text-sm text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-medium">
            View all events
          </button>
        </div>
      </CardContent>
    </Card>
  )
}
