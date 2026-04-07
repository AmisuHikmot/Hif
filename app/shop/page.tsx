import { Metadata } from "next"
import { createClient } from "@/lib/supabase/server"
import { ShopClient } from "./shop-client"
import { CartBanner } from "@/components/shop/cart-banner"

export const metadata: Metadata = {
  title: "Islamic Shop | Books, Resources & Digital Products | Hamduk Islamic Foundation",
  description: "Shop our curated collection of Islamic books, educational resources, and digital products. Support Islamic education and knowledge dissemination through HIF's online store.",
  keywords: [
    "Islamic books",
    "Islamic resources",
    "Digital Islamic products",
    "Islamic education materials",
    "Quranic resources",
    "Islamic learning",
    "HIF shop",
  ],
  openGraph: {
    title: "Islamic Shop | Hamduk Islamic Foundation",
    description: "Browse and purchase authentic Islamic books and resources to support your faith journey.",
    url: "https://www.hif.com.ng/shop",
    type: "website",
    images: [
      {
        url: "https://www.hif.com.ng/islamic-program.png",
        width: 1200,
        height: 630,
        alt: "Islamic Shop - HIF",
      },
    ],
  },
  alternates: {
    canonical: "https://www.hif.com.ng/shop",
  },
}

export default async function ShopPage() {
  const supabase = await createClient()

  // Fetch categories and products in parallel
  const [categoriesResult, productsResult] = await Promise.all([
    supabase
      .from("shop_categories")
      .select("id, name, slug, description")
      .order("name"),
    supabase
      .from("shop_products_enhanced")
      .select(
        "id, name, slug, description, short_description, price, stock, type, category_id, image_url, is_active"
      )
      .eq("is_active", true)
      .order("created_at", { ascending: false }),
  ])

  const categories = categoriesResult.data || []
  const products = productsResult.data || []

  return (
    <div className="min-h-screen bg-background pb-24">
      <CartBanner />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground">
            Islamic Shop
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Browse our collection of Islamic books, resources, and digital products
          </p>
        </div>

        <ShopClient initialProducts={products} categories={categories} />
      </div>
    </div>
  )
}
