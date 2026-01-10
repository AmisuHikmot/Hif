import { createServerClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { session } = body

    if (!session) {
      return NextResponse.json({ error: "No session provided" }, { status: 400 })
    }

    const supabase = await createServerClient()

    // Set session on the server
    await supabase.auth.setSession(session)

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("auth callback error:", err)
    return NextResponse.json({ success: false, error: String(err) }, { status: 500 })
  }
}
