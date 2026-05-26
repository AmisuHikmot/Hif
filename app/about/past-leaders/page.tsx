import type { Metadata } from "next"
import type React from "react"
import Image from "next/image"
import { Calendar, Award, BookOpen, Users } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getLeadershipProfiles } from "@/lib/content"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Past Leaders | Hamduk Islamic Foundation",
  description: "Honoring the legacy of past leaders who shaped Hamduk Islamic Foundation.",
}

const groups = [
  { key: "founders", label: "Founding Leaders" },
  { key: "past-presidents", label: "Past Presidents" },
  { key: "scholarly-advisors", label: "Scholarly Advisors" },
]

export default async function PastLeadersPage() {
  const results = await Promise.all(groups.map((group) => getLeadershipProfiles(group.key)))
  const leadersByGroup = new Map(groups.map((group, index) => [group.key, results[index]]))

  return (
    <main className="container mx-auto px-4 py-12 md:px-6">
      <div className="mx-auto max-w-5xl">
        <h1 className="mb-8 text-center text-4xl font-bold">Past Leaders</h1>
        <p className="mb-12 text-center text-lg text-muted-foreground">
          Honoring the visionaries who laid the foundation and shaped the path of Hamduk Islamic Foundation.
        </p>

        <Tabs defaultValue="founders" className="mb-12">
          <TabsList className="mb-8 grid grid-cols-3">
            {groups.map((group) => (
              <TabsTrigger key={group.key} value={group.key}>
                {group.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {groups.map((group) => {
            const leaders = leadersByGroup.get(group.key) || []
            return (
              <TabsContent key={group.key} value={group.key} className="space-y-8">
                <div className="text-center">
                  <h2 className="mb-4 text-2xl font-semibold">{group.label}</h2>
                </div>
                {leaders.length ? (
                  <div className="grid gap-6 md:grid-cols-2">
                    {leaders.map((leader: any) => (
                      <Card key={leader.id} className="overflow-hidden">
                        <div className="relative h-56">
                          <Image
                            src={leader.image_url || "/placeholder.svg?height=300&width=500"}
                            alt={leader.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <CardHeader>
                          <CardTitle>{leader.name}</CardTitle>
                          <CardDescription>{leader.title}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {leader.bio && <p>{leader.bio}</p>}
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            {leader.tenure && <Info icon={<Calendar />} label="Tenure" value={leader.tenure} />}
                            {leader.achievements && <Info icon={<Award />} label="Achievements" value={leader.achievements} />}
                            {leader.education && <Info icon={<BookOpen />} label="Education" value={leader.education} />}
                            {leader.legacy && <Info icon={<Users />} label="Legacy" value={leader.legacy} />}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card className="p-8 text-center text-muted-foreground">
                    No {group.label.toLowerCase()} have been added yet.
                  </Card>
                )}
              </TabsContent>
            )
          })}
        </Tabs>
      </div>
    </main>
  )
}

function Info({ icon, label, value }: { icon: React.ReactElement; label: string; value: string }) {
  return (
    <div className="flex items-start">
      <span className="mr-2 mt-0.5 text-primary [&>svg]:h-5 [&>svg]:w-5">{icon}</span>
      <div>
        <h4 className="font-medium">{label}</h4>
        <p className="text-muted-foreground">{value}</p>
      </div>
    </div>
  )
}
