# Design: i18n Implementation

## System Architecture Overview

The i18n implementation spans multiple layers of the Nuxt application:

```
┌─────────────────────────────────────────────────────────────┐
│                     Browser Layer                           │
│  - Language Toggle Component (AppHeader)                    │
│  - Cookie Storage (i18n_locale)                             │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                   Nuxt Plugin Layer                         │
│  - @nuxtjs/i18n Module Initialization                       │
│  - Locale Detection & Routing                               │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                 Application Logic Layer                     │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Pinia Store (useLocaleStore)                       │   │
│  │  - Current locale state                             │   │
│  │  - Available locales                                │   │
│  │  - Switch language action                           │   │
│  └─────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Composable (useLocale.ts)                          │   │
│  │  - Wrapper around store + i18n composable           │   │
│  │  - Business logic for language switching            │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                    Data Layer                               │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Translation Files (app/locales/)                    │   │
│  │  - bn.json (Bangla translations)                    │   │
│  │  - en.json (English translations)                   │   │
│  └─────────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  Type Definitions (types/i18n.ts)                   │   │
│  │  - Generated from translation JSON                  │   │
│  │  - Compile-time validation of keys                  │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

## Module Configuration

### @nuxtjs/i18n Configuration

The `nuxt.config.ts` will be updated with the following i18n configuration:

```typescript
export default defineNuxtConfig({
  modules: ['@nuxtjs/i18n'],

  i18n: {
    // Locale configuration
    locales: [
      {
        code: 'bn',
        iso: 'bn-BD',
        name: 'বাংলা',
        file: 'bn.json'
      },
      {
        code: 'en',
        iso: 'en-US',
        name: 'English',
        file: 'en.json'
      }
    ],

    // Default locale: Bangla is primary
    defaultLocale: 'bn',

    // Strategy: no_prefix for instant language switching
    // This means:
    // - URLs never change (e.g., /products always stays /products)
    // - Language is stored in cookies only
    // - Switching is instant with no page reload
    strategy: 'no_prefix',

    // Lazy load translations
    lazy: true,
    langDir: 'locales/',

    // Detect browser language (as secondary fallback after cookie)
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_locale',
      cookieMaxAge: 365 * 24 * 60 * 60, // 1 year
      alwaysRedirect: false,
      fallbackLocale: 'bn' // Primary default
    },

    // SEO: We'll handle hreflang/alternate tags manually since URLs don't change
    seo: false,

    // VueI18n options
    vueI18n: './app/i18n.config.ts'
  }
})
```

### VueI18n Configuration (app/i18n.config.ts)

```typescript
export default defineI18nConfig(() => ({
  legacy: false,
  globalInjection: true,
  fallbackLocale: 'bn',
  messages: {} // Loaded lazily from locales/
}))
```

## Translation File Structure

### Directory Layout

```
app/
├── locales/
│   ├── bn.json          # Bangla translations
│   └── en.json          # English translations
└── types/
    └── i18n.ts          # Generated types (or manually maintained)
```

### Translation File Schema

The translation files follow a nested structure for organization:

```json
{
  "common": {
    "welcome": "স্বাগতম",
    "loading": "লোড হচ্ছে...",
    "error": "ত্রুটি",
    "success": "সফল",
    "cancel": "বাতিল",
    "confirm": "নিশ্চিত",
    "save": "সংরক্ষণ",
    "delete": "মুছুন",
    "edit": "সম্পাদনা",
    "search": "অনুসন্ধান",
    "filter": "ফিল্টার",
    "sort": "সাজান"
  },
  "nav": {
    "home": "হোম",
    "products": "পণ্যসমূহ",
    "about": "আমাদের সম্পর্কে",
    "contact": "যোগাযোগ",
    "admin": "অ্যাডমিন",
    "cart": "কার্ট",
    "login": "লগইন",
    "logout": "লগআউট"
  },
  "auth": {
    "login": "লগইন",
    "signup": "নিবন্ধন",
    "email": "ইমেইল",
    "password": "পাসওয়ার্ড",
    "forgotPassword": "পাসওয়ার্ড ভুলে গেছেন?",
    "noAccount": "অ্যাকাউন্ট নেই?",
    "hasAccount": "আগে থেকেই অ্যাকাউন্ট আছে?"
  },
  "product": {
    "title": "পণ্য",
    "price": "মূল্য",
    "description": "বর্ণনা",
    "addToCart": "কার্টে যোগ করুন",
    "inStock": "মজুদ আছে",
    "outOfStock": "মজুদ নেই",
    "categories": "বিভাগসমূহ"
  },
  "validation": {
    "required": "এই ক্ষেত্রটি পূরণ করা আবশ্যক",
    "email": "সঠিক ইমেইল ঠিকানা প্রদান করুন",
    "minLength": "নূন্যতম {min} অক্ষর প্রয়োজন",
    "maxLength": "সর্বোচ্চ {max} অক্ষর অনুমোদিত"
  },
  "errors": {
    "generic": "কিছু ভুল হয়েছে। আবার চেষ্টা করুন।",
    "network": "নেটওয়ার্ক ত্রুটি। আপনার ইন্টারনেট সংযোগ পরীক্ষা করুন।",
    "unauthorized": "অনুমোদন নেই। আবার লগইন করুন।"
  }
}
```

### Type Safety Approach

**Option A: Manual Type Definition (Recommended for starting)**

Create `app/types/i18n.ts`:

```typescript
export interface I18nMessages {
  common: {
    welcome: string
    loading: string
    error: string
    success: string
    // ... all keys
  }
  nav: {
    home: string
    // ... all keys
  }
  // ... all namespaces
}

declare module 'vue-i18n' {
  export interface DefineLocaleMessage extends I18nMessages {}
}
```

**Option B: Type Generation (Advanced)**

Use a build script or tool like `i18n-typescript` to generate types from JSON files.

## State Management

### Pinia Store (app/stores/useLocaleStore.ts)

```typescript
export const useLocaleStore = defineStore('locale', () => {
  // State
  const currentLocale = ref<'bn' | 'en'>('bn')
  const availableLocales = computed(() => [
    { code: 'bn', name: 'বাংলা', flag: '🇧🇩' },
    { code: 'en', name: 'English', flag: '🇬🇧' }
  ])

  // Getters
  const isBangla = computed(() => currentLocale.value === 'bn')
  const isEnglish = computed(() => currentLocale.value === 'en')

  // Actions
  function setLocale(locale: 'bn' | 'en') {
    const { setLocale } = useI18n()
    currentLocale.value = locale
    setLocale(locale)
  }

  function toggleLocale() {
    setLocale(currentLocale.value === 'bn' ? 'en' : 'bn')
  }

  return {
    currentLocale,
    availableLocales,
    isBangla,
    isEnglish,
    setLocale,
    toggleLocale
  }
})
```

### Composable (app/composables/useLocale.ts)

```typescript
export function useLocale() {
  const localeStore = useLocaleStore()
  const { locale, locales, setLocale, t } = useI18n()

  // Switch language instantly without page reload
  // Uses setLocale() from @nuxtjs/i18n which updates:
  // - Cookie automatically
  // - Vue i18n locale reactively
  // - All components using $t() or t() re-render
  function switchLanguage(targetLocale: 'bn' | 'en') {
    setLocale(targetLocale)
    localeStore.setLocale(targetLocale)
    // No navigateTo() needed with no_prefix strategy
  }

  // Bangla-specific utilities
  const isBangla = computed(() => locale.value === 'bn')

  return {
    ...localeStore,
    locale,
    locales,
    t,
    switchLanguage,
    isBangla
  }
}
```

## UI Components

### Language Switcher Component (app/components/layout/LanguageSwitcher.vue)

```vue
<script setup lang="ts">
const { currentLocale, availableLocales, switchLanguage } = useLocale()

const isOpen = ref(false)

// Instant language switch using setLocale from @nuxtjs/i18n
// Updates UI immediately without page reload or URL change
function handleLanguageSelect(localeCode: string) {
  switchLanguage(localeCode as 'bn' | 'en')
  isOpen.value = false
}
</script>

<template>
  <div class="relative">
    <button
      @click="isOpen = !isOpen"
      class="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
      :aria-label="`Switch language. Current: ${availableLocales.find(l => l.code === currentLocale)?.name}`"
    >
      <span class="text-xl" aria-hidden="true">
        {{ availableLocales.find(l => l.code === currentLocale)?.flag }}
      </span>
      <span class="hidden sm:inline">
        {{ availableLocales.find(l => l.code === currentLocale)?.name }}
      </span>
      <svg
        class="w-4 h-4 transition-transform"
        :class="{ 'rotate-180': isOpen }"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </button>

    <div
      v-if="isOpen"
      class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50"
    >
      <button
        v-for="locale in availableLocales"
        :key="locale.code"
        @click="handleLanguageSelect(locale.code)"
        class="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg transition-colors text-left"
        :class="{
          'bg-gray-100': locale.code === currentLocale,
          'font-semibold': locale.code === currentLocale
        }"
        :aria-current="locale.code === currentLocale ? 'true' : undefined"
      >
        <span class="text-xl" aria-hidden="true">{{ locale.flag }}</span>
        <span>{{ locale.name }}</span>
        <svg
          v-if="locale.code === currentLocale"
          class="w-4 h-4 ml-auto text-green-600"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fill-rule="evenodd"
            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
            clip-rule="evenodd"
          />
        </svg>
      </button>
    </div>
  </div>
</template>
```

## Bangla Typography Support

### Tailwind Configuration

Update `tailwind.config.js`:

```javascript
export default {
  theme: {
    extend: {
      fontFamily: {
        sans: [
          'Hind Siliguri',  // Primary Bangla font
          'Noto Sans Bengali',
          'Arial',
          'sans-serif'
        ]
      }
    }
  }
}
```

### CSS Import (app/assets/css/main.css)

```css
@import url('https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@300;400;500;600;700&family=Noto+Sans+Bengali:wght@400;500;600;700&display=swap');

/* Bangla-specific optimizations */
html[lang="bn"] body {
  font-family: 'Hind Siliguri', 'Noto Sans Bengali', sans-serif;
  line-height: 1.6; /* Bangla needs slightly more line height */
}

html[lang="bn"] * {
  letter-spacing: 0.01em; /* Slight letter-spacing for better readability */
}
```

## SEO Implementation (Manual with no_prefix)

Since we're using `strategy: 'no_prefix'`, SEO tags must be implemented manually because URLs don't change between languages. The same URL serves content in multiple languages.

### Manual SEO Component (app/components/seo/I18nMetaTags.vue)

```vue
<script setup lang="ts">
const { locale } = useI18n()
const route = useRoute()

// Build current URL
const baseUrl = 'https://yourdomain.com' // Replace with actual domain
const currentPath = route.path
const fullUrl = computed(() => `${baseUrl}${currentPath}`)

// Update HTML lang attribute reactively
watch(locale, (newLocale) => {
  if (process.client) {
    document.documentElement.lang = newLocale === 'bn' ? 'bn-BD' : 'en-US'
  }
}, { immediate: true })

// SEO meta tags
useHead({
  htmlAttrs: {
    lang: locale.value === 'bn' ? 'bn-BD' : 'en-US'
  },
  meta: [
    {
      property: 'og:locale',
      content: locale.value === 'bn' ? 'bn_BD' : 'en_US'
    },
    {
      property: 'og:locale:alternate',
      content: locale.value === 'bn' ? 'en_US' : 'bn_BD'
    }
  ],
  link: [
    // Alternate links for both languages pointing to same URL
    {
      rel: 'alternate',
      hreflang: 'bn',
      href: fullUrl.value
    },
    {
      rel: 'alternate',
      hreflang: 'en',
      href: fullUrl.value
    },
    {
      rel: 'alternate',
      hreflang: 'x-default',
      href: fullUrl.value
    }
  ]
})
</script>

<template>
  <!-- This component is head-only, no template needed -->
</template>
```

### Usage in Layout

Add to your main layout:

```vue
<script setup lang="ts">
import I18nMetaTags from '~/components/seo/I18nMetaTags.vue'
</script>

<template>
  <I18nMetaTags />
  <!-- Rest of layout -->
</template>
```

### Per-Page SEO Enhancement

For pages with specific translations for meta tags:

```vue
<script setup lang="ts">
const { t, locale } = useI18n()

useHead({
  title: t('meta.home.title'),
  meta: [
    {
      name: 'description',
      content: t('meta.home.description')
    },
    {
      property: 'og:title',
      content: t('meta.home.title')
    },
    {
      property: 'og:description',
      content: t('meta.home.description')
    }
  ]
})
</script>
```

### Important SEO Considerations with no_prefix

1. **Canonical URLs**: Since both languages share the same URL, set canonical to the current URL without language parameters

2. **hreflang Tags**: Manually implement to indicate the same URL serves multiple languages

3. **Google Search Console**: Use to monitor how Google indexes your multi-language content

4. **Content-Language Header**: Ensure your server sends proper `Content-Language` headers based on cookie

5. **Structured Data**: Include in-locale support for JSON-LD schemas if applicable

## Migration Strategy

### Phase 1: Infrastructure (No User Impact)
1. Install `@nuxtjs/i18n`
2. Configure `nuxt.config.ts`
3. Create translation files with empty keys
4. Set up Pinia store and composable
5. Add type definitions

### Phase 2: Core Content (Incremental)
1. Add translations for navigation and common elements
2. Implement language toggle in header
3. Test switching and persistence
4. Update authentication pages

### Phase 3: Expand Coverage
1. Add product-related translations
2. Add admin area translations
3. Update error messages and validation
4. Add date/time/currency formatting

### Phase 4: Refine and Optimize
1. Optimize bundle size (lazy loading verification)
2. Add missing translation coverage
3. Performance testing
4. SEO validation

## Testing Considerations

### Unit Tests
- Store actions (setLocale, toggleLocale)
- Composable functionality
- Translation key lookup
- Fallback logic

### Integration Tests
- Language switching maintains application state
- Cookie persistence works correctly
- Route transitions update locale
- Component re-rendering on locale change

### E2E Tests
- User can toggle language from header
- Language preference persists across sessions
- URLs update correctly on language switch
- Bangla content renders properly
- SEO meta tags are correct

## Performance Optimizations

1. **Lazy Loading**: Translation files loaded only when needed
2. **Tree Shaking**: Unused translation keys can be eliminated
3. **Cookie Size**: Minimal storage (only locale code)
4. **Build Size**: Type definitions don't increase bundle size
5. **Runtime Performance**: Direct key lookup O(1)

## Future Extensibility

The design allows for:
- Adding more languages (create new JSON file, add to config)
- Per-route translation files (namespacing)
- Dynamic translation loading from API
- Translation management system integration
- User-specific language preferences in database

## Risks and Mitigations

### Risk: Hydration Mismatch
**Cause**: Locale differences between server and client
**Mitigation**: Cookie-based locale detection is consistent between SSR and client

### Risk: SEO Challenges with no_prefix
**Cause**: Search engines may not properly index multi-language content without URL differentiation
**Mitigation**: Implement proper hreflang and alternate link tags manually; monitor Google Search Console

### Risk: Social Media Sharing
**Cause**: Shared links may not preserve language preference since URLs don't change
**Mitigation**: This is expected behavior with no_prefix; users can switch language after navigating to link

### Risk: Large Translation Files
**Cause**: As content grows, JSON files become large
**Mitigation**: Lazy loading already enabled, can split into namespaces later

### Risk: Missing Translations
**Cause**: New features added without translations
**Mitigation**: Fallback to default locale, development warnings

### Risk: Bangla Font Loading Performance
**Cause**: Google Fonts may slow initial render
**Mitigation**: Preconnect to Google Fonts, consider self-hosting for production

### Risk: Analytics Attribution
**Cause**: Analytics tools may struggle to differentiate traffic by language without URL parameters
**Mitigation**: Use custom dimensions in analytics to track by cookie locale
