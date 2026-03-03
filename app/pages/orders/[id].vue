<script setup lang="ts">
const route = useRoute()
const { t } = useI18n()

// Define layout for this page
definePageMeta({
  layout: 'default'
})

// Get the order ID from route
const orderId = computed(() => route.params.id as string)

// Use the composable
const {
  order,
  loading,
  error,
  hasOrder,
  orderItems,
  displayTotalAmount,
  formatPrice,
  formatDate,
  getProductImage,
  getProductSlug,
  getStatusColor,
  calculateItemTotal,
  calculateSubtotal,
  fetchOrderById,
  reset
} = useOrderDetailViewModel()

// Fetch order on mount
onMounted(() => {
  if (orderId.value) {
    fetchOrderById(orderId.value)
  }
})

// Update page metadata
watchEffect(() => {
  if (order.value) {
    useHead({
      title: `Order ${order.value.id}`,
      meta: [
        {
          name: 'description',
          content: `Order details for order ${order.value.id}`
        }
      ]
    })
  }
})

// Clean up on unmount
onUnmounted(() => {
  reset()
})

// Navigate back handler
const navigateBack = () => {
  navigateTo('/')
}
</script>

<template>
  <div class="min-h-screen bg-luxury-bg dark:bg-luxury-dark-bg">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <!-- Back Button -->
      <button
        @click="navigateBack"
        class="mb-6 flex items-center gap-2 text-luxury-text-muted dark:text-luxury-dark-text-muted hover:text-luxury-text dark:hover:text-luxury-dark-text transition-colors"
      >
        <UiIcon name="arrow-left" :size="20" />
        <span>{{ t('common.back') }}</span>
      </button>

      <!-- Error State -->
      <div v-if="error && !loading" class="text-center py-12">
        <div class="inline-flex items-center justify-center w-20 h-20 rounded-full bg-luxury-surface dark:bg-luxury-dark-surface mb-4">
          <UiIcon name="alert-circle" :size="40" class="text-luxury-text-muted dark:text-luxury-dark-text-muted" />
        </div>
        <h2 class="text-2xl font-bold text-luxury-text dark:text-luxury-dark-text mb-2">
          {{ error === 'notFound' ? t('order.notFound') : t('errors.generic') }}
        </h2>
        <p class="text-luxury-text-muted dark:text-luxury-dark-text-muted mb-6">
          {{ error === 'notFound' ? t('order.notFoundMessage') : t('errors.genericMessage') }}
        </p>
        <UiLuxuryButton variant="outline" @click="navigateBack">
          {{ t('common.back') }}
        </UiLuxuryButton>
      </div>

      <!-- Loading State -->
      <div v-else-if="loading" class="space-y-8">
        <!-- Header Skeleton -->
        <OrderDetailHeaderSkeleton />

        <!-- Items List Skeleton -->
        <OrderDetailItemsSkeleton />

        <!-- Shipping Address Skeleton -->
        <OrderDetailShippingAddressSkeleton />

        <!-- Status History Skeleton -->
        <OrderDetailStatusHistorySkeleton />

        <!-- Totals Skeleton -->
        <OrderDetailTotalsSkeleton />
      </div>

      <!-- Order Detail -->
      <div v-else-if="order" class="space-y-8">
        <!-- Header Section -->
        <OrderDetailHeader
          :order-id="order.id"
          :status="order.status"
          :created-at="order.created_at"
          :total="displayTotalAmount"
          :format-date="formatDate"
          :format-price="formatPrice"
          :get-status-color="getStatusColor"
        />

        <!-- Order Items Section -->
        <OrderDetailItems
          v-if="orderItems.length > 0"
          :items="orderItems"
          :get-product-image="getProductImage"
          :get-product-slug="getProductSlug"
          :format-price="formatPrice"
          :calculate-item-total="calculateItemTotal"
        />

        <!-- Shipping Address Section -->
        <OrderDetailShippingAddress
          :shipping-address="order.shipping_address"
        />

        <!-- Status History Section -->
        <OrderDetailStatusHistory
          v-if="order?.history && order.history.length > 0"
          :history="order.history"
          :format-date="formatDate"
          :get-status-color="getStatusColor"
        />

        <!-- Totals Section -->
        <OrderDetailTotals
          :items="orderItems"
          :total="order.total_amount"
          :delivery-charge="order.delivery_charge"
          :format-price="formatPrice"
          :calculate-item-total="calculateItemTotal"
          :calculate-subtotal="calculateSubtotal"
        />
      </div>
    </div>
  </div>
</template>
