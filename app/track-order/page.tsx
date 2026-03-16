import { Metadata } from "next"
import { TrackOrderClient } from "./track-order-client"

export const metadata: Metadata = {
  title: "Track Your Order | Hamduk Islamic Foundation",
  description: "Track your HIF shop order and see the live delivery status",
}

export default function TrackOrderPage() {
  return <TrackOrderClient />
}
