import Image from "next/image"
import type { Metadata } from "next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle, AlertCircle, FileText, Users, Globe } from "lucide-react"

export const metadata: Metadata = {
  title: "Advocacy | Hamduk Islamic Foundation",
  description: "Advocacy initiatives and campaigns by Hamduk Islamic Foundation",
}

// Sample data for advocacy areas
const advocacyAreas = [
  {
    id: 1,
    title: "Religious Freedom",
    description:
      "Advocating for the rights of Muslims to practice their faith freely without discrimination or hindrance.",
    image: "/placeholder.svg?height=400&width=600",
    achievements: [
      "Successfully advocated for the right of Muslim students to wear hijab in public schools",
      "Campaigned for equal recognition of Islamic holidays in the national calendar",
      "Provided legal support to Muslims facing religious discrimination",
    ],
    ongoing: [
      "Monitoring and addressing cases of religious discrimination",
      "Advocating for accommodation of Muslim prayer times in workplaces and schools",
      "Promoting understanding of Islamic religious practices among policy makers",
    ],
  },
  {
    id: 2,
    title: "Islamic Education",
    description: "Promoting the integration of quality Islamic education within the national education system.",
    image: "/placeholder.svg?height=400&width=600",
    achievements: [
      "Contributed to the development of standardized Islamic Studies curriculum for schools",
      "Advocated for the recognition of qualifications from Islamic educational institutions",
      "Established partnerships with educational authorities to improve Islamic education standards",
    ],
    ongoing: [
      "Campaigning for increased funding for Islamic education in public schools",
      "Advocating for teacher training programs specialized in Islamic education",
      "Working towards the integration of modern teaching methodologies in Islamic education",
    ],
  },
  {
    id: 3,
    title: "Social Justice",
    description:
      "Advocating for social justice issues affecting Muslims and the broader society from an Islamic perspective.",
    image: "/placeholder.svg?height=400&width=600",
    achievements: [
      "Led campaigns against economic exploitation and corruption",
      "Advocated for policies addressing poverty and inequality",
      "Promoted ethical business practices based on Islamic principles",
    ],
    ongoing: [
      "Advocating for fair treatment of Muslim minorities in various regions",
      "Campaigning against discriminatory policies and practices",
      "Promoting awareness about social justice in Islamic teachings",
    ],
  },
  {
    id: 4,
    title: "Media Representation",
    description:
      "Working to ensure fair and accurate representation of Islam and Muslims in media and public discourse.",
    image: "/placeholder.svg?height=400&width=600",
    achievements: [
      "Established a media monitoring team to identify and address misrepresentations",
      "Conducted media literacy workshops for journalists on Islamic topics",
      "Developed relationships with media outlets to provide accurate information about Islam",
    ],
    ongoing: [
      "Responding to inaccurate or biased portrayals of Islam in media",
      "Training Muslim spokespersons for effective media engagement",
      "Producing content that presents authentic Islamic perspectives on current issues",
    ],
  },
]

// Sample data for policy papers
const policyPapers = [
  {
    id: 1,
    title: "Islamic Education in Nigeria: Challenges and Opportunities",
    date: "March 2023",
    summary:
      "This policy paper examines the current state of Islamic education in Nigeria, identifying key challenges and proposing recommendations for improvement.",
  },
  {
    id: 2,
    title: "Protecting Religious Freedom: A Framework for Policy Makers",
    date: "November 2022",
    summary:
      "A comprehensive analysis of religious freedom issues affecting Muslims in Nigeria with policy recommendations for government and institutions.",
  },
  {
    id: 3,
    title: "Media Guidelines: Reporting on Islam and Muslims",
    date: "July 2022",
    summary:
      "Guidelines developed for media professionals to ensure accurate, fair, and sensitive reporting on issues related to Islam and Muslims.",
  },
  {
    id: 4,
    title: "Economic Justice from an Islamic Perspective",
    date: "February 2022",
    summary:
      "An exploration of Islamic principles related to economic justice and their application in addressing contemporary economic challenges.",
  },
]

export default function AdvocacyPage() {
  return (
    <main className="container mx-auto px-4 py-12">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-emerald-900 dark:text-emerald-500 mb-4">Advocacy</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
          Standing up for the rights and interests of Muslims and promoting positive change through advocacy, education,
          and engagement.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
        <div className="lg:col-span-2">
          <div className="relative h-80 w-full rounded-lg overflow-hidden mb-6">
            <Image src="/placeholder.svg?height=600&width=1200" alt="Advocacy campaign" fill className="object-cover" />
            <div className="absolute inset-0 bg-emerald-900/30 flex items-center justify-center">
              <div className="bg-white/90 dark:bg-gray-900/90 p-6 rounded-lg max-w-md text-center">
                <h2 className="text-2xl font-bold text-emerald-900 dark:text-emerald-500 mb-2">
                  Our Advocacy Approach
                </h2>
                <p className="text-gray-700 dark:text-gray-300">
                  We combine research, education, coalition-building, and strategic engagement to advocate for positive
                  change.
                </p>
              </div>
            </div>
          </div>
          <div className="prose dark:prose-invert max-w-none">
            <h2 className="text-2xl font-bold text-emerald-900 dark:text-emerald-500 mb-4">Advocacy Philosophy</h2>
            <p>
              The advocacy work of Hamduk Islamic Foundation is guided by the Islamic principles of justice, compassion,
              and the promotion of the common good. We believe in:
            </p>
            <ul>
              <li>
                <strong>Evidence-based advocacy:</strong> Our positions and recommendations are based on thorough
                research and analysis.
              </li>
              <li>
                <strong>Constructive engagement:</strong> We seek to work collaboratively with stakeholders, including
                government, civil society, and other religious communities.
              </li>
              <li>
                <strong>Balanced approach:</strong> We address issues with wisdom, considering both Islamic principles
                and the realities of our diverse society.
              </li>
              <li>
                <strong>Empowerment:</strong> We aim to empower Muslims to understand their rights and responsibilities
                and to participate actively in civic life.
              </li>
              <li>
                <strong>Bridge-building:</strong> We work to build bridges of understanding between Muslims and other
                communities to promote social harmony.
              </li>
            </ul>
            <p>
              Our advocacy initiatives are developed through consultation with Islamic scholars, subject matter experts,
              and community representatives to ensure they reflect both authentic Islamic teachings and the needs of the
              community.
            </p>
          </div>
        </div>

        <div>
          <Card className="border-emerald-200 dark:border-emerald-900">
            <CardHeader className="bg-emerald-50 dark:bg-emerald-900/20">
              <CardTitle className="text-xl text-emerald-900 dark:text-emerald-500">Policy Papers</CardTitle>
              <CardDescription>Research-based recommendations for policy makers</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-6">
                {policyPapers.map((paper) => (
                  <div
                    key={paper.id}
                    className="border-b border-gray-200 dark:border-gray-800 pb-4 last:border-0 last:pb-0"
                  >
                    <h3 className="font-semibold text-lg mb-1 text-emerald-800 dark:text-emerald-400">{paper.title}</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">{paper.date}</p>
                    <p className="text-sm text-gray-700 dark:text-gray-300">{paper.summary}</p>
                    <button className="mt-2 text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 text-sm font-medium flex items-center">
                      <FileText className="h-4 w-4 mr-1" /> Read full paper
                    </button>
                  </div>
                ))}
              </div>
              <div className="mt-6">
                <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 px-4 rounded-md transition-colors">
                  View All Publications
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <h2 className="text-3xl font-bold text-emerald-900 dark:text-emerald-500 mb-8 text-center">Key Advocacy Areas</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        {advocacyAreas.map((area) => (
          <Card key={area.id} className="overflow-hidden border-emerald-200 dark:border-emerald-900">
            <div className="relative h-48 w-full">
              <Image src={area.image || "/placeholder.svg"} alt={area.title} fill className="object-cover" />
            </div>
            <CardHeader className="bg-emerald-50 dark:bg-emerald-900/20">
              <CardTitle className="text-xl text-emerald-900 dark:text-emerald-500">{area.title}</CardTitle>
              <CardDescription>{area.description}</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <Tabs defaultValue="achievements">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="achievements">Achievements</TabsTrigger>
                  <TabsTrigger value="ongoing">Ongoing Work</TabsTrigger>
                </TabsList>
                <TabsContent value="achievements" className="mt-4">
                  <ul className="space-y-2">
                    {area.achievements.map((achievement, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 dark:text-gray-300">{achievement}</span>
                      </li>
                    ))}
                  </ul>
                </TabsContent>
                <TabsContent value="ongoing" className="mt-4">
                  <ul className="space-y-2">
                    {area.ongoing.map((item, index) => (
                      <li key={index} className="flex items-start">
                        <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-400 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 dark:text-gray-300">{item}</span>
                      </li>
                    ))}
                  </ul>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="max-w-4xl mx-auto bg-emerald-50 dark:bg-emerald-900/10 p-8 rounded-lg border border-emerald-200 dark:border-emerald-900/50">
        <h2 className="text-2xl font-bold text-emerald-900 dark:text-emerald-500 mb-4">
          Get Involved in Our Advocacy Work
        </h2>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          There are many ways you can support and participate in our advocacy initiatives:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="flex items-start">
            <Users className="h-6 w-6 text-emerald-700 dark:text-emerald-500 mr-3 mt-0.5" />
            <div>
              <h3 className="font-semibold text-lg mb-1">Join Our Advocacy Network</h3>
              <p className="text-gray-700 dark:text-gray-300">
                Become part of our network of advocates who can be mobilized for campaigns and initiatives.
              </p>
            </div>
          </div>
          <div className="flex items-start">
            <Globe className="h-6 w-6 text-emerald-700 dark:text-emerald-500 mr-3 mt-0.5" />
            <div>
              <h3 className="font-semibold text-lg mb-1">Spread Awareness</h3>
              <p className="text-gray-700 dark:text-gray-300">
                Share our advocacy materials and campaigns with your networks and communities.
              </p>
            </div>
          </div>
        </div>
        <button className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 px-6 rounded-md transition-colors">
          Contact Our Advocacy Team
        </button>
      </div>
    </main>
  )
}
