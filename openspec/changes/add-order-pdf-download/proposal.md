# Change: Add Order PDF Download from Order Detail Page

## Why

Customers need the ability to download their orders as PDF documents for record-keeping, invoicing, and proof of purchase. Currently, orders can only be viewed on the web page, which is not suitable for offline storage or printing. This feature enhances the customer experience by providing a professional, printable invoice that can be saved or shared.

## What Changes

- **ADDED**: New "Download PDF" button on the order detail page ([app/pages/orders/[id].vue](app/pages/orders/[id].vue))
- **ADDED**: PDF generation functionality using a client-side library (jsPDF or pdfmake)
- **ADDED**: PDF template/layout with company details, user details, items list, shipping details, and summary with delivery charge
- **ADDED**: PDF download utility/composable for handling PDF generation
- **ADDED**: New npm dependency for PDF generation

## Impact

- **Affected specs**:
  - New capability: `order-pdf` (PDF generation and download functionality)
- **Affected code**:
  - [app/pages/orders/[id].vue](app/pages/orders/[id].vue) - Add download button
  - New composables/utils for PDF generation
  - New components for PDF template (optional, depending on approach)
- **Dependencies**:
  - Will add `jspdf` and `@types/jspdf` OR `pdfmake` as dependencies
  - Delivery charge fixed at 100 BDT for now (as specified)
