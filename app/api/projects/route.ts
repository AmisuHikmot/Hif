import { createClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from("donation_projects")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) throw error

    return Response.json({ projects: data || [] })
  } catch (error) {
    console.error("Failed to fetch projects:", error)
    return Response.json({ projects: [] }, { status: 500 })
  }
}
