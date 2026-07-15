<script setup lang="ts">
import { storeToRefs } from 'pinia'

// Page metadata. Reactive on both server and client (client-side navigation must
// not leave the title stale). Title is just "Products" — the global titleTemplate
// appends " | <business name>", so we don't repeat the brand here.
const businessBrandingStore = useBusinessBrandingStore()
const { business } = storeToRefs(businessBrandingStore)
const productsDescription = computed(() =>
  `Browse our complete collection of premium luxury products${business.value ? ` at ${business.value.name}` : ''}.`
)

useSeoMeta({
  title: 'Products',
  description: () => productsDescription.value,
  ogTitle: 'Products',
  ogDescription: () => productsDescription.value,
  ogType: 'website',
  twitterCard: 'summary_large_image',
  twitterTitle: 'Products',
  twitterDescription: () => productsDescription.value,
})

// Define layout for this page
definePageMeta({
  layout: 'default'
})

const config = useRuntimeConfig()
const businessId = config.public.businessId as string | undefined

// Use business products view model
const { filteredProducts, loading, fetchProducts } = useBusinessProductsViewModel()

// Navigate to product detail page
const viewProduct = (slug: string) => {
  navigateTo(`/products/${slug}`)
}

// Load products on mounted
onMounted(() => {
  if (businessId) {
    fetchProducts(businessId, 100)
  }

  // Smooth scroll to product section after page load
  nextTick(() => {
    const productSection = document.getElementById('products-section')
    if (productSection) {
      productSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  })
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
      :products="filteredProducts"
      :loading="loading"
      @view-product="viewProduct"
    />
  </div>
</template>
