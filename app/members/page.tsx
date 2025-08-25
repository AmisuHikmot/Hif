import type { Metadata } from "next"
import { MembersDirectory } from "@/components/members/members-directory"

export const metadata: Metadata = {
  title: "Members Directory | Hamduk Islamic Foundation",
  description: "Browse our community of members and connect with fellow Muslims.",
}

export default function MembersPage() {
  return (
    <main className="container mx-auto px-4 py-12">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-emerald-900 dark:text-emerald-500 mb-4">
          Members Directory
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
          Browse our community of members and connect with fellow Muslims.
        </p>
      </div>

      <MembersDirectory />
    </main>
  )
}
