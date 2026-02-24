<script setup lang="ts">
import type { OrderItem } from '~/types/order'

interface Props {
  items: OrderItem[]
  total: number
  deliveryCharge?: number | null
  formatPrice: (price: number) => string
  calculateItemTotal: (item: OrderItem) => number
  calculateSubtotal: () => number
}

const props = defineProps<Props>()

// Parse total as number (API might return string)
const parsedTotal = computed(() => {
  return typeof props.total === 'string' ? parseFloat(props.total) : props.total
})

const subtotalValue = computed(() => props.calculateSubtotal())

// Calculate delivery fee
const deliveryFee = computed(() => {
  if (props.deliveryCharge != null) {
    return typeof props.deliveryCharge === 'string' ? parseFloat(props.deliveryCharge) : props.deliveryCharge
  }
  const total = parsedTotal.value || 0
  const calculatedFee = total - subtotalValue.value
  return calculatedFee > 0 ? calculatedFee : 100
})

const displayTotal = computed(() => {
  // If there's an explicit delivery charge or the parsed total implicitly includes a fee
  if (props.deliveryCharge != null || (parsedTotal.value - subtotalValue.value > 0)) {
    return parsedTotal.value
  }
  return subtotalValue.value + 100
})
</script>

<template>
  <div class="bg-luxury-surface dark:bg-luxury-dark-surface rounded-luxury p-6 sm:p-8 shadow-luxury">
    <h2 class="text-xl font-semibold text-luxury-text dark:text-luxury-dark-text mb-6">
      {{ $t('order.orderSummary') }}
    </h2>

    <div class="space-y-4">
      <!-- Subtotal -->
      <div class="flex justify-between items-center py-3 border-b border-luxury-border/50 dark:border-luxury-dark-border/50">
        <span class="text-base text-luxury-text-muted dark:text-luxury-dark-text-muted">
          {{ $t('order.subtotal') }}
        </span>
        <span class="text-base font-medium text-luxury-text dark:text-luxury-dark-text">
          {{ formatPrice(subtotalValue) }}
        </span>
      </div>

      <!-- Delivery Fee -->
      <div
        class="flex justify-between items-center py-3 border-b border-luxury-border/50 dark:border-luxury-dark-border/50"
      >
        <span class="text-base text-luxury-text-muted dark:text-luxury-dark-text-muted">
          {{ $t('order.deliveryFee') }}
        </span>
        <span class="text-base font-medium text-luxury-text dark:text-luxury-dark-text">
          {{ deliveryFee > 0 ? formatPrice(deliveryFee) : $t('order.freeDelivery') }}
        </span>
      </div>

      <!-- Total -->
      <div class="flex justify-between items-center pt-4">
        <span class="text-lg font-bold text-luxury-text dark:text-luxury-dark-text">
          {{ $t('order.total') }}
        </span>
        <span class="text-2xl font-bold bg-linear-to-r from-luxury-gold to-yellow-500 bg-clip-text text-transparent">
          {{ formatPrice(displayTotal) }}
        </span>
      </div>
    </div>
  </div>
</template>
