import type { Metadata } from "next"
import BranchesClientPage from "./branches-client"

export const metadata: Metadata = {
  title: "Our Branches | Hamduk Islamic Foundation",
  description: "Find Hamduk Islamic Foundation branches across Nigeria. Connect with your local Islamic community.",
}

export default function BranchesPage() {
  return <BranchesClientPage />
}
