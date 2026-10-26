import { requireStaff } from "@/lib/admin/guard"
import ConsoleShell from "@/components/admin/console/console-shell"
import CheckInForm from "@/components/admin/console/checkin-form"

export const metadata = { title: "Event check-in | Admin" }

export default async function CheckInPage() {
  await requireStaff("/admin/checkin")
  return (
    <ConsoleShell title="Event check-in" intro="At the door, scan the QR on a person’s ticket in the app (a USB or phone scanner types the code here) and press Enter.">
      <CheckInForm />
    </ConsoleShell>
  )
}
