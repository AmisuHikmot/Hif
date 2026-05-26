import { createClient as createBrowserClient } from "@supabase/supabase-js"

type BrowserClient = any

let supabaseClient: BrowserClient | null = null

// Always return the same instance
export function createClient() {
  if (supabaseClient) return supabaseClient

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Missing Supabase browser configuration")
  }

  supabaseClient = createBrowserClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  })

  return supabaseClient
}

export const supabase = new Proxy({} as BrowserClient, {
  get(_target, prop, receiver) {
    return Reflect.get(createClient(), prop, receiver)
  },
})
