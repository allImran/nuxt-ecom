<script setup lang="ts">
import { publicNetwork, type Product } from '~/network/public'

// Get business branding for dynamic content
const businessBrandingStore = useBusinessBrandingStore()
const { business } = storeToRefs(businessBrandingStore)

// Page metadata - dynamic based on business
const businessName = computed(() => business.value?.name || 'URBANEASE')
const businessSlogan = computed(() =>
  business.value?.slogan || 'Experience the finest selection of curated products. Quality meets elegance in every piece we offer.'
)

useHead({
  title: computed(() => `${businessName.value} - Premium Luxury Products`),
  meta: [
    computed(() => ({
      name: 'description',
      content: `Discover premium luxury products at ${businessName.value}. ${businessSlogan.value}`
    }))
  ]
})

// Define layout for this page
definePageMeta({
  layout: 'default'
})

// Server-side data fetching for featured products
const { data: featuredProducts, pending: loading } = await useAsyncData<Product[]>(
  'featured-products',
  () => publicNetwork.fetchFeaturedProducts(8)
)

const { viewProduct } = useHomeViewModel()
</script>

<template>
  <div>
    <!-- Hero Section -->
    <HomeHeroSection />

    <!-- Product Showcase -->
    <HomeProductShowcase
      :products="featuredProducts ?? []"
      :loading="loading"
      @view-product="viewProduct"
    />
  </div>
</template>
