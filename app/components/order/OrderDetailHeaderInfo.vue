<script setup lang="ts">
interface Props {
  orderId: string
  createdAt: string
  formatDate: (date: string) => string
}

defineProps<Props>()
</script>

<template>
  <div class="space-y-1">
    <h1 class="text-xl sm:text-2xl font-semibold text-luxury-text dark:text-luxury-dark-text tracking-luxury">
      {{ $t('order.order') }} #{{ orderId.slice(0, 8) }}
    </h1>
    <p class="text-sm text-luxury-text-muted dark:text-luxury-dark-text-muted">
      {{ formatDate(createdAt) }}
    </p>
  </div>
</template>
