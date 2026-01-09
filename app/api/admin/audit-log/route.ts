import { createClient } from "@/lib/supabase/server"

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { action, entityType, entityId, oldValues, newValues } = body

    const { error } = await supabase.from("admin_audit_log").insert({
      admin_id: user.id,
      action,
      entity_type: entityType,
      entity_id: entityId,
      old_values: oldValues || null,
      new_values: newValues || null,
      ip_address: request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip"),
      user_agent: request.headers.get("user-agent"),
    })

    if (error) throw error

    return Response.json({ success: true })
  } catch (error) {
    console.error("Audit log error:", error)
    return Response.json({ error: "Failed to log action" }, { status: 500 })
  }
}

export async function GET() {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: profile } = await supabase.from("profiles").select("is_admin").eq("id", user.id).single()

    if (!profile?.is_admin) {
      return Response.json({ error: "Forbidden" }, { status: 403 })
    }

    const { data: logs } = await supabase
      .from("admin_audit_log")
      .select("*, admin:admin_id(first_name, last_name, email)")
      .order("created_at", { ascending: false })
      .limit(100)

    return Response.json({ logs: logs || [] })
  } catch (error) {
    console.error("Audit log fetch error:", error)
    return Response.json({ error: "Failed to fetch audit logs" }, { status: 500 })
  }
}
