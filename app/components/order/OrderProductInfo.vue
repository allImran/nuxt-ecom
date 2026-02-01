<template>
  <div class="order-product-info flex items-center gap-3 ">
    <div class="flex flex-col items-center gap-3 bg-luxury-gold/10 py-2 px-5" v-if="firstImage">
      <img
        
        :src="firstImage"
        :alt="product.name"
        class="size-16 object-cover rounded-lg"
      />
      <div>
      <!-- <h3 class="font-medium text-luxury-text dark:text-luxury-dark-text">{{ product.name }}</h3> -->
      <p class="text-sm text-luxury-text-muted dark:text-luxury-dark-text-muted">
        {{ formatPrice(productPrice) }}
      </p>
    </div>
    </div>
    <div
      v-else
      class="size-16 bg-luxury-border dark:bg-luxury-dark-border rounded-lg flex items-center justify-center"
    >
      <span class="text-luxury-text-muted dark:text-luxury-dark-text-muted text-xs">No image</span>
    </div>
    
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
