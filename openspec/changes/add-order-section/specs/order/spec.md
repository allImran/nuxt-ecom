## ADDED Requirements

### Requirement: Order Product Selection

The system SHALL allow users to view products and adjust quantities for ordering.

#### Scenario: Display products with initial quantity

- **WHEN** the order component receives a products array
- **THEN** the system SHALL display each product with its name, price (from first variant), and quantity initialized to 0

#### Scenario: Increase product quantity

- **WHEN** user clicks the increase quantity button for a product
- **THEN** the system SHALL increment the quantity by 1
- **AND** update the displayed total price

#### Scenario: Decrease product quantity

- **WHEN** user clicks the decrease quantity button for a product
- **THEN** the system SHALL decrement the quantity by 1
- **AND** shall not allow quantity to go below 0
- **AND** update the displayed total price

#### Scenario: Calculate order subtotal

- **WHEN** one or more products have quantity greater than 0
- **THEN** the system SHALL calculate subtotal as sum of (product price × quantity) for all products

### Requirement: Shipping Address Collection

The system SHALL collect shipping address information with Bangladesh geographic divisions.

#### Scenario: Select division

- **WHEN** user interacts with the division selector
- **THEN** the system SHALL display all 8 divisions of Bangladesh
- **AND** SHALL show division names in the current locale language (Bengali or English)
- **AND** SHALL allow searching by both Bengali and English names

#### Scenario: Select district after division

- **WHEN** user has selected a division
- **THEN** the system SHALL filter and display only districts belonging to the selected division
- **AND** SHALL allow user to optionally select a district or leave it empty

#### Scenario: Select upazila after district

- **WHEN** user has selected a district
- **THEN** the system SHALL filter and display only upazilas belonging to the selected district
- **AND** SHALL allow user to optionally select an upazila or leave it empty

#### Scenario: Enter full address

- **WHEN** user types in the full address field
- **THEN** the system SHALL accept any text input for detailed address information

#### Scenario: Enter mobile number

- **WHEN** user types in the mobile number field
- **THEN** the system SHALL accept mobile number input
- **AND** SHALL validate that the field is not empty on submission

### Requirement: Bilingual Location Display

The system SHALL display location names based on the current locale setting.

#### Scenario: Display location names in Bengali

- **GIVEN** the current locale is set to Bengali
- **WHEN** displaying divisions, districts, or upazilas
- **THEN** the system SHALL use the `bn_name` field from location data

#### Scenario: Display location names in English

- **GIVEN** the current locale is set to English
- **WHEN** displaying divisions, districts, or upazilas
- **THEN** the system SHALL use the `name` field from location data

#### Scenario: Search locations in Bengali

- **GIVEN** the current locale is Bengali
- **WHEN** user searches for a location using Bengali text
- **THEN** the system SHALL filter locations matching the Bengali name

#### Scenario: Search locations in English

- **GIVEN** the current locale is English
- **WHEN** user searches for a location using English text
- **THEN** the system SHALL filter locations matching the English name

### Requirement: Order Price Calculation

The system SHALL calculate and display order total including delivery fee.

#### Scenario: Calculate total with delivery fee

- **GIVEN** the delivery fee is fixed at 100 TK
- **WHEN** user has selected products with quantities
- **THEN** the system SHALL display the total as (subtotal + 100 TK)

#### Scenario: Display price breakdown

- **WHEN** displaying the order summary
- **THEN** the system SHALL show:
  - Individual product prices × quantities
  - Subtotal of all products
  - Delivery fee (100 TK)
  - Final total

#### Scenario: Update totals in real-time

- **WHEN** user changes any product quantity
- **THEN** the system SHALL immediately recalculate and update all displayed prices

### Requirement: Payment Method Selection

The system SHALL provide payment method selection with Cash on Delivery as the only active option.

#### Scenario: Display Cash on Delivery as selected

- **WHEN** the order form is displayed
- **THEN** the system SHALL have "Cash on Delivery" pre-selected as the payment method

#### Scenario: Disable other payment methods

- **WHEN** displaying payment options
- **THEN** the system SHALL show "Others" option as disabled
- **AND** SHALL display "(coming soon)" text next to the disabled option

### Requirement: Order Submission

The system SHALL submit orders to the `/order` API endpoint with required data.

#### Scenario: Submit order with valid data

- **GIVEN** user has selected at least one product with quantity > 0
- **AND** user has provided all required address fields
- **WHEN** user clicks the submit order button
- **THEN** the system SHALL POST to `/order` endpoint with:
  - `user_id`: null
  - `status`: "pending"
  - `shipping_address`: JSONB object with all address fields
  - `products`: array of {id, variant_id, quantity}
- **AND** SHALL display success message on successful response
- **AND** SHALL reset the form after successful submission

#### Scenario: Prevent submission with no products

- **GIVEN** user has not selected any products (all quantities are 0)
- **WHEN** user clicks the submit order button
- **THEN** the system SHALL NOT submit the order
- **AND** SHALL display validation error message

#### Scenario: Prevent submission with missing address

- **GIVEN** user has not provided required address fields
- **WHEN** user clicks the submit order button
- **THEN** the system SHALL NOT submit the order
- **AND** SHALL display validation error for missing fields

#### Scenario: Handle submission error

- **WHEN** the API returns an error response
- **THEN** the system SHALL display appropriate error message to the user
- **AND** SHALL retain form data for retry

### Requirement: Order Form Layout and Responsiveness

The system SHALL display the order form in a mobile-responsive layout following the luxury theme.

#### Scenario: Display on desktop

- **WHEN** viewing on desktop screen
- **THEN** the system SHALL display address and product sections in appropriate layout
- **AND** SHALL follow luxury theme styling

#### Scenario: Display on mobile

- **WHEN** viewing on mobile screen
- **THEN** the system SHALL stack all sections vertically
- **AND** SHALL ensure touch targets are appropriately sized
- **AND** SHALL maintain readability

#### Scenario: Show loading state during submission

- **WHEN** order submission is in progress
- **THEN** the system SHALL disable the submit button
- **AND** SHALL display loading indicator

### Requirement: Order State Management

The system SHALL manage order state using Pinia store with proper separation of concerns.

#### Scenario: Initialize order state

- **WHEN** the order component mounts
- **THEN** the system SHALL initialize order products with received products array (quantity = 0)
- **AND** SHALL initialize empty shipping address fields

#### Scenario: Persist order state during component lifecycle

- **WHEN** user interacts with the order form
- **THEN** the system SHALL maintain state in Pinia store
- **AND** components shall read state via composable, not directly from store

#### Scenario: Reset order state after submission

- **WHEN** order is successfully submitted
- **THEN** the system SHALL reset all quantities to 0
- **AND** SHALL clear all shipping address fields

### Requirement: Order Component Architecture

The system SHALL implement order components using the project's MVVM pattern with no logic in Vue files.

#### Scenario: Component uses composable for state

- **WHEN** the Order Index component is used
- **THEN** it SHALL import and use the `useOrderViewModel` composable
- **AND** SHALL NOT contain any business logic

#### Scenario: Composable uses store for data

- **WHEN** the `useOrderViewModel` composable is used
- **THEN** it SHALL interact with the order Pinia store
- **AND** SHALL NOT directly call network functions

#### Scenario: Store calls network for API

- **WHEN** order submission is triggered
- **THEN** the Pinia store action SHALL call the network layer
- **AND** the network layer SHALL use $fetch for the API call
