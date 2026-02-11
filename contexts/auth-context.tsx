"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState, useRef } from "react"
import { supabase } from "@/lib/supabase/client"
import type { User, Session } from "@supabase/supabase-js"

type UserProfile = {
  id: string
  email: string
  first_name: string | null
  last_name: string | null
  phone: string | null
  role: string
  is_active: boolean
  avatar_url?: string | null
}

type AuthContextType = {
  user: User | null
  profile: UserProfile | null
  session: Session | null
  isLoading: boolean
  isAuthenticated: boolean
  isAdmin: boolean
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>
  signUp: (
    email: string,
    password: string,
    metadata?: { first_name?: string; last_name?: string; phone?: string },
  ) => Promise<{ error: Error | null }>
  signOut: () => Promise<void>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  
  // Prevent multiple simultaneous profile fetches
  const fetchingProfile = useRef<string | null>(null)

  const fetchProfile = async (userId: string) => {
    // If already fetching this user's profile, skip
    if (fetchingProfile.current === userId) {
      console.log("[v0] Already fetching profile for:", userId)
      return
    }

    try {
      fetchingProfile.current = userId
      console.log("[v0] Fetching profile for user:", userId)
      
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single()

      if (error) {
        console.error("[v0] fetchProfile error:", error.message)
        return
      }

      if (data) {
        console.log("[v0] Profile loaded successfully:", data.email)
        setProfile(data as UserProfile)
      }
    } catch (err) {
      console.error("[v0] Unexpected error in fetchProfile:", err)
    } finally {
      fetchingProfile.current = null
    }
  }

  const refreshProfile = async () => {
    if (user?.id) {
      await fetchProfile(user.id)
    }
  }

  useEffect(() => {
    const getSession = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()
        setSession(session ?? null)
        setUser(session?.user ?? null)

        if (session?.user) {
          await fetchProfile(session.user.id)
        }
      } catch (err) {
        console.error("[v0] getSession error:", err)
      } finally {
        setIsLoading(false)
      }
    }

    getSession()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      console.log("[v0] Auth state changed, event:", _event, "has session:", !!session)
      setSession(session ?? null)
      setUser(session?.user ?? null)

      if (session?.user) {
        console.log("[v0] Session found, user ID:", session.user.id)
        await fetchProfile(session.user.id)
      } else {
        setProfile(null)
      }

      setIsLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    try {
      console.log("[v0] Signing in with email:", email)
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        console.error("[v0] Sign in error:", error.message)
        return { error: new Error(error.message) }
      }

      console.log("[v0] Sign in successful")
      // DON'T set session/user/fetch profile here
      // Let onAuthStateChange handle it
      
      return { error: null }
    } catch (err) {
      console.error("[v0] Unexpected sign in error:", err)
      const error = err instanceof Error ? err : new Error("Sign in failed")
      return { error }
    }
  }

  const signUp = async (
    email: string,
    password: string,
    metadata?: { first_name?: string; last_name?: string; phone?: string },
  ) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo:
          process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ??
          `${window.location.origin}/auth/callback`,
      },
    })

    if (error) {
      return { error: new Error(error.message) }
    }

    const createdUser = data?.user
    if (!createdUser) {
      return { error: new Error("Signup succeeded but no user returned") }
    }

    const { error: profileError } = await supabase.from("profiles").upsert(
      {
        id: createdUser.id,
        user_id: createdUser.id,
        email,
        first_name: metadata?.first_name ?? null,
        last_name: metadata?.last_name ?? null,
        phone: metadata?.phone ?? null,
        role: "user",
        is_active: true,
      },
      { onConflict: "id" },
    )

    if (profileError) {
      console.error("[v0] Profile upsert error:", profileError)
      return { error: new Error(profileError.message) }
    }

    // Let onAuthStateChange fetch the profile
    return { error: null }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setProfile(null)
    setSession(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        session,
        isLoading,
        isAuthenticated: !!user,
        isAdmin: profile?.role === "admin",
        signIn,
        signUp,
        signOut,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
