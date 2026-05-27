# Implementation Tasks: Order PDF Download

## 1. Setup and Dependencies

- [x] 1.1 Install jsPDF and jspdf-autotable packages (`npm install jspdf jspdf-autotable`)
- [x] 1.2 Install TypeScript type definitions for jsPDF (`npm install --save-dev @types/jspdf`)
- [x] 1.3 Verify INDOORSHOPPING logo exists at `/public/urban-ease-logo.png`
- [x] 1.4 Verify installation in package.json

## 2. Configuration and Utilities

- [x] 2.1 Create `app/config/pdfConfig.ts` with company details (name, address, phone, email)
- [x] 2.2 Define PDF document constants (A4 size: 210mm × 297mm, margins: 15mm)
- [x] 2.3 Define font sizes (10-12pt body, 14-16pt headers, 18-20pt invoice title)
- [x] 2.4 Create utility function for currency formatting in BDT (৳ symbol)
- [x] 2.5 Define colors and styling constants

## 3. PDF Generation Logic (Native PDF, NOT HTML conversion)

- [x] 3.1 Create `app/composables/useOrderPdf.ts` - PDF generation service
- [x] 3.2 Implement `generateOrderPdf(order: OrderDetail)` function
- [x] 3.3 Create new jsPDF document instance with A4 dimensions (210mm × 297mm)
- [x] 3.4 Implement logo loading from `/public/urban-ease-logo.png`
- [x] 3.5 Implement PDF header:
  - [x] 3.5.1 Add INDOORSHOPPING logo to top-left (40-50mm width)
  - [x] 3.5.2 Add company name next to or below logo
  - [x] 3.5.3 Add "INVOICE" label (right-aligned, large font)
  - [x] 3.5.4 Add order ID and date (right-aligned, below invoice)
  - [x] 3.5.5 Add company contact details (below header)
- [x] 3.6 Implement customer details section:
  - [x] 3.6.1 Add section title "Bill To" or "Customer Details"
  - [x] 3.6.2 Add customer full name
  - [x] 3.6.3 Add customer phone number
  - [x] 3.6.4 Add complete shipping address (division, district, upazila, street)
- [x] 3.7 Implement order items table using jspdf-autotable:
  - [x] 3.7.1 Define table columns: "Item", "Quantity", "Unit Price", "Total"
  - [x] 3.7.2 Add rows for each order item
  - [x] 3.7.3 Enable auto-page breaking for long item lists
  - [x] 3.7.4 Right-align currency columns
  - [x] 3.7.5 Format prices with ৳ symbol (e.g., ৳1,234.56)
- [x] 3.8 Implement summary section:
  - [x] 3.8.1 Calculate subtotal (sum of item totals)
  - [x] 3.8.2 Add delivery charge (fixed at 100 BDT)
  - [x] 3.8.3 Calculate total (subtotal + delivery charge)
  - [x] 3.8.4 Right-align summary values
  - [x] 3.8.5 Display total in bold/larger font
- [x] 3.9 Implement footer:
  - [x] 3.9.1 Add "Thank you for your order!" message
  - [x] 3.9.2 Add company contact information
  - [x] 3.9.3 Add page numbers (if multi-page)
- [x] 3.10 Add filename generation (e.g., `order-{id}-{date}.pdf`)
- [x] 3.11 Implement logo fallback if image fails to load (display company name as text)

## 4. UI Integration

- [x] 4.1 Add "Download PDF" button to order detail page ([app/pages/orders/[id].vue](app/pages/orders/[id].vue))
- [x] 4.2 Position button in header section alongside status and date
- [x] 4.3 Add loading state during PDF generation
- [x] 4.4 Add error handling for PDF generation failures

## 5. Styling and Polish

- [x] 5.1 Apply professional styling to PDF (fonts, spacing, borders)
- [x] 5.2 Ensure proper table column widths and alignment
- [ ] 5.3 Test with various order sizes (1 item, 10+ items)
- [ ] 5.4 Test with long product names and addresses
- [x] 5.5 Verify BDT currency formatting in PDF

## 6. Validation

- [ ] 6.1 Manually test PDF download with sample orders
- [ ] 6.2 Verify PDF includes all required information:
  - INDOORSHOPPING logo in header
  - Company details
  - User details (name, phone)
  - Items list with quantity and prices
  - Shipping details (address)
  - Summary with delivery charge (100 BDT) and total
  - Thank you message in footer
- [x] 6.3 Verify PDF is A4 size (210mm × 297mm)
- [x] 6.4 Verify PDF is generated natively (not HTML conversion)
- [ ] 6.5 Test on different browsers (Chrome, Firefox, Safari)
- [ ] 6.6 Verify PDF is readable when printed
- [ ] 6.7 Test with order containing items without images
- [ ] 6.8 Test logo quality and positioning
- [ ] 6.9 Test with single item orders
- [ ] 6.10 Test with multiple item orders (10+ items, tests pagination)
- [ ] 6.11 Test with long product names and addresses (tests text wrapping)
- [x] 6.12 Verify BDT currency formatting (৳ symbol)

## 7. Documentation

- [x] 7.1 Add inline comments to PDF generation logic
- [x] 7.2 Document PDF configuration structure
- [x] 7.3 Update this tasks.md as implementation progresses

## Notes

- This is a **native PDF generation service** - NOT converting existing HTML to PDF
- Tasks should be completed in order
- Each task should be verified before moving to the next
- Test frequently to catch issues early
- Keep PDF template simple and maintainable
- PDF is generated on the client side using jsPDF (programmatic PDF creation, not HTML-to-PDF)
- INDOORSHOPPING logo must be available at `/public/urban-ease-logo.png` before implementation
- PDF layout is independent of the order detail page HTML - completely separate service
