import { createClient } from "@/lib/supabase/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, firstName, lastName } = body

    if (!email) {
      return Response.json({ error: "Email is required" }, { status: 400 })
    }

    const supabase = await createClient()

    // Check if already subscribed
    const { data: existing } = await supabase.from("newsletter_subscribers").select("id").eq("email", email).single()

    if (existing) {
      return Response.json({ error: "Already subscribed", success: false }, { status: 400 })
    }

    const { error } = await supabase.from("newsletter_subscribers").insert({
      email,
      first_name: firstName || null,
      last_name: lastName || null,
      status: "subscribed",
    })

    if (error) throw error

    // Log activity
    await supabase.from("activity_logs").insert({
      action: "newsletter_subscribed",
      description: `New newsletter subscriber: ${email}`,
    })

    return Response.json({ success: true, message: "Subscription successful" })
  } catch (error) {
    console.error("Newsletter subscription error:", error)
    return Response.json({ error: "Subscription failed" }, { status: 500 })
  }
}
