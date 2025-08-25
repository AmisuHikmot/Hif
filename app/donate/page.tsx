import type { Metadata } from "next"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import DonationForm from "@/components/donation/donation-form"
import DonationProjects from "@/components/donation/donation-projects"

export const metadata: Metadata = {
  title: "Donate | Hamduk Islamic Foundation",
  description: "Support the mission of Hamduk Islamic Foundation through your generous donations",
}

export default function DonatePage() {
  return (
    <main className="container mx-auto px-4 py-12">
      <div className="mx-auto max-w-4xl">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl md:text-5xl">
            Support Our Mission
          </h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
            Your generous donations help us continue our work in promoting Islamic education, community development, and
            humanitarian efforts.
          </p>
        </div>

        <Tabs defaultValue="general">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="general">General Donation</TabsTrigger>
            <TabsTrigger value="projects">Specific Projects</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="mt-6">
            <DonationForm />
          </TabsContent>

          <TabsContent value="projects" className="mt-6">
            <DonationProjects />
          </TabsContent>
        </Tabs>

        <div className="mt-12 bg-slate-50 p-6 rounded-lg dark:bg-slate-800">
          <h2 className="text-xl font-semibold mb-4">Other Ways to Support</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium">Bank Transfer</h3>
              <p className="text-muted-foreground">
                Account Name: Hamduk Islamic Foundation
                <br />
                Account Number: 0123456789
                <br />
                Bank: Sample Bank
              </p>
            </div>
            <div>
              <h3 className="font-medium">Contact for Support</h3>
              <p className="text-muted-foreground">
                For assistance with donations, please contact us at:
                <br />
                Email: donations@hamdukislamicfoundation.org
                <br />
                Phone: +234 706 227 3586
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
