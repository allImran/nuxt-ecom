<script setup lang="ts">
interface Props {
  orderId: string
  createdAt: string
  formatDate: (date: string) => string
}

defineProps<Props>()
</script>

<template>
  <div class="space-y-1.5 flex-1">
    <h1 class="text-xl sm:text-2xl font-bold text-luxury-text dark:text-luxury-dark-text tracking-luxury">
      {{ $t('order.order') }} #{{ orderId.slice(0, 8) }}
    </h1>
    <div class="flex items-center gap-1.5 text-sm text-luxury-text-muted dark:text-luxury-dark-text-muted mt-1">
      <UiIcon name="calendar" :size="14" class="opacity-70" />
      <time :datetime="createdAt">{{ formatDate(createdAt) }}</time>
    </div>
  </div>
</template>
