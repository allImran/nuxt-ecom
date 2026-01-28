# Add Home Page Layout

## Summary

Implement a responsive home page with a shared layout system including sticky header, navigation menu, and footer. The home page will display dummy content sections including product showcases.

## Motivation

Currently, the application lacks a public-facing home page. Users need a landing page that showcases products and provides navigation to key areas of the site. The layout components (header, menu, footer) will be reused across all public pages.

## Proposed Changes

### 1. Create Default Layout (`app/layouts/default.vue`)

- Sticky header that remains visible while scrolling
- Navigation menu with links to key sections
- Footer with site information
- Main content area for page-specific content

### 2. Create Home Page (`app/pages/index.vue`)

- Hero section with welcome message
- Product showcase section displaying featured products
- Responsive grid layout for products
- Call-to-action buttons

### 3. Create Layout Components

**Components:**
- `components/layout/AppHeader.vue` - Sticky header with logo and navigation
- `components/layout/AppMenu.vue` - Navigation menu (mobile-responsive)
- `components/layout/AppFooter.vue` - Footer with links and information
- `components/home/HeroSection.vue` - Hero section for home page
- `components/home/ProductShowcase.vue` - Product display section

### 4. Create Public Network Layer

- Add `app/network/public.ts` with public API calls:
  - `fetchFeaturedProducts()` - Get products for home page display

### 5. Create Composable

- `composables/useHomeViewModel.ts` - Home page state management using Pinia store

### 6. Create Pinia Store

- `stores/home.ts` - Home page state management

## Dependencies

- Existing theme system (`app/assets/css/main.css`)
- Existing UI components (LuxuryButton, BaseCard)
- Product data from backend API
