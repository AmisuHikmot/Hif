"use client"

import { useState, useEffect } from "react"
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
import { useAuth } from "@/contexts/auth-context"
import { Loader2 } from "lucide-react"

interface DonationProject {
  id: string
  title: string
  description: string
  image: string
  raised: number
  goal: number
  deadline: string
  category: string
}

export default function DonationProjects() {
  const { user, profile } = useAuth()
  const { toast } = useToast()
  const [projects, setProjects] = useState<DonationProject[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedProject, setSelectedProject] = useState<DonationProject | null>(null)
  const [donationAmount, setDonationAmount] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [paystackLoaded, setPaystackLoaded] = useState(false)

  useEffect(() => {
    const script = document.createElement("script")
    script.src = "https://js.paystack.co/v1/inline.js"
    script.onload = () => setPaystackLoaded(true)
    document.body.appendChild(script)

    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      const response = await fetch("/api/projects")
      if (response.ok) {
        const data = await response.json()
        setProjects(data.projects || [])
      }
    } catch (error) {
      console.error("Failed to fetch projects:", error)
      toast({
        title: "Error",
        description: "Failed to load projects",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDonate = async () => {
    if (!donationAmount || isNaN(Number(donationAmount)) || Number(donationAmount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid donation amount.",
        variant: "destructive",
      })
      return
    }

    if (!selectedProject) {
      toast({
        title: "Error",
        description: "Please select a project",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)

    try {
      const initResponse = await fetch("/api/payments/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: Number(donationAmount),
          email: user?.email || profile?.email || "",
          donorName: profile ? `${profile.first_name} ${profile.last_name}` : "Anonymous",
          purpose: `Donation to project: ${selectedProject.title}`,
          projectId: selectedProject.id,
        }),
      })

      if (!initResponse.ok) {
        throw new Error("Failed to initialize payment")
      }

      const initData = await initResponse.json()

      const handler = (window as any).PaystackPop.setup({
        key: (window as any).NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY,
        email: user?.email || profile?.email || "",
        amount: Number(donationAmount) * 100,
        ref: initData.reference,
        onClose: () => {
          toast({
            title: "Payment Cancelled",
            description: "You have cancelled the payment",
          })
          setIsProcessing(false)
        },
        onSuccess: async (message: any) => {
          const verifyResponse = await fetch(`/api/payments/verify?reference=${initData.reference}`)

          if (verifyResponse.ok) {
            const verifyData = await verifyResponse.json()

            if (verifyData.success) {
              toast({
                title: "Donation Successful!",
                description: `Thank you for your donation of ₦${Number(donationAmount).toLocaleString()} to ${selectedProject?.title}.`,
              })
              setDonationAmount("")
              setSelectedProject(null)
              fetchProjects()
            } else {
              toast({
                title: "Verification Failed",
                description: "Could not verify your payment",
                variant: "destructive",
              })
            }
          }

          setIsProcessing(false)
        },
      })

      handler.openIframe()
    } catch (error) {
      console.error("Donation error:", error)
      toast({
        title: "Error",
        description: "Failed to process donation",
        variant: "destructive",
      })
      setIsProcessing(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    )
  }

  return (
    <div>
      {projects.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <p className="text-muted-foreground">No projects available at the moment.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {projects.map((project) => {
            const progress = (project.raised / project.goal) * 100
            return (
              <Card key={project.id} className="overflow-hidden flex flex-col">
                <div className="relative h-48 w-full">
                  <Image
                    src={project.image || "/placeholder.svg?height=200&width=400"}
                    alt={project.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-2 right-2">
                    <Badge>{project.category}</Badge>
                  </div>
                </div>
                <CardHeader className="p-4 flex-1">
                  <CardTitle>{project.title}</CardTitle>
                  <CardDescription>{project.description}</CardDescription>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="mb-2 flex justify-between text-sm">
                    <span>Raised: ₦{project.raised.toLocaleString()}</span>
                    <span>Goal: ₦{project.goal.toLocaleString()}</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                  <p className="mt-2 text-xs text-muted-foreground">
                    {Math.round(progress)}% funded • Deadline: {new Date(project.deadline).toLocaleDateString()}
                  </p>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="w-full" onClick={() => setSelectedProject(project)}>
                        Donate to this Project
                      </Button>
                    </DialogTrigger>
                    {selectedProject?.id === project.id && (
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
                        </div>
                        <DialogFooter>
                          <Button onClick={handleDonate} disabled={isProcessing || !paystackLoaded}>
                            {isProcessing ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Processing...
                              </>
                            ) : !paystackLoaded ? (
                              "Loading Payment Gateway..."
                            ) : (
                              "Donate with Paystack"
                            )}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    )}
                  </Dialog>
                </CardFooter>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
