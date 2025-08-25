import Image from "next/image"
import type { Metadata } from "next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { CreditCard, Calendar } from "lucide-react"

export const metadata: Metadata = {
  title: "Membership Renewal | Hamduk Islamic Foundation",
  description: "Renew your membership with Hamduk Islamic Foundation",
}

export default function RenewalPage() {
  return (
    <main className="container mx-auto px-4 py-12">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-emerald-900 dark:text-emerald-500 mb-4">
          Membership Renewal
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
          Renew your membership to continue enjoying the benefits and supporting the mission of Hamduk Islamic
          Foundation.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
        <div className="lg:col-span-2">
          <div className="relative h-64 w-full rounded-lg overflow-hidden mb-6">
            <Image
              src="/placeholder.svg?height=600&width=1200"
              alt="Members at a foundation event"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-emerald-900/30 flex items-center justify-center">
              <div className="bg-white/90 dark:bg-gray-900/90 p-6 rounded-lg max-w-md text-center">
                <h2 className="text-2xl font-bold text-emerald-900 dark:text-emerald-500 mb-2">
                  Continue Your Journey With Us
                </h2>
                <p className="text-gray-700 dark:text-gray-300">
                  Your membership supports our mission and enables us to continue our important work.
                </p>
              </div>
            </div>
          </div>

          <div className="prose dark:prose-invert max-w-none mb-8">
            <h2 className="text-2xl font-bold text-emerald-900 dark:text-emerald-500 mb-4">Renewal Information</h2>
            <p>
              Membership in the Hamduk Islamic Foundation is valid for one year from the date of registration or last
              renewal. Renewing your membership ensures that you continue to:
            </p>
            <ul>
              <li>Participate in foundation activities and programs</li>
              <li>Receive regular updates and communications</li>
              <li>Maintain voting rights (for eligible membership categories)</li>
              <li>Access foundation resources and facilities</li>
              <li>Contribute to the foundation's mission and impact</li>
            </ul>
            <p>
              We send renewal reminders via email 30 days before your membership expires. If you haven't received a
              reminder and believe your membership is due for renewal, you can check your membership status by logging
              into your account or contacting our membership team.
            </p>
          </div>

          <Tabs defaultValue="online" className="mb-8">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="online">Online Renewal</TabsTrigger>
              <TabsTrigger value="inperson">In-Person Renewal</TabsTrigger>
              <TabsTrigger value="bank">Bank Transfer</TabsTrigger>
            </TabsList>
            <TabsContent value="online" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Online Renewal Process</CardTitle>
                  <CardDescription>The fastest and most convenient way to renew</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-gray-700 dark:text-gray-300">
                      To renew your membership online, follow these simple steps:
                    </p>
                    <ol className="space-y-3 pl-5 list-decimal text-gray-700 dark:text-gray-300">
                      <li>Log in to your account on our website</li>
                      <li>Navigate to the "My Membership" section</li>
                      <li>Click on the "Renew Membership" button</li>
                      <li>Review and update your personal information if needed</li>
                      <li>Select your payment method and complete the payment</li>
                      <li>You will receive a confirmation email with your renewed membership details</li>
                    </ol>
                    <p className="text-gray-700 dark:text-gray-300">
                      The online renewal system is secure and available 24/7. Your membership will be renewed
                      immediately upon successful payment.
                    </p>
                    <div className="mt-4">
                      <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
                        Log In to Renew Online
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="inperson" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>In-Person Renewal</CardTitle>
                  <CardDescription>Visit our office to renew in person</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-gray-700 dark:text-gray-300">
                      If you prefer to renew your membership in person, you can visit our office during business hours:
                    </p>
                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md">
                      <h3 className="font-semibold mb-2">Office Hours for Membership Renewals:</h3>
                      <p className="mb-1">Monday to Friday: 9:00 AM - 4:00 PM</p>
                      <p className="mb-1">Saturday: 10:00 AM - 2:00 PM</p>
                      <p>Sunday: Closed</p>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300">When you visit, please bring:</p>
                    <ul className="space-y-2 pl-5 list-disc text-gray-700 dark:text-gray-300">
                      <li>Your membership ID card</li>
                      <li>Payment for membership dues (cash, check, or card)</li>
                      <li>Any updated contact information</li>
                    </ul>
                    <p className="text-gray-700 dark:text-gray-300">
                      Our membership team will process your renewal immediately and provide you with an updated
                      membership card if needed.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="bank" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Bank Transfer Renewal</CardTitle>
                  <CardDescription>Renew by making a bank transfer</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-gray-700 dark:text-gray-300">
                      To renew your membership via bank transfer, follow these steps:
                    </p>
                    <ol className="space-y-3 pl-5 list-decimal text-gray-700 dark:text-gray-300">
                      <li>Make a transfer to our bank account with the following details:</li>
                    </ol>
                    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md">
                      <p className="font-semibold mb-2">Bank Account Details:</p>
                      <p className="mb-1">Bank Name: First Bank of Nigeria</p>
                      <p className="mb-1">Account Name: Hamduk Islamic Foundation</p>
                      <p className="mb-1">Account Number: 1234567890</p>
                      <p>Sort Code: 011-234</p>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 font-medium">
                      Important: In the transfer description, please include:
                    </p>
                    <ul className="space-y-2 pl-5 list-disc text-gray-700 dark:text-gray-300">
                      <li>Your full name</li>
                      <li>Membership ID number</li>
                      <li>The word "Renewal"</li>
                    </ul>
                    <p className="text-gray-700 dark:text-gray-300">
                      After making the transfer, please email a copy of the transaction receipt to membership@hamduk.org
                      or WhatsApp it to +234 812 345 6789. Your membership will be renewed within 1-2 business days
                      after confirmation of payment.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div>
          <Card className="border-emerald-200 dark:border-emerald-900 mb-8 sticky top-24">
            <CardHeader className="bg-emerald-50 dark:bg-emerald-900/20">
              <CardTitle className="text-xl text-emerald-900 dark:text-emerald-500">Renewal Fees</CardTitle>
              <CardDescription>Annual membership dues by category</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-2 border-b border-gray-200 dark:border-gray-800">
                  <span className="font-medium">Regular Membership</span>
                  <span className="font-bold text-emerald-700 dark:text-emerald-400">₦10,000</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-gray-200 dark:border-gray-800">
                  <span className="font-medium">Associate Membership</span>
                  <span className="font-bold text-emerald-700 dark:text-emerald-400">₦8,000</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-gray-200 dark:border-gray-800">
                  <span className="font-medium">Youth Membership</span>
                  <span className="font-bold text-emerald-700 dark:text-emerald-400">₦5,000</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-gray-200 dark:border-gray-800">
                  <span className="font-medium">Honorary Membership</span>
                  <span className="font-bold text-emerald-700 dark:text-emerald-400">No Fee</span>
                </div>
              </div>
              <div className="mt-6 space-y-4">
                <div className="flex items-start space-x-2 text-sm">
                  <Calendar className="h-4 w-4 text-emerald-700 dark:text-emerald-500 mt-0.5" />
                  <span className="text-gray-700 dark:text-gray-300">
                    Membership is valid for one year from renewal date
                  </span>
                </div>
                <div className="flex items-start space-x-2 text-sm">
                  <CreditCard className="h-4 w-4 text-emerald-700 dark:text-emerald-500 mt-0.5" />
                  <span className="text-gray-700 dark:text-gray-300">Multiple payment options available</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-emerald-200 dark:border-emerald-900">
            <CardHeader className="bg-emerald-50 dark:bg-emerald-900/20">
              <CardTitle className="text-xl text-emerald-900 dark:text-emerald-500">Quick Renewal</CardTitle>
              <CardDescription>For existing members only</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <form className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="membershipId">Membership ID *</Label>
                  <Input id="membershipId" placeholder="Enter your membership ID" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input id="email" type="email" placeholder="Enter your email address" required />
                </div>
                <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
                  Check Membership Status
                </Button>
              </form>
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-800">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  Not sure if your membership needs renewal? Contact our membership team for assistance.
                </p>
                <Button variant="outline" className="w-full">
                  Contact Membership Team
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="max-w-4xl mx-auto bg-emerald-50 dark:bg-emerald-900/10 p-8 rounded-lg border border-emerald-200 dark:border-emerald-900/50">
        <h2 className="text-2xl font-bold text-emerald-900 dark:text-emerald-500 mb-4">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div>
            <h3 className="font-semibold text-lg mb-2 text-emerald-800 dark:text-emerald-400">
              When should I renew my membership?
            </h3>
            <p className="text-gray-700 dark:text-gray-300">
              Your membership should be renewed annually, before the expiration date. We recommend renewing at least two
              weeks before expiration to ensure continuity of your membership benefits.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-2 text-emerald-800 dark:text-emerald-400">
              What happens if my membership expires?
            </h3>
            <p className="text-gray-700 dark:text-gray-300">
              If your membership expires, you will lose access to member benefits and privileges. However, you can still
              renew within three months of expiration without having to reapply. After three months, you may need to
              submit a new application.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-2 text-emerald-800 dark:text-emerald-400">
              Can I change my membership category when renewing?
            </h3>
            <p className="text-gray-700 dark:text-gray-300">
              Yes, you can request to change your membership category during renewal. Please contact our membership team
              to discuss the change and any additional requirements or documentation needed.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-2 text-emerald-800 dark:text-emerald-400">
              Are there any discounts available for long-term renewals?
            </h3>
            <p className="text-gray-700 dark:text-gray-300">
              We offer a 10% discount for members who renew for two years at once, and a 15% discount for three-year
              renewals. These options are available during the online renewal process or when renewing in person.
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
