<script setup lang="ts">
import { getPublicImage } from '~/utils/image'

interface Product {
  id: string
  name: string
  slug: string
  file_paths?: string[]
  variants?: Array<{ price: number }>
}

interface Props {
  products: Product[]
  loading: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  viewProduct: [slug: string]
}>()

const getProductPrice = (product: Product) => {
  if (product.variants && product.variants.length > 0) {
    const prices = product.variants.map(v => v.price).filter(p => p != null)
    if (prices.length > 0) {
      const minPrice = Math.min(...prices)
      const maxPrice = Math.max(...prices)
      return minPrice === maxPrice ? `$${minPrice}` : `$${minPrice} - $${maxPrice}`
    }
  }
  return null
}

const getProductImage = (product: Product) => { 
  return product.file_paths && product.file_paths.length > 0 ? getPublicImage('product-images', product.file_paths[0]!) : null
}

const handleProductClick = (product: Product) => {
  emit('viewProduct', product.slug)
}

const shimmerClass = 'animate-pulse bg-luxury-border dark:bg-luxury-dark-border'
</script>

<template>
  <section id="products-section" class="py-16 lg:py-24 bg-luxury-bg dark:bg-luxury-dark-bg transition-colors duration-200">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Section Header -->
      <div class="text-center mb-12">
        <h2 class="text-3xl sm:text-4xl font-bold tracking-luxury text-luxury-text dark:text-luxury-dark-text mb-4">
          Featured Products
        </h2>
        <p class="text-luxury-text-muted dark:text-luxury-dark-text-muted max-w-2xl mx-auto">
          Explore our carefully curated collection of premium products
        </p>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div
          v-for="i in 8"
          :key="i"
          class="rounded-luxury p-6 border border-luxury-border dark:border-luxury-dark-border"
          :class="shimmerClass"
        >
          <div class="aspect-square mb-4 rounded-lg" :class="shimmerClass" />
          <div class="h-6 mb-2 rounded" :class="shimmerClass" />
          <div class="h-4 w-1/2 rounded" :class="shimmerClass" />
        </div>
      </div>

      <!-- Empty State -->
      <div v-else-if="products.length === 0" class="text-center py-12">
        <div class="inline-flex items-center justify-center w-20 h-20 rounded-full bg-luxury-surface dark:bg-luxury-dark-surface mb-4">
          <UiIcon name="package" :size="40" class="text-luxury-text-muted dark:text-luxury-dark-text-muted" />
        </div>
        <h3 class="text-xl font-semibold text-luxury-text dark:text-luxury-dark-text mb-2">
          No products available
        </h3>
        <p class="text-luxury-text-muted dark:text-luxury-dark-text-muted">
          Check back soon for new arrivals
        </p>
      </div>

      <!-- Products Grid -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <UiBaseCard
          v-for="product in products"
          :key="product.id"
          hover
          class="cursor-pointer overflow-hidden group"
          @click="handleProductClick(product)"
        >
          <!-- Product Image -->
          <div class="aspect-square bg-luxury-surface dark:bg-luxury-dark-surface rounded-lg mb-4 overflow-hidden">
            <img
              v-if="getProductImage(product)"
              :src="getProductImage(product) || ''"
              :alt="product.name"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div
              v-else
              class="w-full h-full flex items-center justify-center text-luxury-text-muted dark:text-luxury-dark-text-muted"
            >
              <UiIcon name="image" :size="64" />
            </div>
          </div>

          <!-- Product Info -->
          <div class="space-y-2">
            <h3 class="font-semibold text-luxury-text dark:text-luxury-dark-text line-clamp-1 group-hover:text-luxury-gold transition-colors">
              {{ product.name }}
            </h3>
            <p v-if="getProductPrice(product)" class="text-lg font-bold text-luxury-gold">
              {{ getProductPrice(product) }}
            </p>
            <p v-else class="text-sm text-luxury-text-muted dark:text-luxury-dark-text-muted">
              Contact for pricing
            </p>
          </div>

          <!-- View Button -->
          <div class="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <UiLuxuryButton variant="outline" block class="text-sm">
              View Details
            </UiLuxuryButton>
          </div>
        </UiBaseCard>
      </div>

      <!-- View All Button -->
      <div v-if="products.length > 0" class="text-center mt-12">
        <NuxtLink
          to="/products"
          class="inline-flex items-center justify-center px-8 py-3 text-base font-medium text-luxury-text dark:text-luxury-dark-text border-2 border-luxury-border dark:border-luxury-dark-border rounded-luxury hover:border-luxury-gold hover:text-luxury-gold transition-all duration-300"
        >
          View All Products
          <UiIcon name="arrow-right" :size="20" class="ml-2" />
        </NuxtLink>
      </div>
    </div>
  </section>
</template>
