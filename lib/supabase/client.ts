import { createBrowserClient } from "@supabase/ssr"

type BrowserClient = any

let supabaseClient: BrowserClient | null = null

// Always return the same instance. The session lives in cookies (not
// localStorage), so the server, the proxy and the browser all see the same
// signed-in user.
export function createClient() {
  if (supabaseClient) return supabaseClient

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Missing Supabase browser configuration")
  }

  supabaseClient = createBrowserClient(supabaseUrl, supabaseAnonKey)

  return supabaseClient
}

export const supabase = new Proxy({} as BrowserClient, {
  get(_target, prop, receiver) {
    return Reflect.get(createClient(), prop, receiver)
  },
})
