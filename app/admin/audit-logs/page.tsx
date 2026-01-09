import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Clock, Shield } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import AdminNav from "@/components/admin/admin-nav"

export const metadata = {
  title: "Audit Logs | Admin Dashboard",
  description: "View admin activity logs and audit trail",
}

async function getAuditLogs() {
  const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/api/admin/audit-log`)

  if (!response.ok) {
    return []
  }

  const data = await response.json()
  return data.logs || []
}

export default async function AuditLogsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("is_admin").eq("id", user.id).single()

  if (!profile?.is_admin) {
    redirect("/")
  }

  const logs = await getAuditLogs()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid gap-8 md:grid-cols-[240px_1fr]">
        <AdminNav />

        <main>
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">Audit Logs</h1>
            <p className="text-muted-foreground">View all admin activities and system changes</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Admin Activity Log</CardTitle>
              <CardDescription>Complete audit trail of all administrative actions</CardDescription>
            </CardHeader>
            <CardContent>
              {logs.length > 0 ? (
                <div className="space-y-4">
                  {logs.map((log) => (
                    <div key={log.id}>
                      <div className="flex items-start gap-4 p-3 rounded-lg bg-muted/50">
                        <div className="rounded-full bg-muted p-2">
                          <Shield className="h-4 w-4 text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-medium">{log.action}</h3>
                            {log.entity_type && <Badge variant="outline">{log.entity_type}</Badge>}
                            <span className="text-xs text-muted-foreground">
                              {log.admin?.first_name} {log.admin?.last_name}
                            </span>
                          </div>
                          {log.new_values && (
                            <p className="text-sm text-muted-foreground mt-1">
                              Changes: {JSON.stringify(log.new_values).substring(0, 100)}...
                            </p>
                          )}
                          <div className="flex items-center gap-1 text-xs text-muted-foreground mt-2">
                            <Clock className="h-3 w-3" />
                            {new Date(log.created_at).toLocaleString()}
                          </div>
                        </div>
                      </div>
                      <Separator className="mt-4" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Shield className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No audit logs found</p>
                </div>
              )}
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}
