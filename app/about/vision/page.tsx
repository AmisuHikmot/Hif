import type { Metadata } from "next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle2, Target, Compass, Award, Heart } from "lucide-react"

export const metadata: Metadata = {
  title: "Our Vision & Mission | Hamduk Islamic Foundation",
  description: "Learn about the vision, mission, values, and goals of Hamduk Islamic Foundation.",
}

export default function VisionPage() {
  return (
    <main className="container mx-auto py-12 px-4 md:px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">Our Vision & Mission</h1>

        <div className="mb-12 text-center">
          <p className="text-lg text-muted-foreground mb-6">
            Guiding principles that drive our organization forward in service to the Muslim community.
          </p>
        </div>

        <Tabs defaultValue="vision" className="mb-12">
          <TabsList className="grid grid-cols-4 mb-8">
            <TabsTrigger value="vision">Vision</TabsTrigger>
            <TabsTrigger value="mission">Mission</TabsTrigger>
            <TabsTrigger value="values">Values</TabsTrigger>
            <TabsTrigger value="goals">Goals</TabsTrigger>
          </TabsList>

          <TabsContent value="vision" className="space-y-6">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center mb-2">
                  <Target className="h-8 w-8 text-primary mr-2" />
                  <CardTitle className="text-2xl">Our Vision</CardTitle>
                </div>
                <CardDescription>What we aspire to achieve</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-lg mb-4">
                  To be the leading Islamic organization fostering a vibrant Muslim community that embodies Islamic
                  values and contributes positively to Nigerian society.
                </p>
                <div className="bg-muted p-6 rounded-lg">
                  <h3 className="text-xl font-semibold mb-4">Vision Statement</h3>
                  <p className="italic">
                    "A united Muslim community, enlightened by authentic Islamic knowledge, empowered to thrive in
                    contemporary society while upholding Islamic principles."
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-6 mt-8">
              <div className="bg-primary/5 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <CheckCircle2 className="h-5 w-5 mr-2 text-primary" />
                  Long-term Vision
                </h3>
                <p>
                  By 2030, we aim to establish a nationwide network of Islamic centers that serve as beacons of
                  knowledge, community service, and spiritual growth.
                </p>
              </div>

              <div className="bg-primary/5 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <CheckCircle2 className="h-5 w-5 mr-2 text-primary" />
                  Community Impact
                </h3>
                <p>
                  We envision a society where Muslims are respected contributors, where Islamic values inform positive
                  social change, and where interfaith harmony flourishes.
                </p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="mission" className="space-y-6">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center mb-2">
                  <Compass className="h-8 w-8 text-primary mr-2" />
                  <CardTitle className="text-2xl">Our Mission</CardTitle>
                </div>
                <CardDescription>How we work to achieve our vision</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-lg mb-4">
                  To provide authentic Islamic education, foster community development, advocate for Muslim rights, and
                  promote the positive contribution of Muslims to Nigerian society.
                </p>
                <div className="bg-muted p-6 rounded-lg">
                  <h3 className="text-xl font-semibold mb-4">Mission Statement</h3>
                  <p className="italic">
                    "We are dedicated to nurturing a community of knowledgeable, confident Muslims who embody Islamic
                    values and contribute meaningfully to society through education, advocacy, and service."
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-6 mt-8">
              <div className="bg-primary/5 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <CheckCircle2 className="h-5 w-5 mr-2 text-primary" />
                  Educational Mission
                </h3>
                <p>
                  To provide accessible, authentic Islamic education that equips Muslims with knowledge of their faith
                  and its application in contemporary contexts.
                </p>
              </div>

              <div className="bg-primary/5 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-4 flex items-center">
                  <CheckCircle2 className="h-5 w-5 mr-2 text-primary" />
                  Community Mission
                </h3>
                <p>
                  To build strong, supportive Muslim communities through programs that address spiritual, social, and
                  material needs.
                </p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="values" className="space-y-6">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center mb-2">
                  <Heart className="h-8 w-8 text-primary mr-2" />
                  <CardTitle className="text-2xl">Our Core Values</CardTitle>
                </div>
                <CardDescription>Principles that guide our actions</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-lg mb-6">
                  Our values are rooted in Islamic teachings and guide everything we do as an organization.
                </p>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="border p-4 rounded-lg">
                    <h3 className="font-semibold text-lg mb-2">Authenticity</h3>
                    <p>Commitment to authentic Islamic teachings based on the Quran and Sunnah.</p>
                  </div>

                  <div className="border p-4 rounded-lg">
                    <h3 className="font-semibold text-lg mb-2">Excellence (Ihsan)</h3>
                    <p>Striving for excellence in all our programs, services, and interactions.</p>
                  </div>

                  <div className="border p-4 rounded-lg">
                    <h3 className="font-semibold text-lg mb-2">Inclusivity</h3>
                    <p>Welcoming all Muslims regardless of background, ethnicity, or school of thought.</p>
                  </div>

                  <div className="border p-4 rounded-lg">
                    <h3 className="font-semibold text-lg mb-2">Compassion</h3>
                    <p>Showing mercy and kindness in our service to the community.</p>
                  </div>

                  <div className="border p-4 rounded-lg">
                    <h3 className="font-semibold text-lg mb-2">Integrity</h3>
                    <p>Maintaining honesty, transparency, and ethical conduct in all affairs.</p>
                  </div>

                  <div className="border p-4 rounded-lg">
                    <h3 className="font-semibold text-lg mb-2">Innovation</h3>
                    <p>Embracing creative approaches while remaining true to Islamic principles.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="goals" className="space-y-6">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center mb-2">
                  <Award className="h-8 w-8 text-primary mr-2" />
                  <CardTitle className="text-2xl">Strategic Goals</CardTitle>
                </div>
                <CardDescription>Our objectives for the next five years</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-lg mb-6">
                  These strategic goals guide our planning and resource allocation to fulfill our mission.
                </p>

                <div className="space-y-6">
                  <div className="border-l-4 border-primary pl-4 py-2">
                    <h3 className="font-semibold text-lg mb-1">Educational Excellence</h3>
                    <p>
                      Develop and implement comprehensive Islamic education programs for all age groups and knowledge
                      levels.
                    </p>
                  </div>

                  <div className="border-l-4 border-primary pl-4 py-2">
                    <h3 className="font-semibold text-lg mb-1">Community Development</h3>
                    <p>
                      Establish support services that address the social, economic, and spiritual needs of the Muslim
                      community.
                    </p>
                  </div>

                  <div className="border-l-4 border-primary pl-4 py-2">
                    <h3 className="font-semibold text-lg mb-1">Youth Empowerment</h3>
                    <p>
                      Create programs that nurture the next generation of Muslim leaders, scholars, and professionals.
                    </p>
                  </div>

                  <div className="border-l-4 border-primary pl-4 py-2">
                    <h3 className="font-semibold text-lg mb-1">Advocacy & Representation</h3>
                    <p>
                      Advocate for the rights and interests of Muslims in Nigeria and promote positive representation in
                      media and public discourse.
                    </p>
                  </div>

                  <div className="border-l-4 border-primary pl-4 py-2">
                    <h3 className="font-semibold text-lg mb-1">Organizational Growth</h3>
                    <p>
                      Expand our reach and impact through new branches, partnerships, and enhanced operational capacity.
                    </p>
                  </div>

                  <div className="border-l-4 border-primary pl-4 py-2">
                    <h3 className="font-semibold text-lg mb-1">Interfaith Dialogue</h3>
                    <p>Foster understanding and cooperation with other faith communities to promote social harmony.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="bg-muted p-8 rounded-lg text-center">
          <h2 className="text-2xl font-bold mb-4">Join Us in Our Mission</h2>
          <p className="mb-6">
            Together, we can build a stronger Muslim community and contribute positively to Nigerian society.
          </p>
          <div className="flex justify-center gap-4">
            <a
              href="/membership/how-to-join"
              className="bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-3 rounded-md font-medium"
            >
              Become a Member
            </a>
            <a
              href="/donate"
              className="bg-secondary text-secondary-foreground hover:bg-secondary/90 px-6 py-3 rounded-md font-medium"
            >
              Support Our Work
            </a>
          </div>
        </div>
      </div>
    </main>
  )
}
