import type { Metadata } from "next"
import Link from "next/link"
import { CalendarDays, Clock, Download, FileText, Gift, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import DashboardNav from "@/components/dashboard/dashboard-nav"

export const metadata: Metadata = {
  title: "Member Dashboard | Hamduk Islamic Foundation",
  description: "Access your personalized dashboard as a member of Hamduk Islamic Foundation",
}

export default function DashboardPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid gap-8 md:grid-cols-[240px_1fr]">
        <DashboardNav />

        <main>
          <div className="mb-8 flex flex-col gap-2">
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back, Ahmed! Here's an overview of your membership and activities.
            </p>
          </div>

          <div className="mb-8 grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Membership Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <Badge className="bg-emerald-500">Active</Badge>
                  <span className="text-xs text-muted-foreground">Expires: Dec 31, 2025</span>
                </div>
                <Separator className="my-4" />
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Member since:</span>
                    <span className="font-medium">Jan 15, 2023</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Member ID:</span>
                    <span className="font-medium">HIF-2023-0042</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Type:</span>
                    <span className="font-medium">Full Member</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Donation Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold">₦25,000</span>
                  <span className="text-xs text-muted-foreground">Goal: ₦100,000</span>
                </div>
                <Progress value={25} className="mt-2" />
                <p className="mt-2 text-xs text-muted-foreground">25% of your annual donation goal</p>
                <Button asChild className="mt-4 w-full" size="sm">
                  <Link href="/donate">Make a Donation</Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Upcoming Events</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium">Ramadan Tafsir</h3>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <CalendarDays className="h-3 w-3" />
                      <span>March 23, 2025</span>
                    </div>
                    <Badge variant="outline" className="mt-1">
                      Registered
                    </Badge>
                  </div>
                  <Separator />
                  <div>
                    <h3 className="font-medium">Islamic Leadership Conference</h3>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <CalendarDays className="h-3 w-3" />
                      <span>June 15, 2025</span>
                    </div>
                    <Button variant="outline" size="sm" className="mt-1">
                      Register
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="activities">
            <TabsList className="mb-4">
              <TabsTrigger value="activities">Recent Activities</TabsTrigger>
              <TabsTrigger value="resources">Resources</TabsTrigger>
              <TabsTrigger value="donations">Donation History</TabsTrigger>
            </TabsList>

            <TabsContent value="activities" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activities</CardTitle>
                  <CardDescription>Your recent interactions with Hamduk Islamic Foundation</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="rounded-full bg-emerald-100 p-2 dark:bg-emerald-900/20">
                        <Users className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium">Attended Youth Development Workshop</h3>
                          <span className="text-xs text-muted-foreground">2 days ago</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          You attended the Youth Development Workshop at Hamduk Islamic Center.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="rounded-full bg-emerald-100 p-2 dark:bg-emerald-900/20">
                        <Gift className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium">Made a Donation</h3>
                          <span className="text-xs text-muted-foreground">1 week ago</span>
                        </div>
                        <p className="text-sm text-muted-foreground">You donated ₦10,000 to the Ramadan Food Drive.</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="rounded-full bg-emerald-100 p-2 dark:bg-emerald-900/20">
                        <Download className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium">Downloaded Resource</h3>
                          <span className="text-xs text-muted-foreground">2 weeks ago</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          You downloaded "Understanding Islamic Finance" PDF.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="rounded-full bg-emerald-100 p-2 dark:bg-emerald-900/20">
                        <Clock className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium">Registered for Event</h3>
                          <span className="text-xs text-muted-foreground">1 month ago</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          You registered for the upcoming Ramadan Tafsir Program.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    View All Activities
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="resources" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Member Resources</CardTitle>
                  <CardDescription>Access exclusive resources for Hamduk Islamic Foundation members</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                          <div className="rounded-md bg-emerald-100 p-2 dark:bg-emerald-900/20">
                            <FileText className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                          </div>
                          <div>
                            <h3 className="font-medium">Islamic Finance Guide</h3>
                            <p className="text-xs text-muted-foreground">PDF • 2.4 MB</p>
                            <Button variant="link" className="h-auto p-0 text-xs">
                              Download
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                          <div className="rounded-md bg-emerald-100 p-2 dark:bg-emerald-900/20">
                            <FileText className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                          </div>
                          <div>
                            <h3 className="font-medium">Ramadan Prayer Timetable</h3>
                            <p className="text-xs text-muted-foreground">PDF • 1.2 MB</p>
                            <Button variant="link" className="h-auto p-0 text-xs">
                              Download
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                          <div className="rounded-md bg-emerald-100 p-2 dark:bg-emerald-900/20">
                            <FileText className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                          </div>
                          <div>
                            <h3 className="font-medium">Islamic Education Curriculum</h3>
                            <p className="text-xs text-muted-foreground">PDF • 3.8 MB</p>
                            <Button variant="link" className="h-auto p-0 text-xs">
                              Download
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                          <div className="rounded-md bg-emerald-100 p-2 dark:bg-emerald-900/20">
                            <FileText className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                          </div>
                          <div>
                            <h3 className="font-medium">Member Directory</h3>
                            <p className="text-xs text-muted-foreground">PDF • 1.5 MB</p>
                            <Button variant="link" className="h-auto p-0 text-xs">
                              Download
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    View All Resources
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="donations" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Donation History</CardTitle>
                  <CardDescription>Record of your contributions to Hamduk Islamic Foundation</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Ramadan Food Drive</h3>
                        <p className="text-sm text-muted-foreground">One-time donation</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">₦10,000</p>
                        <p className="text-xs text-muted-foreground">March 10, 2025</p>
                      </div>
                    </div>
                    <Separator />

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Islamic Education Fund</h3>
                        <p className="text-sm text-muted-foreground">Monthly donation</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">₦5,000</p>
                        <p className="text-xs text-muted-foreground">February 15, 2025</p>
                      </div>
                    </div>
                    <Separator />

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Islamic Education Fund</h3>
                        <p className="text-sm text-muted-foreground">Monthly donation</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">₦5,000</p>
                        <p className="text-xs text-muted-foreground">January 15, 2025</p>
                      </div>
                    </div>
                    <Separator />

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Mosque Construction Project</h3>
                        <p className="text-sm text-muted-foreground">One-time donation</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">₦25,000</p>
                        <p className="text-xs text-muted-foreground">December 20, 2024</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-4">
                  <div className="flex w-full items-center justify-between rounded-lg bg-muted p-4">
                    <span className="font-medium">Total Donations (2024-2025)</span>
                    <span className="text-xl font-bold">₦45,000</span>
                  </div>
                  <Button className="w-full">Make a New Donation</Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}
