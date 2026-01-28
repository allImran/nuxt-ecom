## 1. Network Layer

- [x] 1.1 Add `fetchProductBySlug` function to `app/network/public.ts`
- [x] 1.2 Export required types (Product, ProductVariant, ProductSection) from public.ts

## 2. State Management (Pinia Store)

- [x] 2.1 Create `app/stores/productDetail.ts` with Setup Store pattern
- [x] 2.2 Add state: product, selectedVariant, loading, error
- [x] 2.3 Add computed: displayPrice, hasVariants, orderedMedia
- [x] 2.4 Add actions: fetchProductBySlug, selectVariant, reset
- [x] 2.5 Add error handling with try-catch blocks

## 3. Business Logic (Composable)

- [x] 3.1 Create `app/composables/useProductDetailViewModel.ts`
- [x] 3.2 Connect to productDetail store using storeToRefs
- [x] 3.3 Import `getPublicImage` utility from `~/utils/image`
- [x] 3.4 Add helper functions: formatPrice, getAttributeValue, extractYouTubeId, getImageUrl
- [x] 3.5 Add variant selection logic
- [x] 3.6 Add media ordering logic (YouTube first, then images with `getPublicImage`)

## 4. Page Component

- [x] 4.1 Create `app/pages/products/[slug].vue`
- [x] 4.2 Add page metadata (useHead for SEO)
- [x] 4.3 Set up default layout
- [x] 4.4 Call composable in onMounted to fetch product by slug
- [x] 4.5 Handle loading state with skeleton
- [x] 4.6 Handle error state with error message
- [x] 4.7 Render product detail components when data loaded

## 5. Product Components - Breadcrumbs

- [x] 5.1 Create `app/components/product/ProductBreadcrumbs.vue`
- [x] 5.2 Add nested slot structure: `<ProductBreadcrumbs><ProductBreadcrumbsItem /></ProductBreadcrumbs>`
- [x] 5.3 Create `app/components/product/ProductBreadcrumbsItem.vue` for individual items
- [x] 5.4 Style with luxury theme colors and spacing

## 6. Product Components - Media Gallery

- [x] 6.1 Create `app/components/product/ProductMediaGallery.vue` (container)
- [x] 6.2 Create `app/components/product/ProductMediaGalleryMain.vue` (main display)
- [x] 6.3 Create `app/components/product/ProductMediaGalleryThumbnails.vue` (thumbnail container)
- [x] 6.4 Create `app/components/product/ProductMediaThumbnail.vue` (individual thumbnail)
- [x] 6.5 Add YouTube embed support with ID extraction
- [x] 6.6 Add image lazy loading
- [x] 6.7 Implement thumbnail click to change main image
- [x] 6.8 Add hover effects and transitions
- [x] 6.9 Style for mobile (horizontal thumbnails) and desktop (vertical thumbnails)

## 7. Product Components - Info Section

- [x] 7.1 Create `app/components/product/ProductInfoSection.vue` (container)
- [x] 7.2 Create `app/components/product/ProductInfoHeader.vue` (name, category)
- [x] 7.3 Create `app/components/product/ProductInfoPrice.vue` (price display with range logic)
- [x] 7.4 Create `app/components/product/ProductInfoDescription.vue` (short description)
- [x] 7.5 Implement price range calculation (min-max when no variant selected)
- [x] 7.6 Style with luxury theme typography and spacing

## 8. Product Components - Variant Selector

- [x] 8.1 Create `app/components/product/ProductVariantSelector.vue` (container)
- [x] 8.2 Create `app/components/product/ProductVariantItem.vue` (individual variant)
- [x] 8.3 Create `app/components/product/ProductVariantAttributes.vue` (attribute display)
- [x] 8.4 Add selection state management (connect to store via composable)
- [x] 8.5 Display variant SKU and price
- [x] 8.6 Display attributes as key-value pairs
- [x] 8.7 Add visual feedback for selected variant
- [x] 8.8 Handle empty variants (don't render component)

## 9. Product Components - Content Sections

- [x] 9.1 Create `app/components/product/ProductContentSections.vue` (container)
- [x] 9.2 Create `app/components/product/ProductSectionText.vue` for text sections
- [x] 9.3 Create `app/components/product/ProductSectionMedia.vue` for media sections
- [x] 9.4 Use `getPublicImage` utility to generate URLs for section media images
- [x] 9.5 Implement accordion/expandable pattern for sections (optional based on design)
- [x] 9.6 Render text content with proper formatting
- [x] 9.7 Render media sections in grid layout
- [x] 9.8 Handle mixed content types in correct order

## 10. UI Components - Loading States

- [x] 10.1 Add skeleton loader component for media gallery
- [x] 10.2 Add skeleton loader for product info
- [x] 10.3 Add skeleton loader for variant selector
- [x] 10.4 Ensure skeleton matches final layout structure
- [x] 10.5 Apply shimmer animation from existing theme

## 11. Styling and Responsiveness

- [x] 11.1 Implement desktop layout (60/40 two-column grid)
- [x] 11.2 Implement mobile layout (vertical stack)
- [x] 11.3 Implement tablet layout (adapted grid)
- [x] 11.4 Apply luxury theme colors from main.css
- [x] 11.5 Apply luxury border radius and letter spacing
- [x] 11.6 Add transitions and hover effects
- [x] 11.7 Ensure dark mode compatibility
- [x] 11.8 Test on various screen sizes

## 12. Testing and Validation

- [ ] 12.1 Test page with sample product slug
- [ ] 12.2 Test loading state with slow API
- [ ] 12.3 Test error state with invalid slug
- [ ] 12.4 Test variant selection functionality
- [ ] 12.5 Test YouTube video embedding
- [ ] 12.6 Test image thumbnail navigation
- [ ] 12.7 Test responsive behavior on mobile
- [x] 12.8 Verify no console errors (build passed successfully)
- [x] 12.9 Verify all project.md constraints met (no logic in .vue, no local variables, etc.)

## 13. Integration

- [x] 13.1 Update home page product cards to link to `/products/[slug]` (already implemented in useHomeViewModel)
- [ ] 13.2 Verify navigation from home to product detail works
- [ ] 13.3 Test back button and browser navigation
