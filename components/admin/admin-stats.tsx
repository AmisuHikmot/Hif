import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Calendar, DollarSign, TrendingUp } from "lucide-react"

const stats = [
  {
    title: "Total Members",
    value: "2,847",
    change: "+12.5%",
    changeType: "positive" as const,
    icon: Users,
    description: "Active registered members",
  },
  {
    title: "Active Events",
    value: "23",
    change: "+3",
    changeType: "positive" as const,
    icon: Calendar,
    description: "Ongoing and upcoming events",
  },
  {
    title: "Monthly Donations",
    value: "₦1,245,000",
    change: "+8.2%",
    changeType: "positive" as const,
    icon: DollarSign,
    description: "Total donations this month",
  },
  {
    title: "Engagement Rate",
    value: "68.4%",
    change: "-2.1%",
    changeType: "negative" as const,
    icon: TrendingUp,
    description: "Member participation rate",
  },
]

export default function AdminStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => (
        <Card key={stat.title} className="border-emerald-200 dark:border-emerald-900">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-700 dark:text-gray-300">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-900 dark:text-emerald-500">{stat.value}</div>
            <div className="flex items-center space-x-2 text-xs">
              <span
                className={
                  stat.changeType === "positive"
                    ? "text-green-600 dark:text-green-400"
                    : "text-red-600 dark:text-red-400"
                }
              >
                {stat.change}
              </span>
              <span className="text-gray-500 dark:text-gray-400">from last month</span>
            </div>
            <CardDescription className="mt-2 text-xs">{stat.description}</CardDescription>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
