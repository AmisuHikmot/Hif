"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"
import { Mail, Phone } from "lucide-react"

export function SiteFooter() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const supabase = createClient()
      const { error } = await supabase.from("newsletters").insert({
        email,
        is_active: true,
        subscription_date: new Date().toISOString(),
      })

      if (error) {
        if (error.code === "23505") {
          toast({
            title: "Already subscribed",
            description: "This email is already subscribed to our newsletter.",
            variant: "destructive",
          })
        } else {
          throw error
        }
      } else {
        toast({
          title: "Subscribed successfully!",
          description: "Thank you for subscribing to our newsletter.",
        })
        setEmail("")
      }
    } catch (error) {
      toast({
        title: "Subscription failed",
        description: "There was an error subscribing. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* About Section */}
          <div>
            <h4 className="mb-4 text-lg font-semibold text-white">About HIF</h4>
            <p className="text-sm leading-relaxed mb-4">
              Hamduk Islamic Foundation, established in 1996, is dedicated to promoting Islamic education, community
              development, and advocacy worldwide.
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <a href="mailto:info@hif.org" className="hover:text-emerald-500 transition-colors">
                  info@hif.org
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>+234 XXX XXX XXXX</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-4 text-lg font-semibold text-white">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:text-emerald-500 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about/history" className="hover:text-emerald-500 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/about/vision" className="hover:text-emerald-500 transition-colors">
                  Vision & Mission
                </Link>
              </li>
              <li>
                <Link href="/about/branches" className="hover:text-emerald-500 transition-colors">
                  Our Branches
                </Link>
              </li>
              <li>
                <Link href="/membership/who-can-join" className="hover:text-emerald-500 transition-colors">
                  Membership
                </Link>
              </li>
            </ul>
          </div>

          {/* Our Focus */}
          <div>
            <h4 className="mb-4 text-lg font-semibold text-white">Our Focus</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/focus/ramadan-tafsir" className="hover:text-emerald-500 transition-colors">
                  Ramadan Tafsir
                </Link>
              </li>
              <li>
                <Link href="/focus/training" className="hover:text-emerald-500 transition-colors">
                  Training Programs
                </Link>
              </li>
              <li>
                <Link href="/focus/advocacy" className="hover:text-emerald-500 transition-colors">
                  Advocacy
                </Link>
              </li>
              <li>
                <Link href="/conference/islam-in-nigeria" className="hover:text-emerald-500 transition-colors">
                  Conferences
                </Link>
              </li>
              <li>
                <Link href="/events" className="hover:text-emerald-500 transition-colors">
                  Events
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="mb-4 text-lg font-semibold text-white">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/media/gallery" className="hover:text-emerald-500 transition-colors">
                  Media Gallery
                </Link>
              </li>
              <li>
                <Link href="/publications/papers" className="hover:text-emerald-500 transition-colors">
                  Publications
                </Link>
              </li>
              <li>
                <Link href="/donate" className="hover:text-emerald-500 transition-colors">
                  Donate
                </Link>
              </li>
              <li>
                <Link href="/contact-us" className="hover:text-emerald-500 transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/membership/how-to-join" className="hover:text-emerald-500 transition-colors">
                  Join Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="mb-4 text-lg font-semibold text-white">Newsletter</h4>
            <p className="text-sm mb-4">Subscribe for updates on our activities and events.</p>
            <form onSubmit={handleNewsletterSubmit} className="space-y-2">
              <input
                type="email"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-md border border-slate-700 bg-slate-800 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                required
              />
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                {isLoading ? "Subscribing..." : "Subscribe"}
              </Button>
            </form>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-800 pt-8 mb-8">
          <p className="text-sm text-slate-400 mb-4">We respect your privacy. Unsubscribe at any time.</p>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-slate-400">&copy; 2026 Hamduk Islamic Foundation. All rights reserved.</p>
          <nav className="flex gap-6 text-sm">
            <Link href="/privacy" className="text-slate-400 hover:text-emerald-500 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-slate-400 hover:text-emerald-500 transition-colors">
              Terms of Service
            </Link>
            <Link href="/cookie-policy" className="text-slate-400 hover:text-emerald-500 transition-colors">
              Cookie Policy
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  )
}
