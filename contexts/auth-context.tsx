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
  is_admin?: boolean
  is_active: boolean
  avatar_url?: string | null
  profile_picture_url?: string | null
  notification_preferences?: {
    emailNotifications?: boolean
    smsNotifications?: boolean
    newsletter?: boolean
    eventReminders?: boolean
    donationUpdates?: boolean
    communityDigest?: boolean
    generalAnnouncements?: boolean
  } | null
  address?: string | null
  city?: string | null
  state?: string | null
  postal_code?: string | null
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
  syncCurrentSession: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  
  // Prevent multiple simultaneous profile fetches
  const fetchingProfile = useRef<string | null>(null)

  const ensureProfile = async (
    u: User,
    metadata?: { first_name?: string; last_name?: string; phone?: string },
  ) => {
    const meta = (u.user_metadata ?? {}) as Record<string, string | undefined>
    const fullName = (meta.full_name ?? meta.name ?? "").split(" ")
    const { error } = await supabase.from("profiles").upsert(
      {
        id: u.id,
        user_id: u.id,
        email: u.email,
        first_name: metadata?.first_name ?? meta.first_name ?? fullName[0] ?? null,
        last_name: metadata?.last_name ?? meta.last_name ?? (fullName.slice(1).join(" ") || null),
        phone: metadata?.phone ?? meta.phone ?? null,
        role: "user",
        is_active: true,
      },
      { onConflict: "id", ignoreDuplicates: true },
    )
    if (error) console.error("[auth] ensureProfile:", error.message)
  }

  const fetchProfile = async (userId: string) => {
    // If already fetching this user's profile, skip
    if (fetchingProfile.current === userId) {
      return
    }

    try {
      fetchingProfile.current = userId
      
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .maybeSingle()

      if (error) {
        console.error("fetchProfile error:", error.message)
        return
      }

      if (!data) {
        // First sign-in (OAuth or a confirmed email): create the row, then read it.
        const { data: authData } = await supabase.auth.getUser()
        if (authData?.user) await ensureProfile(authData.user)
        const retry = await supabase.from("profiles").select("*").eq("id", userId).maybeSingle()
        if (retry.data) setProfile(retry.data as UserProfile)
        return
      }

      if (data) {
        setProfile(data as UserProfile)
      }
    } catch (err) {
      console.error("Unexpected error in fetchProfile:", err)
    } finally {
      fetchingProfile.current = null
    }
  }

  const refreshProfile = async () => {
    if (user?.id) {
      await fetchProfile(user.id)
    }
  }

  // Sessions live in cookies now, so there is nothing to copy to the server.
  const syncCurrentSession = async () => {}

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
    } = supabase.auth.onAuthStateChange((_event: string, session: Session | null) => {
      setSession(session ?? null)
      setUser(session?.user ?? null)

      if (session?.user) {
        // Do not call Supabase from inside this callback: it holds the auth lock,
        // so a query here would wait on the lock forever and sign-in would hang.
        const id = session.user.id
        setTimeout(() => void fetchProfile(id), 0)
      } else {
        setProfile(null)
      }

      setIsLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        console.error("[v0] Sign in error:", error.message)
        return { error: new Error(error.message) }
      }

      setSession(data.session ?? null)
      setUser(data.user ?? null)

      if (data.user) {
        await fetchProfile(data.user.id)
      }
      
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
        emailRedirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
        data: {
          first_name: metadata?.first_name ?? null,
          last_name: metadata?.last_name ?? null,
          phone: metadata?.phone ?? null,
        },
      },
    })

    if (error) {
      return { error: new Error(error.message) }
    }

    const createdUser = data?.user
    if (!createdUser) {
      return { error: new Error("Signup succeeded but no user returned") }
    }

    // With email confirmation on there is no session yet, so the profile row
    // cannot be written from the browser (row-level security). It is created
    // when the user first signs in; see ensureProfile.
    if (data.session) {
      await ensureProfile(createdUser, metadata)
    }

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
        isAdmin: profile?.role === "admin" || profile?.role === "super_admin" || profile?.is_admin === true,
        signIn,
        signUp,
        signOut,
        refreshProfile,
        syncCurrentSession,
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
