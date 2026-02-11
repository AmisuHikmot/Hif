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

// Always return the same instance
export const supabase = supabaseClient

export function createClient() {
  return supabaseClient // Return existing instance, don't create new one
}
