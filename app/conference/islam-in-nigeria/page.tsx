import type { Metadata } from "next"
import { ConferencePage } from "@/components/content/conference-page"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Islam in Nigeria Conference | Hamduk Islamic Foundation",
  description: "Annual conference exploring the history, challenges, and future of Islam in Nigeria",
}

export default function IslamInNigeriaPage() {
  return (
    <ConferencePage
      pageKey="conference/islam-in-nigeria"
      fallback={{
        title: "Islam in Nigeria Conference",
        subtitle: "Exploring the history, challenges, and future of Islam in Nigeria",
        alt: "Islam in Nigeria Conference",
        sections: [
          {
            heading: "About the Conference",
            paragraphs: [
              "The Islam in Nigeria Conference brings together scholars, researchers, community leaders, and policymakers to discuss Islamic history, education, culture, and contemporary community development in Nigeria.",
              "The conference provides a platform to celebrate Nigeria's Islamic heritage, address contemporary challenges, and develop strategies for Muslim community growth.",
            ],
          },
        ],
        themes: ["Islamic History in Nigeria", "Islamic Education", "Interfaith Relations", "Contemporary Challenges"],
      }}
    />
  )
}
