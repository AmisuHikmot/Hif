import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"

const fallbackTimes = {
  fajr: "05:10",
  sunrise: "06:25",
  dhuhr: "13:30",
  asr: "16:30",
  maghrib: "18:55",
  isha: "20:05",
}

export async function GET() {
  const supabase = createAdminClient()
  const today = new Date().toISOString().split("T")[0]
  const { data } = await supabase
    .from("prayer_times")
    .select("date, fajr, sunrise, dhuhr, asr, maghrib, isha")
    .eq("date", today)
    .is("user_id", null)
    .maybeSingle()

  return NextResponse.json({ prayerTimes: data || { date: today, ...fallbackTimes } })
}
