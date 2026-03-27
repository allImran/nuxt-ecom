# Change: Add Instant Order Management System

## Why

Admin staff need a streamlined interface to create and manage instant orders directly from the admin panel. The current order system requires products to exist first, but staff need to create ad-hoc orders with custom items, pricing, and customer details for phone/in-person orders. This feature will improve operational efficiency and enable faster order processing.

## What Changes

- Add new Instant Order Management routes under `/business/[business_id]/instant-orders/`
- Create order list page with filtering, search, and pagination
- Create order creation page with customer selection and dynamic order items
- Create order edit page for updating existing instant orders
- Add `useInstantOrders` composable for API integration
- Add `useCustomerSearch` composable for user lookup
- Add instant order types to type definitions
- Add instant order store for state management
- Create reusable components: `OrderTable`, `OrderForm`, `CustomerSelector`, `OrderItemsEditor`, `StatusBadge`, `OrderFilters`
- Integrate with existing authentication and luxury theme system

## Impact

- **Affected specs:** New capability `instant-order-management`
- **Affected code:**
  - New pages: `app/pages/business/[id]/instant-orders/*.vue`
  - New composables: `app/composables/useInstantOrdersViewModel.ts`, `app/composables/useCustomerSearch.ts`
  - New store: `app/stores/instantOrders.ts`
  - New network methods: `app/network/admin.ts` (extend existing)
  - New types: `app/types/instantOrder.ts`
  - New components: `app/components/instant-orders/*.vue`
- **Breaking changes:** None
- **Dependencies:**
  - Existing `/api/instant-orders` backend API (already implemented)
  - Existing authentication system
  - Existing luxury theme components
