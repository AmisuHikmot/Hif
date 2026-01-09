import { createClient } from "@/lib/supabase/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, subject, message, phone } = body

    if (!name || !email || !message) {
      return Response.json({ error: "Missing required fields" }, { status: 400 })
    }

    const supabase = await createClient()

    const { data, error } = await supabase.from("contact_messages").insert({
      name,
      email,
      phone: phone || null,
      subject: subject || null,
      message,
      status: "new",
    })

    if (error) throw error

    // Log activity
    await supabase.from("activity_logs").insert({
      action: "contact_form_submitted",
      description: `New contact message from ${name}`,
      metadata: { email, subject },
    })

    return Response.json({ success: true, message: "Message sent successfully" })
  } catch (error) {
    console.error("Contact form error:", error)
    return Response.json({ error: "Failed to send message" }, { status: 500 })
  }
}
