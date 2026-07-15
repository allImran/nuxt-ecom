<script setup lang="ts">
const { locale } = useI18n()
const route = useRoute()

// Canonical / og:url / hreflang all need a real production origin. useSiteUrl
// returns '' (hasSiteUrl=false) until NUXT_PUBLIC_SITE_URL is set, in which case
// we emit no URL-bearing tags rather than pointing crawlers at the placeholder.
const { hasSiteUrl, absoluteUrl } = useSiteUrl()
const fullUrl = computed(() => absoluteUrl(route.path))

// Update HTML lang attribute reactively
watch(locale, (newLocale) => {
  if (process.client) {
    document.documentElement.lang = newLocale === 'bn' ? 'bn-BD' : 'en-US'
  }
}, { immediate: true })

// Locale meta + canonical/og:url (always safe to emit)
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
    },
    // og:url mirrors the canonical URL for social scrapers.
    ...(hasSiteUrl.value ? [{ property: 'og:url', content: fullUrl.value }] : []),
  ],
  link: [
    // Canonical + hreflang only once we have a real origin (no_prefix strategy →
    // one URL serves both locales).
    ...(hasSiteUrl.value
      ? [
          { rel: 'canonical', href: fullUrl.value },
          { rel: 'alternate', hreflang: 'bn', href: fullUrl.value },
          { rel: 'alternate', hreflang: 'en', href: fullUrl.value },
          { rel: 'alternate', hreflang: 'x-default', href: fullUrl.value },
        ]
      : []),
  ]
})
</script>

<template>
  <!-- This component is head-only, no template needed -->
</template>
