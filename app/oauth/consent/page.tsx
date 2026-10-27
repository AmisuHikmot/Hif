import { Suspense } from "react"
import ConsentClient from "./consent-client"

export const metadata = { title: "Sign in with HIF ID" }

export default function ConsentPage() {
  return (
    <Suspense>
      <ConsentClient />
    </Suspense>
  )
}
