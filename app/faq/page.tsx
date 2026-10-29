import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Frequently Asked Questions | Hamduk Islamic Foundation",
  description: "Answers about joining HIF, donating, events, the HIF app and contacting the Foundation.",
}

const faqs: { q: string; a: React.ReactNode; text: string }[] = [
  {
    q: "How do I become a member?",
    text: "Open the membership registration page, choose a membership type and pay the fee online. Your membership ID and confirmation arrive by email.",
    a: (
      <>
        Open the <Link className="underline" href="/membership/registration">membership registration</Link> page, choose a membership type and pay
        the fee online. Your membership ID and confirmation arrive by email. See <Link className="underline" href="/membership/who-can-join">who can join</Link>.
      </>
    ),
  },
  {
    q: "How can I check or renew my membership?",
    text: "Use the renewal page and enter your membership ID and the email you registered with.",
    a: (
      <>
        Use the <Link className="underline" href="/membership/renewal">renewal page</Link> and enter your membership ID and the email you registered with.
      </>
    ),
  },
  {
    q: "How do I donate?",
    text: "Use the donate page and pay securely online with Paystack. Signed-in donors can print a receipt from their dashboard.",
    a: (
      <>
        Use the <Link className="underline" href="/donate">donate page</Link> and pay securely online with Paystack. If you are signed in, you can print a
        receipt for each completed donation from your dashboard.
      </>
    ),
  },
  {
    q: "How do I register for an event?",
    text: "Open the event on the events page and use the register button. You need an account.",
    a: (
      <>
        Open the event on the <Link className="underline" href="/events">events page</Link> and use the register button. You need an account.
      </>
    ),
  },
  {
    q: "What is the HIF app and what does it cost?",
    text: "The HIF app is an Android app with prayer times, Quran, adhkar, halal places, school tools and more. Worship features are free. Optional Plus adds extras. It is downloaded directly from this website, not Google Play.",
    a: (
      <>
        The HIF app is an Android app with prayer times, Quran, adhkar, halal places, school tools and more. Worship features are free; optional Plus adds
        extras. It is downloaded directly from this website, not Google Play. <Link className="underline" href="/app">Get the app</Link>.
      </>
    ),
  },
  {
    q: "Is my payment information stored by HIF?",
    text: "No. Card payments are handled by Paystack. HIF receives only the payment status and reference.",
    a: <>No. Card payments are handled by Paystack. HIF receives only the payment status and reference.</>,
  },
  {
    q: "How do I contact HIF?",
    text: "Email info@hif.com.ng or call +234 706 227 3586, or use the contact form.",
    a: (
      <>
        Email <a className="underline" href="mailto:info@hif.com.ng">info@hif.com.ng</a> or call +234 706 227 3586, or use the{" "}
        <Link className="underline" href="/contact-us">contact form</Link>.
      </>
    ),
  },
]

export default function FaqPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.text } })),
  }
  return (
    <main className="container mx-auto max-w-3xl px-4 py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <h1 className="mb-8 text-3xl font-bold tracking-tight">Frequently asked questions</h1>
      <div className="space-y-3">
        {faqs.map((f) => (
          <details key={f.q} className="group rounded-lg border p-4">
            <summary className="cursor-pointer font-medium">{f.q}</summary>
            <p className="mt-3 text-muted-foreground">{f.a}</p>
          </details>
        ))}
      </div>
    </main>
  )
}
