<template>
  <div class="overflow-hidden order-product-item flex flex-row items-center gap-3 p-3 border border-luxury-border dark:border-gray-600 rounded-xl bg-luxury-surface dark:bg-luxury-dark-surface">
    <!-- Product Image -->
    <div class="w-20 h-20 bg-luxury-bg dark:bg-gray-800 rounded-lg shrink-0 border border-luxury-border dark:border-gray-600 overflow-hidden">
      <img
        v-if="firstImage"
        :src="firstImage"
        :alt="product.name"
        class="object-cover h-full w-full"
      />
      <div v-else class="w-full h-full flex items-center justify-center">
        <span class="text-luxury-text-muted dark:text-luxury-dark-text-muted text-xs">No image</span>
      </div>
    </div>

    <!-- Product Info -->
    <OrderProductInfo
      :product="product"
      :product-price="productPrice"
    />

    <!-- Quantity and Total -->
    <div class="flex flex-col items-end gap-1 shrink-0">
      <OrderQuantityControl
        :quantity="quantity"
        :is-first-product="isFirstProduct"
        @increase="onIncrease"
        @decrease="onDecrease"
      />
      <div class="text-right pr-1">
        <p class="text-xs font-bold text-luxury-text dark:text-luxury-dark-text">{{ formatPrice(lineTotal) }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Product } from '~/network/public'
import { getPublicImage } from '#imports'

interface Props {
  product: Product
  productPrice: number
  quantity: number
  isFirstProduct?: boolean
}

const props = defineProps<Props>()
const { t } = useI18n()

const emit = defineEmits<{
  (e: 'increase'): void
  (e: 'decrease'): void
}>()

const firstImage = computed(() => {
  return getPublicImage('product-images', props.product.file_paths?.[0] || '')
})

const lineTotal = computed(() => props.productPrice * props.quantity)

function formatPrice(price: number): string {
  return `${price} TK`
}

function onIncrease() {
  emit('increase')
}

function onDecrease() {
  emit('decrease')
}
</script>
