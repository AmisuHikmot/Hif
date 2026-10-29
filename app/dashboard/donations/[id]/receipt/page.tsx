import { notFound, redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import PrintButton from "./print-button"

export const dynamic = "force-dynamic"
export const metadata = { title: "Donation receipt | HIF", robots: { index: false, follow: false } }

export default async function ReceiptPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: auth } = await supabase.auth.getUser()
  if (!auth.user) redirect(`/auth/login?redirect=/dashboard/donations/${id}/receipt`)

  // Row-level security limits this to the donor's own donations (or staff).
  const { data: d } = await supabase.from("donations").select("*").eq("id", id).maybeSingle()
  if (!d || d.payment_status !== "completed") notFound()

  const date = new Date(d.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })

  return (
    <main className="mx-auto max-w-xl space-y-6 px-4 py-10">
      <div className="space-y-1 border-b pb-4">
        <h1 className="text-2xl font-bold">Donation receipt</h1>
        <p className="text-sm text-muted-foreground">Hamduk Islamic Foundation · Lagos, Nigeria · info@hif.com.ng</p>
      </div>
      <dl className="grid grid-cols-[140px_1fr] gap-y-2 text-sm">
        <dt className="text-muted-foreground">Receipt no.</dt>
        <dd className="font-mono">{String(d.id).slice(0, 8).toUpperCase()}</dd>
        <dt className="text-muted-foreground">Date</dt>
        <dd>{date}</dd>
        <dt className="text-muted-foreground">Donor</dt>
        <dd>{d.donor_name || auth.user.email}</dd>
        <dt className="text-muted-foreground">Purpose</dt>
        <dd>{d.project_name || "General donation"}</dd>
        <dt className="text-muted-foreground">Type</dt>
        <dd className="capitalize">{d.donation_type}</dd>
        {d.payment_reference && (
          <>
            <dt className="text-muted-foreground">Payment ref.</dt>
            <dd className="break-all font-mono">{d.payment_reference}</dd>
          </>
        )}
        <dt className="text-muted-foreground">Amount</dt>
        <dd className="text-lg font-semibold">
          {d.currency} {Number(d.amount).toLocaleString()}
        </dd>
      </dl>
      <p className="text-sm">Jazakumullahu khayran. May Allah accept it from you.</p>
      <PrintButton />
    </main>
  )
}
