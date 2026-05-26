import type { Metadata } from "next"
import { RegistrationForm } from "./registration-form"

export const metadata: Metadata = {
  title: "Membership Registration | Hamduk Islamic Foundation",
  description: "Register to become a member of Hamduk Islamic Foundation",
}

export default function RegistrationPage() {
  return (
    <main className="container mx-auto px-4 py-12">
      <div className="mb-12 text-center">
        <h1 className="mb-4 text-4xl font-bold tracking-tight text-emerald-900 dark:text-emerald-500">
          Membership Registration
        </h1>
        <p className="mx-auto max-w-3xl text-lg text-gray-600 dark:text-gray-400">
          Complete the form below and pay your membership dues to activate your membership immediately.
        </p>
      </div>

      <div className="mx-auto max-w-4xl">
        <RegistrationForm />
      </div>
    </main>
  )
}
