## 1. Foundation Layer
- [x] 1.1 Update `Business` interface in `app/network/admin.ts` with all fields from API (logo, slogan, primary_color, email, social, address, is_active)
- [x] 1.2 Update `adminNetwork.updateBusiness` to accept full business data object
- [x] 1.3 Update `adminBusiness` store interface and `updateBusiness` method to support all fields

## 2. Composable Layer
- [x] 2.1 Create/useBusinessViewModel.ts` composable with:
  - Business form state management
  - Debounced save function using perfect-debounce
  - Fetch business by ID
  - Update business
  - Logo upload handling

## 3. Component Layer
- [x] 3.1 Create `BusinessLogoUploader.vue` component (adapted from ProductImageUploader):
  - Single image upload (not multiple)
  - Instant upload on file selection
  - Logo preview
  - Loading states
- [x] 3.2 Create `BusinessSocialLinks.vue` component:
  - Dynamic add/remove social link rows
  - Platform selector with icons
  - URL input for each platform
  - v-model for two-way binding

## 4. Page Layer
- [x] 4.1 Create `app/pages/business/[id]/edit.vue` page:
  - Use admin layout
  - Fetch business data on mount
  - Form fields using LuxuryInput for name, slug, slogan, email, address
  - Color picker for primary_color
  - BusinessLogoUploader component for logo
  - BusinessSocialLinks component for social links
  - Debounced auto-save for text fields
  - Instant save for logo upload
  - Loading and error states
  - Back button to business dashboard

## 5. Testing
- [x] 5.1 Test page loads with existing business data
- [x] 5.2 Test debounced auto-save on text fields
- [x] 5.3 Test logo upload and instant save
- [x] 5.4 Test add/remove social links
- [x] 5.5 Test error handling and loading states
