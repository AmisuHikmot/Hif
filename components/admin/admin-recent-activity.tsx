import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

const activities = [
  {
    id: 1,
    user: {
      name: "Ahmed Ibrahim",
      avatar: "/placeholder.svg?height=32&width=32",
      initials: "AI",
    },
    action: "registered for",
    target: "Annual Islamic Conference 2024",
    type: "registration",
    timestamp: "2 minutes ago",
  },
  {
    id: 2,
    user: {
      name: "Fatima Usman",
      avatar: "/placeholder.svg?height=32&width=32",
      initials: "FU",
    },
    action: "made a donation of",
    target: "₦50,000",
    type: "donation",
    timestamp: "15 minutes ago",
  },
  {
    id: 3,
    user: {
      name: "Yusuf Mohammed",
      avatar: "/placeholder.svg?height=32&width=32",
      initials: "YM",
    },
    action: "became a",
    target: "Premium Member",
    type: "membership",
    timestamp: "1 hour ago",
  },
  {
    id: 4,
    user: {
      name: "Aisha Abdullahi",
      avatar: "/placeholder.svg?height=32&width=32",
      initials: "AA",
    },
    action: "updated their",
    target: "profile information",
    type: "profile",
    timestamp: "2 hours ago",
  },
  {
    id: 5,
    user: {
      name: "Ibrahim Suleiman",
      avatar: "/placeholder.svg?height=32&width=32",
      initials: "IS",
    },
    action: "attended",
    target: "Friday Lecture Series",
    type: "attendance",
    timestamp: "3 hours ago",
  },
]

const getActivityBadge = (type: string) => {
  switch (type) {
    case "registration":
      return (
        <Badge variant="secondary" className="bg-blue-100 text-blue-800">
          Registration
        </Badge>
      )
    case "donation":
      return (
        <Badge variant="secondary" className="bg-green-100 text-green-800">
          Donation
        </Badge>
      )
    case "membership":
      return (
        <Badge variant="secondary" className="bg-purple-100 text-purple-800">
          Membership
        </Badge>
      )
    case "profile":
      return (
        <Badge variant="secondary" className="bg-orange-100 text-orange-800">
          Profile
        </Badge>
      )
    case "attendance":
      return (
        <Badge variant="secondary" className="bg-emerald-100 text-emerald-800">
          Attendance
        </Badge>
      )
    default:
      return <Badge variant="secondary">Activity</Badge>
  }
}

export default function AdminRecentActivity() {
  return (
    <Card className="border-emerald-200 dark:border-emerald-900">
      <CardHeader>
        <CardTitle className="text-emerald-900 dark:text-emerald-500">Recent Activity</CardTitle>
        <CardDescription>Latest user activities and interactions</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-center space-x-4 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
            <Avatar className="h-10 w-10">
              <AvatarImage src={activity.user.avatar || "/placeholder.svg"} alt={activity.user.name} />
              <AvatarFallback className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200">
                {activity.user.initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{activity.user.name}</p>
                {getActivityBadge(activity.type)}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {activity.action} <span className="font-medium">{activity.target}</span>
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">{activity.timestamp}</p>
            </div>
          </div>
        ))}
        <div className="text-center pt-4">
          <button className="text-sm text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-medium">
            View all activities
          </button>
        </div>
      </CardContent>
    </Card>
  )
}
