"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
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

  const fetchProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .maybeSingle()

    if (error) {
      console.error("fetchProfile error:", error)
      return
    }

    if (data) {
      setProfile(data as UserProfile)
    } else {
      setProfile(null)
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
        console.error("getSession error:", err)
      } finally {
        setIsLoading(false)
      }
    }

    getSession()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session ?? null)
      setUser(session?.user ?? null)

      if (session?.user) {
        await fetchProfile(session.user.id)
      } else {
        setProfile(null)
      }

      setIsLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { error: error ? new Error(error.message) : null }
  }

  const signUp = async (
    email: string,
    password: string,
    metadata?: { first_name?: string; last_name?: string; phone?: string },
  ) => {
    // 1) Sign up with Supabase Auth (only email + password)
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        // DO NOT put profile fields into auth user metadata if your trigger/DB does not expect them
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

    // 2) Upsert profile row in profiles table (safe if trigger already created the profile)
    const { error: profileError } = await supabase.from("profiles").upsert(
      {
        id: createdUser.id,
        email,
        first_name: metadata?.first_name ?? null,
        last_name: metadata?.last_name ?? null,
        phone: metadata?.phone ?? null,
        // keep defaults in DB, but provide them here for clarity
        role: "user",
        is_active: true,
      },
      { onConflict: "id" },
    )

    if (profileError) {
      console.error("Profile upsert error:", profileError)
      return { error: new Error(profileError.message) }
    }

    // 3) Refresh local state
    await fetchProfile(createdUser.id)

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
