"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Calendar, FileText, User, MapPin } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface SearchResultsProps {
  query: string
}

export function SearchResults({ query }: SearchResultsProps) {
  const [searchQuery, setSearchQuery] = useState(query)
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState<any>({
    all: [],
    events: [],
    pages: [],
    members: [],
    resources: [],
  })

  useEffect(() => {
    if (query) {
      performSearch(query)
    }
  }, [query])

  const performSearch = (searchTerm: string) => {
    if (!searchTerm || searchTerm.length < 2) {
      setResults({
        all: [],
        events: [],
        pages: [],
        members: [],
        resources: [],
      })
      return
    }

    setIsLoading(true)

    // Simulate API call for search results
    setTimeout(() => {
      const mockResults = [
        // Events
        {
          id: "event-1",
          title: "Annual Islamic Conference 2023",
          category: "events",
          url: "/events/annual-conference-2023",
          date: "October 15-17, 2023",
          location: "Hamduk Islamic Center, Lagos",
          image: "/placeholder.svg?height=200&width=300",
          description:
            "Join us for our annual conference featuring renowned scholars discussing contemporary Islamic issues.",
        },
        {
          id: "event-2",
          title: "Ramadan Tafsir Series",
          category: "events",
          url: "/events/ramadan-tafsir-2023",
          date: "March 23 - April 21, 2023",
          location: "Various Locations",
          image: "/placeholder.svg?height=200&width=300",
          description: "Daily Quranic exegesis during Ramadan, covering the entire Quran with detailed explanations.",
        },
        // Pages
        {
          id: "page-1",
          title: "About Us - History & Philosophy",
          category: "pages",
          url: "/about/history",
          image: "/placeholder.svg?height=200&width=300",
          description: "Learn about the history and philosophical foundations of Hamduk Islamic Foundation.",
        },
        {
          id: "page-2",
          title: "Our Vision & Mission",
          category: "pages",
          url: "/about/vision",
          image: "/placeholder.svg?height=200&width=300",
          description: "Discover our vision for the Muslim community and our mission to achieve positive change.",
        },
        // Members
        {
          id: "member-1",
          title: "Dr. Abdulrahman Yusuf",
          category: "members",
          url: "/members/abdulrahman-yusuf",
          role: "President",
          image: "/placeholder.svg?height=200&width=200",
          description: "Leading the foundation since 2018 with a focus on education and community development.",
        },
        {
          id: "member-2",
          title: "Hajiya Fatima Usman",
          category: "members",
          url: "/members/fatima-usman",
          role: "Director of Women's Affairs",
          image: "/placeholder.svg?height=200&width=200",
          description: "Coordinating programs and initiatives focused on women's education and empowerment.",
        },
        // Resources
        {
          id: "resource-1",
          title: "Understanding Islamic Finance",
          category: "resources",
          url: "/resources/islamic-finance",
          type: "PDF Guide",
          image: "/placeholder.svg?height=200&width=300",
          description: "A comprehensive guide to Islamic finance principles and practices.",
        },
        {
          id: "resource-2",
          title: "Guide to Ramadan",
          category: "resources",
          url: "/resources/ramadan-guide",
          type: "E-Book",
          image: "/placeholder.svg?height=200&width=300",
          description: "Everything you need to know about the blessed month of Ramadan.",
        },
      ].filter(
        (item) =>
          item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.description.toLowerCase().includes(searchTerm.toLowerCase()),
      )

      const events = mockResults.filter((item) => item.category === "events")
      const pages = mockResults.filter((item) => item.category === "pages")
      const members = mockResults.filter((item) => item.category === "members")
      const resources = mockResults.filter((item) => item.category === "resources")

      setResults({
        all: mockResults,
        events,
        pages,
        members,
        resources,
      })
      setIsLoading(false)
    }, 500)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    performSearch(searchQuery)
  }

  return (
    <div className="max-w-5xl mx-auto">
      <form onSubmit={handleSearch} className="mb-8">
        <div className="flex gap-2">
          <Input
            type="search"
            placeholder="Search..."
            className="max-w-lg"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button type="submit">Search</Button>
        </div>
      </form>

      {isLoading ? (
        <div className="text-center py-12">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
          <p className="mt-4 text-lg">Searching...</p>
        </div>
      ) : results.all.length > 0 ? (
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="all">All Results ({results.all.length})</TabsTrigger>
            <TabsTrigger value="events">Events ({results.events.length})</TabsTrigger>
            <TabsTrigger value="pages">Pages ({results.pages.length})</TabsTrigger>
            <TabsTrigger value="members">Members ({results.members.length})</TabsTrigger>
            <TabsTrigger value="resources">Resources ({results.resources.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6">
            <div className="space-y-6">
              {results.all.map((result: any) => (
                <SearchResultCard key={result.id} result={result} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="events" className="mt-6">
            <div className="space-y-6">
              {results.events.length > 0 ? (
                results.events.map((result: any) => <SearchResultCard key={result.id} result={result} />)
              ) : (
                <p className="text-center py-8 text-muted-foreground">No event results found.</p>
              )}
            </div>
          </TabsContent>

          <TabsContent value="pages" className="mt-6">
            <div className="space-y-6">
              {results.pages.length > 0 ? (
                results.pages.map((result: any) => <SearchResultCard key={result.id} result={result} />)
              ) : (
                <p className="text-center py-8 text-muted-foreground">No page results found.</p>
              )}
            </div>
          </TabsContent>

          <TabsContent value="members" className="mt-6">
            <div className="space-y-6">
              {results.members.length > 0 ? (
                results.members.map((result: any) => <SearchResultCard key={result.id} result={result} />)
              ) : (
                <p className="text-center py-8 text-muted-foreground">No member results found.</p>
              )}
            </div>
          </TabsContent>

          <TabsContent value="resources" className="mt-6">
            <div className="space-y-6">
              {results.resources.length > 0 ? (
                results.resources.map((result: any) => <SearchResultCard key={result.id} result={result} />)
              ) : (
                <p className="text-center py-8 text-muted-foreground">No resource results found.</p>
              )}
            </div>
          </TabsContent>
        </Tabs>
      ) : query ? (
        <div className="text-center py-12">
          <p className="text-lg mb-4">No results found for "{query}"</p>
          <p className="text-muted-foreground">Try different keywords or check your spelling</p>
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-lg mb-4">Enter a search term to find content</p>
          <p className="text-muted-foreground">You can search for events, pages, members, and resources</p>
        </div>
      )}
    </div>
  )
}

function SearchResultCard({ result }: { result: any }) {
  return (
    <Card className="overflow-hidden">
      <div className="md:flex">
        <div className="md:w-1/4 relative h-48 md:h-auto">
          <Image src={result.image || "/placeholder.svg"} alt={result.title} fill className="object-cover" />
        </div>
        <div className="md:w-3/4">
          <CardHeader>
            <div className="flex items-center gap-2 mb-1">
              <span
                className={`text-xs px-2 py-1 rounded-full ${
                  result.category === "events"
                    ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                    : result.category === "pages"
                      ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300"
                      : result.category === "members"
                        ? "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300"
                        : "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300"
                }`}
              >
                {result.category.charAt(0).toUpperCase() + result.category.slice(1)}
              </span>
            </div>
            <CardTitle className="text-xl">{result.title}</CardTitle>
            <CardDescription>{result.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {result.category === "events" && (
                <>
                  <div className="flex items-center text-sm">
                    <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{result.date}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{result.location}</span>
                  </div>
                </>
              )}

              {result.category === "members" && (
                <div className="flex items-center text-sm">
                  <User className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>{result.role}</span>
                </div>
              )}

              {result.category === "resources" && (
                <div className="flex items-center text-sm">
                  <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>{result.type}</span>
                </div>
              )}

              <div className="pt-2">
                <Link href={result.url} className="text-primary hover:underline font-medium inline-flex items-center">
                  View{" "}
                  {result.category === "members"
                    ? "Profile"
                    : result.category === "events"
                      ? "Event"
                      : result.category === "resources"
                        ? "Resource"
                        : "Page"}
                  <svg
                    className="w-4 h-4 ml-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          </CardContent>
        </div>
      </div>
    </Card>
  )
}
