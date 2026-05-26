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

export function MembersDirectory({ initialMembers = [] }: { initialMembers?: Member[] }) {
  const [searchQuery, setSearchQuery] = useState("")
  const [category, setCategory] = useState<MemberCategory>("all")
  const [sortBy, setSortBy] = useState<SortOption>("name")
  const [members] = useState<Member[]>(initialMembers)
  const [filteredMembers, setFilteredMembers] = useState<Member[]>([])

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

      {filteredMembers.length > 0 ? (
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
