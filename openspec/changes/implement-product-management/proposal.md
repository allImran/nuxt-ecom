# Implement Product Management

## Summary

Implement a comprehensive product management interface in the Admin panel, enabling administrators to list, create, and update products. This includes managing product details, images, content sections, and variants with dynamic attributes.

## Motivation

Currently, the Admin panel lacks product management capabilities. Administrators need a way to manage their product catalog, including uploading images, setting prices, defining variants (e.g., size, color), and structuring rich content.

## Proposed Changes

### 1. Network Layer Updates

- Update `app/network/admin.ts` to include product management API calls:
  - `fetchProducts`
  - `fetchProduct(id)`
  - `createProduct(data)`
  - `updateProduct(id, data)`
  - `deleteProduct(id)`
  - `fetchVariants(productId)`
  - `createVariant(productId, data)`
  - `updateVariant(id, data)`
  - `deleteVariant(id)`
  - `uploadFile(file)` (using existing file API)

### 2. Admin UI Updates

- **Product List (`/admin/products`)**:
  - Display a list of products suitable for e-commerce (image, name, SKU, price range, category).
  - "Create Product" action.
- **Product Creation Flow**:
  - Step 1: Select Root Category (Required).
  - Step 2: Navigate to Product Detail/Edit page with initialized data.
- **Product Detail/Edit (`/admin/products/:id`)**:
  - **General Info**: Name, Slug, Description (if any).
  - **Category**: Read-only display of selected category.
  - **Images**:
    - Multi-file upload.
    - Display using `getPublicImage` helper.
    - Reorder/Remove capabilities.
  - **Sections**:
    - Dynamic list of content sections.
    - Types: Text, Media (File Upload).
  - **Variants**:
    - List of existing variants.
    - "Add Variant" button.
    - Variant Edit (Modal or Inline):
      - SKU, Price.
      - Dynamic Attributes (Key-Value pairs, e.g., Color=Red, Size=M).

### 3. Utilities

- Implement `getPublicImage` helper in `app/utils/image.ts`.

## Dependencies

- Supabase storage for images.
- Existing `UiLuxury` components for UI consistency.
- `admin` middleware for access control.
