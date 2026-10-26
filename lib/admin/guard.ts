import { redirect } from "next/navigation"
import { getStaffId } from "@/lib/auth/staff"

/** For console pages: send anyone who is not staff to sign in. */
export async function requireStaff(path: string): Promise<string> {
  const id = await getStaffId()
  if (!id) redirect(`/auth/login?redirect=${encodeURIComponent(path)}`)
  return id
}

/** For server actions: throw rather than redirect. */
export async function assertStaff(): Promise<string> {
  const id = await getStaffId()
  if (!id) throw new Error("Staff only")
  return id
}
