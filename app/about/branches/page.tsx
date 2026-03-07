import type { Metadata } from "next"
import BranchesClientPage from "./branches-client"

export const metadata: Metadata = {
  title: "Our Branches Nationwide | Hamduk Islamic Foundation Locations",
  description: "Discover Hamduk Islamic Foundation branch locations across Nigeria. Connect with local Islamic communities, attend events, and access our programs near you.",
  keywords: ["branches", "locations", "offices", "chapters", "local community", "Nigeria"],
  openGraph: {
    title: "Our Branches - Hamduk Islamic Foundation",
    description: "Find a branch near you across Nigeria",
    url: "https://hamdukislamicfoundation.org/about/branches",
    type: "website",
  },
}

export default function BranchesPage() {
  return <BranchesClientPage />
}
