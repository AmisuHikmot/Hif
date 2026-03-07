import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Contact Hamduk Islamic Foundation | Get in Touch | Support & Inquiries",
  description: "Contact Hamduk Islamic Foundation for inquiries, support, and feedback. Call us, send an email, or visit our office in Lagos, Nigeria.",
  keywords: ["contact", "inquiries", "support", "reach out", "Hamduk", "Islamic Foundation", "Nigeria"],
  openGraph: {
    title: "Contact Hamduk Islamic Foundation",
    description: "Get in touch with us for any questions or support",
    url: "https://hamdukislamicfoundation.org/contact-us",
    type: "website",
  },
}

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
