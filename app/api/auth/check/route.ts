import { createClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return Response.json({ authenticated: false })
    }

    const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

    return Response.json({
      authenticated: true,
      user: {
        id: user.id,
        email: user.email,
        profile,
      },
    })
  } catch (error) {
    return Response.json({ authenticated: false }, { status: 401 })
  }
}
