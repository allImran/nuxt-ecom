<script setup lang="ts">
interface Props {
  total: number | string
  formatPrice: (price: number) => string
}

const props = defineProps<Props>()

// Parse total as number (API might return string)
const parsedTotal = computed(() => {
  return typeof props.total === 'string' ? parseFloat(props.total) : props.total
})
</script>

<template>
  <div class="text-right shrink-0">
    <p class="text-xs sm:text-sm font-medium text-luxury-text-muted dark:text-luxury-dark-text-muted tracking-wide mb-1">
      {{ $t('order.total') }}
    </p>
    <p class="text-lg sm:text-2xl font-bold bg-linear-to-r from-luxury-gold to-yellow-600 bg-clip-text text-transparent">
      {{ formatPrice(parsedTotal) }}
    </p>
  </div>
</template>
