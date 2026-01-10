import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Terms of Service | Hamduk Islamic Foundation",
  description: "Read our terms of service and conditions of use.",
}

export default function TermsPage() {
  return (
    <main className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-emerald-900 dark:text-emerald-500">Terms of Service</h1>

        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>1. Acceptance of Terms</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 dark:text-gray-300">
                By accessing and using the Hamduk Islamic Foundation website, you accept and agree to be bound by the
                terms and provision of this agreement. If you do not agree to abide by the above, please do not use this
                service.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>2. Use License</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-gray-700 dark:text-gray-300">
              <p>
                Permission is granted to temporarily download one copy of the materials (information or software) on
                Hamduk Islamic Foundation's website for personal, non-commercial transitory viewing only. This is the
                grant of a license, not a transfer of title, and under this license you may not:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Modifying or copying the materials</li>
                <li>Using the materials for any commercial purpose or for any public display</li>
                <li>Attempting to decompile or reverse engineer any software contained on the website</li>
                <li>Removing any copyright or other proprietary notations from the materials</li>
                <li>Transferring the materials to another person or "mirroring" the materials on any other server</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>3. Disclaimer</CardTitle>
            </CardHeader>
            <CardContent className="text-gray-700 dark:text-gray-300">
              <p>
                The materials on Hamduk Islamic Foundation's website are provided "as is". We make no warranties,
                expressed or implied, and hereby disclaim and negate all other warranties including, without limitation,
                implied warranties or conditions of merchantability, fitness for a particular purpose, or
                non-infringement of intellectual property or other violation of rights.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>4. Limitations</CardTitle>
            </CardHeader>
            <CardContent className="text-gray-700 dark:text-gray-300">
              <p>
                In no event shall Hamduk Islamic Foundation or its suppliers be liable for any damages (including,
                without limitation, damages for loss of data or profit, or due to business interruption) arising out of
                the use or inability to use the materials on the website, even if we or our authorized representative
                has been notified orally or in writing of the possibility of such damage.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>5. Accuracy of Materials</CardTitle>
            </CardHeader>
            <CardContent className="text-gray-700 dark:text-gray-300">
              <p>
                The materials appearing on Hamduk Islamic Foundation's website could include technical, typographical,
                or photographic errors. We do not warrant that any of the materials on our website are accurate,
                complete, or current. We may make changes to the materials contained on our website at any time without
                notice.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>6. Links</CardTitle>
            </CardHeader>
            <CardContent className="text-gray-700 dark:text-gray-300">
              <p>
                We have not reviewed all of the sites linked to our website and are not responsible for the contents of
                any such linked site. The inclusion of any link does not imply endorsement by us of the site. Use of any
                such linked website is at the user's own risk.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>7. Modifications</CardTitle>
            </CardHeader>
            <CardContent className="text-gray-700 dark:text-gray-300">
              <p>
                We may revise these terms of service for our website at any time without notice. By using this website,
                you are agreeing to be bound by the then current version of these terms of service.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>8. Governing Law</CardTitle>
            </CardHeader>
            <CardContent className="text-gray-700 dark:text-gray-300">
              <p>
                These terms and conditions are governed by and construed in accordance with the laws of Nigeria, and you
                irrevocably submit to the exclusive jurisdiction of the courts in that location.
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
