<script setup lang="ts">
import type { OrderItem } from '~/types/order'

interface Props {
  item: OrderItem
  getProductImage: (item: OrderItem) => string
  getProductSlug: (item: OrderItem) => string
  formatPrice: (price: number) => string
  calculateItemTotal: (item: OrderItem) => number
}

const props = defineProps<Props>()

const productSlug = computed(() => props.getProductSlug(props.item))
const productImage = computed(() => props.getProductImage(props.item))
</script>

<template>
  <NuxtLink
    :to="`/products/${productSlug}`"
    class="block group"
  >
    <div class="flex gap-4 p-4 rounded-lg border border-luxury-border dark:border-luxury-dark-border hover:border-luxury-gold dark:hover:border-luxury-gold transition-colors">
      <!-- Product Image -->
      <div class="w-20 h-20 flex-shrink-0 bg-luxury-bg dark:bg-luxury-dark-bg rounded-lg overflow-hidden">
        <img
          v-if="productImage"
          :src="productImage"
          :alt="item.snapshot_name"
          class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div v-else class="w-full h-full flex items-center justify-center">
          <UiIcon name="image" :size="32" class="text-luxury-text-muted dark:text-luxury-dark-text-muted" />
        </div>
      </div>

      <!-- Product Info -->
      <div class="flex-1 min-w-0">
        <h3 class="text-base font-medium text-luxury-text dark:text-luxury-dark-text group-hover:text-luxury-gold transition-colors truncate">
          {{ item.snapshot_name }}
        </h3>
        <div class="flex items-center gap-4 mt-2 text-sm text-luxury-text-muted dark:text-luxury-dark-text-muted">
          <span>{{ $t('order.quantity') }}: {{ item.quantity }}</span>
          <span>{{ formatPrice(item.price) }}</span>
        </div>
      </div>

      <!-- Item Total -->
      <div class="text-right">
        <p class="text-base font-semibold text-luxury-text dark:text-luxury-dark-text">
          {{ formatPrice(calculateItemTotal(item)) }}
        </p>
      </div>
    </div>
  </NuxtLink>
</template>
