import type { Metadata } from "next"
import { createClient } from "@/lib/supabase/server"
import HomeClient from "./home-client"

export const revalidate = 300

export const metadata: Metadata = {
  title: "Hamduk Islamic Foundation | Faith, Education, Community",
  description:
    "Hamduk Islamic Foundation (HIF) is a Lagos-based Islamic organisation running lectures, training, advocacy, events and community programmes since 1996.",
}

const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "NGO",
  name: "Hamduk Islamic Foundation",
  alternateName: "HIF",
  url: "https://www.hif.com.ng",
  email: "info@hif.com.ng",
  telephone: "+234 706 227 3586",
  foundingDate: "1996",
  address: { "@type": "PostalAddress", addressLocality: "Lagos", addressCountry: "NG" },
}

export default async function Home() {
  let events: any[] = []
  try {
    const supabase = await createClient()
    const { data } = await supabase.from("events").select("*").order("event_date", { ascending: false }).limit(60)
    events = (data ?? []).sort((a, b) => String(a.event_date).localeCompare(String(b.event_date)))
  } catch {}

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }} />
      <HomeClient events={events} />
    </>
  )
}
