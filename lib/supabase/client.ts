import { createClient as createBrowserClient } from "@supabase/supabase-js"

// Create ONE singleton instance
const supabaseClient = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  { 
    auth: { 
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    } 
  }
)

export const supabase = supabaseClient

// Always return the same instance
export function createClient() {
  return supabaseClient
}
