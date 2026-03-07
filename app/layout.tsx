import type React from "react"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { ThemeProvider } from "@/components/theme-provider"
import { LanguageProvider } from "@/contexts/language-context"
import { AuthProvider } from "@/contexts/auth-context"
import { Toaster } from "@/components/ui/toaster"
import { CookieBanner } from "@/components/cookie-banner"
import "./globals.css"

const geistSans = Geist({ subsets: ["latin"], variable: "--font-sans" })
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono" })

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#1e3a5f",
}

export const metadata = {
  title: "Hamduk Islamic Foundation | Faith, Knowledge & Charity",
  description: "Hamduk Islamic Foundation (HIF) is a premier Islamic organization founded in 1996, dedicated to advancing Islamic education, charitable works, and community development worldwide.",
  keywords: ["Islamic Foundation", "Islam", "Education", "Charity", "Community", "Hamduk", "Nigeria", "Islamic events"],
  generator: "Hamduk Islamic Foundation",
  metadataBase: new URL("https://www.hif.com.ng"),
  openGraph: {
    title: "Hamduk Islamic Foundation | Faith, Knowledge & Charity",
    description: "Dedicated to Islamic education, charitable works, and community development since 1996",
    url: "https://www.hif.com.ng",
    siteName: "Hamduk Islamic Foundation",
    images: [
      {
        url: "https://www.hif.com.ng/placeholder-logo.png",
        width: 1200,
        height: 630,
        alt: "Hamduk Islamic Foundation",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hamduk Islamic Foundation",
    description: "Faith, Knowledge & Charity",
    images: ["https://www.hif.com.ng/placeholder-logo.png"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.png", sizes: "192x192" },
      { url: "/icon-light-32x32.png", sizes: "32x32", media: "(prefers-color-scheme: light)" },
      { url: "/icon-dark-32x32.png", sizes: "32x32", media: "(prefers-color-scheme: dark)" },
    ],
    apple: "/apple-icon.png",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://www.hif.com.ng",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Hamduk Islamic Foundation",
    alternateName: "HIF",
    url: "https://www.hif.com.ng",
    logo: "https://www.hif.com.ng/placeholder-logo.png",
    description: "A premier Islamic organization dedicated to advancing Islamic education, charitable works, and community development worldwide since 1996.",
    foundingDate: "1996",
    foundingLocation: "Nigeria",
    address: {
      "@type": "PostalAddress",
      addressCountry: "NG",
      addressRegion: "Nigeria",
    },
    sameAs: [
      "https://www.facebook.com/hamdukislamicfoundation",
      "https://www.twitter.com/hamdukislamic",
      "https://www.instagram.com/hamdukislamic",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Customer Service",
      email: "info@hif.com.ng",
    },
  };

  const navigationSchema = {
    "@context": "https://schema.org",
    "@type": "SiteNavigationElement",
    name: "Hamduk Islamic Foundation",
    url: "https://www.hif.com.ng",
    mainEntity: {
      "@type": "ItemList",
      itemListElement: [
        {
          "@type": "SiteNavigationElement",
          position: 1,
          name: "About Us",
          url: "https://www.hif.com.ng/about/history",
          description: "Learn about Hamduk Islamic Foundation's mission, vision, and history since 1996",
        },
        {
          "@type": "SiteNavigationElement",
          position: 2,
          name: "Events",
          url: "https://www.hif.com.ng/events",
          description: "Discover and register for upcoming Islamic events, conferences, and programs",
        },
        {
          "@type": "SiteNavigationElement",
          position: 3,
          name: "Ramadan",
          url: "https://www.hif.com.ng/ramadan",
          description: "Special Ramadan programs, reflections, duas, and daily reminders",
        },
        {
          "@type": "SiteNavigationElement",
          position: 4,
          name: "Donate",
          url: "https://www.hif.com.ng/donate",
          description: "Support our charitable mission and community development programs",
        },
        {
          "@type": "SiteNavigationElement",
          position: 5,
          name: "Contact",
          url: "https://www.hif.com.ng/contact-us",
          description: "Get in touch with Hamduk Islamic Foundation for inquiries and support",
        },
        {
          "@type": "SiteNavigationElement",
          position: 6,
          name: "Sign In",
          url: "https://www.hif.com.ng/auth/login",
          description: "Access your member account and personalized dashboard",
        },
        {
          "@type": "SiteNavigationElement",
          position: 7,
          name: "Sign Up",
          url: "https://www.hif.com.ng/auth/register",
          description: "Join our community and become a member of Hamduk Islamic Foundation",
        },
      ],
    },
  };

  return (
    <html lang="en" suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
          suppressHydrationWarning
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(navigationSchema) }}
          suppressHydrationWarning
        />
      </head>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <AuthProvider>
            <LanguageProvider>
              <div className="relative flex min-h-screen flex-col">
                <SiteHeader />
                <div className="flex-1 pt-16">{children}</div>
                <SiteFooter />
                <CookieBanner />
              </div>
              <Toaster />
            </LanguageProvider>
          </AuthProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
