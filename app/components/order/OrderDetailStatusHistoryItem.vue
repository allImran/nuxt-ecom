<script setup lang="ts">
import type { OrderHistory } from '~/types/order'

interface Props {
  entry: OrderHistory
  index: number
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
  <div class="relative pb-8 sm:pb-10 last:pb-0 group">
    <!-- Animated Timeline Line -->
    <div
      v-if="!isLast"
      class="absolute left-6 top-10 w-[2px] h-[calc(100%-24px)] bg-luxury-border/30 dark:bg-luxury-dark-border/30"
    />

    <!-- Timeline Item -->
    <div class="relative flex gap-4 sm:gap-6">
      <!-- Status Icon with Ring -->
      <div class="shrink-0 z-10 w-12 flex justify-center pt-1">
        <div class="relative">
          <!-- Outer Ring with Pulse Effect for the most recent status -->
          <div
            v-if="index === 0"
            class="absolute inset-0 rounded-full animate-pulse opacity-30"
            :class="getStatusColor(entry.status)"
          />
          <!-- Icon Container -->
          <div
            class="relative w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center border-4 border-luxury-surface dark:border-luxury-dark-surface transition-transform duration-300 shadow-md group-hover:scale-105"
            :class="getStatusColor(entry.status)"
          >
            <UiIcon :name="getStatusIcon(entry.status)" :size="18" />
          </div>
        </div>
      </div>

      <!-- Status Info Card -->
      <div class="flex-1 min-w-0 pb-2">
        <div
          class="bg-luxury-bg/50 dark:bg-luxury-dark-bg/50 p-4 sm:p-5 rounded-2xl border border-luxury-border/50 dark:border-luxury-dark-border/50 transition-all duration-300 hover:shadow-lg hover:border-luxury-border dark:hover:border-luxury-dark-border"
        >
          <!-- Header: Status and Date -->
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4 mb-2">
            <h3 class="text-base sm:text-lg font-bold text-luxury-text dark:text-luxury-dark-text flex items-center gap-2">
              <span class="w-1.5 h-1.5 rounded-full" :class="getStatusColor(entry.status)" />
              {{ formattedStatus }}
            </h3>
            <div class="flex items-center gap-1.5 text-xs text-luxury-text-muted dark:text-luxury-dark-text-muted mt-1 sm:mt-0">
              <UiIcon name="calendar" :size="12" class="opacity-70" />
              <time :datetime="entry.changed_at">{{ formatDate(entry.changed_at) }}</time>
            </div>
          </div>

          <!-- Comment -->
          <p v-if="entry.comment" class="text-sm text-luxury-text-muted dark:text-luxury-dark-text-muted mt-3 pl-3 border-l-2 border-luxury-border/40 dark:border-luxury-dark-border/40 leading-relaxed">
            {{ entry.comment }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
