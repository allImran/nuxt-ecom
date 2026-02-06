# Change: Add Admin Panel Order Management

## Why

The admin panel currently lacks comprehensive order management capabilities. Admin and Staff users need to:
- View and manage all orders in a centralized table view
- Access detailed order information for each order
- Update order status with proper tracking (status history)
- Modify order item quantities when necessary

While the public order detail page exists ([orders/[id].vue](app/pages/orders/[id].vue)), it is read-only and doesn't support administrative operations. Creating dedicated admin order management pages will enable efficient order fulfillment and customer service.

## What Changes

- **ADDED**: New admin route `/admin/orders` for order listing page
  - Table view displaying: Order ID, Customer Name, Phone, Status, Total Amount, Created Date
  - Search/filtering capabilities (by status, phone, order ID)
  - Pagination support for large order lists
  - Click-to-detail navigation

- **ADDED**: New admin route `/admin/orders/[id].vue` for order detail page
  - Reuses existing order detail components from [components/order/](app/components/order/)
  - Admin-specific actions: Update Status dropdown, Edit Quantity button
  - Order Status Management:
    - Dropdown to select new status (pending, conducted, confirmed, paid, shipped, delivered, cancelled, returned, partially_returned)
    - Confirmation modal before status change
    - Optional comment field for status change
    - API call to `PATCH /orders/:id/status` creates new history entry
  - Item Quantity Management:
    - Edit button for each order item
    - Quantity input with +/- controls
    - Save button updates via `PATCH /orders/:id`
    - Recalculates total amount on quantity change

- **ADDED**: Admin order management composable `useAdminOrderViewModel` for business logic
- **ADDED**: Admin order Pinia store for state management
- **ADDED**: Protected API network functions in `network/admin.ts`:
  - `fetchAllOrders()` - GET /orders (Admin/Staff only)
  - `updateOrderStatus()` - PATCH /orders/:id/status
  - `updateOrder()` - PATCH /orders/:id (full order update)
- **ADDED**: Admin order types for API request/response structures
- **ADDED**: Admin order management components:
  - `AdminOrderListTable` - Main table with sort/filter
  - `AdminOrderStatusDropdown` - Status selection with confirm dialog
  - `AdminOrderQuantityEditor` - Item quantity edit modal
  - `AdminOrderConfirmDialog` - Confirmation modal for destructive actions
- **ADDED**: Loading skeleton states and error handling for admin pages

## Impact

- Affected specs: **NEW** `admin-order-management` capability
- Affected code:
  - `app/pages/admin/orders/index.vue` - New order listing page
  - `app/pages/admin/orders/[id].vue` - New order detail page
  - `app/stores/adminOrder.ts` - New store for admin order operations
  - `app/composables/useAdminOrderViewModel.ts` - New composable for admin logic
  - `app/network/admin.ts` - Add admin-protected order endpoints
  - `app/types/order.ts` - Add admin order types
  - `app/components/admin/orders/` - New component directory
  - `app/middleware/admin.ts` - Update to include `/admin/orders` routes
- Dependencies: Extends existing order detail components, requires admin authentication, uses existing order API endpoints
