import { Button } from "@/components/ui/button"
import { setReviewStatus } from "@/lib/admin/actions"

export function ReviewButtons({ table, id, status }: { table: string; id: string | number; status: string }) {
  return (
    <div className="flex gap-1">
      {(["approved", "rejected", "pending"] as const)
        .filter((s) => s !== status)
        .map((s) => (
          <form action={setReviewStatus} key={s}>
            <input type="hidden" name="table" value={table} />
            <input type="hidden" name="id" value={String(id)} />
            <input type="hidden" name="status" value={s} />
            <Button size="sm" variant={s === "approved" ? "default" : "outline"} type="submit">
              {s === "approved" ? "Approve" : s === "rejected" ? "Reject" : "Back to pending"}
            </Button>
          </form>
        ))}
    </div>
  )
}

export function StatusBadge({ status }: { status: string }) {
  const color =
    status === "approved"
      ? "bg-emerald-100 text-emerald-800"
      : status === "rejected"
        ? "bg-red-100 text-red-800"
        : "bg-amber-100 text-amber-800"
  return <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${color}`}>{status}</span>
}
