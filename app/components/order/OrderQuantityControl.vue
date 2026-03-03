<template>
  <div class="order-quantity-control flex items-center bg-luxury-surface/50 dark:bg-gray-800 rounded-full border border-luxury-border dark:border-gray-600 h-8">
    <button
      type="button"
      :disabled="isFirstProduct ? quantity <= 1 : quantity <= 0"
      class="w-8 h-full flex items-center justify-center text-luxury-text-muted dark:text-luxury-dark-text-muted focus:outline-none hover:text-luxury-gold transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
      @click="onDecrease"
    >
      <UiIcon name="minus" :size="16" />
    </button>
    <span class="w-6 text-center font-bold text-sm text-luxury-text dark:text-luxury-dark-text leading-none">{{ quantity }}</span>
    <button
      type="button"
      class="w-8 h-full flex items-center justify-center rounded-r-full bg-luxury-gold text-white focus:outline-none hover:bg-luxury-gold-hover transition-colors"
      @click="onIncrease"
    >
      <UiIcon name="plus" :size="16" />
    </button>
  </div>
</template>

<script setup lang="ts">
interface Props {
  quantity: number
  isFirstProduct?: boolean
}

defineProps<Props>()

const emit = defineEmits<{
  (e: 'increase'): void
  (e: 'decrease'): void
}>()

function onIncrease() {
  emit('increase')
}

function onDecrease() {
  emit('decrease')
}
</script>
