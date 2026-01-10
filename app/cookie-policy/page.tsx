import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Cookie Policy | Hamduk Islamic Foundation",
  description: "Understand how we use cookies on our website.",
}

export default function CookiePolicyPage() {
  return (
    <main className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-emerald-900 dark:text-emerald-500">Cookie Policy</h1>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>1. What Are Cookies?</CardTitle>
            </CardHeader>
            <CardContent className="text-gray-700 dark:text-gray-300">
              <p>
                Cookies are small text files that are placed on your device (computer, tablet, or mobile phone) when you
                visit a website. They are widely used to make websites work more efficiently and to provide information
                to the website owners.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>2. How We Use Cookies</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-gray-700 dark:text-gray-300">
              <p>We use cookies for the following purposes:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Essential Cookies:</strong> Required for the website to function properly
                </li>
                <li>
                  <strong>Performance Cookies:</strong> Help us understand how visitors use our website
                </li>
                <li>
                  <strong>Functional Cookies:</strong> Remember your preferences and settings
                </li>
                <li>
                  <strong>Targeting Cookies:</strong> Track your behavior to deliver relevant content
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>3. Types of Cookies We Use</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-gray-700 dark:text-gray-300">
              <div>
                <h4 className="font-semibold mb-2">Session Cookies</h4>
                <p>
                  These cookies expire when you close your browser and are used for authentication and temporary
                  preferences.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Persistent Cookies</h4>
                <p>
                  These cookies remain on your device for a longer period and are used to remember your preferences.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Third-Party Cookies</h4>
                <p>These are set by external services we use, such as analytics providers.</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>4. Your Cookie Choices</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-gray-700 dark:text-gray-300">
              <p>You have the right to choose whether or not to accept cookies. You can:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Change your browser settings to block cookies</li>
                <li>Delete cookies from your device</li>
                <li>Opt-out of specific types of cookies through our cookie banner</li>
              </ul>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-4">
                Note: Disabling cookies may affect the functionality of our website.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>5. Analytics and Tracking</CardTitle>
            </CardHeader>
            <CardContent className="text-gray-700 dark:text-gray-300">
              <p>
                We use analytics cookies to understand how our website is used and to improve our services. This helps
                us measure traffic, optimize content, and enhance user experience. We do not share this data with third
                parties without your consent.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>6. Third-Party Services</CardTitle>
            </CardHeader>
            <CardContent className="text-gray-700 dark:text-gray-300">
              <p>
                Our website may contain links to third-party services that use their own cookies. We are not responsible
                for their cookie policies. We encourage you to review their privacy and cookie policies before using
                their services.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>7. Updates to This Policy</CardTitle>
            </CardHeader>
            <CardContent className="text-gray-700 dark:text-gray-300">
              <p>
                We may update this Cookie Policy from time to time to reflect changes in our practices or for other
                operational, legal, or regulatory reasons. The "Last Updated" date will reflect any changes.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>8. Contact Us</CardTitle>
            </CardHeader>
            <CardContent className="text-gray-700 dark:text-gray-300">
              <p>
                If you have questions about our use of cookies, please contact us at hamdukislamicfoundation@gmail.com.
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
