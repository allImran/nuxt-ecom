<script setup lang="ts">
// Page metadata
useHead({
  title: 'Products - URBANEASE',
  meta: [
    { name: 'description', content: 'Browse our complete collection of premium luxury products at URBANEASE.' }
  ]
})

// Define layout for this page
definePageMeta({
  layout: 'default'
})

// Load all products using the same logic as home page
const { featuredProducts, loading, loadFeaturedProducts, viewProduct } = useHomeViewModel()

// Load products on mounted - fetch all products (or a larger limit)
onMounted(() => {
  loadFeaturedProducts(100)
})
</script>

<template>
  <div>
    <!-- Page Header -->
    <section class="py-12 lg:py-16 bg-luxury-surface dark:bg-luxury-dark-surface transition-colors duration-200">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center">
          <h1 class="text-4xl sm:text-5xl font-bold tracking-luxury text-luxury-text dark:text-luxury-dark-text mb-4">
            All Products
          </h1>
          <p class="text-lg text-luxury-text-muted dark:text-luxury-dark-text-muted max-w-2xl mx-auto">
            Explore our complete collection of premium luxury products
          </p>
        </div>
      </div>
    </section>

    <!-- Product Grid - Reusing the same component from home page -->
    <HomeProductShowcase
      :products="featuredProducts"
      :loading="loading"
      @view-product="viewProduct"
    />
  </div>
</template>
