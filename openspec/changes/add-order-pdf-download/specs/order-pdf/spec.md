# Order PDF Generation Specification

## ADDED Requirements

### Requirement: Order PDF Download Button

The system SHALL provide a "Download PDF" button on the order detail page that allows customers to download their order as a PDF invoice document.

#### Scenario: User downloads order PDF

- **WHEN** a customer views their order detail page
- **THEN** a "Download PDF" button is visible in the order header section
- **AND** clicking the button generates and downloads a PDF file
- **AND** the PDF filename is in the format `order-{order-id}-{date}.pdf`

#### Scenario: PDF generation during loading

- **WHEN** the PDF is being generated
- **THEN** the download button shows a loading state
- **AND** the button is disabled during generation
- **AND** generation completes within 2 seconds for typical orders

#### Scenario: PDF generation error handling

- **WHEN** PDF generation fails
- **THEN** an error message is displayed to the user
- **AND** the page remains functional
- **AND** the user can retry the download

### Requirement: PDF Document Format

The generated PDF SHALL be a native A4-sized document (210mm × 297mm) with professional formatting.

#### Scenario: A4 page size

- **WHEN** the PDF is generated
- **THEN** the document uses A4 page size (210mm × 297mm)
- **AND** margins are at least 15mm on all sides
- **AND** content fits within the printable area
- **AND** pages are automatically added when content exceeds one page

#### Scenario: Native PDF generation

- **GIVEN** the order data is available
- **WHEN** the PDF is generated
- **THEN** the PDF is created programmatically from scratch
- **AND** the PDF is NOT converted from HTML
- **AND** all elements are positioned precisely
- **AND** fonts, colors, and styling are embedded in the PDF

### Requirement: PDF Content - UrbanEase Logo

The generated PDF SHALL include the UrbanEase logo in the document header.

#### Scenario: Logo display in header

- **GIVEN** the UrbanEase logo file exists at `/public/urban-ease-logo.png`
- **WHEN** the PDF is generated
- **THEN** the logo is displayed in the top-left of the header
- **AND** the logo width is approximately 40-50mm
- **AND** the logo maintains its aspect ratio
- **AND** the logo appears clear and high-quality when printed

#### Scenario: Logo missing or unavailable

- **GIVEN** the UrbanEase logo file is not available
- **WHEN** the PDF is generated
- **THEN** the PDF still generates successfully
- **AND** the company name is displayed as text fallback
- **AND** the document layout remains unchanged

### Requirement: PDF Content - Company Details

The generated PDF SHALL include company details at the top of the document in a professional header format.

#### Scenario: Company header display

- **GIVEN** the PDF configuration includes company details
- **WHEN** the PDF is generated
- **THEN** the document header displays the company name
- **AND** includes company address
- **AND** includes company phone number
- **AND** includes company email
- **AND** displays "INVOICE" label prominently
- **AND** displays order ID and order date
- **AND** the UrbanEase logo is positioned to the left of company details

#### Scenario: Company details are configurable

- **GIVEN** the PDF configuration utility exists
- **WHEN** company information needs to be updated
- **THEN** details can be modified in `app/config/pdfConfig.ts`
- **AND** changes are reflected in all newly generated PDFs

### Requirement: PDF Content - Customer Details

The generated PDF SHALL include customer information including name, phone number, and shipping address.

#### Scenario: Customer details display

- **GIVEN** an order exists with customer information
- **WHEN** the PDF is generated
- **THEN** the customer full name is displayed
- **AND** the customer phone number is displayed
- **AND** the complete shipping address is displayed including:
  - Division name
  - District name (if available)
  - Upazila name (if available)
  - Street address

#### Scenario: Customer details with partial address

- **GIVEN** an order has only division and address (missing district/upazila)
- **WHEN** the PDF is generated
- **THEN** only available address fields are displayed
- **AND** no empty fields are shown

### Requirement: PDF Content - Order Items Table

The generated PDF SHALL include a table listing all order items with product name, quantity, unit price, and total price.

#### Scenario: Order items table display

- **GIVEN** an order contains multiple items
- **WHEN** the PDF is generated
- **THEN** a table is rendered with column headers: "Item", "Quantity", "Unit Price", "Total"
- **AND** each row displays one order item
- **AND** the item name is shown (from snapshot_name field)
- **AND** quantity is displayed as a number
- **AND** unit price is displayed in BDT currency format
- **AND** total (quantity × unit price) is displayed in BDT currency format

#### Scenario: Single item order

- **GIVEN** an order contains only one item
- **WHEN** the PDF is generated
- **THEN** the items table displays the single item correctly
- **AND** table formatting remains consistent

#### Scenario: Order with variant items

- **GIVEN** an order item includes variant information
- **WHEN** the PDF is generated
- **THEN** the snapshot_name includes variant details (e.g., "Product Name (Size: M, Color: Blue)")

#### Scenario: Large items list

- **GIVEN** an order contains more than 10 items
- **WHEN** the PDF is generated
- **THEN** the table spans multiple pages if needed
- **AND** table headers are repeated on each page
- **AND** all items are displayed

### Requirement: PDF Content - Order Summary

The generated PDF SHALL include an order summary section showing subtotal, delivery charge, and total amount.

#### Scenario: Order summary calculation

- **GIVEN** an order contains items with various quantities and prices
- **WHEN** the PDF is generated
- **THEN** the summary section displays:
  - "Subtotal" with sum of all item totals
  - "Delivery Charge" with fixed value of 100 BDT
  - "Total" with sum of subtotal and delivery charge
- **AND** all amounts are formatted in BDT currency
- **AND** the total matches the order's total_amount

#### Scenario: Summary formatting

- **GIVEN** the order summary is calculated
- **WHEN** displayed in the PDF
- **THEN** the summary is right-aligned
- **AND** the total amount is displayed in bold or larger font
- **AND** summary is clearly separated from items table

### Requirement: PDF Content - Footer

The generated PDF SHALL include a footer with company contact information and a thank you message.

#### Scenario: Footer display

- **WHEN** the PDF is generated
- **THEN** the document footer displays "Thank you for your order!"
- **AND** includes company contact information
- **AND** footer appears at the bottom of the last page

### Requirement: PDF Formatting and Styling

The generated PDF SHALL use professional formatting consistent with standard business invoices.

#### Scenario: Font and styling

- **WHEN** the PDF is generated
- **THEN** standard fonts are used (Helvetica or Arial)
- **AND** font sizes are readable (10-12pt for body, larger for headers)
- **AND** appropriate margins are maintained (at least 15mm on all sides)
- **AND** section borders separate header, items, and summary

#### Scenario: Currency formatting

- **GIVEN** an amount in BDT needs to be displayed
- **WHEN** rendering in the PDF
- **THEN** the amount uses BDT currency format
- **AND** follows the pattern: "৳X,XXX.XX" (e.g., "৳1,234.56")

### Requirement: PDF Filename

The downloaded PDF file SHALL have a descriptive filename based on order ID and date.

#### Scenario: Filename generation

- **GIVEN** an order with ID "abc-123" and date "2025-01-15"
- **WHEN** the PDF is downloaded
- **THEN** the filename is "order-abc-123-2025-01-15.pdf"
- **AND** the filename uses only the date portion (not time)
- **AND** the filename contains no special characters or spaces

### Requirement: Client-Side PDF Generation

The system SHALL generate PDFs entirely on the client side using browser JavaScript.

#### Scenario: No server dependency

- **GIVEN** the PDF generation functionality
- **WHEN** a user clicks download
- **THEN** PDF generation occurs in the browser
- **AND** no API call is made to generate the PDF
- **AND** the order data is already loaded from the existing API call

#### Scenario: Performance for typical orders

- **GIVEN** an order with 1-10 items
- **WHEN** the user clicks download
- **THEN** PDF generation completes within 1 second
- **AND** the download begins automatically

### Requirement: Cross-Browser Compatibility

The PDF download functionality SHALL work across modern web browsers.

#### Scenario: Chrome browser

- **GIVEN** the user is using Chrome browser
- **WHEN** the download button is clicked
- **THEN** the PDF downloads correctly
- **AND** the PDF is readable when opened

#### Scenario: Firefox browser

- **GIVEN** the user is using Firefox browser
- **WHEN** the download button is clicked
- **THEN** the PDF downloads correctly
- **AND** the PDF is readable when opened

#### Scenario: Safari browser

- **GIVEN** the user is using Safari browser
- **WHEN** the download button is clicked
- **THEN** the PDF downloads correctly
- **AND** the PDF is readable when opened
