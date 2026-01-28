<script setup lang="ts">
import type { ProductVariant } from '~/network/public'

interface Props {
  variants: ProductVariant[]
  selectedVariant: ProductVariant | null
  getAttributeEntries: (variant: ProductVariant) => Array<{ key: string; value: string }>
}

defineProps<Props>()

const emit = defineEmits<{
  selectVariant: [variant: ProductVariant]
}>()
</script>

<template>
  <div class="space-y-3">
    <h3 class="text-lg font-semibold text-luxury-text dark:text-luxury-dark-text">
      Select Variant
    </h3>
    <ProductVariantItem
      v-for="variant in variants"
      :key="variant.id"
      :variant="variant"
      :selected="selectedVariant?.id === variant.id"
      :attributes="getAttributeEntries(variant)"
      @select="emit('selectVariant', variant)"
    />
  </div>
</template>
