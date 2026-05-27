<template>
  <div class="order-product-info flex-1 min-w-0 flex flex-col justify-center h-full">
    <h3 class="font-bold text-base text-luxury-text dark:text-luxury-dark-text truncate leading-tight pr-1" :title="product.name">{{ product.name }}</h3>
    <p class="text-xs text-luxury-text-muted dark:text-luxury-dark-text-muted mt-0.5 truncate">{{ product.category?.name || '' }}</p>
    <p class="text-luxury-gold font-bold text-sm mt-1">{{ formatPrice(productPrice) }}</p>
  </div>
</template>

<script setup lang="ts">
import type { Product } from '~/network/public'
import { getPublicImage } from '#imports'

interface Props {
  product: Product
  productPrice: number
}

const props = defineProps<Props>()
const { t } = useI18n()

const firstImage = computed(() => {
  return getPublicImage('product-images', props.product.file_paths?.[0] || '')
})

function formatPrice(price: number): string {
  return `${price} TK`
}
</script>
