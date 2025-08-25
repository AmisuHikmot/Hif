import type { Metadata } from "next"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Award, BookOpen, Users } from "lucide-react"

export const metadata: Metadata = {
  title: "Past Leaders | Hamduk Islamic Foundation",
  description: "Honoring the legacy of past leaders who shaped Hamduk Islamic Foundation.",
}

export default function PastLeadersPage() {
  return (
    <main className="container mx-auto py-12 px-4 md:px-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">Past Leaders</h1>

        <div className="mb-12 text-center">
          <p className="text-lg text-muted-foreground mb-6">
            Honoring the visionaries who laid the foundation and shaped the path of Hamduk Islamic Foundation.
          </p>
        </div>

        <Tabs defaultValue="founders" className="mb-12">
          <TabsList className="grid grid-cols-3 mb-8">
            <TabsTrigger value="founders">Founding Leaders</TabsTrigger>
            <TabsTrigger value="presidents">Past Presidents</TabsTrigger>
            <TabsTrigger value="scholars">Scholarly Advisors</TabsTrigger>
          </TabsList>

          <TabsContent value="founders" className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-semibold mb-4">Our Founding Leaders</h2>
              <p className="text-muted-foreground">
                The visionaries who established Hamduk Islamic Foundation and set its course.
              </p>
            </div>

            {[1, 2, 3].map((i) => (
              <Card key={i} className="overflow-hidden">
                <div className="md:flex">
                  <div className="md:w-1/3 relative h-64 md:h-auto">
                    <Image
                      src={`/placeholder.svg?height=400&width=300`}
                      alt={`Founding Leader ${i}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="md:w-2/3">
                    <CardHeader>
                      <CardTitle className="text-2xl">Sheikh Abdullah Ibrahim (1945-2010)</CardTitle>
                      <CardDescription>Founding Chairman (1980-1995)</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p>
                        Sheikh Abdullah Ibrahim was a renowned Islamic scholar who dedicated his life to Islamic
                        education and community service. With a vision to establish an organization that would serve the
                        educational and spiritual needs of Muslims in Nigeria, he founded Hamduk Islamic Foundation in
                        1980.
                      </p>

                      <div className="grid grid-cols-2 gap-4 mt-4">
                        <div className="flex items-start">
                          <Calendar className="h-5 w-5 mr-2 text-primary mt-0.5" />
                          <div>
                            <h4 className="font-medium">Tenure</h4>
                            <p className="text-sm text-muted-foreground">1980-1995</p>
                          </div>
                        </div>

                        <div className="flex items-start">
                          <Award className="h-5 w-5 mr-2 text-primary mt-0.5" />
                          <div>
                            <h4 className="font-medium">Key Achievements</h4>
                            <p className="text-sm text-muted-foreground">Established first 5 branches</p>
                          </div>
                        </div>

                        <div className="flex items-start">
                          <BookOpen className="h-5 w-5 mr-2 text-primary mt-0.5" />
                          <div>
                            <h4 className="font-medium">Education</h4>
                            <p className="text-sm text-muted-foreground">Al-Azhar University</p>
                          </div>
                        </div>

                        <div className="flex items-start">
                          <Users className="h-5 w-5 mr-2 text-primary mt-0.5" />
                          <div>
                            <h4 className="font-medium">Legacy</h4>
                            <p className="text-sm text-muted-foreground">Educational programs</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </div>
                </div>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="presidents" className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-semibold mb-4">Past Presidents</h2>
              <p className="text-muted-foreground">
                Leaders who guided our organization through different eras of growth and development.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i} className="overflow-hidden">
                  <div className="relative h-48">
                    <Image
                      src={`/placeholder.svg?height=300&width=500`}
                      alt={`Past President ${i}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <CardHeader>
                    <CardTitle>Dr. Yusuf Mohammed</CardTitle>
                    <CardDescription>President (1995-2002)</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4">
                      Led the foundation through a period of significant expansion, establishing new educational
                      programs and community services.
                    </p>

                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1 text-primary" />
                        <span>1995-2002</span>
                      </div>

                      <div className="flex items-center">
                        <Award className="h-4 w-4 mr-1 text-primary" />
                        <span>10 New Branches</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="bg-muted p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Presidential Timeline</h3>
              <div className="space-y-4">
                <div className="flex">
                  <div className="w-24 font-medium">1980-1995</div>
                  <div>Sheikh Abdullah Ibrahim (Founding Chairman)</div>
                </div>
                <div className="flex">
                  <div className="w-24 font-medium">1995-2002</div>
                  <div>Dr. Yusuf Mohammed</div>
                </div>
                <div className="flex">
                  <div className="w-24 font-medium">2002-2010</div>
                  <div>Alhaji Ibrahim Suleiman</div>
                </div>
                <div className="flex">
                  <div className="w-24 font-medium">2010-2018</div>
                  <div>Professor Abubakar Mahmud</div>
                </div>
                <div className="flex">
                  <div className="w-24 font-medium">2018-Present</div>
                  <div>Dr. Abdulrahman Yusuf (Current President)</div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="scholars" className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-semibold mb-4">Scholarly Advisors</h2>
              <p className="text-muted-foreground">
                Eminent scholars who provided religious guidance and shaped our educational approach.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i}>
                  <div className="relative h-48">
                    <Image
                      src={`/placeholder.svg?height=250&width=250`}
                      alt={`Scholar ${i}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Sheikh Ahmad Tijani</CardTitle>
                    <CardDescription>Scholarly Advisor (1985-2005)</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">
                      Specialized in Fiqh and Hadith studies, providing guidance on educational curriculum and religious
                      programs.
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Scholarly Contributions</CardTitle>
                <CardDescription>
                  Key contributions of our scholarly advisors to the foundation's development
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  <li className="flex">
                    <BookOpen className="h-5 w-5 mr-3 text-primary mt-0.5" />
                    <div>
                      <h4 className="font-medium">Educational Curriculum Development</h4>
                      <p className="text-sm text-muted-foreground">
                        Our scholars developed comprehensive Islamic studies curricula for different age groups and
                        knowledge levels.
                      </p>
                    </div>
                  </li>

                  <li className="flex">
                    <BookOpen className="h-5 w-5 mr-3 text-primary mt-0.5" />
                    <div>
                      <h4 className="font-medium">Religious Guidance</h4>
                      <p className="text-sm text-muted-foreground">
                        Provided authoritative religious opinions on contemporary issues facing the Muslim community.
                      </p>
                    </div>
                  </li>

                  <li className="flex">
                    <BookOpen className="h-5 w-5 mr-3 text-primary mt-0.5" />
                    <div>
                      <h4 className="font-medium">Publications</h4>
                      <p className="text-sm text-muted-foreground">
                        Authored numerous books, articles, and educational materials that continue to benefit the
                        community.
                      </p>
                    </div>
                  </li>

                  <li className="flex">
                    <BookOpen className="h-5 w-5 mr-3 text-primary mt-0.5" />
                    <div>
                      <h4 className="font-medium">Training Programs</h4>
                      <p className="text-sm text-muted-foreground">
                        Established training programs for imams, teachers, and community leaders.
                      </p>
                    </div>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="text-center mt-12">
          <h2 className="text-2xl font-bold mb-4">Their Legacy Lives On</h2>
          <p className="mb-8 text-muted-foreground">
            The vision, dedication, and wisdom of our past leaders continue to inspire and guide our work today.
          </p>
          <div className="flex justify-center gap-4">
            <a
              href="/about/history"
              className="bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-3 rounded-md font-medium"
            >
              Explore Our History
            </a>
            <a
              href="/about/executives"
              className="bg-secondary text-secondary-foreground hover:bg-secondary/90 px-6 py-3 rounded-md font-medium"
            >
              Current Leadership
            </a>
          </div>
        </div>
      </div>
    </main>
  )
}
