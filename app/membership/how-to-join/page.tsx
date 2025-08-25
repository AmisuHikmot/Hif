import Image from "next/image"
import type { Metadata } from "next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, CreditCard, Calendar, HelpCircle } from "lucide-react"

export const metadata: Metadata = {
  title: "How to Join | Hamduk Islamic Foundation",
  description: "Step-by-step guide on how to join the Hamduk Islamic Foundation",
}

export default function HowToJoinPage() {
  return (
    <main className="container mx-auto px-4 py-12">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-emerald-900 dark:text-emerald-500 mb-4">How to Join</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
          A simple step-by-step guide to becoming a member of the Hamduk Islamic Foundation.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
        <div className="lg:col-span-2">
          <div className="relative h-80 w-full rounded-lg overflow-hidden mb-6">
            <Image
              src="/placeholder.svg?height=600&width=1200"
              alt="New members orientation"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-emerald-900/30 flex items-center justify-center">
              <div className="bg-white/90 dark:bg-gray-900/90 p-6 rounded-lg max-w-md text-center">
                <h2 className="text-2xl font-bold text-emerald-900 dark:text-emerald-500 mb-2">Join Our Community</h2>
                <p className="text-gray-700 dark:text-gray-300">
                  Becoming a member is easy and opens the door to a wealth of opportunities and resources.
                </p>
              </div>
            </div>
          </div>

          <div className="mb-10">
            <h2 className="text-2xl font-bold text-emerald-900 dark:text-emerald-500 mb-6">
              Membership Application Process
            </h2>

            <div className="space-y-8">
              <div className="flex items-start">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-800 dark:text-emerald-400 mr-4 mt-0.5">
                  1
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-emerald-800 dark:text-emerald-400">
                    Complete the Application Form
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-3">
                    Fill out our membership application form with your personal information, contact details, and areas
                    of interest. You can complete this form online or obtain a physical copy from our office.
                  </p>
                  <button className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 px-4 rounded-md transition-colors">
                    Online Application Form
                  </button>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-800 dark:text-emerald-400 mr-4 mt-0.5">
                  2
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-emerald-800 dark:text-emerald-400">
                    Submit Required Documents
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-3">
                    Along with your application, you'll need to submit:
                  </p>
                  <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300 mb-3">
                    <li>A copy of your identification (National ID, passport, or driver's license)</li>
                    <li>A recent passport-sized photograph</li>
                    <li>For youth membership: Parental/guardian consent form</li>
                    <li>For associate membership: Letter of interest stating why you wish to join</li>
                  </ul>
                  <p className="text-gray-700 dark:text-gray-300">
                    Documents can be uploaded with your online application or submitted in person at our office.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-800 dark:text-emerald-400 mr-4 mt-0.5">
                  3
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-emerald-800 dark:text-emerald-400">
                    Pay Membership Dues
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-3">Membership dues are as follows:</p>
                  <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300 mb-3">
                    <li>Regular Membership: ₦10,000 annually</li>
                    <li>Associate Membership: ₦8,000 annually</li>
                    <li>Youth Membership: ₦5,000 annually</li>
                    <li>Honorary Membership: No dues required</li>
                  </ul>
                  <p className="text-gray-700 dark:text-gray-300">
                    Payment can be made online, through bank transfer, or in person at our office.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-800 dark:text-emerald-400 mr-4 mt-0.5">
                  4
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-emerald-800 dark:text-emerald-400">
                    Application Review
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300">
                    Your application will be reviewed by our Membership Committee. This process typically takes 1-2
                    weeks. You may be contacted for additional information or clarification if needed.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-800 dark:text-emerald-400 mr-4 mt-0.5">
                  5
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-emerald-800 dark:text-emerald-400">
                    Membership Confirmation
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 mb-3">
                    Once your application is approved, you will receive:
                  </p>
                  <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
                    <li>Official confirmation of membership via email</li>
                    <li>Membership ID card</li>
                    <li>Welcome package with information about the foundation</li>
                    <li>Invitation to the next new member orientation session</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <Card className="border-emerald-200 dark:border-emerald-900 mb-8 sticky top-24">
            <CardHeader className="bg-emerald-50 dark:bg-emerald-900/20">
              <CardTitle className="text-xl text-emerald-900 dark:text-emerald-500">Quick Links</CardTitle>
              <CardDescription>Resources to help you join</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-start">
                  <FileText className="h-5 w-5 text-emerald-700 dark:text-emerald-500 mr-3 mt-0.5" />
                  <div>
                    <h3 className="font-semibold mb-1">Application Form</h3>
                    <p className="text-sm text-gray-700 dark:text-gray-300">Download or complete online</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CreditCard className="h-5 w-5 text-emerald-700 dark:text-emerald-500 mr-3 mt-0.5" />
                  <div>
                    <h3 className="font-semibold mb-1">Payment Options</h3>
                    <p className="text-sm text-gray-700 dark:text-gray-300">View ways to pay membership dues</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Calendar className="h-5 w-5 text-emerald-700 dark:text-emerald-500 mr-3 mt-0.5" />
                  <div>
                    <h3 className="font-semibold mb-1">Orientation Schedule</h3>
                    <p className="text-sm text-gray-700 dark:text-gray-300">Upcoming new member orientations</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <HelpCircle className="h-5 w-5 text-emerald-700 dark:text-emerald-500 mr-3 mt-0.5" />
                  <div>
                    <h3 className="font-semibold mb-1">Membership FAQ</h3>
                    <p className="text-sm text-gray-700 dark:text-gray-300">Common questions answered</p>
                  </div>
                </div>
              </div>
              <div className="mt-6 space-y-4">
                <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 px-4 rounded-md transition-colors">
                  Apply Online Now
                </button>
                <button className="w-full bg-white hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 font-medium py-2 px-4 rounded-md transition-colors">
                  Contact Membership Team
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Tabs defaultValue="online" className="max-w-4xl mx-auto mb-16">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="online">Online Application</TabsTrigger>
          <TabsTrigger value="inperson">In-Person Application</TabsTrigger>
          <TabsTrigger value="mail">Application by Mail</TabsTrigger>
        </TabsList>
        <TabsContent value="online" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Online Application Process</CardTitle>
              <CardDescription>The fastest and most convenient way to apply</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-gray-700 dark:text-gray-300">
                  Our online application process is simple, secure, and available 24/7. Follow these steps:
                </p>
                <ol className="space-y-3 pl-5 list-decimal text-gray-700 dark:text-gray-300">
                  <li>Visit our online application portal by clicking the "Apply Online Now" button</li>
                  <li>Create an account or log in if you already have one</li>
                  <li>Fill out all required fields in the application form</li>
                  <li>Upload the required documents (ID, photo, etc.)</li>
                  <li>Review your application for accuracy</li>
                  <li>Submit your application and pay the membership dues online</li>
                  <li>You will receive a confirmation email with your application number</li>
                </ol>
                <p className="text-gray-700 dark:text-gray-300">
                  The online system allows you to save your application and return to it later if needed. You can also
                  track the status of your application through your account.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="inperson" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>In-Person Application</CardTitle>
              <CardDescription>Visit our office to apply in person</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-gray-700 dark:text-gray-300">
                  If you prefer to apply in person, you can visit our office during business hours:
                </p>
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md">
                  <h3 className="font-semibold mb-2">Office Hours for Membership Applications:</h3>
                  <p className="mb-1">Monday to Friday: 9:00 AM - 4:00 PM</p>
                  <p className="mb-1">Saturday: 10:00 AM - 2:00 PM</p>
                  <p>Sunday: Closed</p>
                </div>
                <p className="text-gray-700 dark:text-gray-300">When you visit, please bring:</p>
                <ul className="space-y-2 pl-5 list-disc text-gray-700 dark:text-gray-300">
                  <li>Original ID for verification (National ID, passport, or driver's license)</li>
                  <li>Two recent passport-sized photographs</li>
                  <li>Completed application form (you can fill it out at our office)</li>
                  <li>Payment for membership dues (cash, check, or card)</li>
                  <li>Any additional documents required for your membership category</li>
                </ul>
                <p className="text-gray-700 dark:text-gray-300">
                  Our membership team will assist you with the application process and answer any questions you may
                  have.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="mail" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Application by Mail</CardTitle>
              <CardDescription>Apply from anywhere by postal mail</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-gray-700 dark:text-gray-300">To apply by mail, follow these steps:</p>
                <ol className="space-y-3 pl-5 list-decimal text-gray-700 dark:text-gray-300">
                  <li>Download and print the application form from our website</li>
                  <li>Complete all sections of the form</li>
                  <li>Attach copies of required documents (ID, photo, etc.)</li>
                  <li>Include a check or money order for the membership dues</li>
                  <li>Mail everything to our office address:</li>
                </ol>
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md">
                  <p className="font-semibold mb-2">Mailing Address:</p>
                  <p className="mb-1">Membership Department</p>
                  <p className="mb-1">Hamduk Islamic Foundation</p>
                  <p className="mb-1">P.O. Box 12345</p>
                  <p>Lagos, Nigeria</p>
                </div>
                <p className="text-gray-700 dark:text-gray-300">
                  Please allow 3-4 weeks for processing applications received by mail. You will receive confirmation by
                  email or postal mail once your application has been processed.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="max-w-4xl mx-auto bg-emerald-50 dark:bg-emerald-900/10 p-8 rounded-lg border border-emerald-200 dark:border-emerald-900/50">
        <h2 className="text-2xl font-bold text-emerald-900 dark:text-emerald-500 mb-4">New Member Orientation</h2>
        <p className="text-gray-700 dark:text-gray-300 mb-4">
          All new members are invited to attend an orientation session. These sessions are held monthly and provide an
          opportunity to:
        </p>
        <ul className="list-disc pl-5 space-y-2 text-gray-700 dark:text-gray-300 mb-6">
          <li>Learn more about the foundation's history, mission, and activities</li>
          <li>Meet foundation leaders and other new members</li>
          <li>Discover opportunities for involvement and service</li>
          <li>Ask questions and get clarification on membership benefits and responsibilities</li>
          <li>Receive your official membership package and ID card</li>
        </ul>
        <p className="text-gray-700 dark:text-gray-300">
          Orientation sessions are held at our main office and branch locations. You will receive information about
          upcoming orientation sessions after your membership application is approved.
        </p>
      </div>
    </main>
  )
}
