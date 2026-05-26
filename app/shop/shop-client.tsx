"use client"

import { useState, useMemo, useCallback, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { addToCart, removeFromCart, updateCartItemQuantity, getCart, formatPrice } from "@/lib/shop"
import type { Product, Category } from "@/lib/shop"
import { Minus, Plus, ShoppingCart, SlidersHorizontal, X, Search, Loader2 } from "lucide-react"

interface ShopClientProps {
  initialProducts: Product[]
  categories: Category[]
}

// ─── Quantity Counter ─────────────────────────────────────────────────────────
function QuantityCounter({
  quantity,
  onIncrease,
  onDecrease,
  max,
}: {
  quantity: number
  onIncrease: () => void
  onDecrease: () => void
  max?: number
}) {
  return (
    <div className="flex flex-1 items-center justify-between rounded-md border border-primary bg-primary/5 px-1">
      <button
        onClick={onDecrease}
        className="flex h-7 w-7 items-center justify-center rounded text-primary transition hover:bg-primary/10 active:scale-95"
        aria-label="Decrease quantity"
      >
        <Minus className="h-3.5 w-3.5" />
      </button>
      <span className="min-w-[1.5rem] text-center text-sm font-semibold tabular-nums text-primary">
        {quantity}
      </span>
      <button
        onClick={onIncrease}
        disabled={max !== undefined && quantity >= max}
        className="flex h-7 w-7 items-center justify-center rounded text-primary transition hover:bg-primary/10 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
        aria-label="Increase quantity"
      >
        <Plus className="h-3.5 w-3.5" />
      </button>
    </div>
  )
}

// ─── Product Card ─────────────────────────────────────────────────────────────
function ProductCard({ product }: { product: Product }) {
  const [cartQty, setCartQty] = useState(0)
  const [adding, setAdding] = useState(false)

  // Sync with cart on mount and cart updates
  useEffect(() => {
    const syncCart = () => {
      const cart = getCart()
      const item = cart.find((i: any) => i.productId === product.id)
      setCartQty(item?.quantity ?? 0)
    }
    syncCart()
    window.addEventListener("cart-updated", syncCart)
    return () => window.removeEventListener("cart-updated", syncCart)
  }, [product.id])

  const isOutOfStock = product.stock <= 0 && product.type === "physical"
  const maxQty = product.type === "physical" ? product.stock : undefined

  const handleAdd = async () => {
    if (isOutOfStock) return
    setAdding(true)
    addToCart({
      productId: product.id,
      productName: product.name,
      productType: product.type,
      price: product.price,
      quantity: 1,
      image_url: product.image_url,
    })
    // Small delay for feedback
    await new Promise((r) => setTimeout(r, 300))
    setAdding(false)
  }

  const handleIncrease = () => {
    updateCartItemQuantity(product.id, cartQty + 1)
  }

  const handleDecrease = () => {
    if (cartQty <= 1) {
      removeFromCart(product.id)
    } else {
      updateCartItemQuantity(product.id, cartQty - 1)
    }
  }

  return (
    <Card className="group overflow-hidden transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5">
      {/* Image */}
      <Link href={`/shop/product/${product.slug}`} className="block">
        <div className="relative h-48 w-full overflow-hidden bg-muted">
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground text-sm">
              No Image
            </div>
          )}
          {/* Type badge overlaid on image */}
          <div className="absolute top-2 left-2">
            <Badge
              variant="secondary"
              className="text-xs backdrop-blur-sm bg-background/80"
            >
              {product.type === "digital" ? "Digital" : "Physical"}
            </Badge>
          </div>
          {/* Out of stock overlay */}
          {isOutOfStock && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <span className="rounded-md bg-destructive px-3 py-1 text-xs font-semibold text-destructive-foreground">
                Out of Stock
              </span>
            </div>
          )}
        </div>
      </Link>

      <div className="flex flex-col gap-2 p-4">
        <Link href={`/shop/product/${product.slug}`} className="hover:underline underline-offset-2">
          <h3 className="line-clamp-2 font-semibold text-sm leading-snug">{product.name}</h3>
        </Link>

        {product.short_description && (
          <p className="line-clamp-2 text-xs text-muted-foreground">
            {product.short_description}
          </p>
        )}

        <div className="flex items-center justify-between pt-1">
          <p className="text-lg font-bold">{formatPrice(product.price)}</p>
          {!isOutOfStock && (
            <span className="text-xs text-muted-foreground">
              {product.type === "digital"
                ? "Instant download"
                : `${product.stock} left`}
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-1">
          <Button variant="outline" size="sm" className="flex-1 text-xs" asChild>
            <Link href={`/shop/product/${product.slug}`}>Details</Link>
          </Button>

          {cartQty > 0 ? (
            <QuantityCounter
              quantity={cartQty}
              onIncrease={handleIncrease}
              onDecrease={handleDecrease}
              max={maxQty}
            />
          ) : (
            <Button
              size="sm"
              className="flex-1 text-xs gap-1.5"
              onClick={handleAdd}
              disabled={isOutOfStock || adding}
            >
              {adding ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <ShoppingCart className="h-3.5 w-3.5" />
              )}
              {adding ? "Adding…" : "Add to Cart"}
            </Button>
          )}
        </div>
      </div>
    </Card>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────
export function ShopClient({ initialProducts, categories }: ShopClientProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000])
  const [showFilters, setShowFilters] = useState(false)
  const [sortBy, setSortBy] = useState<"default" | "price-asc" | "price-desc" | "name">("default")

  const maxPrice = Math.max(...initialProducts.map((p) => p.price), 100000)

  const filteredProducts = useMemo(() => {
    let list = initialProducts.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = !selectedCategory || product.category_id === selectedCategory
      const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1]
      return matchesSearch && matchesCategory && matchesPrice
    })

    if (sortBy === "price-asc") list = [...list].sort((a, b) => a.price - b.price)
    if (sortBy === "price-desc") list = [...list].sort((a, b) => b.price - a.price)
    if (sortBy === "name") list = [...list].sort((a, b) => a.name.localeCompare(b.name))

    return list
  }, [initialProducts, searchTerm, selectedCategory, priceRange, sortBy])

  const activeFilterCount = [
    searchTerm !== "",
    selectedCategory !== null,
    priceRange[0] !== 0 || priceRange[1] !== maxPrice,
  ].filter(Boolean).length

  const clearFilters = () => {
    setSearchTerm("")
    setSelectedCategory(null)
    setPriceRange([0, maxPrice])
    setSortBy("default")
  }

  // ── Filter Sidebar (shared between desktop + mobile) ──
  const FilterSidebar = () => (
    <div className="space-y-6">
      {/* Search */}
      <div>
        <label className="mb-2 block text-sm font-medium">Search</label>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Categories */}
      <div>
        <label className="mb-3 block text-sm font-medium">Categories</label>
        <div className="space-y-1">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`block w-full text-left rounded-md px-3 py-2 text-sm transition ${selectedCategory === null
                ? "bg-primary text-primary-foreground"
                : "hover:bg-muted"
              }`}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(selectedCategory === cat.id ? null : cat.id)}
              className={`block w-full text-left rounded-md px-3 py-2 text-sm transition ${selectedCategory === cat.id
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
        <div className="mt-3 flex gap-2">
          <div className="flex-1">
            <label className="text-xs font-medium text-muted-foreground">Min</label>
            <Input
              type="number"
              min={0}
              value={priceRange[0]}
              onChange={(e) => {
                const val = parseInt(e.target.value) || 0
                setPriceRange([Math.min(val, priceRange[1]), priceRange[1]])
              }}
              className="mt-1 text-sm"
            />
          </div>
          <div className="flex-1">
            <label className="text-xs font-medium text-muted-foreground">Max</label>
            <Input
              type="number"
              min={0}
              value={priceRange[1]}
              onChange={(e) => {
                const val = parseInt(e.target.value) || maxPrice
                setPriceRange([priceRange[0], Math.max(val, priceRange[0])])
              }}
              className="mt-1 text-sm"
            />
          </div>
        </div>
        <div className="mt-1 flex justify-between text-xs text-muted-foreground">
          <span>{formatPrice(priceRange[0])}</span>
          <span>{formatPrice(priceRange[1])}</span>
        </div>
      </div>

      {/* Clear filters */}
      {activeFilterCount > 0 && (
        <button
          onClick={clearFilters}
          className="flex w-full items-center justify-center gap-1.5 rounded-md border border-destructive/40 py-2 text-sm text-destructive transition hover:bg-destructive/5"
        >
          <X className="h-3.5 w-3.5" />
          Clear all filters
        </button>
      )}
    </div>
  )

  return (
    <div className="space-y-4">
      {/* ── Top bar: sort + mobile filter toggle ── */}
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">
          {filteredProducts.length} product{filteredProducts.length !== 1 ? "s" : ""}
          {activeFilterCount > 0 && (
            <button
              onClick={clearFilters}
              className="ml-2 text-primary underline underline-offset-2 text-xs"
            >
              Clear filters
            </button>
          )}
        </p>

        <div className="flex items-center gap-2">
          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="rounded-md border border-input bg-background px-3 py-1.5 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
          >
            <option value="default">Sort: Default</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="name">Name: A–Z</option>
          </select>

          {/* Mobile filter toggle */}
          <button
            onClick={() => setShowFilters((v) => !v)}
            className="flex items-center gap-1.5 rounded-md border border-input bg-background px-3 py-1.5 text-sm shadow-sm transition hover:bg-muted lg:hidden"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filters
            {activeFilterCount > 0 && (
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile filters drawer */}
      {showFilters && (
        <div className="rounded-xl border bg-card p-4 shadow-sm lg:hidden">
          <div className="mb-3 flex items-center justify-between">
            <span className="font-semibold text-sm">Filters</span>
            <button onClick={() => setShowFilters(false)}>
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>
          <FilterSidebar />
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-4">
        {/* Desktop sidebar */}
        <div className="hidden lg:block lg:col-span-1">
          <div className="sticky top-24 rounded-xl border bg-card p-4 shadow-sm">
            <FilterSidebar />
          </div>
        </div>

        {/* Products Grid */}
        <div className="lg:col-span-3">
          {filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed p-12 text-center">
              <ShoppingCart className="mb-3 h-10 w-10 text-muted-foreground/40" />
              <p className="font-medium text-muted-foreground">No products found</p>
              <p className="mt-1 text-sm text-muted-foreground/70">Try adjusting your filters</p>
              {activeFilterCount > 0 && (
                <button
                  onClick={clearFilters}
                  className="mt-4 text-sm text-primary underline underline-offset-2"
                >
                  Clear all filters
                </button>
              )}
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}