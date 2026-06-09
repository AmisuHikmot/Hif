import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    const supabase = await createClient()
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 401 })
    }

    return NextResponse.json({
      success: true,
      user: data.user
        ? {
            id: data.user.id,
            email: data.user.email,
          }
        : null,
    })
  } catch (error) {
    console.error("auth login error:", error)
    return NextResponse.json({ error: "Unable to sign in. Please try again." }, { status: 500 })
  }
}
