<template>
  <div class="min-h-screen flex flex-col bg-luxury-bg dark:bg-luxury-dark-bg text-luxury-text dark:text-luxury-dark-text transition-colors duration-200">
    <!-- SEO Meta Tags for i18n -->
    <SeoI18nMetaTags />

    <!-- Header -->
    <LayoutAppHeader />

    <!-- Main Content -->
    <main class="flex-1 w-full">
      <slot />
    </main>

    <!-- Footer -->
    <LayoutAppFooter />

    <!-- Toast notifications (e.g. add to cart feedback) -->
    <AdminToastContainer />
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'

// Default layout for public pages.

// Organization structured data — one block for the whole storefront, driven by
// the business record (falls back to the deployment's configured site name).
const brandingStore = useBusinessBrandingStore()
const { business } = storeToRefs(brandingStore)
const runtimeConfig = useRuntimeConfig()
const { hasSiteUrl, siteUrl } = useSiteUrl()

useJsonLd(computed(() => {
  const name = business.value?.name || (runtimeConfig.public.siteName as string | undefined)
  if (!name) return null

  const socials = business.value?.social
  const sameAs = socials
    ? [socials.facebook, socials.instagram, socials.youtube, socials.twitter, socials.linkedin].filter(Boolean)
    : []

  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name,
    ...(hasSiteUrl.value ? { url: siteUrl.value } : {}),
    ...(brandingStore.logoUrl ? { logo: brandingStore.logoUrl } : {}),
    ...(sameAs.length > 0 ? { sameAs } : {}),
  }
}))
</script>
