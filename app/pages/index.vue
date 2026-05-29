<script setup lang="ts">
import { storeToRefs } from 'pinia'

// Get business branding for dynamic content
const businessBrandingStore = useBusinessBrandingStore()
const { business } = storeToRefs(businessBrandingStore)

// Page metadata - dynamic based on business
const businessName = computed(() => business.value?.name || 'INDOORSHOPPING')
const businessSlogan = computed(() =>
  business.value?.slogan || 'Experience the finest selection of curated products. Quality meets elegance in every piece we offer.'
)

// Server-side optimized SEO with functional getters
if (import.meta.server) {
  useSeoMeta({
    title: () => `${businessName.value} - Premium Luxury Products`,
    description: () => `Discover premium luxury products at ${businessName.value}. ${businessSlogan.value}`,
    ogTitle: () => `${businessName.value} - Premium Luxury Products`,
    ogDescription: () => `Discover premium luxury products at ${businessName.value}. ${businessSlogan.value}`,
    ogType: 'website',
    twitterCard: 'summary_large_image',
    twitterTitle: () => `${businessName.value} - Premium Luxury Products`,
    twitterDescription: () => `Discover premium luxury products at ${businessName.value}. ${businessSlogan.value}`,
  })
}

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
