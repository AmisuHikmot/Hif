"use client"

import { useState, useMemo, useCallback } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { addToCart, formatPrice } from "@/lib/shop"
import type { Product, Category } from "@/lib/shop"

interface ShopClientProps {
  initialProducts: Product[]
  categories: Category[]
}

export function ShopClient({ initialProducts, categories }: ShopClientProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000])

  const filteredProducts = useMemo(() => {
    return initialProducts.filter((product) => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesCategory = !selectedCategory || product.category_id === selectedCategory
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1]

      return matchesSearch && matchesCategory && matchesPrice
    })
  }, [initialProducts, searchTerm, selectedCategory, priceRange])

  const handleAddToCart = useCallback(
    (product: Product) => {
      if (product.stock <= 0 && product.type === "physical") {
        return
      }

      addToCart({
        productId: product.id,
        productName: product.name,
        productType: product.type,
        price: product.price,
        quantity: 1,
        image_url: product.image_url,
      })

      // Show toast notification (optional)
      alert(`${product.name} added to cart!`)
    },
    []
  )

  const maxPrice = Math.max(...initialProducts.map((p) => p.price), 100000)

  return (
    <div className="grid gap-8 lg:grid-cols-4">
      {/* Sidebar Filters */}
      <div className="lg:col-span-1">
        <div className="space-y-6">
          {/* Search */}
          <div>
            <label className="mb-2 block text-sm font-medium">Search</label>
            <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Categories */}
          <div>
            <label className="mb-3 block text-sm font-medium">Categories</label>
            <div className="space-y-2">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`block w-full text-left rounded px-3 py-2 text-sm transition ${
                  selectedCategory === null
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted"
                }`}
              >
                All Categories
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() =>
                    setSelectedCategory(selectedCategory === cat.id ? null : cat.id)
                  }
                  className={`block w-full text-left rounded px-3 py-2 text-sm transition ${
                    selectedCategory === cat.id
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div>
            <label className="mb-3 block text-sm font-medium">Price Range</label>
            <Slider
              min={0}
              max={maxPrice}
              step={1000}
              value={priceRange}
              onValueChange={(value) => setPriceRange([value[0], value[1]])}
              className="w-full"
            />
            <div className="mt-2 flex justify-between text-xs text-muted-foreground">
              <span>{formatPrice(priceRange[0])}</span>
              <span>{formatPrice(priceRange[1])}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="lg:col-span-3">
        {filteredProducts.length === 0 ? (
          <div className="rounded-lg border border-dashed border-muted-foreground p-8 text-center">
            <p className="text-muted-foreground">No products found matching your criteria.</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
            {filteredProducts.map((product) => (
              <Card
                key={product.id}
                className="overflow-hidden transition hover:shadow-lg"
              >
                <div className="relative h-48 w-full bg-muted">
                  {product.image_url ? (
                    <Image
                      src={product.image_url}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-muted text-muted-foreground">
                      No Image
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-3 p-4">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="line-clamp-2 font-semibold text-sm">{product.name}</h3>
                    <Badge variant="outline" className="shrink-0">
                      {product.type === "digital" ? "Digital" : "Physical"}
                    </Badge>
                  </div>

                  {product.short_description && (
                    <p className="line-clamp-2 text-xs text-muted-foreground">
                      {product.short_description}
                    </p>
                  )}

                  <div className="flex items-center justify-between pt-2">
                    <p className="text-lg font-bold">{formatPrice(product.price)}</p>
                    <Badge
                      variant={product.stock > 0 || product.type === "digital" ? "secondary" : "destructive"}
                      className="text-xs"
                    >
                      {product.type === "digital"
                        ? "Available"
                        : product.stock > 0
                        ? `${product.stock} in stock`
                        : "Out of Stock"}
                    </Badge>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      asChild
                    >
                      <Link href={`/shop/product/${product.slug}`}>Details</Link>
                    </Button>
                    <Button
                      size="sm"
                      className="flex-1"
                      onClick={() => handleAddToCart(product)}
                      disabled={product.stock <= 0 && product.type === "physical"}
                    >
                      Add to Cart
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
