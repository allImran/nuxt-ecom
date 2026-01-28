<script setup lang="ts">
// Page metadata
useHead({
  title: 'LuxeStore - Premium Luxury Products',
  meta: [
    { name: 'description', content: 'Discover premium luxury products at LuxeStore. Quality meets elegance in every piece we offer.' }
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
