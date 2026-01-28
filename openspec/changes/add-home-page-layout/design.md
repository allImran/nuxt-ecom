# Design: Home Page Layout

## Context

The e-commerce application needs a public-facing home page that serves as the entry point for users. This page must:
- Follow the luxury theme established in the project
- Be mobile-first and responsive
- Reuse layout components across all public pages
- Display featured products from the backend

## Goals / Non-Goals

**Goals:**
- Create a reusable default layout for public pages
- Implement a sticky header that remains visible during scroll
- Display featured products in a responsive grid
- Follow the project's luxury theme guidelines
- Separate UI and logic (no business logic in .vue files)

**Non-Goals:**
- Full e-commerce checkout flow (future work)
- User account management in this phase
- Advanced filtering/searching
- Product detail pages

## Decisions

### Layout Structure

**Decision:** Use Nuxt layouts with a `default.vue` layout for public pages.

**Rationale:**
- Nuxt layouts are the standard way to share page structure
- Allows `admin` layout to remain separate
- Easy to switch layouts per page if needed

**Alternatives considered:**
- Component-based layout wrapper: More flexible but not Nuxt idiomatic
- Multiple layouts: Not needed yet, keep it simple

### Sticky Header Implementation

**Decision:** Use CSS `position: sticky` with `top-0` class.

**Rationale:**
- Native CSS solution, no JavaScript required
- Performs well on scroll
- Tailwind supports this out of the box

**Alternatives considered:**
- Fixed position with scroll event listeners: Overkill for this use case
- JavaScript-based libraries: Unnecessary complexity

### Component Organization

**Decision:** Create layout components in `components/layout/` directory.

**Rationale:**
- Clear separation from UI and admin components
- Follows Nuxt auto-import conventions
- Easy to locate and maintain

**Alternatives considered:**
- Put everything in `components/`: Less organized
- Use nested component pattern: Not necessary for this simple layout

### Data Fetching Pattern

**Decision:** Create a Pinia store (`stores/home.ts`) and composable (`composables/useHomeViewModel.ts`).

**Rationale:**
- Follows project conventions (see project.md)
- Components use composables, not stores directly
- Store manages state, composable provides view model
- Consistent with admin product management pattern

**Alternatives considered:**
- Direct API calls from page: Breaks project rules
- Composable-only: No, project requires Pinia as "single source of truth"

### Responsive Design

**Decision:** Mobile-first with Tailwind breakpoints.

**Rationale:**
- Project is mobile-first (project.md constraint)
- Tailwind is already configured
- Use `sm:`, `md:`, `lg:`, `xl:` breakpoints

**Breakpoint strategy:**
- Mobile (default): Single column, stacked navigation
- Tablet (sm/md): 2-column product grid
- Desktop (lg/xl): 3-4 column product grid, horizontal navigation

## Architecture

### Component Hierarchy

```
app/layouts/default.vue
├── components/layout/AppHeader.vue
│   └── components/layout/AppMenu.vue
├── <slot> (page content)
└── components/layout/AppFooter.vue

app/pages/index.vue
├── components/home/HeroSection.vue
└── components/home/ProductShowcase.vue
    └── components/ui/BaseCard.vue (reused)
```

### Data Flow

```
User loads home page
  → pages/index.vue mounts
  → useHomeViewModel() composable called
  → homeStore.fetchFeaturedProducts() action
  → publicNetwork.fetchFeaturedProducts() network call
  → Store updates state
  → Component reacts to state changes
  → UI renders products
```

### File Structure

```
app/
├── components/
│   ├── layout/
│   │   ├── AppHeader.vue
│   │   ├── AppMenu.vue
│   │   └── AppFooter.vue
│   └── home/
│       ├── HeroSection.vue
│       └── ProductShowcase.vue
├── composables/
│   └── useHomeViewModel.ts
├── layouts/
│   ├── default.vue (NEW)
│   └── admin.vue (existing)
├── network/
│   ├── admin.ts (existing)
│   └── public.ts (NEW)
├── pages/
│   ├── index.vue (NEW)
│   └── admin/ (existing)
└── stores/
    ├── home.ts (NEW)
    └── ... (existing)
```

## Styling Decisions

### Theme Alignment

Use existing luxury theme variables from `main.css`:
- Backgrounds: `bg-luxury-bg`, `dark:bg-luxury-dark-bg`
- Surfaces: `bg-luxury-surface`, `dark:bg-luxury-dark-surface`
- Text: `text-luxury-text`, `dark:text-luxury-dark-text`
- Borders: `border-luxury-border`, `dark:border-luxury-dark-border`
- Accents: `luxury-gold` for primary actions
- Radius: `rounded-luxury`
- Shadows: `shadow-luxury`, `dark:shadow-luxury-dark`

### Typography

- Use project's tracking-luxury for headings
- Maintain consistent spacing using Tailwind scale
- Font sizes should be responsive (text-sm, text-base, text-lg, etc.)

## Risks / Trade-offs

### Risk: Header Overlap on Mobile

**Risk:** Sticky header might cover content at the top of the page.

**Mitigation:** Add appropriate top padding to main content area using `pt-20` or similar.

### Trade-off: Dummy Content vs Real Data

**Decision:** Use real product data from backend API with a limit (e.g., 8 featured products).

**Rationale:**
- Real data is more useful for testing
- API already exists from product management feature
- Easy to limit results on backend or frontend

**Alternative:** Hardcoded dummy data - less realistic, not testing integration.

### Risk: Navigation Complexity

**Risk:** Navigation menu might become complex with mobile/desktop states.

**Mitigation:** Start simple with a basic menu that works on all screen sizes. Enhance later if needed.

## Migration Plan

No migration needed - this is a new feature.

## Open Questions

1. **What should be the initial number of featured products?**
   - Suggestion: 8 products (2 rows of 4 on desktop)

2. **Should the menu include authentication links (login/signup)?**
   - Suggestion: Yes, links to `/login` and `/signup`

3. **What pages should the header navigation link to?**
   - Suggestion: Home (/), Products (future), About (future), Contact (future)
