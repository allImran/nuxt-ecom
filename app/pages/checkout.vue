<script setup lang="ts">
import { publicNetwork } from '~/network/public'

const { t } = useI18n()
const cartStore = useCartStore()
const orderStore = useOrderStore()
const { items, totalItems } = storeToRefs(cartStore)

definePageMeta({
  layout: 'default'
})

const products = ref<import('~/network/public').Product[]>([])
const loading = ref(false)

onMounted(async () => {
  cartStore.loadCart()
  await fetchCartProducts()
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

    // Initialize order store with products and set quantities from cart
    orderStore.initializeOrderProducts(products.value)

    // Update quantities based on cart items
    for (const cartItem of items.value) {
      const product = products.value.find(p => p.id === cartItem.productId)
      if (product) {
        const variantId = product.variants?.[0]?.id || null
        orderStore.updateQuantity(cartItem.productId, variantId, cartItem.quantity)
      }
    }
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
      <Order v-else-if="products.length > 0" :products="products" />

      <!-- Loading State -->
      <div v-else class="text-center py-20">
        <div class="inline-block animate-spin text-4xl mb-4">⟳</div>
        <p class="text-luxury-text-muted">{{ t('common.loading') || 'Loading...' }}</p>
      </div>
    </div>
  </div>
</template>
