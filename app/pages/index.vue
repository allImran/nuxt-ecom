<script setup lang="ts">
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

// Load featured products
const { featuredProducts, loading, loadFeaturedProducts, viewProduct } = useHomeViewModel()

onMounted(() => {
  loadFeaturedProducts(8)
})
</script>

<template>
  <div>
    <!-- Hero Section -->
    <HomeHeroSection />

    <!-- Product Showcase -->
    <HomeProductShowcase
      :products="featuredProducts"
      :loading="loading"
      @view-product="viewProduct"
    />
  </div>
</template>
