import { requireStaff } from "@/lib/admin/guard"
import ConsoleShell from "@/components/admin/console/console-shell"

export const metadata = { title: "Schools | Admin" }

export default async function SchoolsPage() {
  await requireStaff("/admin/schools")
  return (
    <ConsoleShell title="School console" intro="Classes, assignments and pupil progress for Islamiyya partners.">
      <div className="rounded-lg border p-6">
        <p>Phase 3. This console arrives with school accounts: class lists, assigned passages with due dates, teacher marking, grades and guardian visibility.</p>
        <p className="mt-2 text-sm text-muted-foreground">Until then, courses and quizzes are managed in the Content Studio, and scholarship requests arrive under Support.</p>
      </div>
    </ConsoleShell>
  )
}
