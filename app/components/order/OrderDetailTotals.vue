<script setup lang="ts">
import type { OrderItem } from '~/types/order'

interface Props {
  items: OrderItem[]
  total: number
  formatPrice: (price: number) => string
  calculateItemTotal: (item: OrderItem) => number
  calculateSubtotal: () => number
}

const props = defineProps<Props>()

// Parse total as number (API might return string)
const parsedTotal = computed(() => {
  return typeof props.total === 'string' ? parseFloat(props.total) : props.total
})

// Calculate delivery fee
const deliveryFee = computed(() => {
  const subtotal = props.calculateSubtotal()
  const total = parsedTotal.value || 0
  const fee = total - subtotal
  return fee > 0 ? fee : 0
})
</script>

<template>
  <div class="bg-luxury-surface dark:bg-luxury-dark-surface rounded-luxury p-6 sm:p-8 shadow-luxury">
    <h2 class="text-lg font-semibold text-luxury-text dark:text-luxury-dark-text mb-6 tracking-luxury">
      {{ $t('order.orderSummary') }}
    </h2>

    <div class="space-y-3">
      <!-- Subtotal -->
      <div class="flex justify-between items-center py-2 border-b border-luxury-border dark:border-luxury-dark-border">
        <span class="text-base text-luxury-text-muted dark:text-luxury-dark-text-muted">
          {{ $t('order.subtotal') }}
        </span>
        <span class="text-base font-medium text-luxury-text dark:text-luxury-dark-text">
          {{ formatPrice(calculateSubtotal()) }}
        </span>
      </div>

      <!-- Delivery Fee -->
      <div
        v-if="deliveryFee > 0"
        class="flex justify-between items-center py-2 border-b border-luxury-border dark:border-luxury-dark-border"
      >
        <span class="text-base text-luxury-text-muted dark:text-luxury-dark-text-muted">
          {{ $t('order.deliveryFee') }}
        </span>
        <span class="text-base font-medium text-luxury-text dark:text-luxury-dark-text">
          {{ formatPrice(deliveryFee) }}
        </span>
      </div>

      <!-- Total -->
      <div class="flex justify-between items-center py-3 mt-2">
        <span class="text-lg font-semibold text-luxury-text dark:text-luxury-dark-text tracking-luxury">
          {{ $t('order.total') }}
        </span>
        <span class="text-xl font-semibold text-luxury-gold">
          {{ formatPrice(parsedTotal) }}
        </span>
      </div>
    </div>
  </div>
</template>
