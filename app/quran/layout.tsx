import { Amiri_Quran } from "next/font/google"

const amiri = Amiri_Quran({ subsets: ["arabic"], weight: "400", variable: "--font-quran", display: "swap" })

export default function QuranLayout({ children }: { children: React.ReactNode }) {
  return <div className={amiri.variable}>{children}</div>
}
