## Context

The order details page is a critical e-commerce feature that allows customers to view their order information and track status. The design follows the project's luxury theme and strict architectural patterns while providing a clear, informative view of order data.

**Constraints:**
- No logic in `.vue` files - all logic in composables
- No local variables in components - use composables for all state
- DRY principle - reusable nested components to avoid props drilling
- Mobile-first responsive design
- Follow luxury theme from `app/assets/css/main.css`
- Use Pinia stores for state management
- Use $fetch for API calls

**Stakeholders:**
- End users viewing their order details and tracking status
- Admin users managing orders

## Goals / Non-Goals

**Goals:**
1. Display comprehensive order information (items, shipping, pricing)
2. Show order status with visual badge and color coding
3. Display order status history as a timeline
4. Link order items to their product detail pages
5. Loading states and error handling
6. Mobile-responsive layout
7. Bilingual support for location names in shipping address
8. Format dates and prices according to locale

**Non-Goals:**
- Order modification/cancellation (future capability)
- Order reprint/download (future capability)
- Payment integration display (future capability)
- Real-time status updates via WebSocket (future capability)
- User authentication check - page is public

## Decisions

### Decision 1: Component Architecture - Nested Slot Pattern

**What**: Use nested slot pattern to avoid props drilling. Components will use slot composition for clean separation.

**Why**: Project.md explicitly states "Use nested slot to avoid props drilling". This keeps components decoupled and maintainable.

**Implementation**:
```vue
<OrderDetail>
  <OrderDetailHeader />
  <OrderDetailItems>
    <OrderDetailItem />
  </OrderDetailItems>
  <OrderDetailShippingAddress />
  <OrderDetailStatusHistory />
</OrderDetail>
```

### Decision 2: Order Item Display - Link to Product Details

**What**: Each order item should be clickable and navigate to the product detail page using the product slug.

**Why**: Users may want to view more details about the products they purchased or reorder the same items.

**Implementation**:
```vue
<NuxtLink :to="`/products/${item.product.slug}`">
  <OrderDetailItem :item="item" />
</NuxtLink>
```

### Decision 3: Order Status Badge - Color Coding

**What**: Display order status with color-coded badges for visual clarity.

**Why**: Color coding helps users quickly identify order status at a glance.

**Status Colors**:
- `pending` - Yellow/Orange
- `processing` - Blue
- `shipped` - Purple
- `delivered` - Green
- `cancelled` - Red
- `returned` - Gray

### Decision 4: Store Organization - Separate orderDetail Store

**What**: Create a dedicated `useOrderDetailStore` instead of reusing `useOrderStore`.

**Why**: Order detail has different state management needs:
- Single order vs order creation form
- No quantity adjustment
- Read-only display vs form state
- Status history management

**Alternatives considered:**
- Extend order store - Rejected, violates single responsibility
- No store, only composable - Rejected, project.md requires Pinia for state

### Decision 5: Status History Timeline - Vertical Display

**What**: Display order status history as a vertical timeline with icons and timestamps.

**Why**: A timeline format provides clear visual representation of order progress.

**Implementation**:
- Latest status at top
- Icon for each status type
- Timestamp formatted according to locale
- Comments displayed if available

### Decision 6: Date Formatting - Locale Aware

**What**: Format dates according to the current locale (Bengali or English).

**Why**: The project supports bilingual users, and dates should be formatted appropriately.

**Implementation**:
```typescript
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat(locale.value, {
    dateStyle: 'long',
    timeStyle: 'short'
  }).format(date)
}
```

### Decision 7: Price Display - Currency Formatting

**What**: Display prices with appropriate currency formatting.

**Why**: Consistent price display across the application.

**Implementation**:
```typescript
const formatPrice = (price: number) => {
  return new Intl.NumberFormat(locale.value, {
    style: 'currency',
    currency: 'BDT'
  }).format(price)
}
```

### Decision 8: Image Display - Product Thumbnail

**What**: Display product thumbnail images for each order item using the first image from `file_paths`.

**Why**: Visual confirmation helps users identify purchased products.

**Implementation**:
```typescript
const getProductImage = (item: OrderItem) => {
  if (item.product?.file_paths?.[0]) {
    return getPublicImage('products', item.product.file_paths[0])
  }
  return placeholderImage
}
```

## Risks / Trade-offs

- **Risk**: Order ID from URL may not correspond to a valid order
  - **Mitigation**: Proper error handling with user-friendly error message

- **Risk**: Order may contain products that have been deleted
  - **Mitigation**: API returns snapshot data (product data at time of order), display snapshot info

- **Risk**: Order status history may be empty
  - **Mitigation**: Display current status only, handle empty history gracefully

- **Trade-off**: Nested components increase file count
  - **Justification**: Improves reusability, avoids props drilling (project requirement)

- **Trade-off**: Public access without authentication
  - **Justification**: User requirement specifies public page, anyone with order ID can view

## Migration Plan

No migration needed - this is a new feature.

**Steps:**
1. Add order detail types to `types/order.ts`
2. Create network function for fetching order by ID
3. Create Pinia store for order detail state
4. Create composable for business logic
5. Create page component
6. Create nested presentation components
7. Test with sample order data

**Rollback**: Delete new files, no existing code affected.

## Open Questions

1. **Should the page require authentication?**
   - **Decision**: No - user specified "public order details page"

2. **What order statuses should be supported?**
   - **Decision**: Use whatever statuses the API returns; color code common statuses (pending, processing, shipped, delivered, cancelled)

3. **Should we show variant attributes in order items?**
   - **Decision**: Yes - show the snapshot_name which includes variant info (e.g., "test product edit (2332)")
