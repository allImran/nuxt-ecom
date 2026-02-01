<template>
  <div class="order-product-info">
    <h3 class="font-medium text-luxury-text dark:text-luxury-dark-text">{{ product.name }}</h3>
    <p class="text-sm text-luxury-text-muted dark:text-luxury-dark-text-muted">
      {{ t('product.price') }}: {{ formatPrice(productPrice) }}
    </p>
  </div>
</template>

<script setup lang="ts">
import type { Product } from '~/network/public'

interface Props {
  product: Product
  productPrice: number
}

defineProps<Props>()
const { t } = useI18n()

function formatPrice(price: number): string {
  return `${price} TK`
}
</script>
