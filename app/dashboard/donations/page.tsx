import { redirect } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { CreditCard, Download, Gift, TrendingUp, Calendar, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import DashboardNav from "@/components/dashboard/dashboard-nav"

export const metadata = {
  title: "My Donations | Hamduk Islamic Foundation",
  description: "View your donation history and manage recurring donations",
}

async function getUserDonations(userId: string) {
  const supabase = await createClient()
  const currentYear = new Date().getFullYear()

  // Get all donations
  const { data: donations } = await supabase
    .from("donations")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  // Get yearly stats
  const { data: yearlyDonations } = await supabase
    .from("donations")
    .select("amount, created_at")
    .eq("user_id", userId)
    .eq("payment_status", "completed")
    .gte("created_at", `${currentYear}-01-01`)

  const totalThisYear = yearlyDonations?.reduce((sum, d) => sum + Number(d.amount), 0) || 0
  const totalAllTime =
    donations?.filter((d) => d.payment_status === "completed").reduce((sum, d) => sum + Number(d.amount), 0) || 0

  // Get recurring donations
  const recurringDonations =
    donations?.filter((d) => d.donation_type === "monthly" || d.donation_type === "annual") || []

  // Group donations by month
  const monthlyStats: { [key: string]: number } = {}
  yearlyDonations?.forEach((d) => {
    const month = new Date(d.created_at).toLocaleDateString("en-US", { month: "short" })
    monthlyStats[month] = (monthlyStats[month] || 0) + Number(d.amount)
  })

  return {
    donations: donations || [],
    totalThisYear,
    totalAllTime,
    recurringDonations,
    monthlyStats,
    donationCount: donations?.filter((d) => d.payment_status === "completed").length || 0,
  }
}

export default async function DonationsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login?redirect=/dashboard/donations")
  }

  const { donations, totalThisYear, totalAllTime, recurringDonations, donationCount } = await getUserDonations(user.id)

  const donationGoal = 100000
  const progress = Math.min((totalThisYear / donationGoal) * 100, 100)

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-emerald-500">Completed</Badge>
      case "pending":
        return <Badge variant="outline">Pending</Badge>
      case "failed":
        return <Badge variant="destructive">Failed</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid gap-8 md:grid-cols-[240px_1fr]">
        <DashboardNav />

        <main>
          <div className="mb-8 flex flex-col gap-2">
            <h1 className="text-3xl font-bold tracking-tight">My Donations</h1>
            <p className="text-muted-foreground">View your donation history and manage recurring contributions</p>
          </div>

          <div className="mb-8 grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total This Year</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">₦{totalThisYear.toLocaleString()}</p>
                <Progress value={progress} className="mt-2 h-2" />
                <p className="text-xs text-muted-foreground mt-1">
                  {Math.round(progress)}% of ₦{donationGoal.toLocaleString()} goal
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">All Time</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">₦{totalAllTime.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground mt-1">{donationCount} donations made</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Recurring</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{recurringDonations.length}</p>
                <p className="text-xs text-muted-foreground mt-1">Active subscriptions</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Impact</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">
                  <TrendingUp className="inline h-5 w-5 text-emerald-600 mr-1" />
                  Growing
                </p>
                <p className="text-xs text-muted-foreground mt-1">Your contributions matter</p>
              </CardContent>
            </Card>
          </div>

          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search donations..." className="pl-10" />
            </div>
            <div className="flex gap-2">
              <Select defaultValue="all">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Donations</SelectItem>
                  <SelectItem value="one-time">One-time</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="annual">Annual</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" className="bg-transparent">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          </div>

          <Tabs defaultValue="all">
            <TabsList className="mb-6">
              <TabsTrigger value="all">All Donations</TabsTrigger>
              <TabsTrigger value="recurring">Recurring</TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              <Card>
                <CardHeader>
                  <CardTitle>Donation History</CardTitle>
                  <CardDescription>A complete record of your contributions</CardDescription>
                </CardHeader>
                <CardContent>
                  {donations.length > 0 ? (
                    <div className="space-y-4">
                      {donations.map((donation) => (
                        <div key={donation.id}>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="rounded-full bg-emerald-100 p-2 dark:bg-emerald-900/20">
                                <Gift className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                              </div>
                              <div>
                                <h3 className="font-medium">{donation.project_name || "General Donation"}</h3>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <Calendar className="h-3 w-3" />
                                  <span>{new Date(donation.created_at).toLocaleDateString()}</span>
                                  <span>•</span>
                                  <span className="capitalize">{donation.donation_type}</span>
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">
                                {donation.currency} {Number(donation.amount).toLocaleString()}
                              </p>
                              {getStatusBadge(donation.payment_status)}
                            </div>
                          </div>
                          <Separator className="mt-4" />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Gift className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">No donations yet.</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Your generosity helps us continue our mission.
                      </p>
                      <Button className="mt-4" asChild>
                        <Link href="/donate">Make Your First Donation</Link>
                      </Button>
                    </div>
                  )}
                </CardContent>
                {donations.length > 0 && (
                  <CardFooter>
                    <Button className="w-full" asChild>
                      <Link href="/donate">Make a New Donation</Link>
                    </Button>
                  </CardFooter>
                )}
              </Card>
            </TabsContent>

            <TabsContent value="recurring">
              <Card>
                <CardHeader>
                  <CardTitle>Recurring Donations</CardTitle>
                  <CardDescription>Manage your monthly and annual contributions</CardDescription>
                </CardHeader>
                <CardContent>
                  {recurringDonations.length > 0 ? (
                    <div className="space-y-4">
                      {recurringDonations.map((donation) => (
                        <div key={donation.id} className="flex items-center justify-between p-4 rounded-lg border">
                          <div>
                            <h3 className="font-medium">{donation.project_name || "General Fund"}</h3>
                            <p className="text-sm text-muted-foreground capitalize">{donation.donation_type}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">
                              {donation.currency} {Number(donation.amount).toLocaleString()}/
                              {donation.donation_type === "monthly" ? "mo" : "yr"}
                            </p>
                            <Button variant="link" className="h-auto p-0 text-sm text-destructive">
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <CreditCard className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">No recurring donations set up.</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Set up a recurring donation to support our work consistently.
                      </p>
                      <Button className="mt-4" asChild>
                        <Link href="/donate">Set Up Recurring Donation</Link>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}
