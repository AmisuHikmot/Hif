import Image from "next/image"
import type { Metadata } from "next"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Users, BookOpen, Heart, Lightbulb } from "lucide-react"

export const metadata: Metadata = {
  title: "Who Can Join | Hamduk Islamic Foundation",
  description: "Information about who can join the Hamduk Islamic Foundation",
}

// Sample data for membership categories
const membershipCategories = [
  {
    id: 1,
    title: "Regular Membership",
    description: "Open to all adult Muslims who accept the foundation's principles and objectives.",
    requirements: [
      "Must be a practicing Muslim",
      "At least 18 years of age",
      "Acceptance of the foundation's constitution and bylaws",
      "Payment of membership dues",
    ],
    benefits: [
      "Participation in all foundation activities and programs",
      "Voting rights in general meetings",
      "Eligibility to be elected to leadership positions",
      "Access to foundation resources and facilities",
      "Regular updates on foundation activities",
    ],
  },
  {
    id: 2,
    title: "Associate Membership",
    description: "For non-Muslims who support the foundation's objectives and wish to participate in its activities.",
    requirements: [
      "Respect for Islamic principles and values",
      "At least 18 years of age",
      "Acceptance of the foundation's constitution and bylaws",
      "Payment of membership dues",
    ],
    benefits: [
      "Participation in selected foundation activities and programs",
      "Access to foundation resources and facilities",
      "Regular updates on foundation activities",
      "Opportunities for interfaith dialogue and learning",
    ],
  },
  {
    id: 3,
    title: "Youth Membership",
    description:
      "For young Muslims between the ages of 13 and 17 who wish to be involved in the foundation's youth programs.",
    requirements: [
      "Must be a Muslim",
      "Between 13 and 17 years of age",
      "Parental/guardian consent",
      "Commitment to participate in youth activities",
    ],
    benefits: [
      "Participation in youth-focused programs and activities",
      "Mentorship opportunities",
      "Leadership development",
      "Educational support",
      "Transition to regular membership upon reaching 18 years",
    ],
  },
  {
    id: 4,
    title: "Honorary Membership",
    description:
      "Awarded to individuals who have made significant contributions to the foundation or to the Muslim community.",
    requirements: [
      "Recognition for outstanding service to Islam or the Muslim community",
      "Nomination by the Executive Committee",
      "Approval by the Board of Trustees",
    ],
    benefits: [
      "Recognition at foundation events",
      "Invitation to special programs and activities",
      "Advisory role in foundation initiatives",
      "Lifetime membership without dues",
    ],
  },
]

export default function WhoCanJoinPage() {
  return (
    <main className="container mx-auto px-4 py-12">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-emerald-900 dark:text-emerald-500 mb-4">Who Can Join?</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
          The Hamduk Islamic Foundation welcomes members from diverse backgrounds who share our commitment to Islamic
          values and community service.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
        <div className="lg:col-span-2">
          <div className="relative h-80 w-full rounded-lg overflow-hidden mb-6">
            <Image
              src="/placeholder.svg?height=600&width=1200"
              alt="Diverse group of foundation members"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-emerald-900/30 flex items-center justify-center">
              <div className="bg-white/90 dark:bg-gray-900/90 p-6 rounded-lg max-w-md text-center">
                <h2 className="text-2xl font-bold text-emerald-900 dark:text-emerald-500 mb-2">Join Our Community</h2>
                <p className="text-gray-700 dark:text-gray-300">
                  Be part of a vibrant community dedicated to promoting Islamic values and serving humanity.
                </p>
              </div>
            </div>
          </div>
          <div className="prose dark:prose-invert max-w-none">
            <h2 className="text-2xl font-bold text-emerald-900 dark:text-emerald-500 mb-4">
              Our Membership Philosophy
            </h2>
            <p>
              The Hamduk Islamic Foundation believes in building a diverse and inclusive community of members who are
              committed to our mission and values. Our membership is open to individuals who:
            </p>
            <ul>
              <li>
                <strong>Share our values:</strong> Commitment to authentic Islamic teachings, unity, excellence,
                compassion, and integrity.
              </li>
              <li>
                <strong>Support our mission:</strong> Dedication to promoting Islamic education, community development,
                and positive social change.
              </li>
              <li>
                <strong>Contribute positively:</strong> Willingness to contribute time, skills, or resources to the
                foundation's activities and initiatives.
              </li>
              <li>
                <strong>Respect diversity:</strong> Appreciation for the diversity within the Muslim community and
                respect for different perspectives and backgrounds.
              </li>
            </ul>
            <p>
              We welcome members from all walks of life, regardless of ethnic background, nationality, profession, or
              social status. What unites our members is a shared commitment to Islamic principles and a desire to serve
              the community.
            </p>
            <h3 className="text-xl font-bold text-emerald-800 dark:text-emerald-400 mt-6 mb-4">
              Membership Expectations
            </h3>
            <p>As a member of the Hamduk Islamic Foundation, you are expected to:</p>
            <ul>
              <li>Uphold the principles and values of Islam in your personal conduct</li>
              <li>Participate actively in foundation programs and activities when possible</li>
              <li>Contribute to the achievement of the foundation's objectives</li>
              <li>Maintain respectful and cooperative relationships with fellow members</li>
              <li>Pay membership dues promptly (except for honorary members)</li>
              <li>Represent the foundation positively in the wider community</li>
            </ul>
          </div>
        </div>

        <div>
          <Card className="border-emerald-200 dark:border-emerald-900 mb-8">
            <CardHeader className="bg-emerald-50 dark:bg-emerald-900/20">
              <CardTitle className="text-xl text-emerald-900 dark:text-emerald-500">Why Join Us?</CardTitle>
              <CardDescription>Benefits of becoming a member</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-start">
                  <Users className="h-5 w-5 text-emerald-700 dark:text-emerald-500 mr-3 mt-0.5" />
                  <div>
                    <h3 className="font-semibold mb-1">Community</h3>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      Connect with like-minded individuals committed to Islamic values and community service.
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <BookOpen className="h-5 w-5 text-emerald-700 dark:text-emerald-500 mr-3 mt-0.5" />
                  <div>
                    <h3 className="font-semibold mb-1">Knowledge</h3>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      Access educational programs, lectures, and resources to deepen your understanding of Islam.
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Heart className="h-5 w-5 text-emerald-700 dark:text-emerald-500 mr-3 mt-0.5" />
                  <div>
                    <h3 className="font-semibold mb-1">Service</h3>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      Participate in humanitarian and community service initiatives that benefit society.
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Lightbulb className="h-5 w-5 text-emerald-700 dark:text-emerald-500 mr-3 mt-0.5" />
                  <div>
                    <h3 className="font-semibold mb-1">Growth</h3>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      Develop leadership skills and personal growth through active participation and training.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-emerald-200 dark:border-emerald-900">
            <CardHeader className="bg-emerald-50 dark:bg-emerald-900/20">
              <CardTitle className="text-xl text-emerald-900 dark:text-emerald-500">Ready to Join?</CardTitle>
              <CardDescription>Next steps to become a member</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                If you're interested in becoming a member of the Hamduk Islamic Foundation, you can:
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400 mr-2 mt-0.5" />
                  <span className="text-gray-700 dark:text-gray-300">
                    Visit our "How to Join" page for detailed instructions
                  </span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400 mr-2 mt-0.5" />
                  <span className="text-gray-700 dark:text-gray-300">Complete the online registration form</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400 mr-2 mt-0.5" />
                  <span className="text-gray-700 dark:text-gray-300">
                    Contact our membership coordinator for assistance
                  </span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400 mr-2 mt-0.5" />
                  <span className="text-gray-700 dark:text-gray-300">
                    Visit our office during membership registration hours
                  </span>
                </li>
              </ul>
              <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 px-4 rounded-md transition-colors">
                Learn How to Join
              </button>
            </CardContent>
          </Card>
        </div>
      </div>

      <h2 className="text-3xl font-bold text-emerald-900 dark:text-emerald-500 mb-8 text-center">
        Membership Categories
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        {membershipCategories.map((category) => (
          <Card key={category.id} className="overflow-hidden border-emerald-200 dark:border-emerald-900">
            <CardHeader className="bg-emerald-50 dark:bg-emerald-900/20">
              <CardTitle className="text-xl text-emerald-900 dark:text-emerald-500">{category.title}</CardTitle>
              <CardDescription>{category.description}</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="mb-6">
                <h3 className="font-semibold text-lg mb-3 text-emerald-800 dark:text-emerald-400">Requirements</h3>
                <ul className="space-y-2">
                  {category.requirements.map((requirement, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300">{requirement}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-3 text-emerald-800 dark:text-emerald-400">Benefits</h3>
                <ul className="space-y-2">
                  {category.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="max-w-4xl mx-auto bg-emerald-50 dark:bg-emerald-900/10 p-8 rounded-lg border border-emerald-200 dark:border-emerald-900/50">
        <h2 className="text-2xl font-bold text-emerald-900 dark:text-emerald-500 mb-4">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <div>
            <h3 className="font-semibold text-lg mb-2 text-emerald-800 dark:text-emerald-400">
              Can I join if I'm not from Nigeria?
            </h3>
            <p className="text-gray-700 dark:text-gray-300">
              Yes, membership is open to Muslims regardless of nationality. We welcome members from all countries who
              support our mission and values.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-2 text-emerald-800 dark:text-emerald-400">
              Is there an age limit for membership?
            </h3>
            <p className="text-gray-700 dark:text-gray-300">
              Regular membership is open to adults 18 and older. Youth between 13-17 can join our youth membership
              program with parental consent.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-2 text-emerald-800 dark:text-emerald-400">
              What are the membership dues?
            </h3>
            <p className="text-gray-700 dark:text-gray-300">
              Membership dues vary by category and are reviewed annually. Current rates can be found on our "How to
              Join" page. Dues contribute to the foundation's operational costs and programs.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-2 text-emerald-800 dark:text-emerald-400">
              Can I volunteer without becoming a member?
            </h3>
            <p className="text-gray-700 dark:text-gray-300">
              Yes, we welcome volunteers for many of our programs and activities even if they are not members. However,
              membership provides additional benefits and opportunities for involvement.
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
