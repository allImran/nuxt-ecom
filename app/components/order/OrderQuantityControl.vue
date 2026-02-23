<template>
  <div class="order-quantity-control bg-gray-100/60 dark:bg-gray-900 p-2 rounded-full flex items-center gap-">
    <button
      type="button"
      :disabled="isFirstProduct ? quantity <= 1 : quantity <= 0"
      class="size-8 flex items-center justify-center border rounded-luxury hover:bg-luxury-border dark:hover:bg-luxury-dark-border transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
      @click="onDecrease"
    >
      <span class="text-xl">−</span>
    </button>
    <span class="w-12 text-center font-medium">{{ quantity }}</span>
    <button
      type="button"
      class="size-8 flex items-center justify-center border rounded-luxury hover:bg-luxury-border dark:hover:bg-luxury-dark-border transition-colors"
      @click="onIncrease"
    >
      <span class="text-xl">+</span>
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
