import type { Metadata } from "next"
import { MembersDirectory } from "@/components/members/members-directory"
import { createAdminClient } from "@/lib/supabase/admin"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Members Directory | Hamduk Islamic Foundation",
  description: "Browse our community of members and connect with fellow Muslims.",
}

export default async function MembersPage() {
  const supabase = createAdminClient()
  const { data } = await supabase
    .from("profiles")
    .select("id, first_name, last_name, role, membership_type, profile_picture_url, avatar_url, city, state, created_at, occupation")
    .eq("is_active", true)
    .in("role", ["member", "admin", "super_admin"])
    .order("created_at", { ascending: false })

  const members =
    data?.map((profile) => ({
      id: profile.id,
      name: [profile.first_name, profile.last_name].filter(Boolean).join(" ") || "HIF Member",
      role: profile.occupation || (profile.role === "member" ? "Member" : "Executive"),
      category: profile.role === "member" ? "volunteers" : "executives",
      image: profile.profile_picture_url || profile.avatar_url || "/placeholder.svg?height=200&width=200",
      bio: profile.membership_type ? `${profile.membership_type} member of Hamduk Islamic Foundation.` : "Member of Hamduk Islamic Foundation.",
      location: [profile.city, profile.state].filter(Boolean).join(", "),
      joinDate: profile.created_at,
    })) || []

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

      <MembersDirectory initialMembers={members} />
    </main>
  )
}
