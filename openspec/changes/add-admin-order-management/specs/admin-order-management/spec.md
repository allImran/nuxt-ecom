## ADDED Requirements

### Requirement: Admin Order List View

The system SHALL provide an administrative interface for listing and filtering all orders in the application. This interface SHALL only be accessible to users with Admin or Staff roles and SHALL display orders in a tabular format with key information for quick reference.

#### Scenario: Admin views order list

- **WHEN** an Admin or Staff user navigates to `/admin/orders`
- **THEN** the system SHALL display a table containing all orders with columns: Order ID, Customer Name, Phone, Status, Total Amount, Created Date
- **AND** orders SHALL be sorted by creation date (newest first) by default

#### Scenario: Admin filters orders by status

- **WHEN** an Admin user selects a status filter (e.g., "pending", "confirmed", "paid", "shipped", "delivered", "cancelled", "returned")
- **THEN** the system SHALL display only orders matching the selected status
- **AND** the filter SHALL be reflected in the URL query parameters

#### Scenario: Admin searches for order by phone or ID

- **WHEN** an Admin user enters a phone number or order ID in the search field
- **THEN** the system SHALL filter the order list to show matching results
- **AND** partial matches SHALL be supported for phone numbers

#### Scenario: Admin paginates through large order lists

- **WHEN** the order list contains more items than the page size (default 25)
- **THEN** the system SHALL display pagination controls (Previous, Next, page numbers)
- **AND** the system SHALL fetch orders in pages from the API using limit/offset parameters

#### Scenario: Admin navigates to order detail

- **WHEN** an Admin user clicks on a row in the order list table
- **THEN** the system SHALL navigate to `/admin/orders/[id]` for that specific order
- **AND** the order detail page SHALL load with full order information

### Requirement: Admin Order Detail View

The system SHALL provide a comprehensive order detail view for Admin and Staff users that displays all order information and enables administrative actions such as status updates and quantity modifications. This view SHALL reuse existing order detail components where possible.

#### Scenario: Admin views order details

- **WHEN** an Admin or Staff user navigates to `/admin/orders/[id]`
- **THEN** the system SHALL display complete order information including:
  - Order ID, status, created date, total amount
  - All order items with product details, quantities, and prices
  - Shipping address information
  - Order status history timeline
  - Order totals summary
- **AND** the view SHALL reuse existing components: `OrderDetailHeader`, `OrderDetailItems`, `OrderDetailShippingAddress`, `OrderDetailStatusHistory`, `OrderDetailTotals`

#### Scenario: Admin sees admin-specific actions

- **WHEN** an Admin user views an order detail page
- **THEN** the system SHALL display additional action buttons not present in the public view:
  - "Update Status" button that opens a status change dropdown
  - "Edit Quantities" button on each order item
- **AND** these actions SHALL only be visible to authenticated Admin/Staff users

#### Scenario: Admin views order with loading state

- **WHEN** an Admin user navigates to an order detail page and data is loading
- **THEN** the system SHALL display skeleton loading states for each section
- **AND** the skeleton SHALL match the final layout structure

#### Scenario: Admin views non-existent order

- **WHEN** an Admin user navigates to `/admin/orders/[id]` with an invalid order ID
- **THEN** the system SHALL display an error message indicating the order was not found
- **AND** provide a "Back to Orders List" button

### Requirement: Order Status Management

The system SHALL enable Admin and Staff users to update order status through a controlled workflow with confirmation and automatic history tracking. Status changes SHALL create new history entries via the API.

#### Scenario: Admin initiates status change

- **WHEN** an Admin user clicks the "Update Status" button on an order detail page
- **THEN** the system SHALL display a dropdown menu with available status options
- **AND** the current status SHALL be visually indicated as selected
- **AND** the system SHALL filter available statuses based on valid transitions from the current status

#### Scenario: Admin confirms status change

- **WHEN** an Admin user selects a new status and clicks "Confirm"
- **THEN** the system SHALL display a confirmation dialog showing:
  - The current status and the new status
  - An optional comment textarea
  - "Confirm" and "Cancel" buttons
- **AND** the dialog SHALL clearly indicate this action will create a permanent history entry

#### Scenario: Admin completes status update

- **WHEN** an Admin user confirms the status change in the confirmation dialog
- **THEN** the system SHALL call `PATCH /orders/:id/status` with the new status and optional comment
- **AND** upon success, the system SHALL refresh the order detail data
- **AND** the new status history entry SHALL be visible in the status timeline
- **AND** a success toast notification SHALL be displayed

#### Scenario: Status update fails with error

- **WHEN** the status update API call fails (network error, server error, or validation error)
- **THEN** the system SHALL display an error message
- **AND** the order status SHALL remain unchanged in the UI
- **AND** an error toast notification SHALL be displayed with the error details

#### Scenario: Invalid status transition

- **WHEN** an Admin user attempts an invalid status transition (e.g., from "delivered" to "pending")
- **THEN** the system SHALL either:
  - Disable the invalid option in the dropdown, OR
  - Show a warning message when the invalid status is selected
- **AND** the system SHALL prevent the API call for invalid transitions

#### Scenario: Status with optional comment

- **WHEN** an Admin user changes order status and provides a comment
- **THEN** the system SHALL include the comment in the API request
- **AND** the comment SHALL appear in the order status history timeline for that entry

#### Scenario: Valid status transitions

- **WHEN** an Admin user views available status options
- **THEN** the system SHALL allow transitions following this flow:
  - `pending` → `conducted`, `confirmed`, `cancelled`
  - `conducted` → `confirmed`, `cancelled`
  - `confirmed` → `paid`, `cancelled`
  - `paid` → `shipped`, `cancelled`
  - `shipped` → `delivered`, `partially_returned`, `returned`
  - `delivered` → `returned`, `partially_returned`
  - `cancelled` → (no transitions allowed)
  - `returned` → (no transitions allowed)
  - `partially_returned` → `returned`
- **AND** the system SHALL allow any status to transition to `cancelled` before fulfillment

### Requirement: Order Item Quantity Management

The system SHALL enable Admin users to modify order item quantities. When quantities change, the system SHALL recalculate item totals and the overall order total.

#### Scenario: Admin opens quantity editor

- **WHEN** an Admin user clicks the "Edit Quantity" button on an order item
- **THEN** the system SHALL open a modal dialog displaying:
  - Product name and variant information
  - Current quantity
  - Quantity input field with +/- controls
  - Calculated total (price × quantity)
  - "Save" and "Cancel" buttons

#### Scenario: Admin updates item quantity

- **WHEN** an Admin user changes the quantity and clicks "Save"
- **THEN** the system SHALL call `PATCH /orders/:id` with the updated order items array
- **AND** the API SHALL recalculate the order total based on new quantities
- **AND** upon success, the system SHALL refresh the order detail data
- **AND** the updated item quantity and totals SHALL be displayed
- **AND** a success toast notification SHALL be displayed

#### Scenario: Quantity update fails

- **WHEN** the quantity update API call fails
- **THEN** the system SHALL display an error message in the modal
- **AND** the quantity SHALL remain unchanged in the UI
- **AND** the modal SHALL remain open for the user to retry or cancel

#### Scenario: Quantity validation

- **WHEN** an Admin user enters an invalid quantity (less than 1, not a number)
- **THEN** the system SHALL disable the "Save" button
- **AND** display a validation error message
- **AND** the system SHALL prevent the API call until a valid quantity is entered

#### Scenario: Quantity update recalculates totals

- **WHEN** an Admin user successfully updates an item quantity
- **THEN** the system SHALL display the updated item total (price × new quantity)
- **AND** the order subtotal SHALL be recalculated
- **AND** the order total amount SHALL be updated from the API response

### Requirement: Admin Order Authentication and Authorization

The system SHALL protect all admin order management routes with authentication and role-based authorization. Only users with Admin or Staff roles SHALL access these features.

#### Scenario: Unauthenticated user attempts access

- **WHEN** an unauthenticated user navigates to `/admin/orders` or `/admin/orders/[id]`
- **THEN** the system SHALL redirect the user to the login page
- **AND** the login page SHALL include a return URL to redirect back after successful authentication

#### Scenario: Non-admin user attempts access

- **WHEN** an authenticated user without Admin or Staff role attempts to access admin order pages
- **THEN** the system SHALL display a "Forbidden" error page
- **AND** the system SHALL NOT expose any order data

#### Scenario: Admin user accesses order pages

- **WHEN** an authenticated Admin or Staff user navigates to `/admin/orders`
- **THEN** the system SHALL display the order list page
- **AND** all API requests SHALL include the authentication token in the Authorization header

#### Scenario: Token expiry during order operations

- **WHEN** the authentication token expires while an Admin user is managing orders
- **THEN** the system SHALL redirect to the login page upon the next API call failure (401)
- **AND** display a message indicating the session has expired

### Requirement: Admin Order API Integration

The system SHALL provide protected API network functions for order management operations. These functions SHALL handle authentication headers, error responses, and data transformation.

#### Scenario: Fetch all orders

- **WHEN** the system calls `fetchAllOrders(params)` function
- **THEN** the system SHALL make a GET request to `/orders` with query parameters (status, phone, limit, offset)
- **AND** the request SHALL include the Authorization header with the auth token
- **AND** the system SHALL return an array of order objects for admin list view

#### Scenario: Fetch single order by ID

- **WHEN** the system calls `fetchOrderById(orderId)` function
- **THEN** the system SHALL make a GET request to `/orders/:id`
- **AND** the request SHALL include the Authorization header
- **AND** the system SHALL return a full order object with items and history

#### Scenario: Update order status

- **WHEN** the system calls `updateOrderStatus(orderId, status, comment?)` function
- **THEN** the system SHALL make a PATCH request to `/orders/:id/status`
- **AND** the request body SHALL contain `{ status, comment }` (comment optional)
- **AND** the request SHALL include the Authorization header
- **AND** the system SHALL return the updated order object with new history entry

#### Scenario: Update order (quantity changes)

- **WHEN** the system calls `updateOrder(orderId, data)` function
- **THEN** the system SHALL make a PATCH request to `/orders/:id`
- **AND** the request body SHALL contain the updated order data including modified items
- **AND** the request SHALL include the Authorization header
- **AND** the system SHALL return the updated order object with recalculated totals

#### Scenario: API returns 401 unauthorized

- **WHEN** any admin order API call returns a 401 status code
- **THEN** the system SHALL clear the auth token from storage
- **AND** redirect the user to the login page

#### Scenario: API returns 403 forbidden

- **WHEN** any admin order API call returns a 403 status code
- **THEN** the system SHALL display a "Forbidden" error message
- **AND** the system SHALL NOT modify any local state

#### Scenario: API returns 404 not found

- **WHEN** an order detail API call returns a 404 status code
- **THEN** the system SHALL display an "Order not found" error message
- **AND** provide navigation back to the order list

### Requirement: Responsive Admin Order UI

The system SHALL provide a responsive user interface for admin order management that adapts to different screen sizes while maintaining usability and visual consistency with the luxury design theme.

#### Scenario: Desktop view (1024px and above)

- **WHEN** an Admin user views the order list on a desktop screen
- **THEN** the order table SHALL display all columns in a single row
- **AND** the table SHALL have a fixed header with scrollable body for large datasets
- **AND** hover effects SHALL be applied to table rows

#### Scenario: Tablet view (768px - 1023px)

- **WHEN** an Admin user views the order list on a tablet
- **THEN** the order table SHALL adapt column widths or hide less critical columns
- **AND** the table SHALL maintain horizontal scrolling if needed

#### Scenario: Mobile view (below 768px)

- **WHEN** an Admin user views the order list on a mobile device
- **THEN** the order table SHALL display as cards instead of a table
- **OR** the table SHALL enable horizontal scrolling with sticky first column (Order ID)
- **AND** filter controls SHALL stack vertically
- **AND** actions SHALL be touch-friendly (minimum 44px tap targets)

#### Scenario: Order detail on mobile

- **WHEN** an Admin user views an order detail page on a mobile device
- **THEN** all order sections SHALL stack vertically
- **AND** action buttons SHALL be sticky at the bottom for easy access
- **AND** modals (status change, quantity edit) SHALL occupy full screen

### Requirement: Bilingual Admin Order Interface

The system SHALL provide bilingual support (English and Bengali) for all admin order management interfaces, following the same localization patterns used in the public-facing pages.

#### Scenario: English locale

- **WHEN** the locale is set to English
- **THEN** all order status labels SHALL be displayed in English (Pending, Confirmed, Paid, etc.)
- **AND** table column headers SHALL be in English
- **AND** button labels SHALL be in English
- **AND** confirmation messages SHALL be in English

#### Scenario: Bengali locale

- **WHEN** the locale is set to Bengali
- **THEN** all order status labels SHALL be displayed in Bengali
- **AND** table column headers SHALL be in Bengali
- **AND** button labels SHALL be in Bengali
- **AND** confirmation messages SHALL be in Bengali

#### Scenario: Locale switching

- **WHEN** an Admin user changes the locale while viewing an order page
- **THEN** the UI SHALL update immediately without page reload
- **AND** the locale preference SHALL persist for future sessions

### Requirement: Order List Sorting

The system SHALL enable Admin users to sort the order list by clicking column headers, with support for ascending and descending sort orders.

#### Scenario: Sort by Order ID

- **WHEN** an Admin user clicks the "Order ID" column header
- **THEN** the system SHALL sort orders by Order ID in ascending order
- **AND** a second click SHALL reverse to descending order
- **AND** a sort indicator SHALL appear in the column header

#### Scenario: Sort by Date

- **WHEN** an Admin user clicks the "Created Date" column header
- **THEN** the system SHALL sort orders by creation date (newest first by default)
- **AND** the sort SHALL apply to the current filtered results

#### Scenario: Sort by Total Amount

- **WHEN** an Admin user clicks the "Total Amount" column header
- **THEN** the system SHALL sort orders by total amount (highest first by default)
- **AND** the sort SHALL apply numeric sorting, not string sorting

### Requirement: Admin Order State Management

The system SHALL provide centralized state management for admin order operations using a Pinia store, managing order lists, current order detail, filters, and pagination.

#### Scenario: Store initial state

- **WHEN** the admin order store is initialized
- **THEN** the store SHALL contain the following state:
  - `orders: []` - Array of order list items
  - `orderDetail: null` - Current order detail object
  - `loading: false` - Loading state indicator
  - `error: null` - Error message
  - `filters: {}` - Active filter object
  - `pagination: { currentPage: 1, itemsPerPage: 25, totalItems: 0 }`

#### Scenario: Fetch orders updates store

- **WHEN** the `fetchAllOrders` action is called successfully
- **THEN** the store SHALL update `orders` with the fetched data
- **AND** set `loading` to false
- **AND** update `pagination.totalItems` from the response

#### Scenario: Fetch order detail updates store

- **WHEN** the `fetchOrderById` action is called successfully
- **THEN** the store SHALL update `orderDetail` with the fetched data
- **AND** set `loading` to false
- **AND** clear any existing `error`

#### Scenario: Update filters

- **WHEN** an Admin user changes filter values (status, phone search)
- **THEN** the store SHALL update the `filters` state
- **AND** reset `pagination.currentPage` to 1
- **AND** trigger a refetch of orders with new filters

#### Scenario: Update pagination

- **WHEN** an Admin user changes page or items per page
- **THEN** the store SHALL update the `pagination` state
- **AND** trigger a refetch of orders with new pagination parameters

### Requirement: Admin Order Error Handling

The system SHALL provide comprehensive error handling for all admin order operations, displaying user-friendly error messages and recovery options.

#### Scenario: Network error on order list fetch

- **WHEN** fetching the order list fails due to network error
- **THEN** the system SHALL display an error message: "Failed to load orders. Please check your connection."
- **AND** provide a "Retry" button to reattempt the fetch

#### Scenario: Network error on status update

- **WHEN** updating order status fails due to network error
- **THEN** the system SHALL display an error toast: "Failed to update status. Please try again."
- **AND** keep the confirmation dialog open for retry

#### Scenario: Validation error from API

- **WHEN** an API call returns a 422 validation error
- **THEN** the system SHALL display the validation message from the API response
- **AND** highlight the specific field that caused the error

#### Scenario: Server error

- **WHEN** an API call returns a 500 server error
- **THEN** the system SHALL display a generic error message: "Something went wrong. Please try again later."
- **AND** log the error details to console for debugging
