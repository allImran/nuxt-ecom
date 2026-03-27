## ADDED Requirements

### Requirement: Instant Order List Display

The system SHALL display a list of instant orders for a business in the admin panel.

#### Scenario: Display orders with filtering
- **GIVEN** an admin user is authenticated
- **WHEN** navigating to `/business/[business_id]/instant-orders`
- **THEN** the system SHALL display a table of instant orders with columns: Order ID, Customer Name, Phone, Status, Total Amount, Created Date
- **AND** the system SHALL provide search input for filtering by name, phone, or order ID
- **AND** the system SHALL provide status filter dropdown
- **AND** the system SHALL provide date range filter
- **AND** the system SHALL support pagination

#### Scenario: Display loading state
- **GIVEN** the orders are being fetched
- **WHEN** the list page loads
- **THEN** the system SHALL display a loading indicator
- **AND** the table SHALL not be visible until data is loaded

#### Scenario: Display empty state
- **GIVEN** no instant orders exist for the business
- **WHEN** the list page loads
- **THEN** the system SHALL display an empty state message
- **AND** the system SHALL show a "Create Order" button

#### Scenario: Navigate to order detail
- **GIVEN** the order list is displayed
- **WHEN** an admin user clicks on an order row
- **THEN** the system SHALL navigate to the edit page for that order

---

### Requirement: Instant Order Creation

The system SHALL allow admin staff to create new instant orders with custom items and customer information.

#### Scenario: Initialize create form
- **GIVEN** an admin user is authenticated
- **WHEN** navigating to `/business/[business_id]/instant-orders/create`
- **THEN** the system SHALL display an empty order form
- **AND** the form SHALL include customer selection section
- **AND** the form SHALL include order items section with at least one empty item
- **AND** the form SHALL include delivery charge field
- **AND** the form SHALL include COD reference field
- **AND** the form SHALL include status field (default: pending)
- **AND** the form SHALL display calculated total amount

#### Scenario: Select existing customer
- **GIVEN** the create form is displayed
- **WHEN** an admin user searches for a customer
- **THEN** the system SHALL display matching customers after debounce (300-500ms)
- **AND** the system SHALL populate customer fields when a customer is selected
- **AND** the system SHALL set `user_id` in the form data

#### Scenario: Enter customer information manually
- **GIVEN** the create form is displayed
- **WHEN** an admin user switches to manual entry mode
- **THEN** the system SHALL display name, phone, and address input fields
- **AND** the system SHALL clear any selected `user_id`
- **AND** the system SHALL validate that all customer fields are populated on submit

#### Scenario: Add order item
- **GIVEN** the create form is displayed
- **WHEN** an admin user clicks "Add Item"
- **THEN** the system SHALL add a new empty item row
- **AND** the item SHALL include fields: title, price, quantity, unit, description
- **AND** the system SHALL update the total amount calculation

#### Scenario: Remove order item
- **GIVEN** the create form has multiple items
- **WHEN** an admin user clicks "Remove" on an item
- **THEN** the system SHALL remove the item from the form
- **AND** the system SHALL update the total amount calculation
- **AND** the system SHALL maintain at least one empty item row

#### Scenario: Calculate total amount
- **GIVEN** the create form has order items
- **WHEN** item prices, quantities, or delivery charge change
- **THEN** the system SHALL recalculate total as: sum(price × quantity) + delivery_charge
- **AND** the system SHALL display the updated total in real-time

#### Scenario: Validate form on submit
- **GIVEN** the create form is filled
- **WHEN** an admin user clicks "Create Order" with invalid data
- **THEN** the system SHALL prevent submission
- **AND** the system SHALL display validation errors for:
  - Missing customer information (user_id OR all customer fields)
  - Empty order items list
  - Missing required item fields
  - Invalid price or quantity values (must be positive numbers)

#### Scenario: Submit valid order
- **GIVEN** the create form is filled with valid data
- **WHEN** an admin user clicks "Create Order"
- **THEN** the system SHALL POST to `/api/instant-orders` with form data
- **AND** the system SHALL send `user_id` if customer was selected
- **OR** the system SHALL send `customer_info` object if manual entry
- **AND** the system SHALL send `order_items` array
- **AND** the system SHALL send `delivery_charge`, `cod_reference`, and `status`
- **AND** the system SHALL disable the submit button during request
- **AND** on success, the system SHALL navigate to the order list or detail page
- **AND** on error, the system SHALL display error message

---

### Requirement: Instant Order Editing

The system SHALL allow admin staff to update existing instant orders.

#### Scenario: Load order for editing
- **GIVEN** an instant order exists
- **WHEN** an admin user navigates to `/business/[business_id]/instant-orders/edit/[order_id]`
- **THEN** the system SHALL fetch the order from `/api/instant-orders/:id`
- **AND** the system SHALL pre-fill the form with order data
- **AND** the system SHALL display loading indicator while fetching

#### Scenario: Update order information
- **GIVEN** the edit form is displayed with order data
- **WHEN** an admin user modifies any field and clicks "Update Order"
- **THEN** the system SHALL PATCH to `/api/instant-orders/:id` with modified data
- **AND** the system SHALL include all form fields in the request
- **AND** the system SHALL disable submit button during request
- **AND** on success, the system SHALL display success message
- **AND** on error, the system SHALL display error message and keep form data

#### Scenario: Update order status
- **GIVEN** the edit form is displayed
- **WHEN** an admin user changes the status dropdown
- **THEN** the system SHALL update the status field in the form
- **AND** the status change SHALL be saved when the form is submitted

---

### Requirement: Customer Search Integration

The system SHALL provide customer search functionality for the instant order form.

#### Scenario: Debounced search query
- **GIVEN** the customer search input is displayed
- **WHEN** an admin user types a search query
- **THEN** the system SHALL wait 300-500ms after typing stops
- **AND** the system SHALL then send API request with the query

#### Scenario: Display search results
- **GIVEN** a search API request is in progress
- **WHEN** results are returned
- **THEN** the system SHALL display a dropdown with matching customers
- **AND** each result SHALL show customer name and phone
- **AND** the system SHALL highlight the selected customer

#### Scenario: Handle search errors
- **GIVEN** the customer search API fails
- **WHEN** an error occurs
- **THEN** the system SHALL display an error message
- **AND** the system SHALL allow manual entry as fallback
- **AND** the system SHALL not prevent form submission

---

### Requirement: Order Items Editor

The system SHALL provide a dynamic editor for managing order items in the instant order form.

#### Scenario: Display item list
- **GIVEN** the order form is displayed
- **WHEN** the order items section renders
- **THEN** the system SHALL display all items in a list
- **AND** each item SHALL show input fields for: title, price, quantity, unit (dropdown), description
- **AND** each item SHALL have a remove button (except if it's the only item)

#### Scenario: Validate item data
- **GIVEN** an order item is in the list
- **WHEN** an admin user enters invalid data (empty title, negative price, zero quantity)
- **THEN** the system SHALL show inline validation errors
- **AND** the system SHALL prevent form submission

#### Scenario: Live total calculation
- **GIVEN** the order form has multiple items
- **WHEN** any item's price or quantity changes
- **THEN** the system SHALL immediately recalculate the item subtotal
- **AND** the system SHALL update the order total display

#### Scenario: Unit selection
- **GIVEN** an order item is being edited
- **WHEN** an admin user selects a unit from the dropdown
- **THEN** the system SHALL set the unit value for that item
- **AND** common units SHALL be: pcs, kg, g, l, ml, m, cm, box, set, pair

---

### Requirement: Status Badge Display

The system SHALL display order status with appropriate color coding.

#### Scenario: Display status colors
- **GIVEN** an order status is displayed
- **WHEN** rendering the status badge
- **THEN** the system SHALL apply color coding:
  - `pending`: Yellow/Gold
  - `confirmed`: Blue/Indigo
  - `paid`: Green
  - `shipped`: Purple
  - `delivered`: Emerald/Green
  - `cancelled`: Red
  - `returned`: Orange

#### Scenario: Display status label
- **GIVEN** an order status value exists
- **WHEN** displaying the status
- **THEN** the system SHALL show a human-readable label
- **AND** the label SHALL be title-cased
- **AND** the label SHALL be displayed in a pill/badge component

---

### Requirement: API Integration Layer

The system SHALL provide a composable for instant order API operations.

#### Scenario: List instant orders
- **GIVEN** the `useInstantOrders` composable is used
- **WHEN** calling `listOrders(businessId, params)`
- **THEN** the system SHALL fetch from `/api/instant-orders` with query params
- **AND** the system SHALL include auth token in request headers
- **AND** the system SHALL return orders array with loading state
- **AND** the system SHALL handle errors gracefully

#### Scenario: Fetch single order
- **GIVEN** the `useInstantOrders` composable is used
- **WHEN** calling `getOrder(orderId)`
- **THEN** the system SHALL fetch from `/api/instant-orders/:id`
- **AND** the system SHALL include auth token in request headers
- **AND** the system SHALL return order object with loading state
- **AND** the system SHALL handle errors gracefully

#### Scenario: Create instant order
- **GIVEN** the `useInstantOrders` composable is used
- **WHEN** calling `createOrder(payload)`
- **THEN** the system SHALL POST to `/api/instant-orders`
- **AND** the system SHALL include auth token in request headers
- **AND** the system SHALL send the payload in request body
- **AND** the system SHALL return created order with loading state
- **AND** the system SHALL handle errors gracefully

#### Scenario: Update instant order
- **GIVEN** the `useInstantOrders` composable is used
- **WHEN** calling `updateOrder(orderId, payload)`
- **THEN** the system SHALL PATCH to `/api/instant-orders/:id`
- **AND** the system SHALL include auth token in request headers
- **AND** the system SHALL send the payload in request body
- **AND** the system SHALL return updated order with loading state
- **AND** the system SHALL handle errors gracefully

---

### Requirement: Customer Search Composable

The system SHALL provide a composable for searching and selecting customers.

#### Scenario: Search customers by query
- **GIVEN** the `useCustomerSearch` composable is used
- **WHEN** calling `searchUsers(query)`
- **THEN** the system SHALL debounce the query (300-500ms)
- **AND** the system SHALL fetch from user search API endpoint
- **AND** the system SHALL return matching customers array
- **AND** the system SHALL handle errors gracefully

#### Scenario: Reset search results
- **GIVEN** the `useCustomerSearch` composable is used
- **WHEN** calling `reset()`
- **THEN** the system SHALL clear search query
- **AND** the system SHALL clear search results
- **AND** the system SHALL clear any errors

---

### Requirement: Type Definitions

The system SHALL provide TypeScript type definitions for instant order entities.

#### Scenario: Define instant order types
- **GIVEN** the type system is in place
- **THEN** the system SHALL export `InstantOrder` interface with fields:
  - `id: string`
  - `business_id: string`
  - `user_id?: string`
  - `customer_info: CustomerInfo`
  - `order_items: OrderItem[]`
  - `delivery_charge: number`
  - `cod_reference?: string`
  - `status: string`
  - `created_at: string`
  - `updated_at: string`

#### Scenario: Define form types
- **GIVEN** the type system is in place
- **THEN** the system SHALL export `InstantOrderForm` interface for form state
- **AND** the system SHALL export `OrderItemForm` interface for item state
- **AND** the system SHALL export `CustomerInfo` interface for customer data

---

### Requirement: State Management

The system SHALL manage instant order state using a Pinia store.

#### Scenario: Store order list
- **GIVEN** the instant orders store is initialized
- **WHEN** orders are fetched
- **THEN** the store SHALL maintain `orders` array
- **AND** the store SHALL maintain `loading` boolean
- **AND** the store SHALL maintain `error` string or null
- **AND** the store SHALL maintain `pagination` object

#### Scenario: Store current order
- **GIVEN** the instant orders store is initialized
- **WHEN** a single order is fetched or created
- **THEN** the store SHALL maintain `currentOrder` object or null
- **AND** the store SHALL update the orders array if the order exists in the list

#### Scenario: Reset store state
- **GIVEN** the instant orders store has data
- **WHEN** `reset()` is called
- **THEN** the store SHALL clear all orders
- **AND** the store SHALL clear current order
- **AND** the store SHALL clear errors
- **AND** the store SHALL reset pagination to defaults

---

### Requirement: Routing and Navigation

The system SHALL provide file-based routing for instant order pages.

#### Scenario: List page route
- **GIVEN** the file-based routing is configured
- **WHEN** navigating to `/business/[business_id]/instant-orders`
- **THEN** the system SHALL render the instant order list page
- **AND** the page SHALL use the admin layout
- **AND** the page SHALL require authentication and admin/staff role

#### Scenario: Create page route
- **GIVEN** the file-based routing is configured
- **WHEN** navigating to `/business/[business_id]/instant-orders/create`
- **THEN** the system SHALL render the instant order create page
- **AND** the page SHALL use the admin layout
- **AND** the page SHALL require authentication and admin/staff role

#### Scenario: Edit page route
- **GIVEN** the file-based routing is configured
- **WHEN** navigating to `/business/[business_id]/instant-orders/edit/[order_id]`
- **THEN** the system SHALL render the instant order edit page
- **AND** the page SHALL use the admin layout
- **AND** the page SHALL require authentication and admin/staff role
- **AND** the page SHALL load the order data on mount

---

### Requirement: Error Handling

The system SHALL handle errors gracefully across all instant order operations.

#### Scenario: Display API errors
- **GIVEN** an API request fails
- **WHEN** an error response is received
- **THEN** the system SHALL display a user-friendly error message
- **AND** the system SHALL log the error for debugging
- **AND** the system SHALL allow the user to retry the operation

#### Scenario: Handle network errors
- **GIVEN** a network request is in progress
- **WHEN** the network connection fails
- **THEN** the system SHALL display a network error message
- **AND** the system SHALL set loading state to false
- **AND** the system SHALL not crash or hang

#### Scenario: Handle validation errors
- **GIVEN** form validation fails
- **WHEN** the user attempts to submit invalid data
- **THEN** the system SHALL display inline validation errors
- **AND** the system SHALL highlight invalid fields
- **AND** the system SHALL prevent submission until valid

---

### Requirement: Responsive Design

The system SHALL provide a responsive interface for instant order management.

#### Scenario: Mobile list view
- **GIVEN** the list page is displayed on a mobile device
- **WHEN** the page renders
- **THEN** the table SHALL adapt to mobile layout
- **AND** filters SHALL be collapsible or stacked
- **AND** actions SHALL be touch-friendly

#### Scenario: Mobile form view
- **GIVEN** the create/edit form is displayed on a mobile device
- **WHEN** the page renders
- **THEN** the form SHALL use full-width inputs
- **AND** the items editor SHALL stack vertically
- **AND** the submit button SHALL be easily accessible
