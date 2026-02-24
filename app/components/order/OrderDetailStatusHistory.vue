<script setup lang="ts">
import type { OrderHistory } from '~/types/order'

interface Props {
  history: OrderHistory[]
  formatDate: (date: string) => string
  getStatusColor: (status: string) => string
}

defineProps<Props>()
</script>

<template>
  <div class="bg-luxury-surface dark:bg-luxury-dark-surface rounded-luxury p-6 sm:p-8 shadow-luxury">
    <div class="flex items-center gap-3 mb-8">
      <div class="w-10 h-10 rounded-full bg-luxury-surface-alt dark:bg-luxury-dark-surface-alt flex items-center justify-center border border-luxury-border/50">
        <UiIcon name="clock" :size="20" class="text-luxury-text-muted" />
      </div>
      <h2 class="text-xl font-bold text-luxury-text dark:text-luxury-dark-text tracking-luxury">
        {{ $t('order.statusHistory') }}
      </h2>
    </div>
    <div class="space-y-0 relative">
      <OrderDetailStatusHistoryItem
        v-for="(entry, index) in history"
        :key="entry.id"
        :entry="entry"
        :index="index"
        :format-date="formatDate"
        :get-status-color="getStatusColor"
        :is-last="index === history.length - 1"
      />
    </div>
  </div>
</template>
