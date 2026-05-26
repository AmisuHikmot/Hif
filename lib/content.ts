import { createAdminClient } from "@/lib/supabase/admin"

export type PageContent = {
  page_key: string
  title: string
  subtitle: string | null
  hero_image_url: string | null
  body: {
    sections?: Array<{ heading?: string; paragraphs?: string[] }>
    themes?: string[]
    upcoming?: {
      title?: string
      description?: string
      date?: string
      time?: string
      location?: string
      image_url?: string
    }
  } | null
}

export async function getPageContent(pageKey: string): Promise<PageContent | null> {
  const supabase = createAdminClient()
  const { data } = await supabase
    .from("page_content")
    .select("page_key, title, subtitle, hero_image_url, body")
    .eq("page_key", pageKey)
    .eq("is_published", true)
    .maybeSingle()

  return data as PageContent | null
}

export async function getLeadershipProfiles(groupKey: string) {
  const supabase = createAdminClient()
  const { data } = await supabase
    .from("leadership_profiles")
    .select("*")
    .eq("group_key", groupKey)
    .eq("is_active", true)
    .order("display_order", { ascending: true })

  return data || []
}
