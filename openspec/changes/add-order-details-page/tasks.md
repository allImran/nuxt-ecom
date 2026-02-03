## 1. Type Definitions

- [x] 1.1 Add order detail types to `app/types/order.ts`:
  - `OrderDetail` - Full order response type
  - `OrderItem` - Order item with product snapshot
  - `OrderHistory` - Order status history entry
  - `OrderShippingAddress` - Shipping address display type
- [x] 1.2 Export types from `app/network/public.ts` for consistency

## 2. Network Layer

- [x] 2.1 Add `fetchOrderById` function to `app/network/public.ts`
- [x] 2.2 Define `OrderDetail`, `OrderItem`, `OrderHistory` interfaces in public.ts
- [x] 2.3 Add error handling for 404 (order not found) and other errors

## 3. State Management (Pinia Store)

- [x] 3.1 Create `app/stores/orderDetail.ts` with Setup Store pattern
- [x] 3.2 Add state: order, loading, error
- [x] 3.3 Add computed: hasOrder, orderItems, statusHistory, formattedDate, formattedTotal
- [x] 3.4 Add actions: fetchOrderById, reset
- [x] 3.5 Add error handling with try-catch blocks

## 4. Business Logic (Composable)

- [x] 4.1 Create `app/composables/useOrderDetailViewModel.ts`
- [x] 4.2 Connect to orderDetail store using storeToRefs
- [x] 4.3 Import locale store for bilingual support
- [x] 4.4 Add helper functions:
  - `formatPrice` - Format prices as BDT currency
  - `formatDate` - Format dates according to locale
  - `getProductImage` - Get product thumbnail URL using getPublicImage
  - `getProductSlug` - Get product slug from order item
  - `getStatusColor` - Get color class for order status
  - `calculateItemTotal` - Calculate order item total (price × quantity)
  - `calculateSubtotal` - Calculate sum of all item totals

## 5. Page Component

- [x] 5.1 Create `app/pages/orders/[id].vue`
- [x] 5.2 Add page metadata (useHead for SEO)
- [x] 5.3 Set up default layout
- [x] 5.4 Call composable in onMounted to fetch order by ID
- [x] 5.5 Handle loading state with skeleton
- [x] 5.6 Handle error state with error message and back button
- [x] 5.7 Render order detail components when data loaded

## 6. Order Components - Header

- [x] 6.1 Create `app/components/order/OrderDetailHeader.vue` (container)
- [x] 6.2 Create `app/components/order/OrderDetailHeaderInfo.vue` (order ID, date)
- [x] 6.3 Create `app/components/order/OrderDetailHeaderTotal.vue` (total amount)
- [x] 6.4 Create `app/components/order/OrderDetailStatusBadge.vue` (status with color)
- [x] 6.5 Implement status color mapping (pending=yellow, processing=blue, shipped=purple, delivered=green, cancelled=red, returned=gray)
- [x] 6.6 Style with luxury theme colors and spacing

## 7. Order Components - Items List

- [x] 7.1 Create `app/components/order/OrderDetailItems.vue` (container)
- [x] 7.2 Create `app/components/order/OrderDetailItem.vue` (individual item card)
- [x] 7.3 Display product thumbnail using getPublicImage utility
- [x] 7.4 Display snapshot_name (product name with variant info)
- [x] 7.5 Display quantity and price at purchase
- [x] 7.6 Calculate and display item total
- [x] 7.7 Wrap item in NuxtLink to product detail page using product slug
- [x] 7.8 Show placeholder image when no file_paths available

## 8. Order Components - Shipping Address

- [x] 8.1 Create `app/components/order/OrderDetailShippingAddress.vue`
- [x] 8.2 Display full_name, mobile, address
- [x] 8.3 Display division_name, district_name (if exists), upazila_name (if exists)
- [x] 8.4 Use location icon from UI components
- [x] 8.5 Style with luxury theme

## 9. Order Components - Status History Timeline

- [x] 9.1 Create `app/components/order/OrderDetailStatusHistory.vue` (container)
- [x] 9.2 Create `app/components/order/OrderDetailStatusHistoryItem.vue` (individual timeline entry)
- [x] 9.3 Display vertical timeline with icons for each status
- [x] 9.4 Display status name, formatted timestamp
- [x] 9.5 Display comment if available
- [x] 9.6 Order entries by changed_at descending (newest first)
- [x] 9.7 Handle empty history (don't render section)

## 10. Order Components - Totals Summary

- [x] 10.1 Create `app/components/order/OrderDetailTotals.vue`
- [x] 10.2 Calculate and display subtotal from order items
- [x] 10.3 Display delivery fee (if applicable, check if total > calculated subtotal)
- [x] 10.4 Display total amount matching API response
- [x] 10.5 Format all prices using formatPrice helper
- [x] 10.6 Style with luxury theme typography

## 11. UI Components - Loading States

- [x] 11.1 Add skeleton loader component for order header
- [x] 11.2 Add skeleton loader for order items list
- [x] 11.3 Add skeleton loader for shipping address section
- [x] 11.4 Add skeleton loader for status history section
- [x] 11.5 Ensure skeleton matches final layout structure
- [x] 11.6 Apply shimmer animation from existing theme

## 12. UI Components - Error State

- [x] 12.1 Create error state component for order not found
- [x] 12.2 Display appropriate icon (alert-circle or similar)
- [x] 12.3 Show user-friendly error message
- [x] 12.4 Provide "Back to Home" button
- [x] 12.5 Provide "Retry" button for network errors

## 13. Styling and Responsiveness

- [x] 13.1 Implement desktop layout with appropriate spacing
- [x] 13.2 Implement mobile layout (vertical stack)
- [x] 13.3 Implement tablet layout (adapted grid/spacing)
- [x] 13.4 Apply luxury theme colors from main.css
- [x] 13.5 Apply luxury border radius and letter spacing
- [x] 13.6 Add transitions and hover effects where appropriate
- [x] 13.7 Ensure dark mode compatibility
- [x] 13.8 Test on various screen sizes

## 14. Bilingual Support

- [x] 14.1 Use locale store to determine current locale
- [x] 14.2 Format dates using Intl.DateTimeFormat with locale
- [x] 14.3 Format prices using Intl.NumberFormat with locale
- [x] 14.4 Display location names as provided from API (already localized)

## 15. Integration

- [x] 15.1 Verify order items link to correct product detail pages
- [x] 15.2 Test with sample order ID
- [x] 15.3 Test back button and browser navigation
- [x] 15.4 Verify navigation from order confirmation (if applicable)

## 16. Testing and Validation

- [x] 16.1 Test page with valid order ID
- [x] 16.2 Test loading state with slow API
- [x] 16.3 Test error state with invalid order ID
- [x] 16.4 Test error state with network error
- [x] 16.5 Test order item navigation to product detail
- [x] 16.6 Test responsive behavior on mobile
- [x] 16.7 Test dark mode switching
- [x] 16.8 Test bilingual locale switching
- [x] 16.9 Verify no console errors (build passed successfully)
- [x] 16.10 Verify all project.md constraints met (no logic in .vue, composables only, etc.)
