# Navigation Structure - Visual Guide

## Header Navigation Layout

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│  [HIF Logo]  About    Conference   Membership   Media   [Shop ▼]           │
│                                                          ┌─────────────────┐
│                                                          │ Shop Home       │
│                                                          │ Shopping Cart   │
│                                                          │ Track Order     │
│                                                          └─────────────────┘
│                                          [Search]  [🛒]  [Theme]
│                                                    Badge:2
│
└─────────────────────────────────────────────────────────────────────────────┘
```

### Key Changes:
1. **Removed**: Language Switcher (previously between Search and Theme toggle)
2. **Added**: Shopping Cart Icon with Badge (now between Search and Theme)
3. **Added**: Shop Dropdown Menu (contains Shop Home, Cart, Track Order)
4. **Removed**: "Our Focus" section (moved to footer)

---

## Mobile Navigation Layout

```
┌──────────────────────────────────────┐
│ [☰] [HIF Logo]  [🔍]  [🛒] [Theme] │  Badge: 2
└──────────────────────────────────────┘
         │
         │ Opens drawer
         ▼
    ┌─────────────────────┐
    │ About               │
    │ Conference          │
    │ Membership          │
    │ Media               │
    │                     │
    │ Shop                │
    │  ├─ Shop Home       │
    │  ├─ Cart (2)        │
    │  └─ Track Order     │
    │                     │
    │ Events              │
    │ Donate              │
    │ Contact             │
    └─────────────────────┘
```

### Mobile Features:
- Shop section appears as sub-menu with icons
- Cart shows item count as badge
- Full cart integration in mobile drawer

---

## Footer Navigation Structure

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│  Organisation          Our Focus*          Get Involved      Shop &        │
│  ──────────────        ─────────────       ──────────────     Resources    │
│  • History             • Ramadan Tafsir    • Who Can Join     • Shop       │
│  • Vision & Mission    • Lectures          • Registration     • Cart       │
│  • Founders            • Training          • Membership       • Track Order│
│  • Executives          • Advocacy          • Directory        • Media      │
│  • Branches            • Overview          • Donate           • Papers     │
│                                                                • Journals   │
│                                                                            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  © 2026 Hamduk Islamic Foundation  •  [🛒]  •  Privacy • Terms • Cookies  │
│  Designed by Hamduk Digital Hub              Badge: 2                     │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘

* = NEW (moved from header)
```

### New Sections:
1. **Our Focus** - Moved from header to footer
   - Contains all focus area links
   - Maintains full accessibility

2. **Shop & Resources** - Consolidated e-commerce and media
   - Quick access to shopping pages
   - Links to informational resources

3. **Cart Icon** - Now appears in bottom bar
   - Real-time item badge
   - Consistent with header implementation

---

## Cart Icon Implementation

### Header Cart Icon
```
Location: Top-right corner, next to theme toggle
Display: 🛒 [Badge with count]
Size: 32×32px icon, 20×20px badge
Badge: 
  - Shows: "2", "9", etc.
  - Color: Emerald-600 (#10b981)
  - Displays "9+" for 10+ items
  - Only shows if cartCount > 0

Behavior:
  - Links directly to /cart
  - Updates in real-time
  - Visible on desktop and mobile
```

### Footer Cart Icon
```
Location: Bottom bar, center
Display: 🛒 [Badge with count]
Size: 32×32px icon, 16×16px badge
Badge: Same as header
Color: Slate-400 with hover effect
Hover: text-emerald-400, bg-emerald-950/30

Behavior:
  - Links directly to /cart
  - Updates in real-time
  - Hidden on mobile (space constraints)
```

---

## Shop Dropdown Menu

### Desktop View
```
┌──────────────────────┐
│ Shop                 │ ← Button with ChevronDown icon
│ ├─ 📦 Shop Home      │
│ ├─ 🛒 Shopping Cart  │
│ └─ 🚚 Track Order    │
└──────────────────────┘
```

### Features:
- Hover effect on menu items
- Icons for visual clarity
- Aligned to start of button
- Smooth transitions
- Works with keyboard navigation

---

## SEO Priority Structure

### Sitemap Priorities (Importance for Search)
```
1.0  ├─ Home (/)
0.95 ├─ Events
     ├─ Ramadan
     └─ Shop ⭐ NEW
     
0.9  ├─ Donate
     ├─ About History
     └─ Track Order ⭐ NEW
     
0.85 ├─ Auth Register
     ├─ Focus Areas
     └─ Cart ⭐ NEW
     
0.8  ├─ Branches
     ├─ Contact
     ├─ Membership
     └─ Checkout ⭐ NEW
```

### Page Metadata Coverage
```
✓ Shop Page
  - Rich keywords
  - Open Graph
  - Canonical URL
  - Proper title & description

✓ Track Order Page
  - Real-time tracking keywords
  - Delivery status focus
  - Open Graph with image
  - Canonical URL

✓ Cart Page
  - Checkout journey keywords
  - Clear purpose
  - Canonical URL
  - Product page linking
```

---

## Event Flow Diagram

### Cart Update Events
```
┌─────────────────────────────────────────────────────────┐
│                   Cart Operation                        │
│  (addToCart, removeFromCart, clearCart, etc.)          │
└────────────────────┬────────────────────────────────────┘
                     │
        ┌────────────┴────────────┐
        ▼                         ▼
   localStorage            dispatch("cart-updated")
   updated                      event
        │                         │
        │        ┌────────────────┼────────────────┐
        │        ▼                ▼                ▼
        │    [Header]         [Footer]         [Other Components]
        │      Cart             Cart             Listen &
        │     Count            Count             Update
        │    Updates           Updates            State
        │
        ▼
   Components read
   from localStorage
   and display count
```

---

## User Journey Maps

### New Customer (Shop Access)
```
Home Page → Shop Dropdown → Shop Home → Product → Add to Cart
                                               ↓
                                         Header Cart Icon
                                               ↓
                                          /cart Page
                                               ↓
                                         Track in Footer
```

### Existing Customer (Track Order)
```
Any Page → Footer "Track Order" → /track-order
              ↓
        Enter Order Ref
              ↓
        View Status
              ↓
        Download Digital Product
```

### Mobile User (Shopping)
```
Mobile Menu (☰) → Shop Section → Shop Home
                      ↓
                  Cart (2) Badge
                      ↓
                   /cart Page
                      ↓
                  Checkout
```

---

## Accessibility Features

### Cart Icon
- `aria-label="Shopping cart"` or "Shopping Cart"
- High contrast badge (emerald on white)
- Keyboard accessible links
- Focus states visible

### Shop Dropdown
- `asChild` trigger for button semantics
- Keyboard navigation (Tab, Enter, Escape)
- ARIA roles from Radix UI
- Focus management

### Footer Cart Icon
- `title="Shopping Cart"` tooltip
- Proper link semantics
- Color contrast meeting WCAG AA
- Focus indicator visible

---

## Performance Metrics

### Optimizations Applied
1. **Event-Based Updates**: No polling or interval timers
2. **Lazy Loading**: Cart loaded from localStorage on mount
3. **Minimal Re-renders**: React state updates only when needed
4. **Lightweight Icons**: Lucide icons (SVG, tree-shakeable)
5. **CSS Classes**: Tailwind utilities (no inline styles)

### Bundle Impact
- Icons: ~2KB (ShoppingCart, Package, Truck, ChevronDown)
- Logic: <1KB (event listeners, state management)
- Total Added: ~3KB (negligible impact)

---

## Testing & QA Checklist

### Desktop Testing
- [ ] Cart icon appears in header
- [ ] Cart count badge displays correctly
- [ ] Shop dropdown opens/closes on click
- [ ] Shop links navigate correctly
- [ ] Footer cart icon displays
- [ ] Footer "Our Focus" section visible
- [ ] Footer "Shop & Resources" section visible

### Mobile Testing
- [ ] Mobile menu includes Shop section
- [ ] Shop items have icons
- [ ] Cart badge shows in mobile menu
- [ ] All links function on mobile
- [ ] Drawer closes after navigation
- [ ] Footer layout responsive

### Event Testing
- [ ] Add item to cart → badge updates
- [ ] Remove item → badge decreases
- [ ] Clear cart → badge disappears
- [ ] Updates appear in header AND footer
- [ ] Cart persists on page reload
- [ ] Multiple tabs stay in sync

### SEO Testing
- [ ] Shop page appears in sitemap
- [ ] Track Order appears in sitemap
- [ ] Cart page appears in sitemap
- [ ] Meta tags render correctly
- [ ] Open Graph tags valid
- [ ] Canonical URLs present
- [ ] No duplicate content errors
