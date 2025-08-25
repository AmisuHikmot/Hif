"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { MapPin, Filter, SearchIcon, User, Users, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { useLanguage } from "@/contexts/language-context"

type MemberCategory = "all" | "executives" | "scholars" | "volunteers"
type SortOption = "name" | "newest" | "oldest"

interface Member {
  id: string
  name: string
  role: string
  category: MemberCategory | string
  image: string
  bio: string
  email?: string
  phone?: string
  location?: string
  joinDate: string
  socialLinks?: {
    twitter?: string
    facebook?: string
    linkedin?: string
  }
}

export function MembersDirectory() {
  const { t } = useLanguage()
  const [searchQuery, setSearchQuery] = useState("")
  const [category, setCategory] = useState<MemberCategory>("all")
  const [sortBy, setSortBy] = useState<SortOption>("name")
  const [members, setMembers] = useState<Member[]>([])
  const [filteredMembers, setFilteredMembers] = useState<Member[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate API call to fetch members
    setTimeout(() => {
      const mockMembers: Member[] = [
        {
          id: "1",
          name: "Dr. Abdulrahman Yusuf",
          role: "President",
          category: "executives",
          image: "/placeholder.svg?height=200&width=200",
          bio: "Leading the foundation since 2018 with a focus on education and community development. Dr. Yusuf has over 20 years of experience in Islamic education.",
          email: "abdulrahman@example.com",
          phone: "+234 123 456 7890",
          location: "Lagos, Nigeria",
          joinDate: "2010-05-15",
          socialLinks: {
            twitter: "https://twitter.com",
            facebook: "https://facebook.com",
            linkedin: "https://linkedin.com",
          },
        },
        {
          id: "2",
          name: "Hajiya Fatima Usman",
          role: "Director of Women's Affairs",
          category: "executives",
          image: "/placeholder.svg?height=200&width=200",
          bio: "Coordinating programs and initiatives focused on women's education and empowerment. Hajiya Fatima has been instrumental in developing women's programs.",
          email: "fatima@example.com",
          phone: "+234 123 456 7891",
          location: "Abuja, Nigeria",
          joinDate: "2012-03-20",
        },
        {
          id: "3",
          name: "Sheikh Ibrahim Khalil",
          role: "Chief Scholar",
          category: "scholars",
          image: "/placeholder.svg?height=200&width=200",
          bio: "A renowned Islamic scholar specializing in Quranic exegesis and Islamic jurisprudence. Sheikh Ibrahim has authored numerous books on Islamic topics.",
          email: "ibrahim@example.com",
          location: "Kano, Nigeria",
          joinDate: "2008-11-10",
        },
        {
          id: "4",
          name: "Mallam Suleiman Abubakar",
          role: "Islamic Education Coordinator",
          category: "scholars",
          image: "/placeholder.svg?height=200&width=200",
          bio: "Overseeing educational programs and curriculum development. Mallam Suleiman has a background in Islamic education and pedagogy.",
          email: "suleiman@example.com",
          phone: "+234 123 456 7892",
          location: "Kaduna, Nigeria",
          joinDate: "2015-07-05",
        },
        {
          id: "5",
          name: "Aisha Mohammed",
          role: "Youth Program Volunteer",
          category: "volunteers",
          image: "/placeholder.svg?height=200&width=200",
          bio: "Dedicated to organizing youth activities and mentorship programs. Aisha is passionate about empowering young Muslims.",
          email: "aisha@example.com",
          location: "Lagos, Nigeria",
          joinDate: "2019-02-15",
        },
        {
          id: "6",
          name: "Yusuf Abdullahi",
          role: "Community Outreach Volunteer",
          category: "volunteers",
          image: "/placeholder.svg?height=200&width=200",
          bio: "Focused on community engagement and humanitarian initiatives. Yusuf has been volunteering with the foundation for over 5 years.",
          email: "yusuf@example.com",
          phone: "+234 123 456 7893",
          location: "Ibadan, Nigeria",
          joinDate: "2018-09-30",
        },
        {
          id: "7",
          name: "Dr. Maryam Hassan",
          role: "Secretary General",
          category: "executives",
          image: "/placeholder.svg?height=200&width=200",
          bio: "Responsible for administrative affairs and organizational management. Dr. Maryam has a background in organizational leadership.",
          email: "maryam@example.com",
          phone: "+234 123 456 7894",
          location: "Lagos, Nigeria",
          joinDate: "2014-04-12",
        },
        {
          id: "8",
          name: "Sheikh Umar Farooq",
          role: "Senior Scholar",
          category: "scholars",
          image: "/placeholder.svg?height=200&width=200",
          bio: "Specializing in Islamic history and comparative religion. Sheikh Umar is known for his engaging lectures and depth of knowledge.",
          email: "umar@example.com",
          location: "Sokoto, Nigeria",
          joinDate: "2011-08-22",
        },
        {
          id: "9",
          name: "Zainab Aliyu",
          role: "Events Coordinator Volunteer",
          category: "volunteers",
          image: "/placeholder.svg?height=200&width=200",
          bio: "Organizing and managing foundation events and programs. Zainab brings creativity and efficiency to event planning.",
          email: "zainab@example.com",
          phone: "+234 123 456 7895",
          location: "Abuja, Nigeria",
          joinDate: "2020-01-10",
        },
      ]

      setMembers(mockMembers)
      setIsLoading(false)
    }, 1000)
  }, [])

  useEffect(() => {
    // Filter and sort members based on current criteria
    let filtered = [...members]

    // Filter by category
    if (category !== "all") {
      filtered = filtered.filter((member) => member.category === category)
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (member) =>
          member.name.toLowerCase().includes(query) ||
          member.role.toLowerCase().includes(query) ||
          member.bio.toLowerCase().includes(query) ||
          (member.location && member.location.toLowerCase().includes(query)),
      )
    }

    // Sort members
    filtered.sort((a, b) => {
      if (sortBy === "name") {
        return a.name.localeCompare(b.name)
      } else if (sortBy === "newest") {
        return new Date(b.joinDate).getTime() - new Date(a.joinDate).getTime()
      } else {
        // oldest
        return new Date(a.joinDate).getTime() - new Date(b.joinDate).getTime()
      }
    })

    setFilteredMembers(filtered)
  }, [members, category, searchQuery, sortBy])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Search is already handled by the useEffect
  }

  return (
    <div>
      <div className="mb-8 flex flex-col sm:flex-row justify-between gap-4">
        <Tabs
          value={category}
          onValueChange={(value) => setCategory(value as MemberCategory)}
          className="w-full sm:w-auto"
        >
          <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full sm:w-auto">
            <TabsTrigger value="all" className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span className="hidden md:inline">All Members</span>
              <span className="md:hidden">All</span>
            </TabsTrigger>
            <TabsTrigger value="executives" className="flex items-center gap-1">
              <User className="h-4 w-4" />
              <span className="hidden md:inline">Executives</span>
              <span className="md:hidden">Exec</span>
            </TabsTrigger>
            <TabsTrigger value="scholars" className="flex items-center gap-1">
              <BookOpen className="h-4 w-4" />
              <span className="hidden md:inline">Scholars</span>
              <span className="md:hidden">Scholars</span>
            </TabsTrigger>
            <TabsTrigger value="volunteers" className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span className="hidden md:inline">Volunteers</span>
              <span className="md:hidden">Vol</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex flex-col sm:flex-row gap-2">
          <form onSubmit={handleSearch} className="relative">
            <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search members..."
              className="w-full pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-1">
                <Filter className="h-4 w-4 mr-1" />
                Sort by: {sortBy === "name" ? "Name" : sortBy === "newest" ? "Newest" : "Oldest"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setSortBy("name")}>Name</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy("newest")}>Newest</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy("oldest")}>Oldest</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
          <p className="mt-4 text-lg">Loading members...</p>
        </div>
      ) : filteredMembers.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredMembers.map((member) => (
            <MemberCard key={member.id} member={member} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-lg mb-4">No members found matching your criteria.</p>
          <p className="text-muted-foreground">Try different filters or search terms.</p>
        </div>
      )}
    </div>
  )
}

function MemberCard({ member }: { member: Member }) {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="mx-auto sm:mx-0">
            <div className="relative h-24 w-24 rounded-full overflow-hidden">
              <Image src={member.image || "/placeholder.svg"} alt={member.name} fill className="object-cover" />
            </div>
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h3 className="text-xl font-bold">{member.name}</h3>
            <p className="text-muted-foreground mb-2">{member.role}</p>

            <div className="mb-3">
              <Badge
                variant="outline"
                className={
                  member.category === "executives"
                    ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-800"
                    : member.category === "scholars"
                      ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800"
                      : "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300 border-purple-200 dark:border-purple-800"
                }
              >
                {member.category.charAt(0).toUpperCase() + member.category.slice(1)}
              </Badge>
            </div>

            <p className="text-sm line-clamp-2 mb-3">{member.bio}</p>

            {member.location && (
              <div className="flex items-center justify-center sm:justify-start text-sm text-muted-foreground mb-1">
                <MapPin className="h-3.5 w-3.5 mr-1" />
                <span>{member.location}</span>
              </div>
            )}

            <div className="mt-3">
              <Link href={`/members/${member.id}`}>
                <Button variant="link" className="p-0 h-auto">
                  View Profile
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
