import type { Metadata } from "next"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import AiChat from "./chat"

export const metadata: Metadata = {
  title: "HIF Assistant | Hamduk Islamic Foundation",
  description: "Ask about the meaning of verses and hadith. Answers come from the Quran, tafsir and hadith texts, with sources shown.",
}

export default async function AiPage() {
  const { data } = await (await createClient()).auth.getUser()
  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-4 px-4 py-8">
      <header>
        <h1 className="text-2xl font-semibold">HIF Assistant</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          A study aid, not a scholar. It explains verses and hadith using the Quran, classical tafsir and our hadith library, and shows its sources.
          It does not give rulings. For your own situation, use <Link className="underline" href="/dashboard">Ask a scholar</Link> in the app.
        </p>
      </header>
      {data.user ? (
        <AiChat />
      ) : (
        <div className="rounded-lg border p-6 text-center">
          <p className="mb-3">Sign in to use the assistant. It is free.</p>
          <Link className="underline" href="/auth/login?redirect=/ai">Sign in</Link>
        </div>
      )}
    </main>
  )
}
