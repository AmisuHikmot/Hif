import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"

export const dynamic = "force-dynamic"

/**
 * Daily clean-up (HFZ-05): removes recitation audio that is past its
 * deletion date, then marks it gone. Vercel Cron calls this with
 * `Authorization: Bearer $CRON_SECRET`; without that secret set it refuses.
 */
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Not allowed" }, { status: 401 })
  }
  const db = createAdminClient()
  const { data: due, error } = await db.rpc("purge_list")
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  const rows = (due ?? []) as { id: string; audio_path: string | null; reply_path: string | null }[]
  const done: string[] = []
  for (const r of rows) {
    const paths = [r.audio_path, r.reply_path].filter((p): p is string => !!p)
    if (paths.length) {
      const { error: rmErr } = await db.storage.from("recitations").remove(paths)
      if (rmErr) continue // try again tomorrow
    }
    done.push(r.id)
  }
  if (done.length) await db.rpc("purge_done", { p_ids: done })
  return NextResponse.json({ removed: done.length, waiting: rows.length - done.length })
}
