# Design: Instant Order Management System

## Context

The Instant Order Management System is a new admin panel feature for creating and managing ad-hoc orders. Unlike regular product-based orders, instant orders allow staff to create orders with custom items, pricing, and customer details without requiring pre-existing products. This is essential for phone orders, in-person sales, and custom orders.

### Backend API (Fixed)

The backend API is already implemented with the following endpoints:
- `POST /api/instant-orders` - Create order
- `GET /api/instant-orders` - List orders (filters, search, pagination)
- `GET /api/instant-orders/:id` - Get single order
- `PATCH /api/instant-orders/:id` - Update order

All endpoints require authentication and `admin` or `staff` role.

### Existing Patterns

The codebase follows these established patterns:
- **State Management:** Pinia stores with Composition API (`useBusinessOrdersStore` as reference)
- **View Models:** Composables that bridge stores and UI (`useBusinessOrdersViewModel` as reference)
- **Network Layer:** `useAdminFetch` composable with automatic auth headers
- **UI Components:** Luxury-themed components in `app/components/ui/` and feature-specific in `app/components/admin/`
- **Routing:** File-based routing with dynamic parameters
- **Types:** Centralized type definitions in `app/types/`

### Constraints

- Must follow existing luxury theme styling
- Must integrate with existing authentication system
- Must use existing patterns (stores, composables, network layer)
- Backend API is fixed and cannot be modified
- Must support both user-selected and manually-entered customer information
- Must calculate totals dynamically from order_items

## Goals / Non-Goals

### Goals
- Provide fast, efficient instant order creation workflow
- Support dynamic order items with live total calculation
- Enable customer lookup with fallback to manual entry
- Maintain consistency with existing order management UI patterns
- Handle loading, error, and empty states gracefully
- Support debounced search to reduce API calls

### Non-Goals
- Real-time order updates (not required for MVP)
- Advanced inventory management
- Payment processing integration (deferred)
- Order export functionality (deferred)
- Bulk order operations (deferred)

## Decisions

### 1. Component Architecture

**Decision:** Create dedicated `instant-orders` component directory with reusable components.

**Rationale:**
- Separates instant order components from regular order components
- Allows for specialized instant order features (custom items, etc.)
- Follows existing component organization pattern
- Components can be reused across list, create, and edit pages

**Components:**
- `InstantOrderTable` - Display orders in list view
- `InstantOrderForm` - Create/edit form with validation
- `CustomerSelector` - User search with manual entry fallback
- `OrderItemsEditor` - Dynamic items list with add/remove
- `InstantOrderStatusBadge` - Status display with color coding
- `InstantOrderFilters` - Search, status, date range filters

### 2. State Management Strategy

**Decision:** Use Pinia store with composable view model pattern.

**Rationale:**
- Consistent with existing codebase patterns (`useBusinessOrdersStore`)
- Store handles data fetching and caching
- View model handles UI-specific logic (filtering, formatting)
- Clear separation of concerns
- Easy to test and maintain

**Store Structure:**
```typescript
// app/stores/instantOrders.ts
interface InstantOrderState {
  orders: InstantOrder[]
  currentOrder: InstantOrder | null
  loading: boolean
  error: string | null
  pagination: { limit: number; offset: number; total: number }
}

// Composable: app/composables/useInstantOrdersViewModel.ts
// Handles filtering, search, totals calculation, etc.
```

### 3. Form State Management

**Decision:** Use reactive form state with computed validations and totals.

**Rationale:**
- No additional dependencies required (Vue 3 reactivity built-in)
- Follows existing patterns in the codebase
- Simple and straightforward for this use case
- Easy to debug and maintain

**Form State Shape:**
```typescript
interface InstantOrderForm {
  user_id: string | null
  customer_info: {
    name: string
    phone: string
    address: string
  }
  order_items: OrderItemForm[]
  delivery_charge: number
  cod_reference: string
  status: string
}
```

### 4. API Integration

**Decision:** Extend `adminNetwork` object with instant order methods using `useAdminFetch`.

**Rationale:**
- Consistent with existing API integration pattern
- `useAdminFetch` handles auth headers automatically
- Centralizes all admin API calls
- Easy to mock for testing

**Network Methods:**
```typescript
// app/network/admin.ts (extend existing)
{
  fetchInstantOrders: (businessId: string, params?) => useAdminFetch(...)
  fetchInstantOrder: (id: string) => useAdminFetch(...)
  createInstantOrder: (data) => useAdminFetch(...)
  updateInstantOrder: (id, data) => useAdminFetch(...)
  searchUsers: (query) => useAdminFetch(...) // For customer search
}
```

### 5. Customer Selection Flow

**Decision:** Implement dual-mode customer input (user search OR manual entry).

**Rationale:**
- Supports both registered and guest customers
- Flexibility for different order scenarios
- Matches backend API requirements (user_id OR customer_info)

**UX Flow:**
1. Default: User search input with debounced API call
2. Selection: Populate form with user data, set `user_id`
3. Toggle: Switch to manual entry mode
4. Manual: Clear `user_id`, enable manual input fields
5. Validation: Ensure either `user_id` OR all customer fields are populated

### 6. Order Items Management

**Decision:** Dynamic array with add/remove operations and computed totals.

**Rationale:**
- Flexible for varying numbers of items
- Computed totals are reactive and efficient
- Simple array operations for add/remove
- Easy to validate (prevent empty submission)

**Item Structure:**
```typescript
interface OrderItemForm {
  title: string
  price: number
  quantity: number
  unit: string
  description: string
}

// Computed total
const totalAmount = computed(() => {
  const itemsTotal = form.order_items.reduce(
    (sum, item) => sum + (item.price * item.quantity),
    0
  )
  return itemsTotal + (form.delivery_charge || 0)
})
```

### 7. Routing Structure

**Decision:** File-based routing under business namespace.

**Rationale:**
- Nuxt 3 convention
- Scoped to specific business context
- Follows existing pattern (`/business/[id]/orders`)

**Routes:**
```
/business/[id]/instant-orders              → List page
/business/[id]/instant-orders/create       → Create page
/business/[id]/instant-orders/edit/[oid]   → Edit page
```

### 8. Validation Strategy

**Decision:** Inline validation with computed error states and submit guard.

**Rationale:**
- No external validation library needed
- Reactive error messages
- Prevents invalid submissions
- Follows existing patterns

**Validation Rules:**
- Either `user_id` OR all `customer_info` fields required
- At least one order item required
- All item fields required (title, price, quantity, unit)
- Price and quantity must be positive numbers
- Disable submit button while loading or invalid

### 9. Search and Filter UX

**Decision:** Debounced search with client-side filtering for instant feedback.

**Rationale:**
- Reduces API calls (debounce 300-500ms)
- Fast UI response (client-side filter on cached data)
- Matches existing order list UX pattern
- Better user experience

**Filter Implementation:**
```typescript
const searchQuery = ref('')
const statusFilter = ref('')
const dateRange = ref({ start: '', end: '' })

const filteredOrders = computed(() => {
  return orders.value.filter(order => {
    // Match search query (name, phone, order ID)
    // Match status filter
    // Match date range
  })
})
```

## Risks / Trade-offs

### Risk: Customer Search API Not Specified

**Risk:** Backend assumes separate user search API but endpoint is not defined.

**Mitigation:**
- Create placeholder `/api/users/search` endpoint in network layer
- Graceful fallback to manual entry if search fails
- Document API requirement for backend team

### Risk: Form Complexity

**Risk:** Dynamic form with nested arrays may become complex to validate.

**Mitigation:**
- Keep validation simple and inline
- Use computed properties for complex validations
- Clear visual feedback for validation errors
- Start simple, add complexity only if needed

### Trade-off: Client-side vs Server-side Filtering

**Trade-off:** Client-side filtering is faster but requires all data loaded.

**Decision:** Client-side filtering with pagination support.
- Faster user experience
- Simpler implementation
- API supports pagination for large datasets
- Can add server-side filtering later if needed

### Trade-off: Store vs Direct API Calls

**Trade-off:** Store adds complexity but provides caching and state management.

**Decision:** Use store pattern for consistency with existing code.
- Follows established patterns
- Easier to maintain
- Better testing story
- Caching benefits for list/detail navigation

## Migration Plan

Not applicable - new feature with no migration needed.

## Implementation Phases

### Phase 1: Foundation
1. Type definitions
2. Network layer extension
3. Store implementation
4. Basic composables

### Phase 2: List Page
1. Instant order list page
2. Table component
3. Filters component
4. View model for list

### Phase 3: Create/Edit Pages
1. Form page structure
2. Customer selector component
3. Order items editor component
4. Form validation
5. View model for forms

### Phase 4: Polish
1. Error handling
2. Loading states
3. Empty states
4. Testing and refinement

## Open Questions

1. **User Search API:** What is the exact endpoint for searching users? Assume `/api/users/search?q={query}` for now.
2. **Order Status Values:** What are the valid status values for instant orders? Assume same as regular orders: `pending`, `confirmed`, `paid`, `shipped`, `delivered`, `cancelled`.
3. **Unit Options:** What are the valid unit options for order items? Assume free-text for now, could be dropdown if limited set exists.
4. **Date Format:** What date format does the API expect/return? Assume ISO 8601 strings.
