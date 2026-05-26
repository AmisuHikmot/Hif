import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Create Account | Join Hamduk Islamic Foundation | Free Membership Sign Up",
  description: "Join Hamduk Islamic Foundation today. Create your free member account to register for events, make donations, access exclusive content, and connect with our community.",
  keywords: ["sign up", "register", "create account", "membership", "join", "Islamic community"],
  openGraph: {
    title: "Join Hamduk Islamic Foundation - Create Your Account",
    description: "Become part of our thriving Islamic community",
    url: "https://hamdukislamicfoundation.org/auth/register",
    type: "website",
  },
}

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
