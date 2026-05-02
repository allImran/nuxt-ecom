<script setup lang="ts">
import type { InstantOrderListItem } from '~/types/instantOrder'

interface Props {
  order: InstantOrderListItem
  formatPrice: (price: number) => string
  formatDate: (date: string) => string
  getStatusLabel: (status: string) => string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  click: [order: InstantOrderListItem]
}>()

// Format date for mobile card (e.g., "MARCH 26, 2026")
function formatCardDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).toUpperCase()
}

// Get status badge class for mobile
function getMobileStatusBadge(status: string): string {
  const statusLower = status.toLowerCase()
  switch (statusLower) {
    case 'pending':
      return 'bg-primary-fixed text-on-primary-fixed-variant'
    case 'delivered':
      return 'bg-secondary-fixed text-on-secondary-fixed-variant'
    case 'confirmed':
      return 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300'
    case 'paid':
      return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
    case 'shipped':
      return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300'
    case 'cancelled':
      return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
    default:
      return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
  }
}

function handleClick() {
  emit('click', props.order)
}
</script>

<template>
  <div
    class="bg-luxury-surface dark:bg-luxury-dark-surface rounded-xl p-5 shadow-sm border border-luxury-border dark:border-luxury-dark-border active:scale-[0.98] transition-transform cursor-pointer"
    @click="handleClick"
  >
    <div class="flex justify-between items-start mb-4">
      <div class="flex flex-col">
        <span class="text-xs font-semibold tracking-wider text-luxury-text-muted dark:text-luxury-dark-text-muted mb-1 uppercase">
          {{ formatCardDate(order.created_at) }}
        </span>
        <h3 class="text-lg font-semibold text-luxury-text dark:text-luxury-dark-text">
          {{ order.customer_info?.name || 'Unknown' }}
        </h3>
        <p class="text-xs text-luxury-text-muted dark:text-luxury-dark-text-muted mt-0.5">
          {{ order.customer_info?.address || 'No address' }}
        </p>
      </div>
      <span :class="['px-3 py-1 text-xs font-semibold rounded-full', getMobileStatusBadge(order.status)]">
        {{ getStatusLabel(order.status) }}
      </span>
    </div>

    <div class="h-px w-full bg-luxury-border dark:border-luxury-dark-border mb-4"></div>

    <div class="flex justify-between items-center">
      <div class="flex items-center gap-2">
        <UiIcon name="package-2" :size="18" class="text-luxury-text-muted dark:text-luxury-dark-text-muted" />
        <span class="text-sm text-luxury-text-muted dark:text-luxury-dark-text-muted">
          {{ order.order_items?.length || 0 }} Items
        </span>
      </div>
      <div class="text-right">
        <span class="block text-xs text-luxury-text-muted dark:text-luxury-dark-text-muted">Total Amount</span>
        <span class="text-lg font-semibold text-luxury-accent dark:text-luxury-dark-accent">
          {{ formatPrice(order.total) }}
        </span>
      </div>
    </div>
  </div>
</template>
