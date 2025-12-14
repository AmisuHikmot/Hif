"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Loader2, Download, DollarSign, TrendingUp, Users, Calendar } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import AdminNav from "@/components/admin/admin-nav"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "@/contexts/auth-context"

interface Donation {
  id: string
  amount: number
  currency: string
  donation_type: string
  project_name: string | null
  payment_method: string
  payment_reference: string | null
  status: string
  is_anonymous: boolean
  donor_name: string | null
  donor_email: string | null
  created_at: string
  user: {
    first_name: string
    last_name: string
    email: string
  } | null
}

export default function AdminDonationsPage() {
  const { toast } = useToast()
  const router = useRouter()
  const { profile } = useAuth()
  const [donations, setDonations] = useState<Donation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")

  useEffect(() => {
    if (profile && profile.role !== "admin") {
      router.push("/dashboard")
    }
  }, [profile, router])

  useEffect(() => {
    fetchDonations()
  }, [])

  const fetchDonations = async () => {
    setIsLoading(true)
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from("donations")
        .select(`
          *,
          user:users(first_name, last_name, email)
        `)
        .order("created_at", { ascending: false })

      if (error) throw error
      setDonations(data || [])
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch donations",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const filteredDonations = donations.filter((donation) => {
    const donorName = donation.is_anonymous
      ? "Anonymous"
      : donation.user
        ? `${donation.user.first_name} ${donation.user.last_name}`
        : donation.donor_name || ""

    const matchesSearch =
      donorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      donation.payment_reference?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      donation.project_name?.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === "all" || donation.status === statusFilter
    const matchesType = typeFilter === "all" || donation.donation_type === typeFilter

    return matchesSearch && matchesStatus && matchesType
  })

  const totalDonations = donations.filter((d) => d.status === "completed").reduce((sum, d) => sum + d.amount, 0)

  const thisMonthDonations = donations
    .filter((d) => {
      const donationDate = new Date(d.created_at)
      const now = new Date()
      return (
        d.status === "completed" &&
        donationDate.getMonth() === now.getMonth() &&
        donationDate.getFullYear() === now.getFullYear()
      )
    })
    .reduce((sum, d) => sum + d.amount, 0)

  const uniqueDonors = new Set(donations.filter((d) => d.status === "completed").map((d) => d.user_id || d.donor_email))
    .size

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-emerald-100 text-emerald-800">Completed</Badge>
      case "pending":
        return (
          <Badge variant="outline" className="text-yellow-600 border-yellow-600">
            Pending
          </Badge>
        )
      case "failed":
        return <Badge variant="destructive">Failed</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid gap-8 md:grid-cols-[240px_1fr]">
        <AdminNav />

        <main>
          <div className="mb-8 flex flex-col gap-2">
            <h1 className="text-3xl font-bold tracking-tight">Donation Management</h1>
            <p className="text-muted-foreground">Track and manage all donations</p>
          </div>

          <div className="grid gap-4 md:grid-cols-4 mb-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Donations</CardTitle>
                <DollarSign className="h-4 w-4 text-emerald-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(totalDonations)}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">This Month</CardTitle>
                <Calendar className="h-4 w-4 text-emerald-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(thisMonthDonations)}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Donors</CardTitle>
                <Users className="h-4 w-4 text-emerald-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{uniqueDonors}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Avg. Donation</CardTitle>
                <TrendingUp className="h-4 w-4 text-emerald-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatCurrency(
                    donations.filter((d) => d.status === "completed").length > 0
                      ? totalDonations / donations.filter((d) => d.status === "completed").length
                      : 0,
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search donations..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="general">General</SelectItem>
                  <SelectItem value="project">Project</SelectItem>
                  <SelectItem value="zakat">Zakat</SelectItem>
                  <SelectItem value="sadaqah">Sadaqah</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
            </div>
          ) : (
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Donor</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Project</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Reference</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDonations.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                          No donations found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredDonations.map((donation) => (
                        <TableRow key={donation.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">
                                {donation.is_anonymous
                                  ? "Anonymous"
                                  : donation.user
                                    ? `${donation.user.first_name} ${donation.user.last_name}`
                                    : donation.donor_name || "Guest"}
                              </div>
                              {!donation.is_anonymous && (
                                <div className="text-sm text-muted-foreground">
                                  {donation.user?.email || donation.donor_email}
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="font-medium">{formatCurrency(donation.amount)}</TableCell>
                          <TableCell>
                            <span className="capitalize">{donation.donation_type}</span>
                          </TableCell>
                          <TableCell>{donation.project_name || "-"}</TableCell>
                          <TableCell>{getStatusBadge(donation.status)}</TableCell>
                          <TableCell>
                            {new Date(donation.created_at).toLocaleDateString("en-NG", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </TableCell>
                          <TableCell className="font-mono text-xs">{donation.payment_reference || "-"}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </main>
      </div>
    </div>
  )
}
