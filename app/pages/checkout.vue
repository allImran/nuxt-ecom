<script setup lang="ts">
import { publicNetwork } from '~/network/public'

const { t } = useI18n()
const cartStore = useCartStore()
const { items, totalItems } = storeToRefs(cartStore)

definePageMeta({
  layout: 'default'
})

// Server-side optimized SEO
if (import.meta.server) {
  useSeoMeta({
    title: 'Checkout',
    description: 'Complete your purchase securely. Review your cart and proceed to payment.',
    ogTitle: 'Checkout',
    ogDescription: 'Complete your purchase securely. Review your cart and proceed to payment.',
    ogType: 'website',
    robots: 'noindex, nofollow',
  })
}

const products = ref<import('~/network/public').Product[]>([])
const loading = ref(false)

// Restore the exact variant the customer picked in the cart (product_id -> variant_id)
const selectedVariantsMap = computed(() => {
  const map: Record<string, string> = {}
  for (const item of items.value) {
    if (item.variantId) map[item.productId] = item.variantId
  }
  return map
})

// Restore the exact quantities from the cart (product_id -> quantity), summed
// across cart lines in case the same product was added with multiple variants
const initialQuantitiesMap = computed(() => {
  const map: Record<string, number> = {}
  for (const item of items.value) {
    map[item.productId] = (map[item.productId] || 0) + item.quantity
  }
  return map
})

onMounted(async () => {
  cartStore.loadCart()
  await fetchCartProducts()

  // Track InitiateCheckout event with Meta Pixel
  if (items.value.length > 0) {
    const { trackInitiateCheckout } = usePixel()
    const contentIds = items.value.map(item => item.productId)
    const numItems = items.value.reduce((sum, item) => sum + item.quantity, 0)

    trackInitiateCheckout(
      cartStore.totalPrice,
      numItems,
      contentIds,
      'BDT'
    )
  }
})

async function fetchCartProducts() {
  if (items.value.length === 0) return

  loading.value = true
  try {
    const uniqueSlugs = [...new Set(items.value.map(item => item.slug))]
    const productPromises = uniqueSlugs.map(slug =>
      publicNetwork.fetchProductBySlug(slug)
    )
    products.value = await Promise.all(productPromises)
    // Quantities/variants are restored by the Order component itself, from
    // selectedVariantsMap/initialQuantitiesMap props (single init, no race).
  } catch (err) {
    console.error('Failed to fetch cart products:', err)
  } finally {
    loading.value = false
  }
}

// Watch for cart changes to refetch products
watch(items, async () => {
  if (items.value.length > 0 && products.value.length === 0) {
    await fetchCartProducts()
  }
})
</script>

<template>
  <div class="min-h-screen bg-luxury-bg dark:bg-luxury-dark-bg">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 class="text-3xl font-bold text-luxury-text dark:text-luxury-dark-text mb-8 text-center">
        {{ t('cart.title') || 'Checkout' }}
      </h1>

      <!-- Empty Cart State -->
      <div
        v-if="totalItems === 0"
        class="text-center py-20 bg-luxury-surface dark:bg-luxury-dark-surface rounded-lg"
      >
        <div class="inline-flex items-center justify-center w-20 h-20 rounded-full bg-luxury-gold/10 mb-4">
          <UiIcon name="shopping-cart" :size="40" class="text-luxury-gold" />
        </div>
        <h2 class="text-2xl font-bold text-luxury-text dark:text-luxury-dark-text mb-2">
          {{ t('cart.empty') || 'Your cart is empty' }}
        </h2>
        <p class="text-luxury-text-muted dark:text-luxury-dark-text-muted mb-6">
          {{ t('cart.emptyMessage') || 'Add some products to get started' }}
        </p>
        <UiLuxuryButton variant="outline" @click="navigateTo('/')">
          {{ t('cart.continueShopping') || 'Continue Shopping' }}
        </UiLuxuryButton>
      </div>

      <!-- Order Form -->
      <Order
        v-else-if="products.length > 0"
        :products="products"
        :selected-variants="selectedVariantsMap"
        :initial-quantities="initialQuantitiesMap"
      />

      <!-- Loading State -->
      <div v-else class="text-center py-20">
        <div class="inline-block animate-spin text-4xl mb-4">⟳</div>
        <p class="text-luxury-text-muted">{{ t('common.loading') || 'Loading...' }}</p>
      </div>
    </div>
  </div>
</template>
