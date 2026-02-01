# Change: Add Order Section

## Why

The product detail page currently displays product information but lacks any ordering capability. Users cannot select products, provide shipping information, or place orders. This is a critical gap for an e-commerce website as it directly affects conversion and revenue.

## What Changes

- **ADDED**: New order section component at `app/components/order/Index.vue` (already exists as placeholder)
- **ADDED**: Location data utilities for Bangladesh divisions, districts, and upazilas with bilingual support
- **ADDED**: Order state management Pinia store for products, quantities, and shipping address
- **ADDED**: Order composable `useOrderViewModel` for business logic
- **ADDED**: Order API network function `createOrder` in `network/public.ts`
- **ADDED**: Order form components:
  - `OrderAddressSection` - Division, district, upazila selectors with search
  - `OrderProductSection` - Product list with quantity controls
  - `OrderPaymentSection` - Payment method selection (COD only)
  - `OrderSummary` - Price breakdown and submit button
- **ADDED**: I18n translations for order-related UI in both Bengali and English
- **ADDED**: Order types and interfaces
- **MODIFIED**: Product detail page to pass product data to order component

## Impact

- Affected specs: **NEW** `order` capability
- Affected code:
  - `app/components/order/Index.vue` - Replace placeholder with full implementation
  - `app/components/order/` - New nested component directory
  - `app/stores/order.ts` - New store
  - `app/composables/useOrderViewModel.ts` - New composable
  - `app/network/public.ts` - Add `createOrder` function
  - `app/utils/` - New location data utilities
  - `app/types/` - Add order-related types
  - `i18n/locales/` - Add order translations
- Dependencies:
  - Location JSON files in `/public/` (divisions.json, districts.json, upazilas.json)
  - Existing Product types from `network/public.ts`
  - Existing locale store for language switching
