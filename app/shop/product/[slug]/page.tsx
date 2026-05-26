import { Metadata } from "next"
import { notFound } from "next/navigation"
import Image from "next/image"
import { createAdminClient } from "@/lib/supabase/admin"
import { ProductDetailClient } from "./product-detail-client"

export const dynamic = "force-dynamic"

interface ProductDetailPageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateMetadata({
  params,
}: ProductDetailPageProps): Promise<Metadata> {
  const supabase = createAdminClient()
  const { slug } = await params

  const { data: product } = await supabase
    .from("shop_products_enhanced")
    .select("name, short_description")
    .eq("slug", slug)
    .single()

  if (!product) {
    return {
      title: "Product Not Found",
    }
  }

  return {
    title: product.name,
    description: product.short_description || "Product details",
  }
}

export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  const supabase = createAdminClient()
  const { slug } = await params

  const { data: product, error } = await supabase
    .from("shop_products_enhanced")
    .select(
      `
      id, name, slug, description, short_description, price, stock, type, 
      category_id, image_url, digital_file_path, is_active, created_at,
      shop_categories:category_id (id, name, slug)
    `
    )
    .eq("slug", slug)
    .eq("is_active", true)
    .single()

  if (error || !product) {
    notFound()
  }

  const productForClient = {
    ...product,
    shop_categories: Array.isArray(product.shop_categories)
      ? product.shop_categories[0] ?? null
      : product.shop_categories,
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-2">
          {/* Product Image */}
          <div className="rounded-lg bg-muted p-4">
            {product.image_url ? (
              <div className="relative aspect-square w-full">
                <Image
                  src={product.image_url}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="flex aspect-square items-center justify-center bg-muted-foreground/20 text-muted-foreground">
                No Image Available
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="flex flex-col gap-6">
            <ProductDetailClient product={productForClient} />
          </div>
        </div>

        {/* Description */}
        {product.description && (
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            <div>
              <h2 className="mb-4 text-2xl font-bold">About This Product</h2>
              <p className="whitespace-pre-wrap text-muted-foreground">
                {product.description}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
