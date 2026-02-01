<template>
  <div class="overflow-hidden order-product-item flex flex-col sm:flex-row sm:items-center justify-between gap-4 pr-4 border border-luxury-border dark:border-luxury-dark-border rounded-luxury">
    <OrderProductInfo
      :product="product"
      :product-price="productPrice"
    />
    <div class="flex items-center gap-6">
      <OrderQuantityControl
        :quantity="quantity"
        @increase="onIncrease"
        @decrease="onDecrease"
      />
      <div class="text-right min-w-[100px]">
        <p class="text-sm text-luxury-text-muted dark:text-luxury-dark-text-muted">{{ t('order.total') }}</p>
        <p class="font-semibold">{{ formatPrice(lineTotal) }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Product } from '~/network/public'

interface Props {
  product: Product
  productPrice: number
  quantity: number
}

const props = defineProps<Props>()
const { t } = useI18n()

const emit = defineEmits<{
  (e: 'increase'): void
  (e: 'decrease'): void
}>()

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
