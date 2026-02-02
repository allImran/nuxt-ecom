<template>
  <section class="order-product-section space-y-6">
    
    <div v-if="productItems.length > 0" class="space-y-4">
      <OrderProductItem
        v-for="item in productItems"
        :key="item.product.id"
        :product="item.product"
        :product-price="item.price"
        :quantity="item.quantity"
        @increase="onIncrease(item.product.id, item.variantId)"
        @decrease="onDecrease(item.product.id, item.variantId)"
      />
    </div>

    <p v-else class="text-center text-luxury-text-muted dark:text-luxury-dark-text-muted py-8">
      {{ t('order.noProducts') }}
    </p>
  </section>
</template>

<script setup lang="ts">
import type { Product } from '~/network/public'

interface ProductItem {
  product: Product
  price: number
  quantity: number
  variantId: string | null
}

interface Props {
  products: Product[]
  orderProducts: Array<{
    id: string
    variant_id: string | null
    quantity: number
  }>
  getProductPrice: (product: Product) => number
}

const props = defineProps<Props>()
const { t } = useI18n()

const emit = defineEmits<{
  (e: 'increase', productId: string, variantId: string | null): void
  (e: 'decrease', productId: string, variantId: string | null): void
}>()

const productItems = computed((): ProductItem[] => {
  return props.orderProducts
    .filter(op => op.quantity > 0)
    .map(op => {
      const product = props.products.find(p => p.id === op.id)
      if (!product) return null
      return {
        product,
        price: props.getProductPrice(product),
        quantity: op.quantity,
        variantId: op.variant_id
      }
    })
    .filter((item): item is ProductItem => item !== null)
})

function onIncrease(productId: string, variantId: string | null) {
  emit('increase', productId, variantId)
}

function onDecrease(productId: string, variantId: string | null) {
  emit('decrease', productId, variantId)
}
</script>
