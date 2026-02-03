<script setup lang="ts">
import type { OrderHistory } from '~/types/order'

interface Props {
  entry: OrderHistory
  formatDate: (date: string) => string
  getStatusColor: (status: string) => string
  isLast: boolean
}

const props = defineProps<Props>()

// Capitalize first letter of status
const formattedStatus = computed(() => {
  if (!props.entry.status) return ''
  return props.entry.status.charAt(0).toUpperCase() + props.entry.status.slice(1).toLowerCase()
})

// Get icon name based on status
const getStatusIcon = (status: string): string => {
  const statusLower = status.toLowerCase()
  switch (statusLower) {
    case 'pending':
      return 'clock'
    case 'processing':
      return 'loader'
    case 'shipped':
      return 'truck'
    case 'delivered':
      return 'check-circle'
    case 'cancelled':
      return 'x-circle'
    case 'returned':
      return 'refresh-ccw'
    default:
      return 'circle'
  }
}
</script>

<template>
  <div class="relative pb-10 last:pb-0 group">
    <!-- Animated Timeline Line -->
    <div
      v-if="!isLast"
      class="absolute left-[19px] top-12 w-0.5 h-[calc(100%-48px)] bg-linear-to-b from-luxury-border via-luxury-border to-transparent dark:from-luxury-dark-border dark:via-luxury-dark-border"
    />

    <!-- Timeline Item -->
    <div class="relative flex gap-5">
      <!-- Status Icon with Ring -->
      <div class="flex-shrink-0 z-10">
        <div class="relative">
          <!-- Outer Ring with Pulse Effect -->
          <div
            class="absolute inset-0 rounded-full animate-pulse opacity-20"
            :class="getStatusColor(entry.status)"
          />
          <!-- Icon Container -->
          <div
            class="relative w-10 h-10 rounded-full flex items-center justify-center ring-4 ring-luxury-surface dark:ring-luxury-dark-surface transition-all duration-300 group-hover:scale-110"
            :class="getStatusColor(entry.status)"
          >
            <UiIcon :name="getStatusIcon(entry.status)" :size="18" />
          </div>
        </div>
      </div>

      <!-- Status Info Card -->
      <div class="flex-1 min-w-0 pt-1">
        <div
          class="p-4 rounded-xl bg-luxury-bg dark:bg-luxury-dark-bg border border-luxury-border dark:border-luxury-dark-border transition-all duration-300 hover:border-luxury-text/20 dark:hover:border-luxury-dark-text/20 hover:shadow-md"
        >
          <!-- Header: Status and Date -->
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
            <h3 class="text-base font-semibold text-luxury-text dark:text-luxury-dark-text flex items-center gap-2">
              <span class="w-2 h-2 rounded-full animate-pulse" :class="getStatusColor(entry.status)" />
              {{ formattedStatus }}
            </h3>
            <div class="flex items-center gap-1.5 text-xs text-luxury-text-muted dark:text-luxury-dark-text-muted">
              <UiIcon name="calendar" :size="12" />
              <time :datetime="entry.changed_at">{{ formatDate(entry.changed_at) }}</time>
            </div>
          </div>

          <!-- Comment -->
          <p v-if="entry.comment" class="text-sm text-luxury-text-muted dark:text-luxury-dark-text-muted pl-4 border-l-2 border-luxury-border dark:border-luxury-dark-border">
            {{ entry.comment }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
