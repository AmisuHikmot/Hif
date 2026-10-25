import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import AdminNav from "@/components/admin/admin-nav"
import QaManager from "@/components/admin/qa-manager"

export const metadata = {
  title: "Questions | Admin Dashboard",
  description: "Review questions, manage scholars and publish answers",
}

export default async function QuestionsAdminPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect("/auth/login?redirect=/admin/questions")

  const { data: profile } = await supabase.from("profiles").select("role, is_admin").eq("id", user.id).single()
  if (!profile || (profile.role !== "admin" && profile.role !== "super_admin" && !profile.is_admin)) {
    redirect("/dashboard")
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid gap-8 md:grid-cols-[240px_1fr]">
        <AdminNav />
        <main>
          <h1 className="mb-6 text-3xl font-bold">Questions</h1>
          <QaManager />
        </main>
      </div>
    </div>
  )
}
