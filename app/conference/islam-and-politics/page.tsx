import type { Metadata } from "next"
import { ConferencePage } from "@/components/content/conference-page"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Islam and Politics Conference | Hamduk Islamic Foundation",
  description: "Annual conference exploring the relationship between Islam and politics in contemporary society",
}

export default function IslamAndPoliticsPage() {
  return (
    <ConferencePage
      pageKey="conference/islam-and-politics"
      fallback={{
        title: "Islam and Politics Conference",
        subtitle: "Exploring the relationship between Islam and politics in contemporary society",
        alt: "Islam and Politics Conference",
        sections: [
          {
            heading: "About the Conference",
            paragraphs: [
              "A thoughtful forum on governance, leadership, civic participation, justice, and public ethics from an Islamic perspective.",
            ],
          },
        ],
        themes: ["Islamic Political Thought", "Governance and Leadership", "Human Rights", "Political Participation"],
      }}
    />
  )
}
