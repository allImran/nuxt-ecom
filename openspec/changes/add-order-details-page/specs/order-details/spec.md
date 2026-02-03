## ADDED Requirements

### Requirement: Order Details Page Routing

The system SHALL provide a dynamic route for order detail pages using the order ID.

#### Scenario: Navigate to order details page

- **GIVEN** an order exists with ID "51fa09ca-822f-4446-9496-8a807ecef9d5"
- **WHEN** a user navigates to `/orders/51fa09ca-822f-4446-9496-8a807ecef9d5`
- **THEN** the system shall render the order details page
- **AND** the page shall display the order information

#### Scenario: Invalid order ID

- **GIVEN** an order does not exist with ID "nonexistent-id"
- **WHEN** a user navigates to `/orders/nonexistent-id`
- **THEN** the system shall display an appropriate error message
- **AND** provide an option to navigate back to home

### Requirement: Order Data Fetching

The system SHALL fetch order data from the public API endpoint using the order ID.

#### Scenario: Successful order fetch

- **GIVEN** the API endpoint `/orders/{id}` returns valid order data
- **WHEN** the page loads with order ID "51fa09ca-822f-4446-9496-8a807ecef9d5"
- **THEN** the system shall call the API endpoint
- **AND** store the order data in Pinia store
- **AND** display loading state during fetch
- **AND** remove loading state after fetch completes

#### Scenario: API error handling

- **GIVEN** the API endpoint returns an error (4xx or 5xx)
- **WHEN** the order data fetch fails
- **THEN** the system shall display a user-friendly error message
- **AND** log the error for debugging
- **AND** not display the order details

### Requirement: Order Header Display

The system SHALL display key order information in a header section.

#### Scenario: Display order header

- **GIVEN** an order with ID, status, total amount, and creation date
- **WHEN** the order details page renders
- **THEN** the system shall display:
  - Order ID
  - Current status as a colored badge
  - Total amount formatted as currency
  - Creation date formatted according to locale

#### Scenario: Status badge color coding

- **GIVEN** an order has status "pending"
- **WHEN** the status badge is displayed
- **THEN** the system shall apply appropriate color (yellow/orange)
- **AND** display "pending" text
- **AND** show different colors for different statuses (delivered=green, cancelled=red, etc.)

### Requirement: Order Items Display

The system SHALL display all items in the order with product information.

#### Scenario: Display order items list

- **GIVEN** an order has multiple order_items with product data
- **WHEN** the order details page renders
- **THEN** the system shall display each order item showing:
  - Product thumbnail image (first image from file_paths)
  - Product name (snapshot_name)
  - Quantity purchased
  - Price at purchase
  - Item total (price × quantity)

#### Scenario: Link to product detail page

- **GIVEN** an order item has associated product data with slug
- **WHEN** user clicks on an order item
- **THEN** the system shall navigate to `/products/{slug}`
- **AND** display the product detail page

#### Scenario: Display variant information

- **GIVEN** an order item has variant data
- **WHEN** the order item is displayed
- **THEN** the system shall display the snapshot_name which includes variant SKU
- **AND** may optionally display variant attributes

#### Scenario: Missing product data

- **GIVEN** an order item has null or missing product data
- **WHEN** the order item is displayed
- **THEN** the system shall display the snapshot_name
- **AND** display placeholder image if no file_paths exist

### Requirement: Shipping Address Display

The system SHALL display the shipping address for the order.

#### Scenario: Display shipping address

- **GIVEN** an order has shipping_address with full_name, mobile, address, and division_name
- **WHEN** the order details page renders
- **THEN** the system shall display:
  - Recipient full name
  - Mobile number
  - Full address text
  - Division name (bilingual based on locale)
  - District name (if available, bilingual)
  - Upazila name (if available, bilingual)

#### Scenario: Bilingual location display

- **GIVEN** the current locale is Bengali
- **WHEN** displaying location names (division, district, upazila)
- **THEN** the system shall use the stored *_name fields from the API response
- **AND** display the names as stored (API provides localized names)

### Requirement: Order Status History Timeline

The system SHALL display a timeline of order status changes.

#### Scenario: Display status history

- **GIVEN** an order has history entries with status, changed_at, and optional comment
- **WHEN** the order details page renders
- **THEN** the system shall display a vertical timeline showing:
  - Each status change with icon
  - Status name
  - Timestamp formatted according to locale
  - Comment if available
- **AND** display entries in reverse chronological order (newest first)

#### Scenario: Empty history

- **GIVEN** an order has no history entries
- **WHEN** the order details page renders
- **THEN** the system shall display only the current order status
- **AND** not display the timeline section

### Requirement: Order Totals Display

The system SHALL display order pricing summary.

#### Scenario: Display price breakdown

- **GIVEN** an order with total_amount and order_items
- **WHEN** the order details page renders
- **THEN** the system shall calculate and display:
  - Subtotal (sum of all item prices × quantities)
  - Delivery fee (if applicable)
  - Total amount matching the API response
- **AND** format all prices as currency with appropriate locale

### Requirement: Loading and Error States

The system SHALL provide clear visual feedback during loading and error states.

#### Scenario: Loading skeleton

- **GIVEN** a user navigates to an order details page
- **WHEN** the order data is being fetched
- **THEN** the system shall display skeleton loaders for all major sections
- **AND** the skeleton shall match the final layout structure

#### Scenario: Network error

- **GIVEN** the API call fails due to network error
- **WHEN** the fetch completes with an error
- **THEN** the system shall display a user-friendly error message
- **AND** provide an option to retry or navigate back to home

#### Scenario: Order not found

- **GIVEN** the API returns 404 for the order ID
- **WHEN** the fetch completes
- **THEN** the system shall display "Order not found" message
- **AND** provide a button to navigate back to home

### Requirement: Responsive Layout

The order details page SHALL be mobile-first and responsive across all device sizes.

#### Scenario: Desktop layout

- **GIVEN** the user is on a desktop screen (1024px and above)
- **WHEN** the order details page renders
- **THEN** the layout shall use appropriate spacing and grid
- **AND** may display order items in multiple columns if appropriate

#### Scenario: Mobile layout

- **GIVEN** the user is on a mobile screen (below 768px)
- **WHEN** the order details page renders
- **THEN** the layout shall stack all sections vertically
- **AND** ensure touch targets are appropriately sized
- **AND** maintain readability

#### Scenario: Tablet layout

- **GIVEN** the user is on a tablet screen (768px - 1023px)
- **WHEN** the order details page renders
- **THEN** the layout shall adapt to the screen width
- **AND** maintain readability and usability

### Requirement: Theme Consistency

The order details page components SHALL follow the luxury theme defined in the project.

#### Scenario: Light mode styling

- **GIVEN** the user has light mode selected
- **WHEN** the order details page renders
- **THEN** all components shall use light theme colors from `main.css`
- **AND** use the luxury border radius (1.5rem)
- **AND** use luxury letter spacing (0.18em)

#### Scenario: Dark mode styling

- **GIVEN** the user has dark mode selected
- **WHEN** the order details page renders
- **THEN** all components shall use dark theme colors from `main.css`
- **AND** maintain the same layout structure as light mode

### Requirement: Date and Number Formatting

The system SHALL format dates and numbers according to the current locale.

#### Scenario: Format dates in Bengali locale

- **GIVEN** the current locale is Bengali
- **WHEN** displaying dates (created_at, changed_at)
- **THEN** the system shall use Bengali date formatting
- **AND** display Bengali numerals if appropriate

#### Scenario: Format dates in English locale

- **GIVEN** the current locale is English
- **WHEN** displaying dates (created_at, changed_at)
- **THEN** the system shall use English date formatting
- **AND** use standard date-time format

#### Scenario: Format prices as currency

- **GIVEN** displaying prices (total_amount, price_at_purchase)
- **WHEN** the price is displayed
- **THEN** the system shall format as BDT currency
- **AND** use appropriate decimal formatting for locale

### Requirement: Component Architecture

The system SHALL implement order detail components using the project's MVVM pattern with no logic in Vue files.

#### Scenario: Page uses composable for state

- **WHEN** the Order Detail page is used
- **THEN** it SHALL import and use the `useOrderDetailViewModel` composable
- **AND** SHALL NOT contain any business logic

#### Scenario: Composable uses store for data

- **WHEN** the `useOrderDetailViewModel` composable is used
- **THEN** it SHALL interact with the orderDetail Pinia store
- **AND** SHALL NOT directly call network functions

#### Scenario: Store calls network for API

- **WHEN** order data fetching is triggered
- **THEN** the Pinia store action SHALL call the network layer
- **AND** the network layer SHALL use $fetch for the API call

#### Scenario: Network function in public.ts

- **WHEN** fetching order details
- **THEN** the network function SHALL be in `app/network/public.ts`
- **AND** SHALL be named `fetchOrderById`
- **AND** SHALL use the API endpoint `/orders/{id}`
