import { Metadata } from "next"
import { createClient } from "@/lib/supabase/server"
import { ShopClient } from "./shop-client"

export const metadata: Metadata = {
  title: "Shop | HIF",
  description: "Browse and purchase Islamic books, resources, and digital products",
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
    <div className="min-h-screen bg-background">
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
