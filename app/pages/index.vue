<script setup lang="ts">
import { storeToRefs } from 'pinia'

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

// Use business products view model
const { filteredProducts, loading, fetchProducts } = useBusinessProductsViewModel()

const { viewProduct } = useHomeViewModel()

// Load products on mounted
onMounted(() => {
  if (businessId) {
    fetchProducts(businessId, 8)
  }
})
</script>

<template>
  <div>
    <!-- Hero Section -->
    <HomeHeroSection />

    <!-- Product Showcase -->
    <main id="products-section">
      <HomeProductShowcase
        :products="filteredProducts"
        :loading="loading"
        @view-product="viewProduct"
      />
    </main>
  </div>
</template>
