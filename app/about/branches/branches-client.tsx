"use client"

import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { MapPin, Phone, Mail, User, Clock, Search } from "lucide-react"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"

const regions = ["All Regions", "North West", "North East", "North Central", "South West", "South East", "South South"]
const states = ["All States", "Lagos", "Kano", "FCT", "Rivers", "Kaduna", "Ogun", "Oyo", "Plateau", "Borno", "Adamawa"]

export default function BranchesClientPage() {
  const [branches, setBranches] = useState<any[]>([])
  const [filteredBranches, setFilteredBranches] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRegion, setSelectedRegion] = useState("")
  const [selectedState, setSelectedState] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const supabase = createClient()
        const { data, error } = await supabase.from("branches").select("*").eq("is_active", true).order("name")

        if (error) throw error
        setBranches(data || [])
        setFilteredBranches(data || [])
      } catch (error) {
        console.error("Error fetching branches:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchBranches()
  }, [])

  useEffect(() => {
    let filtered = branches

    if (searchTerm) {
      filtered = filtered.filter(
        (branch) =>
          branch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          branch.address.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (selectedRegion && selectedRegion !== "all-regions") {
      filtered = filtered.filter((branch) => branch.region.toLowerCase().includes(selectedRegion.replace("-", " ")))
    }

    if (selectedState && selectedState !== "all-states") {
      filtered = filtered.filter((branch) => branch.state.toLowerCase().includes(selectedState.replace("-", " ")))
    }

    setFilteredBranches(filtered)
  }, [searchTerm, selectedRegion, selectedState, branches])

  if (isLoading) {
    return (
      <main className="container mx-auto px-4 py-12">
        <div className="text-center">Loading branches...</div>
      </main>
    )
  }

  return (
    <main className="container mx-auto px-4 py-12">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-emerald-900 dark:text-emerald-500 mb-4">Our Branches</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
          Find a Hamduk Islamic Foundation branch near you. Connect with your local Islamic community and participate in
          our programs and activities.
        </p>
      </div>

      {/* Search and Filter Section */}
      <div className="mb-8 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-emerald-200 dark:border-emerald-900">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search branches..."
              className="pl-10 border-emerald-200 dark:border-emerald-900 focus:border-emerald-500"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select>
            <SelectTrigger className="border-emerald-200 dark:border-emerald-900 focus:border-emerald-500">
              <SelectValue placeholder="Select Region" />
            </SelectTrigger>
            <SelectContent>
              {regions.map((region) => (
                <SelectItem
                  key={region}
                  value={region.toLowerCase().replace(/\s+/g, "-")}
                  onClick={() => setSelectedRegion(region.toLowerCase().replace(/\s+/g, "-"))}
                >
                  {region}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger className="border-emerald-200 dark:border-emerald-900 focus:border-emerald-500">
              <SelectValue placeholder="Select State" />
            </SelectTrigger>
            <SelectContent>
              {states.map((state) => (
                <SelectItem
                  key={state}
                  value={state.toLowerCase().replace(/\s+/g, "-")}
                  onClick={() => setSelectedState(state.toLowerCase().replace(/\s+/g, "-"))}
                >
                  {state}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">Search Branches</Button>
        </div>
      </div>

      {/* Branches Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
        {filteredBranches.map((branch) => (
          <Card
            key={branch.id}
            className="overflow-hidden border-emerald-200 dark:border-emerald-900 hover:shadow-lg transition-shadow"
          >
            <div className="relative h-48 w-full">
              <Image src={branch.image || "/placeholder.svg"} alt={branch.name} fill className="object-cover" />
              <div className="absolute top-4 right-4 bg-emerald-600 text-white text-xs font-medium px-2 py-1 rounded-full">
                Est. {branch.established}
              </div>
            </div>
            <CardHeader className="p-4">
              <CardTitle className="text-xl text-emerald-900 dark:text-emerald-500">{branch.name}</CardTitle>
              <CardDescription className="text-sm text-gray-600 dark:text-gray-400">
                {branch.region} • {branch.state} State
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-0 space-y-3">
              <div className="flex items-start space-x-2">
                <MapPin className="h-4 w-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-gray-700 dark:text-gray-300">{branch.address}</p>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                <p className="text-sm text-gray-700 dark:text-gray-300">{branch.phone}</p>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                <p className="text-sm text-gray-700 dark:text-gray-300">{branch.email}</p>
              </div>
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                <p className="text-sm text-gray-700 dark:text-gray-300">{branch.coordinator_name}</p>
              </div>
              <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">{branch.member_count} active members</p>
                <div className="flex space-x-2">
                  <Button size="sm" className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs">
                    Visit Branch
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 border-emerald-600 text-emerald-600 hover:bg-emerald-50 text-xs bg-transparent"
                  >
                    Get Directions
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Operating Hours Section */}
      <div className="mb-16 bg-emerald-50 dark:bg-emerald-900/10 p-8 rounded-lg border border-emerald-200 dark:border-emerald-900/50">
        <h2 className="text-2xl font-bold text-emerald-900 dark:text-emerald-500 mb-6 text-center">
          Branch Operating Hours
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-emerald-800 dark:text-emerald-400 mb-4 flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              Regular Hours
            </h3>
            <div className="space-y-2 text-gray-700 dark:text-gray-300">
              <div className="flex justify-between">
                <span>Monday - Thursday:</span>
                <span>9:00 AM - 6:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span>Friday:</span>
                <span>9:00 AM - 2:00 PM, 3:00 PM - 6:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span>Saturday:</span>
                <span>10:00 AM - 4:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span>Sunday:</span>
                <span>2:00 PM - 6:00 PM</span>
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-emerald-800 dark:text-emerald-400 mb-4 flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              Special Events
            </h3>
            <div className="space-y-2 text-gray-700 dark:text-gray-300">
              <div className="flex justify-between">
                <span>Jumu'ah Prayer:</span>
                <span>1:00 PM - 2:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span>Evening Programs:</span>
                <span>7:00 PM - 9:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span>Weekend Classes:</span>
                <span>Saturday 2:00 PM - 5:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span>Ramadan Programs:</span>
                <span>Extended hours during Ramadan</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="text-center bg-white dark:bg-gray-800 p-8 rounded-lg shadow-sm border border-emerald-200 dark:border-emerald-900">
        <h2 className="text-2xl font-bold text-emerald-900 dark:text-emerald-500 mb-4">Don't See a Branch Near You?</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-2xl mx-auto">
          We're always looking to expand our reach and serve more communities. If you're interested in starting a new
          branch in your area, we'd love to hear from you.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">Start a New Branch</Button>
          <Button variant="outline" className="border-emerald-600 text-emerald-600 hover:bg-emerald-50 bg-transparent">
            Contact Us
          </Button>
        </div>
      </div>
    </main>
  )
}
