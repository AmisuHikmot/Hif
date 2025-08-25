import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function NewsletterSignup() {
  return (
    <section className="bg-emerald-50 py-16 dark:bg-emerald-950/20 md:py-24">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-4xl">
            Stay Connected
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
            Subscribe to our newsletter to receive updates on our activities, events, and publications.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Input type="email" placeholder="Your email address" className="max-w-md flex-1" required />
            <Button type="submit" className="w-full sm:w-auto">
              Subscribe
            </Button>
          </div>
          <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </div>
      </div>
    </section>
  )
}
