import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Sign In to Your Account | Hamduk Islamic Foundation Member Portal",
  description: "Sign in to your Hamduk Islamic Foundation account to access your member dashboard, donations, events, and personalized settings.",
  keywords: ["sign in", "login", "member portal", "account", "authentication"],
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    title: "Sign In - Hamduk Islamic Foundation",
    description: "Access your member account",
    url: "https://hamdukislamicfoundation.org/auth/login",
    type: "website",
  },
}

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
