import Image from "next/image"
import type { Metadata } from "next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Play, Clock, Calendar, User } from "lucide-react"

export const metadata: Metadata = {
  title: "Videos | Hamduk Islamic Foundation",
  description: "Video library of lectures, events, and programs by Hamduk Islamic Foundation",
}

// Sample data for video categories
const videoCategories = {
  lectures: [
    {
      id: 1,
      title: "Understanding the Quran in Contemporary Times",
      speaker: "Sheikh Abdullah Ibrahim",
      date: "March 15, 2023",
      duration: "45 minutes",
      views: "2,345",
      thumbnail: "/placeholder.svg?height=400&width=600",
      description: "An insightful lecture on how to understand and apply Quranic teachings in our modern world.",
    },
    {
      id: 2,
      title: "The Importance of Sunnah in Daily Life",
      speaker: "Dr. Aisha Mohammed",
      date: "February 10, 2023",
      duration: "38 minutes",
      views: "1,987",
      thumbnail: "/placeholder.svg?height=400&width=600",
      description: "Dr. Aisha explains how following the Sunnah can enhance our daily lives and spiritual connection.",
    },
    {
      id: 3,
      title: "Islamic Ethics in Business Transactions",
      speaker: "Prof. Yusuf Oladimeji",
      date: "January 25, 2023",
      duration: "52 minutes",
      views: "3,210",
      thumbnail: "/placeholder.svg?height=400&width=600",
      description: "A comprehensive lecture on ethical principles that should guide Muslims in business and commerce.",
    },
    {
      id: 4,
      title: "Raising Children with Islamic Values",
      speaker: "Hajiya Fatima Usman",
      date: "December 8, 2022",
      duration: "41 minutes",
      views: "4,567",
      thumbnail: "/placeholder.svg?height=400&width=600",
      description: "Practical advice for parents on instilling Islamic values in children in a challenging world.",
    },
  ],
  events: [
    {
      id: 5,
      title: "Annual Islamic Conference 2023 - Opening Ceremony",
      speaker: "Multiple Speakers",
      date: "April 5, 2023",
      duration: "1 hour 20 minutes",
      views: "5,678",
      thumbnail: "/placeholder.svg?height=400&width=600",
      description:
        "Highlights from the opening ceremony of our annual Islamic conference focusing on 'Islam and Modern Challenges'.",
    },
    {
      id: 6,
      title: "Ramadan Tafsir Series - Day 1",
      speaker: "Sheikh Muhammad Saleh",
      date: "March 23, 2023",
      duration: "1 hour 5 minutes",
      views: "3,456",
      thumbnail: "/placeholder.svg?height=400&width=600",
      description: "The first session of our daily Ramadan Tafsir series, covering the first juz of the Quran.",
    },
    {
      id: 7,
      title: "Eid-ul-Fitr Celebration 2022",
      speaker: "Various",
      date: "May 2, 2022",
      duration: "45 minutes",
      views: "7,890",
      thumbnail: "/placeholder.svg?height=400&width=600",
      description: "Highlights from our community Eid-ul-Fitr celebration, including the Eid prayer and festivities.",
    },
    {
      id: 8,
      title: "Youth Islamic Camp - Closing Ceremony",
      speaker: "Youth Leaders",
      date: "August 15, 2022",
      duration: "55 minutes",
      views: "2,345",
      thumbnail: "/placeholder.svg?height=400&width=600",
      description:
        "The closing ceremony of our annual youth Islamic camp, featuring presentations and testimonials from participants.",
    },
  ],
  tutorials: [
    {
      id: 9,
      title: "How to Perform Wudu (Ablution)",
      speaker: "Ustadh Ibrahim Hassan",
      date: "June 10, 2023",
      duration: "12 minutes",
      views: "8,765",
      thumbnail: "/placeholder.svg?height=400&width=600",
      description: "A step-by-step tutorial on how to perform wudu (ablution) correctly according to the Sunnah.",
    },
    {
      id: 10,
      title: "Learning Tajweed: Basic Rules",
      speaker: "Qari Abdul Rahman",
      date: "May 20, 2023",
      duration: "25 minutes",
      views: "6,543",
      thumbnail: "/placeholder.svg?height=400&width=600",
      description: "An introduction to the basic rules of Tajweed for proper Quranic recitation.",
    },
    {
      id: 11,
      title: "How to Pray Salah (Prayer)",
      speaker: "Ustadh Ibrahim Hassan",
      date: "April 15, 2023",
      duration: "30 minutes",
      views: "9,876",
      thumbnail: "/placeholder.svg?height=400&width=600",
      description: "A comprehensive tutorial on how to perform the five daily prayers correctly.",
    },
    {
      id: 12,
      title: "Understanding Zakat Calculation",
      speaker: "Dr. Abubakar Muhammad",
      date: "March 5, 2023",
      duration: "22 minutes",
      views: "4,321",
      thumbnail: "/placeholder.svg?height=400&width=600",
      description: "A practical guide to calculating Zakat on different types of wealth and assets.",
    },
  ],
  interviews: [
    {
      id: 13,
      title: "Interview with Sheikh Abdullah Ibrahim on Islamic Education",
      speaker: "Sheikh Abdullah Ibrahim",
      date: "July 20, 2023",
      duration: "35 minutes",
      views: "3,210",
      thumbnail: "/placeholder.svg?height=400&width=600",
      description: "An in-depth interview discussing the state of Islamic education in Nigeria and ways to improve it.",
    },
    {
      id: 14,
      title: "Conversation with Dr. Aisha Mohammed on Women in Islam",
      speaker: "Dr. Aisha Mohammed",
      date: "June 25, 2023",
      duration: "42 minutes",
      views: "5,432",
      thumbnail: "/placeholder.svg?height=400&width=600",
      description: "Dr. Aisha discusses the role and rights of women in Islam, addressing common misconceptions.",
    },
    {
      id: 15,
      title: "Dialogue with Prof. Yusuf Oladimeji on Islamic Finance",
      speaker: "Prof. Yusuf Oladimeji",
      date: "May 15, 2023",
      duration: "38 minutes",
      views: "2,987",
      thumbnail: "/placeholder.svg?height=400&width=600",
      description:
        "A conversation exploring Islamic finance principles and their application in modern banking and investment.",
    },
    {
      id: 16,
      title: "Interview with Hajiya Fatima Usman on Islamic Parenting",
      speaker: "Hajiya Fatima Usman",
      date: "April 10, 2023",
      duration: "40 minutes",
      views: "4,765",
      thumbnail: "/placeholder.svg?height=400&width=600",
      description:
        "Hajiya Fatima shares insights and advice on raising children according to Islamic principles in today's world.",
    },
  ],
}

export default function VideosPage() {
  return (
    <main className="container mx-auto px-4 py-12">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-emerald-900 dark:text-emerald-500 mb-4">Video Library</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
          Explore our collection of lectures, events, tutorials, and interviews that provide Islamic knowledge and
          inspiration.
        </p>
      </div>

      <div className="relative h-80 w-full rounded-lg overflow-hidden mb-12">
        <Image src="/placeholder.svg?height=600&width=1200" alt="Featured video" fill className="object-cover" />
        <div className="absolute inset-0 bg-emerald-900/50 flex items-center justify-center">
          <div className="text-center text-white p-6">
            <span className="bg-emerald-600 text-white text-xs font-medium px-2.5 py-0.5 rounded-full mb-4 inline-block">
              Featured
            </span>
            <h2 className="text-3xl font-bold mb-2">Annual Islamic Conference 2023 Highlights</h2>
            <p className="text-lg mb-6 max-w-2xl">
              Watch the highlights from our recent annual conference featuring renowned scholars and speakers from
              around the world.
            </p>
            <button className="bg-white text-emerald-900 hover:bg-emerald-100 font-medium py-2 px-6 rounded-full inline-flex items-center">
              <Play className="h-5 w-5 mr-2" />
              Watch Now
            </button>
          </div>
        </div>
      </div>

      <Tabs defaultValue="lectures" className="mb-16">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-8">
          <TabsTrigger value="lectures">Lectures</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="tutorials">Tutorials</TabsTrigger>
          <TabsTrigger value="interviews">Interviews</TabsTrigger>
        </TabsList>

        {Object.entries(videoCategories).map(([category, videos]) => (
          <TabsContent key={category} value={category} className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {videos.map((video) => (
                <Card
                  key={video.id}
                  className="overflow-hidden border-emerald-200 dark:border-emerald-900 flex flex-col h-full"
                >
                  <div className="relative h-48 w-full group">
                    <Image
                      src={video.thumbnail || "/placeholder.svg"}
                      alt={video.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button className="bg-white/90 text-emerald-900 hover:bg-white rounded-full p-3">
                        <Play className="h-6 w-6" />
                      </button>
                    </div>
                    <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                      {video.duration}
                    </div>
                  </div>
                  <CardHeader className="p-4">
                    <CardTitle className="text-lg text-emerald-900 dark:text-emerald-500 line-clamp-2">
                      {video.title}
                    </CardTitle>
                    <CardDescription className="flex items-center text-sm">
                      <User className="h-3 w-3 mr-1" /> {video.speaker}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 pt-0 flex-grow">
                    <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-3 mb-3">{video.description}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mt-auto">
                      <div className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" /> {video.date}
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" /> {video.views} views
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="text-center mt-8">
              <button className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 px-6 rounded-md transition-colors">
                View More {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            </div>
          </TabsContent>
        ))}
      </Tabs>

      <div className="max-w-4xl mx-auto bg-emerald-50 dark:bg-emerald-900/10 p-8 rounded-lg border border-emerald-200 dark:border-emerald-900/50 mb-16">
        <h2 className="text-2xl font-bold text-emerald-900 dark:text-emerald-500 mb-4">Subscribe to Our Channel</h2>
        <p className="text-gray-700 dark:text-gray-300 mb-6">
          Stay updated with our latest videos by subscribing to our YouTube channel. We regularly upload new lectures,
          event highlights, tutorials, and interviews.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-6 rounded-md transition-colors flex items-center justify-center">
            <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
            </svg>
            Subscribe on YouTube
          </button>
          <button className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 px-6 rounded-md transition-colors">
            Join Our Mailing List
          </button>
        </div>
      </div>

      <div className="mb-16">
        <h2 className="text-3xl font-bold text-emerald-900 dark:text-emerald-500 mb-8 text-center">
          Popular Playlists
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="overflow-hidden border-emerald-200 dark:border-emerald-900">
            <div className="relative h-48 w-full">
              <Image
                src="/placeholder.svg?height=400&width=600"
                alt="Ramadan Tafsir Series"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-emerald-900/30 flex items-center justify-center">
                <div className="bg-white/90 dark:bg-gray-900/90 p-4 rounded-lg text-center">
                  <h3 className="font-bold text-emerald-900 dark:text-emerald-500">Ramadan Tafsir Series</h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300">30 Videos</p>
                </div>
              </div>
            </div>
            <CardContent className="p-4">
              <p className="text-gray-700 dark:text-gray-300 text-sm">
                Daily Quranic exegesis during Ramadan, covering the entire Quran with detailed explanations and lessons.
              </p>
              <button className="mt-4 w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 rounded-md transition-colors text-sm">
                View Playlist
              </button>
            </CardContent>
          </Card>

          <Card className="overflow-hidden border-emerald-200 dark:border-emerald-900">
            <div className="relative h-48 w-full">
              <Image
                src="/placeholder.svg?height=400&width=600"
                alt="Islamic Parenting Series"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-emerald-900/30 flex items-center justify-center">
                <div className="bg-white/90 dark:bg-gray-900/90 p-4 rounded-lg text-center">
                  <h3 className="font-bold text-emerald-900 dark:text-emerald-500">Islamic Parenting Series</h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300">12 Videos</p>
                </div>
              </div>
            </div>
            <CardContent className="p-4">
              <p className="text-gray-700 dark:text-gray-300 text-sm">
                Guidance for parents on raising children with Islamic values in the contemporary world.
              </p>
              <button className="mt-4 w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 rounded-md transition-colors text-sm">
                View Playlist
              </button>
            </CardContent>
          </Card>

          <Card className="overflow-hidden border-emerald-200 dark:border-emerald-900">
            <div className="relative h-48 w-full">
              <Image
                src="/placeholder.svg?height=400&width=600"
                alt="Islamic Finance Workshop"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-emerald-900/30 flex items-center justify-center">
                <div className="bg-white/90 dark:bg-gray-900/90 p-4 rounded-lg text-center">
                  <h3 className="font-bold text-emerald-900 dark:text-emerald-500">Islamic Finance Workshop</h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300">8 Videos</p>
                </div>
              </div>
            </div>
            <CardContent className="p-4">
              <p className="text-gray-700 dark:text-gray-300 text-sm">
                Comprehensive workshop on Islamic finance principles, halal investments, and avoiding riba.
              </p>
              <button className="mt-4 w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 rounded-md transition-colors text-sm">
                View Playlist
              </button>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}
