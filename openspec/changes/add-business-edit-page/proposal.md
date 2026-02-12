# Change: Add Business Edit Page

## Why
The business dashboard links to `/business/[id]/edit` page which doesn't exist. Admins need a dedicated interface to edit business details including logo, slogan, colors, contact info, and social media links.

## What Changes
- Add new business edit page at `/business/[id]/edit`
- Add debounced auto-save for text fields (name, slug, slogan, email, address)
- Add instant save for logo image upload
- Add dynamic add/remove social media links
- Extend admin network and store to support all business fields
- Reuse existing UI components (LuxuryInput, LuxuryButton, ProductImageUploader patterns)

## Impact
- Affected specs: New spec for business-management capability
- Affected code:
  - `app/pages/business/[id]/edit.vue` (new)
  - `app/network/admin.ts` (update Business type and update method)
  - `app/stores/adminBusiness.ts` (update interface and update method)
  - `app/composables/useBusinessViewModel.ts` (new)
  - `app/components/admin/BusinessLogoUploader.vue` (new, adapted from ProductImageUploader)
  - `app/components/admin/BusinessSocialLinks.vue` (new)
