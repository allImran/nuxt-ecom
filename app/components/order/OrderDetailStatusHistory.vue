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
    <h2 class="text-lg font-semibold text-luxury-text dark:text-luxury-dark-text mb-6 tracking-luxury">
      {{ $t('order.statusHistory') }}
    </h2>
    <div class="space-y-0">
      <OrderDetailStatusHistoryItem
        v-for="(entry, index) in history"
        :key="entry.id"
        :entry="entry"
        :format-date="formatDate"
        :get-status-color="getStatusColor"
        :is-last="index === history.length - 1"
      />
    </div>
  </div>
</template>
