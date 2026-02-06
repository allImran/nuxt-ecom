# Design: Order PDF Download

## Context

The order detail page currently displays all order information in the browser. We need to add a **native PDF generation service** that creates a professional A4-sized PDF invoice from order data. This is **NOT** an HTML-to-PDF conversion - the PDF will be programmatically generated with precise layout control.

### Requirements
- PDF must be **A4 size** (210mm × 297mm)
- PDF must include: UrbanEase logo, company details, user details, items list with quantities, shipping details, summary (subtotal, delivery charge, total)
- PDF generation is a **separate service** - not converting existing HTML to PDF
- Delivery charge is fixed at 100 BDT for now
- PDF should be generated client-side (no server-side rendering)
- PDF should be downloadable via a button on the order detail page

## Goals / Non-Goals

### Goals
- Generate professional-looking PDF invoices from order data
- Support client-side PDF generation for quick user experience
- Include all essential order information in a readable format
- Support BDT currency formatting
- Make the PDF template maintainable and customizable

### Non-Goals
- Server-side PDF generation (can be added later if needed)
- Emailing PDFs (separate feature)
- Multi-page invoice support (will be handled naturally by the library)
- Custom PDF templates per business (single template for now)

## Decisions

### Decision 1: Native PDF Generation (NOT HTML-to-PDF)

**Choice**: Use `jsPDF` with `jspdf-autotable` plugin for native PDF generation

**Important**: This is **NOT** HTML-to-PDF conversion. We are creating a dedicated PDF generation service that programmatically builds the PDF document with precise control over layout, fonts, positioning, and formatting.

**Alternatives considered**:
1. **jsPDF** (CHOSEN):
   - Pros: Native PDF generation, lightweight, mature, good documentation, client-side only, works well with Nuxt/Vue, precise control over every element
   - Cons: Requires manual layout management (but this gives us control)
   - Plugin `jspdf-autotable` provides table support for order items

2. **html2pdf.js / html2canvas**:
   - Pros: Converts existing HTML to PDF
   - Cons: Less control over output, can be buggy with complex CSS, not truly professional, **REJECTED** per requirements

3. **pdfmake**:
   - Pros: Declarative API, better layout control
   - Cons: Larger bundle size, requires virtual filesystem setup in browser

**Rationale**: jsPDF is the most mature and widely used client-side PDF library for JavaScript. It provides native PDF generation (not HTML conversion) with precise control over positioning, fonts, and formatting. This allows us to create a truly professional A4 invoice with the UrbanEase logo, proper table layout, and exact control over every element on the page.

### Decision 2: PDF Template Structure (A4 Professional Invoice)

**Document Size**: A4 (210mm × 297mm)

**Layout**: Standard invoice format
- **Header** (top 25% of page):
  - UrbanEase logo (left-aligned, ~40mm width)
  - Company name (next to logo or below)
  - "INVOICE" label (prominent, right-aligned)
  - Order ID and date (right-aligned, below invoice label)
  - Company contact details (below header)
- **Customer Details** (below header):
  - Section title: "Bill To" or "Customer Details"
  - Customer full name
  - Customer phone number
  - Complete shipping address (division, district, upazila, street address)
- **Items Table** (middle section):
  - Table headers: "Item", "Quantity", "Unit Price", "Total"
  - One row per order item
  - Auto-page breaking if many items
- **Summary Section** (bottom of items table or new page):
  - Right-aligned summary with: Subtotal, Delivery Charge (100 BDT), Total
  - Total in bold/larger font
- **Footer** (bottom of last page):
  - "Thank you for your order!" message
  - Company contact information
  - Page numbers (if multi-page)

**Styling**:
- Clean, professional look
- Use standard fonts (Helvetica/Arial for compatibility)
- Font sizes: 10-12pt body, 14-16pt headers, 18-20pt invoice title
- Border lines for sections
- Right-aligned currency values (৳X,XXX.XX format)
- Margins: minimum 15mm on all sides
- Logo should be high-quality and properly sized

**Logo Handling**:
- UrbanEase logo will be loaded from `/public/urban-ease-logo.png`
- Logo will be embedded as base64 or loaded from public directory
- Logo size: approximately 40-50mm width, maintaining aspect ratio
- Logo positioned in top-left of header

### Decision 3: Company Details Source

**Approach**: Hardcoded company details in a config file for now

**Future consideration**: Could be fetched from business settings API once that capability exists

### Decision 4: Implementation Architecture

**This is a separate PDF generation service**, not integrated with the existing order detail page rendering.

**Components**:
- `composables/useOrderPdf.ts` - PDF generation service/logic (new)
- `utils/pdfConfig.ts` - Company details and PDF configuration constants (new)
- `utils/pdfTemplates.ts` - PDF layout template functions (new, optional)
- Button in `pages/orders/[id].vue` - Trigger download (modify existing)
- Optional: `components/OrderPdfButton.vue` - Reusable button component (new)

**Data Flow**:
1. User views order detail page (existing functionality)
2. User clicks "Download PDF" button
3. PDF generation service `useOrderPdf.generateOrderPdf(order)` is called with order data
4. jsPDF creates new A4 PDF document from scratch (not HTML conversion)
5. PDF is populated with:
   - UrbanEase logo (loaded from `/public/urban-ease-logo.png`)
   - Company details from config
   - Order data (customer, items, shipping, totals)
6. Browser downloads the generated PDF file
7. Order detail page remains unchanged (separate concerns)

**Separation of Concerns**:
- The order detail page continues to render HTML for web display
- The PDF service is independent and generates a completely separate document
- Changes to order detail page HTML do not affect PDF generation
- PDF template can be modified independently of the web UI

## Risks / Trade-offs

### Risk 1: Bundle Size Increase
- **Risk**: Adding jsPDF increases bundle size (~100KB gzipped)
- **Mitigation**: Library is reasonably sized; can be code-split if needed (lazy load only when button clicked)

### Risk 2: Client-Side Performance
- **Risk**: Large orders with many items may cause brief UI freeze during PDF generation
- **Mitigation**: PDF generation is typically fast (< 1 second). Can add loading indicator if needed.

### Risk 3: PDF Layout Complexity
- **Risk**: Manual PDF layout may be time-consuming to get right
- **Mitigation**: Start with simple invoice template, iterate based on feedback. autotable plugin handles most complexity.

## Migration Plan

### Implementation Steps
1. **Setup**:
   - Install dependencies (`npm install jspdf jspdf-autotable`)
   - Verify UrbanEase logo exists at `/public/urban-ease-logo.png`
   - Install TypeScript types (`npm install --save-dev @types/jspdf`)

2. **Configuration**:
   - Create `utils/pdfConfig.ts` with company details and constants
   - Define A4 page dimensions (210mm × 297mm)
   - Configure margins, fonts, colors

3. **PDF Service**:
   - Create `composables/useOrderPdf.ts` - main PDF generation service
   - Implement logo loading and positioning
   - Implement header generation (logo + company details + invoice info)
   - Implement customer details section
   - Implement items table with autotable
   - Implement summary section
   - Implement footer with page numbers (if needed)

4. **UI Integration**:
   - Add "Download PDF" button to order detail page header
   - Add loading state during PDF generation
   - Add error handling

5. **Testing**:
   - Test with single item orders
   - Test with multiple item orders (10+ items)
   - Test with long product names and addresses
   - Verify logo appears correctly
   - Test A4 layout doesn't overflow
   - Test on different browsers
   - Verify currency formatting (৳ symbol)

### Rollback
- Remove PDF generation code if issues arise
- Revert dependency installation
- Remove download button from order detail page
- No database changes, so easy rollback

## Open Questions

1. **Q**: Should the PDF include order status history?
   **A**: Not included in initial scope. Focus on invoice details first. Can be added later if needed.

2. **Q**: Should delivery charge be configurable per order?
   **A**: Fixed at 100 BDT for now as specified. Can be made dynamic in future.

3. **Q**: Should we support multiple languages in the PDF?
   **A**: Start with English only. i18n support can be added later if required.

4. **Q**: Should the PDF include product images?
   **A**: Not in initial scope. Adds complexity. Text-only invoice is standard.
