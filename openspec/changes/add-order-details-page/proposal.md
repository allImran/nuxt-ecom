# Change: Add Public Order Details Page

## Why

The application currently has order creation functionality, but users cannot view their order details or track order status after placing an order. An order details page is essential for e-commerce as it provides:
- Order confirmation and verification
- Order status tracking (pending, processing, shipped, delivered, etc.)
- Review of purchased items and pricing
- Shipping address verification
- Order history timeline

## What Changes

- **ADDED**: New dynamic route `/orders/[id].vue` for public order detail pages
- **ADDED**: Order detail composable `useOrderDetailViewModel` for business logic
- **ADDED**: Order detail Pinia store for state management
- **ADDED**: Public API network function `fetchOrderById` in `network/public.ts`
- **ADDED**: Order detail types for API response structures
- **ADDED**: Order detail components:
  - `OrderDetailHeader` - Order ID, status, date, total amount
  - `OrderDetailItems` - List of ordered items with product info
  - `OrderDetailShippingAddress` - Shipping address display
  - `OrderDetailStatusHistory` - Timeline of order status changes
  - `OrderDetailItem` - Individual order item card with product link
- **ADDED**: Loading skeleton states and error handling
- **ADDED**: Order status badge component with color coding

## Impact

- Affected specs: **NEW** `order-details` capability
- Affected code:
  - `app/pages/orders/[id].vue` - New page
  - `app/stores/orderDetail.ts` - New store
  - `app/composables/useOrderDetailViewModel.ts` - New composable
  - `app/network/public.ts` - Add `fetchOrderById` and order types
  - `app/components/order/` - New component directory with 5+ nested components
  - `app/types/order.ts` - Add order detail types
- Dependencies: Extends existing order types, uses location utilities for address display
