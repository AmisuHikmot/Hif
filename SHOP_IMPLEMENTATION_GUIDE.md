# HIF Online Shop System - Implementation Guide

## Overview
Complete, production-ready online shop system for selling physical and digital Islamic products using Supabase backend and Paystack for payments.

## ✅ Completed Implementation

### 1. Database Schema
- **File**: `/scripts/34-shop-system-schema.sql` & `/scripts/35-shop-triggers-and-functions.sql`
- **Tables Created**:
  - `shop_categories` - Product categories
  - `shop_products_enhanced` - Products (physical/digital)
  - `shop_promo_codes` - Discount codes
  - `shop_orders_enhanced` - Customer orders
  - `shop_order_items_enhanced` - Order line items
  - `shop_digital_downloads` - Download tokens for digital products

- **Features**:
  - Automatic stock reduction on payment
  - Digital download token generation on paid orders
  - Promo code validation and usage tracking
  - Server-side order total calculation
  - RLS policies for security

### 2. Frontend Pages

#### Shop Listing (`/app/shop/page.tsx`)
- Product grid (responsive: 2 cols mobile, 3 cols tablet, 4 cols desktop)
- Category filtering
- Price range filter
- Search functionality (debounced)
- Stock status badges
- Skeleton loaders
- Formatted prices in Nigerian Naira (₦)

#### Product Details (`/app/shop/product/[slug]/page.tsx`)
- Large product image
- Full product description
- Quantity selector with stock validation
- Digital product download notice
- Related product information
- Back to shop navigation

#### Shopping Cart (`/app/cart/page.tsx`)
- localStorage-based cart state
- Add/remove items
- Update quantities
- Real-time totals calculation
- Shipping fee logic (free for digital-only)
- Order summary panel
- Checkout button

#### Checkout (`/app/checkout/page.tsx`)
- Customer information form validation
- Promo code application
- Real-time discount calculation
- Order summary
- Paystack payment integration
- Error handling

#### Order Success (`/app/shop/order-success/page.tsx`)
- Order confirmation display
- Order reference number
- Itemized order summary
- Digital download buttons
- Download link expiry notice (72 hours, max 3 downloads)
- Customer information summary

### 3. API Routes

#### Promo Code Validation
**Route**: `POST /api/shop/validate-promo`
```javascript
// Request
{ code: "PROMO2024" }

// Response
{
  valid: true,
  id: "uuid",
  code: "PROMO2024",
  discountType: "percentage",
  discountValue: 10
}
```

#### Order Initialization
**Route**: `POST /api/shop/orders/initialize`
```javascript
// Request
{
  items: [{ productId: "uuid", quantity: 1 }],
  customerName: "John Doe",
  customerEmail: "john@example.com",
  customerPhone: "+234 800 000 0000",
  deliveryAddress: "123 Main St...",
  promoCodeId: "uuid" (optional)
}

// Response
{
  orderId: "uuid",
  reference: "shop_1234567890_abc123",
  total: 15000,
  authorizationUrl: "https://checkout.paystack.com/...",
  accessCode: "..."
}
```

#### Digital Download
**Route**: `GET /api/shop/download?token=secure-random-token`
- Returns signed URL to download file
- Increments download count
- Validates token expiry (72 hours)
- Checks max download limit (3 times)

#### Updated Payment Webhook
**Route**: `POST /api/payments/webhook`
- Handles both donations and shop orders
- Updates order payment status to "paid"
- Triggers stock reduction (via trigger)
- Generates digital download tokens (via trigger)
- Increments promo code usage

#### Updated Payment Verification
**Route**: `POST /api/payments/verify`
- Verifies Paystack payment
- Returns transaction type (donation/shop_order)
- Redirects to appropriate success page

### 4. Utility Library
**File**: `/lib/shop.ts`
- `formatPrice()` - Format amounts as Nigerian Naira
- Cart management functions (localStorage)
- `addToCart()`, `removeFromCart()`, `updateCartItemQuantity()`
- `getCart()`, `clearCart()`, `getCartTotal()`

### 5. Extended Paystack Integration
**File**: `/lib/paystack.ts`
- `initializeShopPayment()` - Initialize shop order payments
- `saveShopOrder()` - Save order with Paystack metadata

## 🔒 Security Features

1. **Server-side Validation**
   - Order totals calculated on server
   - Promo codes validated on server
   - Stock checked before order creation

2. **Webhook Security**
   - HMAC-SHA512 signature verification
   - Event source validation
   - Idempotency checks

3. **Download Security**
   - Token-based access (secure random tokens)
   - Token expiry (72 hours)
   - Download count limits (3 times)
   - Signed URLs from Supabase Storage

4. **RLS Policies**
   - Users can only view own orders
   - Admin access to all orders
   - Service role manages sensitive operations

5. **Database Triggers**
   - Atomic stock reduction
   - Prevents overselling
   - Automatic download token generation

## 📋 Environment Variables Required

```env
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_live_xxxxx
PAYSTACK_SECRET_KEY=sk_live_xxxxx
```

## 🎯 Features Implemented

✅ Product browsing with filters and search  
✅ Shopping cart with localStorage persistence  
✅ Checkout form with validation  
✅ Promo code system with validation  
✅ Paystack payment integration  
✅ Order confirmation and receipt  
✅ Digital download system with tokens  
✅ Stock management and reduction  
✅ Shipping fee calculation  
✅ Order history tracking  
✅ Responsive mobile design  
✅ Error handling and validation  
✅ Loading states and skeleton screens  

## 🚀 Future Enhancements

- Order history page in dashboard
- Admin product management
- Inventory management system
- Email receipts via Resend
- Refund/cancellation system
- PDF invoice generation
- Shipping integration
- Analytics dashboard
- Wishlist functionality
- Product reviews and ratings

## 📱 Pages Navigation

```
/shop                          - Product listing
/shop/product/[slug]          - Product details
/cart                          - Shopping cart
/checkout                      - Checkout form
/payment/callback?ref=...     - Payment verification
/shop/order-success?ref=...   - Order confirmation
```

## 🔧 Database Migrations

Execute these SQL scripts in order:
1. `/scripts/34-shop-system-schema.sql` - Creates tables and indexes
2. `/scripts/35-shop-triggers-and-functions.sql` - Creates triggers and functions

## 💡 Key Implementation Details

1. **Cart State**: localStorage stores cart, custom events for synchronization across tabs
2. **Product Types**: Support both physical (stock managed) and digital (instant download)
3. **Shipping Logic**: Free for digital-only orders, flat ₦1,500 for orders with physical items
4. **Promo Codes**: Support percentage and fixed discounts with usage limits and expiry
5. **Digital Downloads**: 72-hour expiry, 3-download limit per purchase
6. **Order Reference**: Format: `shop_timestamp_randomhex` for unique identification

## 🧪 Testing Checklist

- [ ] Browse products with filtering
- [ ] Add products to cart
- [ ] Update cart quantities
- [ ] Apply valid promo code
- [ ] Apply invalid promo code
- [ ] Complete checkout with physical product
- [ ] Complete checkout with digital product
- [ ] Verify payment callback
- [ ] Access order success page
- [ ] Download digital product
- [ ] Verify download link expiry
- [ ] Test stock reduction
- [ ] Test insufficient stock error
- [ ] Test mobile responsiveness

## 📞 Support

For issues or questions about the shop system implementation, refer to:
- Supabase documentation: https://supabase.com/docs
- Paystack API: https://paystack.com/docs/api
- Next.js documentation: https://nextjs.org/docs
