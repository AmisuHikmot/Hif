// Shop System Utilities

export interface Product {
  id: string
  name: string
  slug: string
  description: string
  short_description: string
  price: number
  stock: number
  type: "physical" | "digital"
  category_id: string
  image_url: string
  digital_file_path: string
  is_active: boolean
  created_at: string
}

export interface Category {
  id: string
  name: string
  slug: string
  description: string
}

export interface CartItem {
  productId: string
  productName: string
  productType: "physical" | "digital"
  price: number
  quantity: number
  image_url: string
}

export interface Order {
  id: string
  reference: string
  customer_name: string
  customer_email: string
  total: number
  payment_status: "pending" | "paid" | "failed"
  order_status: "processing" | "shipped" | "delivered" | "cancelled"
  created_at: string
}

export interface PromoCode {
  id: string
  code: string
  discount_type: "percentage" | "fixed"
  discount_value: number
}

// Format price as Naira - FIXED: Added safety checks for undefined/null/NaN
export function formatPrice(amount: number | string | null | undefined): string {
  if (amount === null || amount === undefined || amount === "") {
    return "₦0.00"
  }

  const num = typeof amount === "string" ? parseFloat(amount) : amount

  if (isNaN(num as number)) {
    return "₦0.00"
  }

  return `₦${num!.toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

// Format price without currency symbol - FIXED: Added safety checks
export function formatPriceNumber(amount: number | string | null | undefined): number {
  if (amount === null || amount === undefined || amount === "") return 0
  const num = typeof amount === "string" ? parseFloat(amount) : amount
  if (isNaN(num)) return 0
  return Math.round(num * 100) / 100
}

// Cart management (localStorage)
const CART_STORAGE_KEY = "shop_cart"

export function getCart(): CartItem[] {
  if (typeof window === "undefined") return []
  const cart = localStorage.getItem(CART_STORAGE_KEY)
  return cart ? JSON.parse(cart) : []
}

export function addToCart(item: CartItem): void {
  if (typeof window === "undefined") return
  const cart = getCart()
  const existingItem = cart.find(
    (i) => i.productId === item.productId
  )

  if (existingItem) {
    existingItem.quantity += item.quantity
  } else {
    cart.push(item)
  }

  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart))
  // Dispatch custom event for subscribers
  window.dispatchEvent(new CustomEvent("cart-updated", { detail: cart }))
}

export function removeFromCart(productId: string): void {
  if (typeof window === "undefined") return
  const cart = getCart()
  const filtered = cart.filter((i) => i.productId !== productId)
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(filtered))
  window.dispatchEvent(new CustomEvent("cart-updated", { detail: filtered }))
}

export function updateCartItemQuantity(productId: string, quantity: number): void {
  if (typeof window === "undefined") return
  const cart = getCart()
  const item = cart.find((i) => i.productId === productId)
  if (item) {
    item.quantity = Math.max(1, quantity)
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart))
    window.dispatchEvent(new CustomEvent("cart-updated", { detail: cart }))
  }
}

export function clearCart(): void {
  if (typeof window === "undefined") return
  localStorage.removeItem(CART_STORAGE_KEY)
  window.dispatchEvent(new CustomEvent("cart-updated", { detail: [] }))
}

export function getCartTotal(): number {
  return getCart().reduce((total, item) => total + (item.price || 0) * item.quantity, 0)
}

export function getCartItemCount(): number {
  return getCart().reduce((count, item) => count + item.quantity, 0)
}
