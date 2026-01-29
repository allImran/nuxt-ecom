# i18n Specification

## Purpose

Defines requirements for implementing internationalization (i18n) support using Bangla (bn) as the primary language and English (en) as the secondary option, enabling the e-commerce application to serve users in both languages with proper SEO and user experience without URL prefixing.

## ADDED Requirements

### Requirement: Locale Detection and Persistence

The system MUST detect and persist the user's language preference across sessions using cookies with Bangla (bn) as the primary default and browser language detection as a secondary fallback.

#### Scenario: First-time visitor sees Bangla by default

Given a first-time visitor with no language cookie
When they access any URL in the application
Then the system should display content in Bangla
And a cookie `i18n_locale` should be set with value `bn`
And the URL should remain unchanged (no prefix)

#### Scenario: Returning user sees their saved language

Given a user with cookie `i18n_locale=en`
When they access the application
Then the system should display content in English
And the URL should remain unchanged (no prefix)
And no redirect should occur

#### Scenario: Language preference persists across sessions

Given a user who selected English (cookie set to `en`)
When they close and reopen the browser
And visit the application
Then the system should recognize their preference from the cookie
And display content in English
Without any URL change or redirect

#### Scenario: Browser language detection as fallback

Given a first-time visitor with no language cookie
And their browser is set to English (en-US or en-GB)
When they access the application
Then the system should detect the browser language as a secondary fallback
And display content in English if browser language is English
Otherwise display content in Bangla (default)
And set the cookie accordingly

### Requirement: Instant Language Switching

The system MUST provide a LanguageSwitcher component that uses the `setLocale` method from @nuxtjs/i18n to trigger an instant UI update without page reload or URL change.

#### Scenario: User switches from Bangla to English instantly

Given a user viewing the application in Bangla at any URL
When they click the language switcher and select English
Then the UI should update immediately to English
And the URL should remain unchanged
And the language preference should be saved in a cookie
And no page reload should occur
And all component state should be preserved

#### Scenario: User switches from English to Bangla instantly

Given a user viewing the application in English at any URL
When they click the language switcher and select Bangla
Then the UI should update immediately to Bangla
And the URL should remain unchanged
And the language preference should be saved in a cookie
And no page reload should occur
And all component state should be preserved

#### Scenario: Language switcher shows current selection

Given a user viewing the application in any language
When they view the language switcher in the header
Then it should display the current language with its flag
And show both language options when clicked
And highlight the currently active language
And the switch should be instant (< 100ms)

### Requirement: No-Prefix URL Strategy

The system MUST use a no_prefix strategy where URLs remain unchanged regardless of language selection, allowing seamless language switching without affecting navigation or bookmarks.

#### Scenario: URLs remain unchanged when switching languages

Given a user viewing `/products` in Bangla
When they switch to English
Then the URL should still be `/products`
And the content should display in English
And no redirect should occur

#### Scenario: Bookmarks work regardless of language

Given a user has bookmarked `/products/123`
When they visit the bookmark
Then the page should load
And display in their saved language preference from cookie
Or default to Bangla if no cookie exists
And the bookmarked URL should work correctly

#### Scenario: All routes work without locale prefix

Given any route in the application (`/`, `/products`, `/cart`, etc.)
When a user accesses the route
Then the route should work directly without any locale prefix
And the content should display in the user's preferred language
And no 404 errors should occur due to missing prefix

### Requirement: SEO with No-Prefix Strategy

The system MUST handle SEO manually for multi-language content since URLs don't change, including proper lang attributes, alternate links, and hreflang tags.

#### Scenario: HTML lang attribute updates on language switch

Given the application is viewed in Bangla
When the page renders
Then the HTML `<html lang="bn">` attribute should be set
And when the user switches to English
Then the HTML `<html lang="en">` attribute should update
Without page reload

#### Scenario: Alternate links indicate available languages

Given any page in the application
When the page is rendered
Then the `<head>` should include alternate links for both languages
Example: `<link rel="alternate" hreflang="bn" href="https://example.com/products">`
And `<link rel="alternate" hreflang="en" href="https://example.com/products">`

#### Scenario: hreflang tags are manually implemented

Given the application uses no_prefix strategy
When implementing SEO
Then hreflang tags should be added manually to each page
Indicating the same URL serves multiple languages
Example: `<link rel="alternate" hreflang="bn" href="/products">`
And `<link rel="alternate" hreflang="en" href="/products">`
And `<link rel="alternate" hreflang="x-default" href="/products">`

#### Scenario: Open Graph locale tags update

Given a page displaying content
When the language changes
Then the `og:locale` meta tag should update to `bn_BD` or `en_US`
And the `og:locale:alternate` tag should show the alternate locale
Without requiring a page reload

### Requirement: Translation Key System

The system MUST organize translation strings in separate JSON files per locale within the `app/locales/` directory with a hierarchical structure for maintainability.

#### Scenario: Translations are stored in locale files

Given the application has translation strings
When translation files are read
Then Bangla translations should exist in `app/locales/bn.json`
And English translations should exist in `app/locales/en.json`
And both files should have identical key structures

#### Scenario: Translation keys are namespaced

Given translation files with multiple content areas
When keys are organized
Then common translations should be under `common.*` namespace
And navigation translations should be under `nav.*` namespace
And authentication translations should be under `auth.*` namespace
And product translations should be under `product.*` namespace
And validation translations should be under `validation.*` namespace
And error translations should be under `errors.*` namespace

#### Scenario: Translation keys support interpolation

Given a validation message that needs dynamic values
When the translation is displayed
Then it should support interpolation parameters
And the message "Minimum {min} characters required" should render with actual min value

### Requirement: Type-Safe Translations

The system MUST provide TypeScript type definitions for translation keys to enable compile-time validation and autocomplete in IDEs.

#### Scenario: Autocomplete works for translation keys

Given a developer is writing code in a component
When they type `t('`
Then the IDE should suggest available translation keys
And autocomplete should show namespaces and keys hierarchically

#### Scenario: Invalid translation keys cause type error

Given a developer uses a non-existent translation key
When the code is type-checked
Then TypeScript should report an error
And the build should fail if type errors are not resolved

#### Scenario: Type definitions match translation files

Given translation files with specific keys
When the type definitions are generated
Then all keys in translation files should be typed
And the interface should match the JSON structure exactly

### Requirement: Bangla Typography Support

The system MUST render Bangla text with proper font support, including appropriate font families, line-height, and letter-spacing for optimal readability.

#### Scenario: Bangla font loads correctly

Given the application is viewed in Bangla locale
When the page renders
Then Bangla text should use Hind Siliguri or Noto Sans Bengali fonts
And the fonts should be loaded from Google Fonts
And fallback fonts should be available if Google Fonts fails

#### Scenario: Bangla text has optimal readability

Given the application displays Bangla content
When text is rendered
Then line-height should be 1.6 for better readability
And letter-spacing should be 0.01em for character clarity
And the CSS should only apply to `[lang="bn"]` elements

#### Scenario: English text is unaffected

Given the application is viewed in English locale
When the page renders
Then the default sans-serif font stack should be used
And Bangla-specific CSS should not apply
And text should render with standard spacing

### Requirement: Translation Function Integration

The system MUST provide a globally available `$t()` function for use in components and a `t()` composable function for use in `<script setup>` blocks.

#### Scenario: Using $t in component templates

Given a Vue component template
When text needs to be translated
Then the developer should use `{{ $t('common.welcome') }}`
And the translated string should render in the current locale

#### Scenario: Using t in script setup

Given a Vue component with `<script setup>`
When translation is needed in script logic
Then the developer should use `const { t } = useI18n()`
And can call `t('nav.home')` to get the translated string

#### Scenario: Translations are reactive

Given a component displaying translated text
When the user switches languages
Then all translated text should update immediately
And the component should not require manual re-rendering
And the update should not lose component state

### Requirement: Fallback and Missing Translation Handling

The system MUST gracefully handle missing translations by falling back to the default locale and providing warnings in development mode.

#### Scenario: Missing translation falls back to default

Given a translation key exists in Bangla but not in English
When the user is viewing in English
Then the system should display the Bangla translation
And the UI should not show blank text
And a warning should be logged in development mode

#### Scenario: Invalid key shows fallback

Given a developer uses a non-existent translation key
When the key is used in production
Then the system should display the key itself (e.g., `invalid.key`)
And the application should not crash
And a warning should be logged in development mode

### Requirement: State Management Integration

The system MUST integrate with the existing Pinia store architecture to provide locale state management following project conventions.

#### Scenario: Locale store provides current locale

Given any component or composable in the application
When locale state is needed
Then the developer should use `useLocaleStore()` from Pinia
And the store should provide `currentLocale` state
And the store should follow Setup Store pattern as per project conventions

#### Scenario: Locale composable wraps store and i18n

Given a developer needs locale functionality
When they use the `useLocale()` composable
Then it should provide locale state from the store
And it should provide the `t()` translation function
And it should provide `switchLanguage()` action
And it should follow the project pattern: composables use Pinia stores

#### Scenario: Components use composable not store directly

Given a component needs locale functionality
When following project conventions
Then the component should import `useLocale` composable
And should NOT import the Pinia store directly
And should interact with data via composables only

### Requirement: Lazy Loading Performance

The system MUST lazy load translation files to ensure optimal initial bundle size and fast page load times.

#### Scenario: Translation files are loaded on demand

Given a user visits the application for the first time
When the page loads
Then only the translation file for the current locale should be loaded
And the other locale translation should load when switched
And the initial bundle should not contain both translations

#### Scenario: Switching language loads translation

Given a user is viewing in Bangla
When they switch to English
Then the English translation file should be loaded
And the Bangla translation should remain cached
And subsequent switches should be instant

## Related Capabilities

- **auth**: Authentication pages need i18n for login/signup forms
- **product-management**: Product catalog will need localized names and descriptions (future scope)
- **content**: Future CMS integration will require i18n support

## Notes

- **No URL prefixing**: The `no_prefix` strategy means URLs remain unchanged when switching languages
- **Cookie-based**: Language selection is stored and retrieved via cookies, not URL segments
- **Default locale**: Bangla (bn) is the primary default; browser language is a secondary fallback only
- **Instant switching**: Uses `setLocale()` from @nuxtjs/i18n for immediate UI updates without page reload
- **Manual SEO**: hreflang and alternate link tags must be implemented manually since URLs don't change between languages
- **Cookie name**: `i18n_locale` follows @nuxtjs/i18n convention
- **Font selection**: Should be validated with actual Bangla content before finalizing
- **Future enhancements**: Consider adding currency formatting (৳ vs $) and date/time formatting following locale conventions
