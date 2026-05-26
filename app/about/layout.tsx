import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "About Us | Hamduk Islamic Foundation - Our Mission & Vision Since 1996",
  description: "Learn about Hamduk Islamic Foundation's mission to advance Islamic education, charitable works, and community development. Discover our vision, leadership, and impact since 1996.",
  keywords: ["about", "mission", "vision", "Islamic foundation", "charity", "education", "community"],
  openGraph: {
    title: "About Hamduk Islamic Foundation",
    description: "Dedicated to Islamic education and community development since 1996",
    url: "https://hamdukislamicfoundation.org/about",
    type: "website",
  },
}

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
