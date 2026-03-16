"use client"

import { useState, useCallback } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Download } from "lucide-react"
import { addToCart, formatPrice } from "@/lib/shop"
import type { Product } from "@/lib/shop"

interface ProductDetailClientProps {
  product: Product & {
    shop_categories?: {
      id: string
      name: string
      slug: string
    }
  }
}

export function ProductDetailClient({ product }: ProductDetailClientProps) {
  const [quantity, setQuantity] = useState(1)
  const [isAdding, setIsAdding] = useState(false)

  const maxQuantity = product.type === "digital" ? 999 : product.stock

  const handleAddToCart = useCallback(async () => {
    if (quantity <= 0 || (product.type === "physical" && quantity > product.stock)) {
      return
    }

    setIsAdding(true)
    try {
      addToCart({
        productId: product.id,
        productName: product.name,
        productType: product.type,
        price: product.price,
        quantity,
        image_url: product.image_url,
      })

      // Reset quantity after successful add
      setQuantity(1)
    } finally {
      setIsAdding(false)
    }
  }, [product, quantity])

  const isOutOfStock = product.type === "physical" && product.stock === 0

  return (
    <>
      <Link href="/shop" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" />
        Back to Shop
      </Link>

      <div>
        <h1 className="text-balance text-3xl font-bold">{product.name}</h1>
        {product.shop_categories && (
          <p className="mt-2 text-sm text-muted-foreground">
            Category:{" "}
            <Link
              href={`/shop?category=${product.shop_categories.slug}`}
              className="text-primary hover:underline"
            >
              {product.shop_categories.name}
            </Link>
          </p>
        )}
      </div>

      <div className="flex items-center gap-4">
        <div className="text-3xl font-bold">{formatPrice(product.price)}</div>
        <Badge
          variant={
            product.type === "digital" ? "default" : isOutOfStock ? "destructive" : "secondary"
          }
        >
          {product.type === "digital" ? (
            <span className="inline-flex items-center gap-1">
              <Download className="h-3 w-3" /> Digital Download
            </span>
          ) : isOutOfStock ? (
            "Out of Stock"
          ) : (
            `${product.stock} in stock`
          )}
        </Badge>
      </div>

      {product.short_description && (
        <p className="text-lg text-muted-foreground">{product.short_description}</p>
      )}

      {product.type === "digital" && (
        <div className="rounded-lg bg-primary/10 p-4 text-sm text-primary">
          📥 This product will be available for download after successful payment. You'll receive
          a download link via email.
        </div>
      )}

      <div className="space-y-4 rounded-lg border border-muted bg-muted/50 p-6">
        <h3 className="font-semibold">Add to Cart</h3>

        <Button
          size="lg"
          onClick={handleAddToCart}
          disabled={isOutOfStock || isAdding}
          className="w-full"
        >
          {isAdding ? "Adding..." : isOutOfStock ? "Out of Stock" : "Add to Cart"}
        </Button>

        <p className="text-xs text-muted-foreground">
          You can review and modify quantities in your shopping cart before checkout.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <h4 className="mb-2 font-semibold">Product Type</h4>
          <p className="text-sm text-muted-foreground capitalize">{product.type}</p>
        </div>
        {product.type === "physical" && (
          <div>
            <h4 className="mb-2 font-semibold">Availability</h4>
            <p className="text-sm text-muted-foreground">
              {product.stock > 0 ? `${product.stock} items available` : "Currently unavailable"}
            </p>
          </div>
        )}
      </div>
    </>
  )
}
