## Context

The product detail page is a core e-commerce feature that displays comprehensive product information. The design follows the reference image with a two-column layout (60% media, 40% product info) while adhering to the project's luxury theme and strict architectural patterns.

**Constraints:**
- No logic in `.vue` files - all logic in composables
- No local variables in components - use composables for all state
- DRY principle - reusable nested components to avoid props drilling
- Mobile-first responsive design
- Follow luxury theme from `app/assets/css/main.css`
- Use Pinia stores for state management
- Use $fetch for API calls

**Stakeholders:**
- End users viewing product details
- Admin users managing product content

## Goals / Non-Goals

**Goals:**
1. Display product information with media gallery, variants, and content sections
2. Support dynamic slug-based routing for SEO-friendly URLs
3. Reusable component architecture using nested slots
4. Loading states and error handling
5. Mobile-responsive layout
6. YouTube video integration (first media item if exists)
7. Variant selection with attribute display
8. Expandable content sections (accordion pattern)

**Non-Goals:**
- Add to cart functionality (separate feature)
- Product reviews/ratings (future capability)
- Related products (future capability)
- Stock management display (future capability)

## Decisions

### Decision 1: Component Architecture - Nested Slot Pattern

**What**: Use nested slot pattern to avoid props drilling. Components will use provide/inject or slot composition instead of deeply passing props.

**Why**: Project.md explicitly states "Use nested slot to avoid props drilling". This keeps components decoupled and maintainable.

**Alternatives considered:**
- Props drilling - Rejected due to project.md constraint
- Pinia store for component state - Overkill for presentation logic
- Provide/inject - Valid alternative, but slots are more explicit

### Decision 2: Media Order - YouTube First

**What**: If a product has a YouTube URL, embed it as the first media item in the gallery, followed by product images.

**Why**: User requirement states "youtube video will be the first item if exist, then other images". This prioritizes video content which may be more engaging.

**Implementation**:
```typescript
// Computed property that orders media
const orderedMedia = computed(() => {
  const media: MediaItem[] = []
  if (product.value?.youtube_url) {
    media.push({ type: 'video', url: product.value.youtube_url })
  }
  product.value?.file_paths?.forEach(path => {
    media.push({ type: 'image', url: getPublicImage('products', path) })
  })
  return media
})
```

### Decision 2.1: Image URL Generation - Use Existing Utility

**What**: Use the existing `getPublicImage` utility function from `app/utils/image.ts` for all product image URLs.

**Why**: The utility already handles Supabase storage URL generation correctly, including error handling for missing configuration. Reusing it follows DRY principle and ensures consistency across the application.

**Implementation**:
```typescript
// In composable or component
import { getPublicImage } from '~/utils/image'

const imageUrl = computed(() => {
  if (!product.value?.file_paths || product.value.file_paths.length === 0) {
    return placeholderImage
  }
  return getPublicImage('products', product.value.file_paths[0])
})
```

**Alternatives considered:**
- Inline URL construction - Rejected, duplicates existing utility logic
- Create new utility - Rejected, existing utility is sufficient

### Decision 3: Store Organization - Separate productDetail Store

**What**: Create a dedicated `useProductDetailStore` instead of reusing `useHomeStore`.

**Why**: Product detail has different state management needs:
- Single product vs list of products
- Selected variant state
- Image gallery state
- Section expansion states

**Alternatives considered:**
- Extend home store - Rejected, violates single responsibility
- No store, only composable - Rejected, project.md requires Pinia for state

### Decision 4: Component Structure - Product Directory

**What**: Create `app/components/product/` directory with:
- `ProductMediaGallery.vue` - Gallery with thumbnails
- `ProductInfoSection.vue` - Basic product info
- `ProductVariantSelector.vue` - Variant selection
- `ProductContentSections.vue` - Text/media sections
- `ProductBreadcrumbs.vue` - Navigation

Each component will have nested sub-components using slots:
```vue
<ProductMediaGallery>
  <ProductMediaGalleryMain />
  <ProductMediaGalleryThumbnails>
    <ProductMediaThumbnail />
  </ProductMediaGalleryThumbnails>
</ProductMediaGallery>
```

**Why**: Follows DRY principle, avoids props drilling, maintains presentational purity.

### Decision 5: State Management - Selected Variant

**What**: Track selected variant in Pinia store with computed price display.

**Why**: Variant selection affects displayed price and attributes. Centralized state enables consistent price calculation.

**Implementation**:
```typescript
// In productDetail store
const selectedVariant = ref<ProductVariant | null>(null)
const displayPrice = computed(() => {
  if (selectedVariant.value) return selectedVariant.value.price
  const prices = product.value?.variants?.map(v => v.price) || []
  return prices.length ? Math.min(...prices) : null
})
```

## Risks / Trade-offs

- **Risk**: YouTube embed may not work with all URL formats
  - **Mitigation**: Use robust YouTube ID extraction regex, fallback to link if embed fails

- **Risk**: Large product images may slow page load
  - **Mitigation**: Implement lazy loading for images, show skeleton during load

- **Risk**: Variant attributes can be arbitrary key-value pairs
  - **Mitigation**: Use generic attribute renderer, format as key-value list

- **Trade-off**: Nested components increase file count
  - **Justification**: Improves reusability, avoids props drilling (project requirement)

## Migration Plan

No migration needed - this is a new feature.

**Steps:**
1. Create network function for fetching product by slug
2. Create Pinia store for product detail state
3. Create composable for business logic
4. Create page component
5. Create nested presentation components
6. Test with sample product data

**Rollback**: Delete new files, no existing code affected.

## Open Questions

None - requirements are clear from API response structure and design reference.
