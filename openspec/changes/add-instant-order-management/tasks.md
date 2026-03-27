# Tasks: Add Instant Order Management System

## 1. Foundation - Type Definitions and Network Layer

- [x] 1.1 Create `app/types/instantOrder.ts` with type definitions
  - [x] Define `InstantOrder` interface
  - [x] Define `InstantOrderForm` interface
  - [x] Define `OrderItemForm` interface
  - [x] Define `CustomerInfo` interface
  - [x] Define `InstantOrderStatus` type
  - [x] Define `CreateInstantOrderRequest` interface
  - [x] Define `UpdateInstantOrderRequest` interface
  - [x] Export all types

- [x] 1.2 Extend `app/network/admin.ts` with instant order API methods
  - [x] Add `fetchInstantOrders(businessId, params)` method
  - [x] Add `fetchInstantOrder(id)` method
  - [x] Add `createInstantOrder(data)` method
  - [x] Add `updateInstantOrder(id, data)` method
  - [x] Add `searchUsers(query)` method (for customer search)
  - [x] Update type exports to include instant order types

## 2. State Management

- [x] 2.1 Create `app/stores/instantOrders.ts` Pinia store
  - [x] Define store state: `orders`, `currentOrder`, `loading`, `error`, `pagination`
  - [x] Implement `fetchOrdersByBusiness(businessId, params)` action
  - [x] Implement `fetchOrderById(id)` action
  - [x] Implement `createOrder(data)` action
  - [x] Implement `updateOrder(id, data)` action
  - [x] Implement `reset()` action
  - [x] Export store with proper TypeScript types

- [x] 2.2 Create `app/composables/useInstantOrdersViewModel.ts` composable
  - [x] Initialize store with `storeToRefs`
  - [x] Implement `searchQuery` ref for filtering
  - [x] Implement `statusFilter` ref for filtering
  - [x] Implement `dateRange` ref for filtering
  - [x] Implement `filteredOrders` computed property
  - [x] Implement `getStatusColor(status)` function
  - [x] Implement `formatPrice(price)` function
  - [x] Implement `formatDate(date)` function
  - [x] Implement `reset()` function to clear filters
  - [x] Export all necessary refs and functions

- [x] 2.3 Create `app/composables/useCustomerSearch.ts` composable
  - [x] Implement `searchQuery` ref
  - [x] Implement `searchResults` ref
  - [x] Implement `loading` ref
  - [x] Implement `error` ref
  - [x] Implement debounced `searchUsers(query)` function
  - [x] Implement `selectUser(user)` function
  - [x] Implement `reset()` function
  - [x] Export all necessary refs and functions

- [x] 2.4 Create `app/composables/useInstantOrderForm.ts` composable
  - [x] Implement `form` ref with default form state
  - [x] Implement `validationErrors` computed property
  - [x] Implement `isValid` computed property
  - [x] Implement `totalAmount` computed property
  - [x] Implement `addItem()` function
  - [x] Implement `removeItem(index)` function
  - [x] Implement `updateItem(index, field, value)` function
  - [x] Implement `setUser(user)` function
  - [x] Implement `clearUser()` function
  - [x] Implement `reset()` function
  - [x] Implement `validate()` function
  - [x] Export all necessary refs and functions

## 3. Components - Instant Orders

- [x] 3.1 Create `app/components/instant-orders/InstantOrderStatusBadge.vue`
  - [x] Accept `status` prop
  - [x] Accept `getStatusLabel` optional prop
  - [x] Accept `getStatusColor` optional prop
  - [x] Display status with color-coded badge
  - [x] Support all status types

- [x] 3.2 Create `app/components/instant-orders/InstantOrderFilters.vue`
  - [x] Accept `searchQuery` v-model
  - [x] Accept `statusFilter` v-model
  - [x] Accept `dateRange` v-model
  - [x] Emit filter change events
  - [x] Include reset filters button
  - [x] Use luxury theme styling

- [x] 3.3 Create `app/components/instant-orders/InstantOrderTable.vue`
  - [x] Accept `orders` prop array
  - [x] Accept `loading` prop
  - [x] Accept `formatPrice` function prop
  - [x] Accept `formatDate` function prop
  - [x] Accept `getStatusColor` function prop
  - [x] Accept `getStatusLabel` function prop
  - [x] Emit `row-click` event
  - [x] Display loading skeleton when loading
  - [x] Display empty state when no orders
  - [x] Render table with sortable columns
  - [x] Use luxury theme styling

- [x] 3.4 Create `app/components/instant-orders/CustomerSelector.vue`
  - [x] Accept `modelValue` prop (user object or null)
  - [x] Accept `customerInfo` v-model
  - [x] Implement search input with debouncing
  - [x] Display search results dropdown
  - [x] Implement manual entry toggle
  - [x] Display manual entry fields (name, phone, address)
  - [x] Validate customer data
  - [x] Emit `update:modelValue` event
  - [x] Handle search errors gracefully
  - [x] Use luxury theme styling

- [x] 3.5 Create `app/components/instant-orders/OrderItemsEditor.vue`
  - [x] Accept `modelValue` prop (array of order items)
  - [x] Implement item list rendering
  - [x] Implement "Add Item" button
  - [x] Implement "Remove" button for each item
  - [x] Display input fields: title, price, quantity, unit, description
  - [x] Implement unit dropdown with common options
  - [x] Display inline validation errors
  - [x] Emit `update:modelValue` event
  - [x] Calculate and display item subtotals
  - [x] Use luxury theme styling

- [x] 3.6 Create `app/components/instant-orders/InstantOrderForm.vue`
  - [x] Accept `modelValue` prop (form data)
  - [x] Accept `loading` prop
  - [x] Accept `mode` prop ('create' | 'edit')
  - [x] Accept `submitLabel` prop
  - [x] Include `CustomerSelector` component
  - [x] Include `OrderItemsEditor` component
  - [x] Include delivery charge input
  - [x] Include COD reference input
  - [x] Include status dropdown
  - [x] Display calculated total amount
  - [x] Implement form validation
  - [x] Disable submit when invalid or loading
  - [x] Emit `submit` event with form data
  - [x] Display error messages
  - [x] Use luxury theme styling

## 4. Pages - List View

- [x] 4.1 Create `app/pages/business/[id]/instant-orders/index.vue`
  - [x] Set page meta with admin layout and middleware
  - [x] Get `businessId` from route params
  - [x] Initialize `useInstantOrdersViewModel` composable
  - [x] Fetch business info for display
  - [x] Fetch instant orders on mount
  - [x] Implement header with back button
  - [x] Include `InstantOrderFilters` component
  - [x] Include `InstantOrderTable` component
  - [x] Add "Create Order" button
  - [x] Implement navigation to create page
  - [x] Implement navigation to edit page on row click
  - [x] Reset state on unmount
  - [x] Watch for businessId changes and refetch
  - [x] Use luxury theme styling

## 5. Pages - Create View

- [x] 5.1 Create `app/pages/business/[id]/instant-orders/create.vue`
  - [x] Set page meta with admin layout and middleware
  - [x] Get `businessId` from route params
  - [x] Initialize `useInstantOrderForm` composable
  - [x] Initialize `useCustomerSearch` composable
  - [x] Implement header with back button
  - [x] Include `InstantOrderForm` component
  - [x] Handle form submission
  - [x] Call `createOrder` API on submit
  - [x] Show loading state during submission
  - [x] Handle success - navigate to list or detail
  - [x] Handle errors - display messages
  - [x] Reset form on success or unmount
  - [x] Use luxury theme styling

## 6. Pages - Edit View

- [x] 6.1 Create `app/pages/business/[id]/instant-orders/edit/[orderId].vue`
  - [x] Set page meta with admin layout and middleware
  - [x] Get `businessId` and `orderId` from route params
  - [x] Initialize `useInstantOrderForm` composable
  - [x] Initialize `useCustomerSearch` composable
  - [x] Fetch order data on mount
  - [x] Pre-fill form with order data
  - [x] Show loading skeleton while fetching
  - [x] Implement header with back button
  - [x] Include `InstantOrderForm` component
  - [x] Handle form submission
  - [x] Call `updateOrder` API on submit
  - [x] Show loading state during submission
  - [x] Handle success - show success message
  - [x] Handle errors - display messages
  - [x] Handle fetch errors - display error state
  - [x] Reset form on unmount
  - [x] Use luxury theme styling

## 7. Testing and Refinement

- [ ] 7.1 Test order list functionality
  - [ ] Verify orders load correctly
  - [ ] Test search filtering
  - [ ] Test status filtering
  - [ ] Test date range filtering
  - [ ] Test pagination
  - [ ] Test empty state
  - [ ] Test loading state
  - [ ] Test error handling
  - [ ] Test row click navigation

- [ ] 7.2 Test order creation functionality
  - [ ] Test customer search
  - [ ] Test customer selection
  - [ ] Test manual customer entry
  - [ ] Test adding order items
  - [ ] Test removing order items
  - [ ] Test item validation
  - [ ] Test total calculation
  - [ ] Test form validation
  - [ ] Test successful submission
  - [ ] Test error handling
  - [ ] Test navigation after creation

- [ ] 7.3 Test order editing functionality
  - [ ] Verify order data loads correctly
  - [ ] Test loading state
  - [ ] Test customer data display
  - [ ] Test order items display
  - [ ] Test modifying customer info
  - [ ] Test modifying order items
  - [ ] Test changing status
  - [ ] Test form validation
  - [ ] Test successful update
  - [ ] Test error handling
  - [ ] Test data persistence

- [ ] 7.4 Test responsive design
  - [ ] Test list view on mobile
  - [ ] Test create form on mobile
  - [ ] Test edit form on mobile
  - [ ] Test filters on mobile
  - [ ] Test table on mobile
  - [ ] Verify touch interactions work

- [ ] 7.5 Test error scenarios
  - [ ] Test network errors
  - [ ] Test validation errors
  - [ ] Test API error responses
  - [ ] Test search API failures
  - [ ] Test with invalid order IDs
  - [ ] Test with unauthorized access

- [ ] 7.6 Accessibility check
  - [ ] Verify keyboard navigation
  - [ ] Check ARIA labels
  - [ ] Test with screen reader
  - [ ] Verify color contrast
  - [ ] Check form error announcements

- [ ] 7.7 Performance check
  - [ ] Verify debounced search works
  - [ ] Check for unnecessary re-renders
  - [ ] Verify large list performance
  - [ ] Test with many order items
  - [ ] Check memory leaks

- [ ] 7.8 Polish and refinement
  - [ ] Add loading skeletons
  - [ ] Improve empty states
  - [ ] Add success toasts
  - [ ] Improve error messages
  - [ ] Add confirmations for destructive actions
  - [ ] Refine styling and spacing
  - [ ] Add tooltips where helpful
  - [ ] Improve accessibility
  - [ ] Add animations/transitions

## 8. Documentation

- [ ] 8.1 Document component props
  - [ ] Add JSDoc comments to all components
  - [ ] Document prop types and defaults
  - [ ] Document events emitted
  - [ ] Document slots if any

- [ ] 8.2 Document composables
  - [ ] Add JSDoc comments to all composables
  - [ ] Document return values
  - [ ] Document usage examples

- [ ] 8.3 Update README (if applicable)
  - [ ] Document new routes
  - [ ] Document new components
  - [ ] Document API integration
