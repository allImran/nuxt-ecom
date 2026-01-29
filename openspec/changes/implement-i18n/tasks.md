# Tasks: Implement i18n

## Task Breakdown

### Phase 1: Foundation and Infrastructure

- [x] **Task 1.1**: Install `@nuxtjs/i18n` package
  - Run: `npm install @nuxtjs/i18n`
  - Verify installation in `package.json`
  - Commit: "feat(i18n): install @nuxtjs/i18n package"

- [x] **Task 1.2**: Create locales directory structure
  - Create directory: `i18n/locales/`
  - Create empty files: `i18n/locales/bn.json`, `i18n/locales/en.json`
  - Add base JSON structure with `common` namespace
  - Commit: "feat(i18n): create locale directory structure"

- [x] **Task 1.3**: Configure i18n in `nuxt.config.ts`
  - Add `@nuxtjs/i18n` to modules array
  - Add `i18n` configuration object with:
    - `locales`: bn and en with proper metadata
    - `defaultLocale`: 'bn'
    - `strategy`: 'no_prefix'
    - `lazy`: true
    - `langDir`: 'locales/'
    - `detectBrowserLanguage`: cookie configuration
    - `seo`: false
  - Commit: "feat(i18n): configure @nuxtjs/i18n module"

- [x] **Task 1.4**: Create VueI18n configuration
  - Create file: `app/i18n.config.ts`
  - Export default config with:
    - `legacy`: false
    - `globalInjection`: true
    - `fallbackLocale`: 'bn'
  - Commit: "feat(i18n): add VueI18n base configuration"

- [x] **Task 1.5**: Create TypeScript type definitions
  - Create file: `app/types/i18n.ts`
  - Define `I18nMessages` interface matching translation structure
  - Extend VueI18n `DefineLocaleMessage` interface
  - Commit: "feat(i18n): add TypeScript type definitions"

- [x] **Task 1.6**: Create Pinia locale store
  - Create file: `app/stores/locale.ts`
  - Implement store with:
    - `currentLocale` state
    - `availableLocales` getter
    - `isBangla` and `isEnglish` getters
    - `setLocale` action
    - `toggleLocale` action
  - Follow project convention: use Setup Stores pattern
  - Commit: "feat(i18n): create Pinia store for locale state"

- [x] **Task 1.7**: Create useLocale composable
  - Create file: `app/composables/useLocale.ts`
  - Implement composable wrapping store + i18n composables:
    - `switchLanguage` function with navigation
    - Expose all store properties
    - Expose i18n `t` function
  - Commit: "feat(i18n): create useLocale composable"

- [x] **Task 1.8**: Add Bangla font support
  - Import Bangla fonts in `app/assets/css/main.css`:
    - Hind Siliguri (Google Fonts)
    - Noto Sans Bengali (Google Fonts)
  - Add Bangla-specific CSS rules for lang="bn"
  - Update `tailwind.config.js` with font family
  - Commit: "feat(i18n): add Bangla typography support"

### Phase 2: Translation Content

- [x] **Task 2.1**: Add common translations (bn.json)
  - Add translations for: welcome, loading, error, success, cancel, confirm, save, delete, edit, search, filter, sort
  - Ensure proper Bangla translations
  - Commit: "feat(i18n): add common translations (Bangla)"

- [x] **Task 2.2**: Add common translations (en.json)
  - Add English translations for common keys
  - Mirror Bangla structure exactly
  - Commit: "feat(i18n): add common translations (English)"

- [x] **Task 2.3**: Add navigation translations
  - Add translations for: home, products, about, contact, admin, cart, login, logout
  - Add to both bn.json and en.json
  - Create `nav` namespace
  - Commit: "feat(i18n): add navigation translations"

- [x] **Task 2.4**: Add authentication translations
  - Add translations for: login, signup, email, password, forgotPassword, noAccount, hasAccount
  - Create `auth` namespace
  - Commit: "feat(i18n): add authentication translations"

- [x] **Task 2.5**: Add product translations
  - Add translations for: title, price, description, addToCart, inStock, outOfStock, categories
  - Create `product` namespace
  - Commit: "feat(i18n): add product translations"

- [x] **Task 2.6**: Add validation translations
  - Add translations for: required, email, minLength, maxLength
  - Create `validation` namespace
  - Support interpolation for dynamic values
  - Commit: "feat(i18n): add validation translations"

- [x] **Task 2.7**: Add error translations
  - Add translations for: generic, network, unauthorized
  - Create `errors` namespace
  - Commit: "feat(i18n): add error message translations"

- [x] **Task 2.8**: Update TypeScript types
  - Update `app/types/i18n.ts` with all translation keys
  - Ensure all namespaces are typed
  - Commit: "feat(i18n): update type definitions for all translations"

### Phase 3: UI Integration

- [x] **Task 3.1**: Create LanguageToggle component
  - Create file: `app/components/layout/LanguageToggle.vue`
  - Implement dropdown with flags and language names
  - Use `useLocale` composable
  - Add proper state management for dropdown open/close
  - Follow project conventions: PascalCase, <script setup lang="ts">
  - Commit: "feat(i18n): create LanguageToggle component"

- [x] **Task 3.2**: Integrate LanguageToggle into AppHeader
  - Read: `app/components/layout/AppHeader.vue`
  - Import and add `<LanguageToggle />` component
  - Position appropriately in header navigation
  - Test responsive behavior
  - Commit: "feat(i18n): add language toggle to header"

- [x] **Task 3.3**: Update AppMenu component with translations
  - Read: `app/components/layout/AppMenu.vue`
  - Replace static text with `t()` calls
  - Use `nav.*` translation keys
  - Commit: "feat(i18n): translate AppMenu component"

- [ ] **Task 3.4**: Update AppFooter component with translations
  - Read: `app/components/layout/AppFooter.vue`
  - Replace static text with `t()` calls
  - Commit: "feat(i18n): translate AppFooter component"

- [x] **Task 3.5**: Create i18n-aware layout (if needed)
  - Update main layout to include proper lang attribute
  - Add font classes based on locale
  - Add I18nMetaTags component to default layout
  - Commit: "feat(i18n): update layout for locale-aware rendering"

### Phase 4: Page Integration

- [ ] **Task 4.1**: Update home page with translations
  - Read home page files in `app/pages/index.vue`
  - Replace static text with `t()` calls
  - Add meta tags for SEO
  - Commit: "feat(i18n): translate home page"

- [ ] **Task 4.2**: Update authentication pages with translations
  - Read login/signup pages
  - Replace static text with `t()` calls
  - Use `auth.*` and `validation.*` keys
  - Update form validation messages
  - Commit: "feat(i18n): translate authentication pages"

- [ ] **Task 4.3**: Update product pages with translations
  - Read product listing and detail pages
  - Replace static text with `t()` calls
  - Use `product.*` keys
  - Commit: "feat(i18n): translate product pages"

- [ ] **Task 4.4**: Update admin pages with translations
  - Read admin pages
  - Add admin-specific translations if needed
  - Commit: "feat(i18n): translate admin pages"

### Phase 5: Testing and Validation

- [ ] **Task 5.1**: Test language switching
  - Start dev server: `npm run dev`
  - Navigate to root URL, verify redirect to `/bn/`
  - Toggle language from header
  - Verify URL changes to `/en/`
  - Verify content updates to English
  - Toggle back to Bangla
  - Verify URL and content

- [ ] **Task 5.2**: Test cookie persistence
  - Set language to English
  - Close browser
  - Reopen application
  - Verify language persists as English
  - Check cookie in DevTools
  - Test with multiple sessions

- [ ] **Task 5.3**: Test Bangla typography
  - View application in Bangla locale
  - Check font rendering on different elements
  - Test on mobile devices
  - Verify line-height and letter-spacing
  - Test with long Bangla text

- [ ] **Task 5.4**: Test SEO meta tags
  - View page source in both locales
  - Verify `lang` attribute on `<html>`
  - Verify `og:locale` meta tags
  - Verify alternate links present
  - Test with SEO browser extension

- [ ] **Task 5.5**: Test TypeScript autocomplete
  - Open a component file
  - Type `t('` and verify autocomplete shows keys
  - Type a wrong key and verify TypeScript error
  - Verify type checking works: `npm run typecheck`

- [ ] **Task 5.6**: Test fallback behavior
  - Use a translation key that doesn't exist
  - Verify fallback to default locale works
  - Verify no blank UI elements
  - Check console for warnings in dev mode

- [ ] **Task 5.7**: Test responsive behavior
  - Test language toggle on mobile viewport
  - Verify dropdown works with touch
  - Check header layout on different screen sizes
  - Test on actual mobile device

- [ ] **Task 5.8**: Test route transitions
  - Navigate between pages in same locale
  - Verify locale is maintained
  - Switch language and verify navigation
  - Test direct URL access with locale prefix
  - Verify no 404 errors

- [x] **Task 5.9**: Test build and production
  - Run build: `npm run build`
  - Verify build succeeds without errors
  - Preview production build: `npm run preview`
  - Test all features in production mode
  - Verify bundle size is reasonable

### Phase 6: Documentation and Polish

- [ ] **Task 6.1**: Document translation workflow
  - Create documentation for adding new translations
  - Document type update process
  - Add to project docs if needed

- [ ] **Task 6.2**: Add translation coverage comments
  - Comment on untranslated sections (if any)
  - Create TODO list for remaining translations

- [ ] **Task 6.3**: Performance verification
  - Check bundle size impact
  - Verify lazy loading works
  - Profile translation lookup performance
  - Optimize if needed

- [ ] **Task 6.4**: Final testing round
  - Full application walkthrough in both languages
  - Edge case testing
  - Browser compatibility check
  - Accessibility audit with translations

## Dependencies

Tasks can be parallelized as follows:

**Phase 1** (Must complete first):
- All tasks sequential
- Blocks all other phases

**Phase 2** (Can run parallel after Phase 1):
- Tasks 2.1-2.7 can be parallel (different namespaces)
- Task 2.8 must wait for 2.1-2.7

**Phase 3** (Can run parallel after Phase 2):
- Tasks 3.1-3.2 sequential (component must exist before integration)
- Tasks 3.3-3.5 can be parallel

**Phase 4** (Can run parallel after Phase 3):
- Tasks 4.1-4.4 can be parallel (different pages)

**Phase 5** (Must complete after Phase 4):
- Most tasks sequential for proper testing
- Some testing tasks can be parallel

**Phase 6** (Final phase):
- Tasks can be parallel

## Validation Criteria

Each task should be validated with:
- [ ] Code follows project conventions
- [ ] TypeScript compiles without errors
- [ ] Component/page renders correctly
- [ ] No console errors or warnings
- [ ] Git commit message is descriptive
- [ ] Changes are tested in browser
