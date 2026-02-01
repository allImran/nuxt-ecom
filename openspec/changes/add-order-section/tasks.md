## 1. Type Definitions

- [x] 1.1 Create `LocationData` interface in `app/types/location.ts` (id, name, bn_name, division_id, district_id)
- [x] 1.2 Create `OrderProduct` interface in `app/types/order.ts` (id, variant_id, quantity)
- [x] 1.3 Create `ShippingAddress` interface in `app/types/order.ts` (division, division_name, district?, district_name?, upazila?, upazila_name?, address, mobile)
- [x] 1.4 Create `CreateOrderRequest` interface in `app/types/order.ts`
- [x] 1.5 Update `I18nMessages` interface in `app/types/i18n.ts` to include `order` namespace

## 2. Location Data Utilities

- [x] 2.1 Create `app/utils/location.ts` with location data import functions
- [x] 2.2 Add `parseDivisions()` function to parse divisions.json structure
- [x] 2.3 Add `parseDistricts()` function to parse districts.json structure
- [x] 2.4 Add `parseUpazilas()` function to parse upazilas.json structure
- [x] 2.5 Export `divisions`, `districts`, `upazilas` arrays with proper typing
- [x] 2.6 Add `getLocationName()` utility for bilingual name retrieval
- [x] 2.7 Add `filterLocationsByParent()` utility for cascading filters
- [x] 2.8 Add `searchLocations()` utility for searching by both languages

## 3. Network Layer (API)

- [x] 3.1 Add `CreateOrderRequest` type to `app/network/public.ts`
- [x] 3.2 Add `createOrder(request: CreateOrderRequest)` function to `publicNetwork` object
- [x] 3.3 Implement POST request to `/order` endpoint using $fetch
- [x] 3.4 Add proper error handling with try-catch

## 4. State Management (Pinia Store)

- [x] 4.1 Create `app/stores/order.ts` with Setup Store pattern
- [x] 4.2 Add state: `orderProducts` (ref<OrderProduct[]>)
- [x] 4.3 Add state: `selectedDivision`, `selectedDistrict`, `selectedUpazila` (refs)
- [x] 4.4 Add state: `fullAddress`, `mobileNumber` (refs)
- [x] 4.5 Add state: `loading`, `error` (refs)
- [x] 4.6 Add computed: `availableDistricts` - filtered by selected division
- [x] 4.7 Add computed: `availableUpazilas` - filtered by selected district
- [x] 4.8 Add computed: `productsForSubmission` - filter products with quantity > 0
- [x] 4.9 Add computed: `subtotal` - sum of product prices × quantities
- [x] 4.10 Add computed: `total` - subtotal + delivery fee (100)
- [x] 4.11 Add action: `initializeOrderProducts(products: Product[])` - set up products with quantity 0
- [x] 4.12 Add action: `updateQuantity(productId, variantId, quantity)` - update product quantity
- [x] 4.13 Add action: `setAddressField(field, value)` - update address fields
- [x] 4.14 Add action: `submitOrder()` - call network layer
- [x] 4.15 Add action: `resetOrder()` - clear all state after submission
- [x] 4.16 Add action: `validateOrder()` - check if order can be submitted
- [x] 4.17 Import location utilities for cascading dropdowns

## 5. Business Logic (Composable)

- [x] 5.1 Create `app/composables/useOrderViewModel.ts`
- [x] 5.2 Connect to order store using `storeToRefs`
- [x] 5.3 Connect to locale store for bilingual support
- [x] 5.4 Add `isBangla` computed for locale detection
- [x] 5.5 Add `getDeliveryFee()` constant (100)
- [x] 5.6 Add `getProductPrice(product: Product)` helper - return first variant price
- [x] 5.7 Add `getDivisionName(division: LocationData)` helper - bilingual
- [x] 5.8 Add `getDistrictName(district: LocationData)` helper - bilingual
- [x] 5.9 Add `getUpazilaName(upazila: LocationData)` helper - bilingual
- [x] 5.10 Add `buildShippingAddress(): ShippingAddress` helper - construct for API
- [x] 5.11 Add `searchDivisions(query: string)` function
- [x] 5.12 Add `searchDistricts(query: string)` function
- [x] 5.13 Add `searchUpazilas(query: string)` function
- [x] 5.14 Add `handleQuantityChange(productId, variantId, delta)` function
- [x] 5.15 Add `handleSubmit()` function with validation
- [x] 5.16 Export all state, computed, and actions for components

## 6. I18n Translations

- [x] 6.1 Add `order` namespace to `i18n/locales/en.json`
- [x] 6.2 Add translations: title, division, district, upazila, fullAddress, mobileNumber
- [x] 6.3 Add translations: quantity, subtotal, deliveryFee, total, placeOrder
- [x] 6.4 Add translations: cashOnDelivery, othersComingSoon
- [x] 6.5 Add translations: validation messages (required, noProducts, invalidPhone)
- [x] 6.6 Add translations: success message, error messages
- [x] 6.7 Add `order` namespace to `i18n/locales/bn.json` with Bengali translations
- [x] 6.8 Verify all translation keys match the I18nMessages interface

## 7. Order Components - Address Section

- [x] 7.1 Create `app/components/order/OrderAddressSection.vue` (container)
- [x] 7.2 Create `app/components/order/OrderDivisionSelect.vue` with search
- [x] 7.3 Create `app/components/order/OrderDistrictSelect.vue` with search (optional)
- [x] 7.4 Create `app/components/order/OrderUpazilaSelect.vue` with search (optional)
- [x] 7.5 Create `app/components/order/OrderAddressInput.vue` for text area
- [x] 7.6 Create `app/components/order/OrderMobileInput.vue` for phone input
- [x] 7.7 Implement cascading behavior (division → district → upazila)
- [x] 7.8 Implement bilingual display based on current locale
- [x] 7.9 Implement search functionality for each selector
- [x] 7.10 Add validation for required fields

## 8. Order Components - Product Section

- [x] 8.1 Create `app/components/order/OrderProductSection.vue` (container)
- [x] 8.2 Create `app/components/order/OrderProductItem.vue` for individual products
- [x] 8.3 Create `app/components/order/OrderProductInfo.vue` (name, price)
- [x] 8.4 Create `app/components/order/OrderQuantityControl.vue` (+/- buttons)
- [x] 8.5 Display product price from first variant
- [x] 8.6 Show quantity 0 for products not selected
- [x] 8.7 Update quantity on +/- button clicks
- [x] 8.8 Display line total (price × quantity)
- [x] 8.9 Handle empty products array gracefully

## 9. Order Components - Payment Section

- [x] 9.1 Create `app/components/order/OrderPaymentSection.vue` (container)
- [x] 9.2 Create `app/components/order/OrderPaymentMethod.vue`
- [x] 9.3 Display "Cash on Delivery" as selected radio option
- [x] 9.4 Display "Others" as disabled radio option with "(coming soon)"
- [x] 9.5 Style according to luxury theme

## 10. Order Components - Summary

- [x] 10.1 Create `app/components/order/OrderSummary.vue`
- [x] 10.2 Display list of selected products (quantity > 0)
- [x] 10.3 Display subtotal for all products
- [x] 10.4 Display delivery fee (100 TK)
- [x] 10.5 Display total amount
- [x] 10.6 Add submit button with loading state
- [x] 10.7 Disable submit when no products selected or form invalid
- [x] 10.8 Show success message after successful submission
- [x] 10.9 Show error message on submission failure

## 11. Main Order Component (Index.vue)

- [x] 11.1 Update `app/components/order/Index.vue` to use new implementation
- [x] 11.2 Define props interface: `products: Product[]`
- [x] 11.3 Import and use `useOrderViewModel` composable
- [x] 11.4 Initialize order products on mount with received props
- [x] 11.5 Render `OrderAddressSection` with proper bindings
- [x] 11.6 Render `OrderProductSection` with products
- [x] 11.7 Render `OrderPaymentSection`
- [x] 11.8 Render `OrderSummary` with totals and submit button
- [x] 11.9 Handle loading state with disabled form and spinner
- [x] 11.10 Handle error state with error message display
- [x] 11.11 Handle success state with success message and form reset

## 12. Product Detail Page Integration

- [x] 12.1 Update `app/pages/products/[slug].vue` to pass product to Order component
- [x] 12.2 Pass current product as array to Order component
- [x] 12.3 Verify Order component renders correctly on product page
- [x] 12.4 Ensure responsive layout on product detail page

## 13. Styling and Responsiveness

- [x] 13.1 Apply luxury theme colors from `main.css`
- [x] 13.2 Implement mobile layout (vertical stack)
- [x] 13.3 Implement desktop layout (appropriate grid/column arrangement)
- [x] 13.4 Apply luxury border radius and letter spacing
- [x] 13.5 Add transitions and hover effects
- [x] 13.6 Ensure dark mode compatibility
- [x] 13.7 Style search inputs within selects
- [x] 13.8 Ensure touch targets are appropriately sized on mobile

## 14. Validation and Error Handling

- [x] 14.1 Add form validation before submission
- [x] 14.2 Validate at least one product has quantity > 0
- [x] 14.3 Validate required address fields (division, address, mobile)
- [x] 14.4 Add mobile number format validation (basic)
- [x] 14.5 Display validation error messages using i18n
- [x] 14.6 Handle network errors gracefully
- [x] 14.7 Show user-friendly error messages
- [x] 14.8 Retain form data on error for retry

## 15. Testing and Validation

- [ ] 15.1 Test division selection cascading to districts
- [ ] 15.2 Test district selection cascading to upazilas
- [ ] 15.3 Test Bengali language display for locations
- [ ] 15.4 Test English language display for locations
- [ ] 15.5 Test searching divisions in Bengali
- [ ] 15.6 Test searching divisions in English
- [ ] 15.7 Test product quantity increase/decrease
- [ ] 15.8 Test price calculation updates
- [ ] 15.9 Test order submission with valid data
- [ ] 15.10 Test submission rejection with no products
- [ ] 15.11 Test submission rejection with missing address
- [ ] 15.12 Test form reset after successful submission
- [ ] 15.13 Test on mobile viewport
- [ ] 15.14 Test on desktop viewport
- [ ] 15.15 Test dark mode
- [ ] 15.16 Verify no console errors
- [ ] 15.17 Verify no logic in .vue files (all in composable)
- [ ] 15.18 Verify components use composable, not store directly

## 16. Documentation

- [x] 16.1 Add comments to complex location filtering logic
- [x] 16.2 Document shipping address JSONB structure
- [x] 16.3 Document order product array structure
- [x] 16.4 Update OpenSpec tasks.md with completion status
