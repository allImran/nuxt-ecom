<template>
  <div class="order-quantity-control flex items-center gap-3">
    <button
      type="button"
      :disabled="quantity <= 0"
      class="w-10 h-10 flex items-center justify-center border rounded-luxury hover:bg-luxury-border dark:hover:bg-luxury-dark-border transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
      @click="onDecrease"
    >
      <span class="text-xl">−</span>
    </button>
    <span class="w-12 text-center font-medium">{{ quantity }}</span>
    <button
      type="button"
      class="w-10 h-10 flex items-center justify-center border rounded-luxury hover:bg-luxury-border dark:hover:bg-luxury-dark-border transition-colors"
      @click="onIncrease"
    >
      <span class="text-xl">+</span>
    </button>
  </div>
</template>

<script setup lang="ts">
interface Props {
  quantity: number
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
