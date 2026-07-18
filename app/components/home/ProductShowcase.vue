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
  // On the home page we show the "Featured Products" header and a "View All"
  // button; the /products listing hides both (it has its own header + pagination).
  showHeader?: boolean
  showViewAll?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showHeader: true,
  showViewAll: true,
})

// Kept for backward-compat with parents that still bind @view-product. Navigation
// itself is now handled by the <NuxtLink> wrapping each card (crawlable <a href>),
// so this is no longer emitted.
defineEmits<{
  viewProduct: [slug: string]
}>()

const getProductPrice = (product: Product) => {
  if (product.variants && product.variants.length > 0) {
    const prices = product.variants.map(v => v.price).filter(p => p != null)
    if (prices.length > 0) {
      const minPrice = Math.min(...prices)
      const maxPrice = Math.max(...prices)
      // Lead with the minimum price; "From" signals it's a starting price when
      // variants differ.
      return minPrice === maxPrice ? `${minPrice} TK` : `From ${minPrice} TK`
    }
  }
  return null
}

const getProductImage = (product: Product) => {
  return product.file_paths && product.file_paths.length > 0 ? getPublicImage('product-images', product.file_paths[0]!) : null
}

const shimmerClass = 'animate-pulse bg-luxury-border dark:bg-luxury-dark-border'
</script>

<template>
  <section id="products-section" class="py-16 lg:py-24 bg-luxury-bg dark:bg-luxury-dark-bg transition-colors duration-200">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Section Header -->
      <div v-if="showHeader" class="text-center mb-12 lg:mb-16">
        <div class="inline-flex items-center gap-3 mb-4">
          <span class="h-px w-8 bg-luxury-gold/40" />
          <span class="text-xs font-medium uppercase tracking-luxury text-luxury-gold">
            Featured Collection
          </span>
          <span class="h-px w-8 bg-luxury-gold/40" />
        </div>
        <h2 class="text-3xl sm:text-4xl font-bold tracking-luxury text-luxury-text dark:text-luxury-dark-text mb-4">
          Featured Products
        </h2>
        <p class="text-luxury-text-muted dark:text-luxury-dark-text-muted max-w-2xl mx-auto">
          Explore our carefully curated collection of premium products
        </p>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div
          v-for="i in 8"
          :key="i"
          class="rounded-luxury p-3 border border-luxury-border dark:border-luxury-dark-border"
        >
          <div class="aspect-square mb-3 rounded-2xl" :class="shimmerClass" />
          <div class="h-4 mx-1 mb-2 rounded" :class="shimmerClass" />
          <div class="h-5 w-1/2 mx-1 mb-1 rounded" :class="shimmerClass" />
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
      <div v-else class="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <NuxtLink
          v-for="product in products"
          :key="product.id"
          :to="`/products/${product.slug}`"
          class="group flex flex-col h-full p-3 rounded-lg bg-luxury-surface dark:bg-luxury-dark-surface border border-luxury-border dark:border-luxury-dark-border shadow-luxury dark:shadow-luxury-dark transition-all duration-300 hover:-translate-y-1 hover:border-luxury-gold dark:hover:border-luxury-gold"
        >
          <!-- Product Image — contained on a neutral panel so the full product is
               always visible (never cropped), and the card stays square + compact -->
          <div class="relative aspect-square rounded-2xl bg-luxury-bg dark:bg-luxury-dark-bg overflow-hidden">
            <img
              v-if="getProductImage(product)"
              :src="getProductImage(product) || ''"
              :alt="product.name"
              loading="lazy"
              class="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 ease-out"
            />
            <div
              v-else
              class="w-full h-full flex items-center justify-center text-luxury-text-muted dark:text-luxury-dark-text-muted"
            >
              <UiIcon name="image" :size="56" />
            </div>
          </div>

          <!-- Product Info -->
          <div class="flex flex-1 flex-col px-1 pt-3">
            <h3 class="text-sm sm:text-base font-semibold leading-snug text-luxury-text dark:text-luxury-dark-text line-clamp-2 group-hover:text-luxury-gold transition-colors">
              {{ product.name }}
            </h3>

            <!-- Price + CTA pinned to the bottom so cards align regardless of title length -->
            <div class="mt-auto pt-3 flex items-end justify-between gap-2">
              <div class="min-w-0">
                <span class="block text-[0.65rem] uppercase tracking-luxury text-luxury-text-muted dark:text-luxury-dark-text-muted">
                  Price
                </span>
                <p v-if="getProductPrice(product)" class="text-base sm:text-lg font-bold text-luxury-gold truncate">
                  {{ getProductPrice(product) }}
                </p>
                <p v-else class="text-xs text-luxury-text-muted dark:text-luxury-dark-text-muted">
                  Contact us
                </p>
              </div>

              <!-- Navigates via the wrapping link; styled as the "Buy Now"-style pill -->
              <span
                class="shrink-0 inline-flex items-center justify-center w-9 h-9 rounded-full bg-luxury-charcoal/90 text-white dark:bg-luxury-dark-border transition-all duration-300 group-hover:bg-luxury-gold group-hover:scale-105"
                aria-hidden="true"
              >
                <UiIcon name="arrow-right" :size="18" class="transition-transform duration-300 group-hover:translate-x-0.5" />
              </span>
            </div>
          </div>
        </NuxtLink>
      </div>

      <!-- View All Button -->
      <div v-if="showViewAll && products.length > 0" class="text-center mt-12">
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
