"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"

const projects = [
  {
    id: 1,
    title: "Mosque Construction Project",
    description: "Help us build a new mosque to serve the growing Muslim community in Lagos.",
    image: "/placeholder.svg?height=200&width=400",
    raised: 15000000,
    goal: 50000000,
    deadline: "December 31, 2025",
    category: "Construction",
  },
  {
    id: 2,
    title: "Ramadan Food Drive",
    description: "Support our initiative to provide iftar meals for those in need during Ramadan.",
    image: "/placeholder.svg?height=200&width=400",
    raised: 2500000,
    goal: 5000000,
    deadline: "February 28, 2025",
    category: "Charity",
  },
  {
    id: 3,
    title: "Islamic Education Scholarship",
    description: "Help fund scholarships for deserving students to pursue Islamic education.",
    image: "/placeholder.svg?height=200&width=400",
    raised: 3500000,
    goal: 10000000,
    deadline: "August 15, 2025",
    category: "Education",
  },
  {
    id: 4,
    title: "Community Center Renovation",
    description: "Support the renovation of our community center to better serve our members.",
    image: "/placeholder.svg?height=200&width=400",
    raised: 7000000,
    goal: 15000000,
    deadline: "October 1, 2025",
    category: "Construction",
  },
]

export default function DonationProjects() {
  const [selectedProject, setSelectedProject] = useState<(typeof projects)[0] | null>(null)
  const [donationAmount, setDonationAmount] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const { toast } = useToast()

  const handleDonate = () => {
    if (!donationAmount || isNaN(Number(donationAmount)) || Number(donationAmount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid donation amount.",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)

    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false)
      toast({
        title: "Donation Successful",
        description: `Thank you for your donation of ₦${Number(donationAmount).toLocaleString()} to ${selectedProject?.title}.`,
      })
      setDonationAmount("")
      setSelectedProject(null)
    }, 2000)
  }

  return (
    <div>
      <div className="grid gap-6 md:grid-cols-2">
        {projects.map((project) => (
          <Card key={project.id} className="overflow-hidden">
            <div className="relative h-48 w-full">
              <Image src={project.image || "/placeholder.svg"} alt={project.title} fill className="object-cover" />
              <div className="absolute top-2 right-2">
                <Badge>{project.category}</Badge>
              </div>
            </div>
            <CardHeader className="p-4">
              <CardTitle>{project.title}</CardTitle>
              <CardDescription>{project.description}</CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="mb-2 flex justify-between text-sm">
                <span>Raised: ₦{project.raised.toLocaleString()}</span>
                <span>Goal: ₦{project.goal.toLocaleString()}</span>
              </div>
              <Progress value={(project.raised / project.goal) * 100} className="h-2" />
              <p className="mt-2 text-xs text-muted-foreground">Deadline: {project.deadline}</p>
            </CardContent>
            <CardFooter className="p-4 pt-0">
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="w-full" onClick={() => setSelectedProject(project)}>
                    Donate to this Project
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Donate to {selectedProject?.title}</DialogTitle>
                    <DialogDescription>
                      Your contribution will help us reach our goal of ₦{selectedProject?.goal.toLocaleString()}.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="donation-amount">Donation Amount (₦)</Label>
                      <Input
                        id="donation-amount"
                        type="number"
                        placeholder="Enter amount"
                        value={donationAmount}
                        onChange={(e) => setDonationAmount(e.target.value)}
                      />
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {[5000, 10000, 20000, 50000].map((amount) => (
                        <Button
                          key={amount}
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setDonationAmount(amount.toString())}
                        >
                          ₦{amount.toLocaleString()}
                        </Button>
                      ))}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="donor-name">Your Name</Label>
                      <Input id="donor-name" placeholder="Enter your name" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="donor-email">Email Address</Label>
                      <Input id="donor-email" type="email" placeholder="Enter your email" />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={handleDonate} disabled={isProcessing}>
                      {isProcessing ? "Processing..." : "Complete Donation"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
