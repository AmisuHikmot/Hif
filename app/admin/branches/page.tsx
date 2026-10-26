import { requireStaff } from "@/lib/admin/guard"
import { createAdminClient } from "@/lib/supabase/admin"
import ConsoleShell from "@/components/admin/console/console-shell"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { revalidatePath } from "next/cache"
import { assertStaff } from "@/lib/admin/guard"

export const metadata = { title: "Branches | Admin" }
export const dynamic = "force-dynamic"

async function saveBranch(formData: FormData) {
  "use server"
  await assertStaff()
  const id = String(formData.get("id") ?? "")
  const row = {
    name: String(formData.get("name")),
    address: String(formData.get("address") ?? "") || null,
    city: String(formData.get("city") ?? "") || null,
    state: String(formData.get("state") ?? "") || null,
    phone: String(formData.get("phone") ?? "") || null,
    email: String(formData.get("email") ?? "") || null,
    is_active: formData.get("is_active") === "on",
  }
  const db = createAdminClient()
  const { error } = id ? await db.from("branches").update(row).eq("id", id) : await db.from("branches").insert(row)
  if (error) throw new Error(error.message)
  revalidatePath("/admin/branches")
}

function BranchForm({ b }: { b?: Record<string, string | boolean | null> }) {
  return (
    <form action={saveBranch} className="grid gap-2 rounded-lg border p-3 md:grid-cols-3">
      {b && <input type="hidden" name="id" value={String(b.id)} />}
      <Input name="name" defaultValue={String(b?.name ?? "")} placeholder="Branch name" required />
      <Input name="city" defaultValue={String(b?.city ?? "")} placeholder="City" />
      <Input name="state" defaultValue={String(b?.state ?? "")} placeholder="State" />
      <Input name="address" defaultValue={String(b?.address ?? "")} placeholder="Address" />
      <Input name="phone" defaultValue={String(b?.phone ?? "")} placeholder="Phone" />
      <Input name="email" defaultValue={String(b?.email ?? "")} placeholder="Email" />
      <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="is_active" defaultChecked={b ? Boolean(b.is_active) : true} /> Shown in the app</label>
      <Button type="submit" className="md:col-span-2">{b ? "Save" : "Add branch"}</Button>
    </form>
  )
}

export default async function BranchesPage() {
  await requireStaff("/admin/branches")
  const { data } = await createAdminClient().from("branches").select("*").order("name")
  return (
    <ConsoleShell title="Branches" intro="The branches listed in the app’s Branches screen.">
      <BranchForm />
      {(data ?? []).map((b) => <BranchForm key={b.id} b={b} />)}
    </ConsoleShell>
  )
}
