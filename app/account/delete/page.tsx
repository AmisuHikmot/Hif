import Link from "next/link"

export const metadata = {
  title: "Delete your HIF account",
  description: "How to permanently delete your HIF account and what happens to your data.",
}

export default function DeleteAccountPage() {
  return (
    <div className="container mx-auto max-w-2xl px-4 py-12">
      <h1 className="text-3xl font-bold mb-4">Delete your HIF account</h1>
      <p className="mb-4">
        You can delete your account from the HIF App (Account, then Delete account) or from the website. Sign in, open
        your settings, and choose &quot;Delete Account Permanently&quot;.
      </p>
      <h2 className="text-xl font-semibold mt-8 mb-2">What is deleted</h2>
      <ul className="list-disc pl-6 mb-4 space-y-1">
        <li>Your profile, sign-in account and sessions</li>
        <li>Quran bookmarks and reading progress, tasbih and prayer logs, saved items and notes</li>
        <li>Event registrations, memberships, notifications and your comments</li>
        <li>Questions you asked and any mailing list entries under your email</li>
      </ul>
      <h2 className="text-xl font-semibold mt-8 mb-2">What is kept</h2>
      <p className="mb-4">
        Donation and shop order records are kept for HIF&apos;s financial accounts, as the law requires. Your name,
        email, phone number and address are removed from them. Published questions and answers stay, without your name.
      </p>
      <p className="mb-8">
        If you have an order on its way, please delete your account after it arrives. For help, use the{" "}
        <Link className="underline" href="/contact-us">
          contact page
        </Link>
        .
      </p>
      <Link className="underline" href="/dashboard/settings">
        Go to your settings
      </Link>
    </div>
  )
}
