import type { Metadata } from "next"
import { ConferencePage } from "@/components/content/conference-page"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Islam and Economy Conference | Hamduk Islamic Foundation",
  description: "Annual conference exploring Islamic economics, finance, and sustainable development",
}

export default function IslamAndEconomyPage() {
  return (
    <ConferencePage
      pageKey="conference/islam-and-economy"
      fallback={{
        title: "Islam and Economy Conference",
        subtitle: "Exploring Islamic economics, finance, and sustainable development",
        alt: "Islam and Economy Conference",
        sections: [
          {
            heading: "About the Conference",
            paragraphs: [
              "This conference examines Islamic finance, ethical business, zakat, poverty alleviation, entrepreneurship, and sustainable economic development.",
            ],
          },
        ],
        themes: ["Islamic Banking and Finance", "Zakat and Poverty Alleviation", "Islamic Business Ethics", "Sustainable Development"],
      }}
    />
  )
}
