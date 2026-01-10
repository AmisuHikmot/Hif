import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Privacy Policy | Hamduk Islamic Foundation",
  description: "Read our privacy policy to understand how we protect your personal data.",
}

export default function PrivacyPage() {
  return (
    <main className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-emerald-900 dark:text-emerald-500">Privacy Policy</h1>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>1. Information We Collect</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-gray-700 dark:text-gray-300">
              <p>We collect information you provide directly to us, such as:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Name, email address, and phone number when you register or subscribe</li>
                <li>Event registration information</li>
                <li>Donation information and payment details</li>
                <li>Profile information you choose to provide</li>
                <li>Contact form submissions</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>2. How We Use Your Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-gray-700 dark:text-gray-300">
              <p>We use the information we collect to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Provide, maintain, and improve our services</li>
                <li>Send you newsletters and updates about our events and programs</li>
                <li>Process your donations and event registrations</li>
                <li>Respond to your inquiries and provide customer support</li>
                <li>Send administrative information and updates</li>
                <li>Comply with legal and regulatory requirements</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>3. Data Security</CardTitle>
            </CardHeader>
            <CardContent className="text-gray-700 dark:text-gray-300">
              <p>
                We implement appropriate technical and organizational measures to protect your personal information
                against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission
                over the Internet is 100% secure.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>4. Sharing Your Information</CardTitle>
            </CardHeader>
            <CardContent className="text-gray-700 dark:text-gray-300">
              <p>
                We do not sell, trade, or otherwise transfer your personal information to third parties. We may share
                information with trusted partners who assist us in operating our website and conducting our business,
                provided they agree to keep this information confidential.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>5. Your Rights</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-gray-700 dark:text-gray-300">
              <p>You have the right to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Access your personal data</li>
                <li>Correct inaccurate data</li>
                <li>Request deletion of your data</li>
                <li>Opt-out of marketing communications</li>
                <li>Data portability</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>6. Cookies</CardTitle>
            </CardHeader>
            <CardContent className="text-gray-700 dark:text-gray-300">
              <p>
                We use cookies to enhance your experience on our website. You can choose to disable cookies through your
                browser settings, though this may affect the functionality of our website. For more information, see our
                Cookie Policy.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>7. Third-Party Links</CardTitle>
            </CardHeader>
            <CardContent className="text-gray-700 dark:text-gray-300">
              <p>
                Our website may contain links to third-party websites. We are not responsible for the privacy practices
                or content of these external sites. We encourage you to review the privacy policies of any third-party
                sites before providing personal information.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>8. Changes to This Policy</CardTitle>
            </CardHeader>
            <CardContent className="text-gray-700 dark:text-gray-300">
              <p>
                We may update this Privacy Policy from time to time. We will notify you of any changes by updating the
                "Last Updated" date below and, in some cases, we may provide additional notice such as adding a
                statement to our homepage or sending you an email notification.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>9. Contact Us</CardTitle>
            </CardHeader>
            <CardContent className="text-gray-700 dark:text-gray-300">
              <p>
                If you have questions about this Privacy Policy, please contact us at hamdukislamicfoundation@gmail.com
                or call +234 706 227 3586.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 p-6 bg-emerald-50 dark:bg-emerald-900/10 rounded-lg border border-emerald-200 dark:border-emerald-900">
          <p className="text-sm text-gray-700 dark:text-gray-300">Last updated: {new Date().toLocaleDateString()}</p>
        </div>
      </div>
    </main>
  )
}
