<script setup lang="ts">
const { locale } = useI18n()
const route = useRoute()

// Build current URL (use runtime config for base URL in production)
const config = useRuntimeConfig()
const baseUrl = config.public.siteUrl || 'https://yourdomain.com'
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
    // Alternate links for both languages pointing to same URL (no_prefix strategy)
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
