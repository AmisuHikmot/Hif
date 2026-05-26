import type { Metadata } from "next"
import { ConferencePage } from "@/components/content/conference-page"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Islam and Education Conference | Hamduk Islamic Foundation",
  description: "Annual conference exploring Islamic education, its principles, challenges, and innovations",
}

export default function IslamAndEducationPage() {
  return (
    <ConferencePage
      pageKey="conference/islam-and-education"
      fallback={{
        title: "Islam and Education Conference",
        subtitle: "Exploring Islamic education principles, challenges, and innovations",
        alt: "Islam and Education Conference",
        sections: [
          {
            heading: "About the Conference",
            paragraphs: [
              "This annual gathering explores curriculum, teacher training, technology, and the integration of Islamic and contemporary learning.",
            ],
          },
        ],
        themes: ["Islamic Educational Philosophy", "Curriculum Development", "Technology in Islamic Education", "Teacher Training"],
      }}
    />
  )
}
