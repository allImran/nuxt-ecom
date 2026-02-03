<script setup lang="ts">
import type { OrderItem } from '~/types/order'

interface Props {
  items: OrderItem[]
  getProductImage: (item: OrderItem) => string
  getProductSlug: (item: OrderItem) => string
  formatPrice: (price: number) => string
  calculateItemTotal: (item: OrderItem) => number
}

defineProps<Props>()
</script>

<template>
  <div class="bg-luxury-surface dark:bg-luxury-dark-surface rounded-luxury p-6 sm:p-8 shadow-luxury">
    <h2 class="text-lg font-semibold text-luxury-text dark:text-luxury-dark-text mb-6 tracking-luxury">
      {{ $t('order.items') }}
    </h2>
    <div class="space-y-4">
      <OrderDetailItem
        v-for="item in items"
        :key="item.id"
        :item="item"
        :get-product-image="getProductImage"
        :get-product-slug="getProductSlug"
        :format-price="formatPrice"
        :calculate-item-total="calculateItemTotal"
      />
    </div>
  </div>
</template>
