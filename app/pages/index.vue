<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { publicNetwork, type Product } from '~/network/public'

// Get business branding for dynamic content
const businessBrandingStore = useBusinessBrandingStore()
const { business } = storeToRefs(businessBrandingStore)

// Page metadata - dynamic based on business (falls back to the deployment's
// configured site name, never a hardcoded brand)
const runtimeConfig = useRuntimeConfig()
const businessName = computed(() => business.value?.name || (runtimeConfig.public.siteName as string) || 'our store')
const businessSlogan = computed(() =>
  business.value?.slogan || 'Experience the finest selection of curated products. Quality meets elegance in every piece we offer.'
)

// SEO with functional getters. Reactive on both server and client so client-side
// navigation keeps the title fresh. Title is just the tagline — the global
// titleTemplate (and the branding plugin) append " | <business name>", so we must
// NOT repeat the business name here or titles double-brand.
useSeoMeta({
  title: 'Premium Luxury Products',
  description: () => `Discover premium luxury products at ${businessName.value}. ${businessSlogan.value}`,
  ogTitle: () => `${businessName.value} - Premium Luxury Products`,
  ogDescription: () => `Discover premium luxury products at ${businessName.value}. ${businessSlogan.value}`,
  ogType: 'website',
  twitterCard: 'summary_large_image',
  twitterTitle: () => `${businessName.value} - Premium Luxury Products`,
  twitterDescription: () => `Discover premium luxury products at ${businessName.value}. ${businessSlogan.value}`,
})

// Define layout for this page
definePageMeta({
  layout: 'default'
})

// Get business ID from runtime config
const config = useRuntimeConfig()
const businessId = config.public.businessId as string | undefined

const { viewProduct } = useHomeViewModel()

// Fetch at setup time so the products render during SSR / `nuxt generate`
// prerendering (C2). The fetched list rides in useAsyncData's data (serialized
// into the payload and rehydrated on the client with no refetch on hard load) —
// the Pinia store is NOT serialized, so we read `data` directly rather than the
// store. The crawler follows the product <NuxtLink>s to discover product pages;
// on client-side navigation to this route the handler re-runs for fresh data.
const { data: products, pending: loading } = await useAsyncData<Product[]>(
  'home-products',
  () => (businessId ? publicNetwork.fetchProductsByBusinessWithPrices(businessId, 8) : Promise.resolve([])),
  { default: () => [] as Product[] }
)
</script>

<template>
  <div>
    <!-- Hero Section -->
    <HomeHeroSection />

    <!-- Product Showcase -->
    <main id="products-section">
      <HomeProductShowcase
        :products="products"
        :loading="loading"
        @view-product="viewProduct"
      />
    </main>

    <!-- Brand Philosophy -->
    <HomeBrandValues />
  </div>
</template>
