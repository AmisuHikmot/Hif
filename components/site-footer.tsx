import Link from "next/link"
import { Facebook, Instagram, Linkedin, Twitter, Youtube, Mail, Phone, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"

export function SiteFooter() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="mb-4 text-lg font-bold text-white">Hamduk Islamic Foundation</h3>
            <address className="not-italic space-y-3">
              <div className="flex">
                <MapPin className="mr-2 h-5 w-5 flex-shrink-0 text-emerald-500" />
                <p>
                  No. 1 Amusugbo Area, Gomajayi, adjacent Edward Street,
                  <br />
                  next turning after Seven Star Petrol Station, Agunmo,
                  <br />
                  Lagos, Nigeria.
                </p>
              </div>
              <div className="flex">
                <Phone className="mr-2 h-5 w-5 flex-shrink-0 text-emerald-500" />
                <p>+234 706 227 3586</p>
              </div>
              <div className="flex">
                <Mail className="mr-2 h-5 w-5 flex-shrink-0 text-emerald-500" />
                <p>hamdukislamicfoundation@gmail.com</p>
              </div>
            </address>
          </div>

          <div>
            <h4 className="mb-4 text-md font-semibold text-white">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="hover:text-emerald-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about/history" className="hover:text-emerald-400 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/events" className="hover:text-emerald-400 transition-colors">
                  Events
                </Link>
              </li>
              <li>
                <Link href="/contact-us" className="hover:text-emerald-400 transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/membership/who-can-join" className="hover:text-emerald-400 transition-colors">
                  Membership
                </Link>
              </li>
              <li>
                <Link href="/donate" className="hover:text-emerald-400 transition-colors">
                  Donate
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-md font-semibold text-white">Resources</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/focus/ramadan-tafsir" className="hover:text-emerald-400 transition-colors">
                  Tafsir
                </Link>
              </li>
              <li>
                <Link href="/conference/islam-in-nigeria" className="hover:text-emerald-400 transition-colors">
                  Conference
                </Link>
              </li>
              <li>
                <Link href="/publications/journals" className="hover:text-emerald-400 transition-colors">
                  Journal
                </Link>
              </li>
              <li>
                <Link href="/publications/papers" className="hover:text-emerald-400 transition-colors">
                  Islamic Papers
                </Link>
              </li>
              <li>
                <Link href="/media/videos" className="hover:text-emerald-400 transition-colors">
                  Videos
                </Link>
              </li>
              <li>
                <Link href="/media/gallery" className="hover:text-emerald-400 transition-colors">
                  Gallery
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-md font-semibold text-white">Newsletter</h4>
            <p className="mb-4">Subscribe to our newsletter to receive updates on our activities and events.</p>
            <form className="space-y-2">
              <input
                type="email"
                placeholder="Your email address"
                className="w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                required
              />
              <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700">
                Subscribe
              </Button>
            </form>

            <div className="mt-6">
              <h4 className="mb-2 text-md font-semibold text-white">Follow Us</h4>
              <div className="flex space-x-4">
                <Link href="#" className="text-gray-400 hover:text-emerald-400 transition-colors">
                  <Facebook className="h-5 w-5" />
                  <span className="sr-only">Facebook</span>
                </Link>
                <Link href="#" className="text-gray-400 hover:text-emerald-400 transition-colors">
                  <Youtube className="h-5 w-5" />
                  <span className="sr-only">Youtube</span>
                </Link>
                <Link href="#" className="text-gray-400 hover:text-emerald-400 transition-colors">
                  <Twitter className="h-5 w-5" />
                  <span className="sr-only">Twitter</span>
                </Link>
                <Link href="#" className="text-gray-400 hover:text-emerald-400 transition-colors">
                  <Instagram className="h-5 w-5" />
                  <span className="sr-only">Instagram</span>
                </Link>
                <Link href="#" className="text-gray-400 hover:text-emerald-400 transition-colors">
                  <Linkedin className="h-5 w-5" />
                  <span className="sr-only">LinkedIn</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row md:justify-between">
            <div className="text-center md:text-left">
              <p className="text-sm">
                &copy; {new Date().getFullYear()} <strong>Hamduk Islamic Foundation</strong>. All Rights Reserved
              </p>
            </div>
            <div className="mt-4 text-center md:mt-0 md:text-right">
              <p className="text-sm">
                Website Designed by{" "}
                <a href="#" className="text-emerald-400 hover:underline">
                  Hamduk Unique Concept
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
