<script setup lang="ts">
import type { ProductVariant } from '~/network/public'

interface Props {
  variant: ProductVariant
  selected?: boolean
  attributes: Array<{ key: string; value: string }>
}

defineProps<Props>()

const emit = defineEmits<{
  select: [variant: ProductVariant]
}>()
</script>

<template>
  <button
    :class="[
      'w-full text-left rounded-lg border-2 transition-all duration-300',
      selected
        ? 'border-luxury-gold bg-luxury-surface dark:bg-luxury-dark-surface'
        : 'border-luxury-border dark:border-luxury-dark-border hover:border-luxury-gold-muted'
    ]"
    @click="emit('select', variant)"
  >
    <div class="flex justify-between items-center">
      <ProductVariantAttributes :attributes="attributes" class="border-r border-luxury-border p-2 flex-1" />
      <!-- <span class="text-sm text-luxury-text-muted dark:text-luxury-dark-text-muted">
        SKU: {{ variant.sku }}
      </span> -->
      <span class="font-bold text-luxury-gold px-2">
        {{ variant.price }} TK
      </span>
    </div>
    
  </button>
</template>
