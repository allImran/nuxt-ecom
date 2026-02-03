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
</script>

<template>
  <div class="relative pb-8 last:pb-0">
    <!-- Timeline Line -->
    <div
      v-if="!isLast"
      class="absolute left-4 top-8 w-0.5 h-full bg-luxury-border dark:bg-luxury-dark-border"
    />

    <!-- Timeline Item -->
    <div class="relative flex gap-4">
      <!-- Status Icon -->
      <div class="flex-shrink-0 z-10">
        <div
          class="w-8 h-8 rounded-full flex items-center justify-center"
          :class="getStatusColor(entry.status)"
        >
          <UiIcon name="check" :size="16" />
        </div>
      </div>

      <!-- Status Info -->
      <div class="flex-1 pt-1">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
          <h3 class="text-base font-medium text-luxury-text dark:text-luxury-dark-text">
            {{ formattedStatus }}
          </h3>
          <p class="text-sm text-luxury-text-muted dark:text-luxury-dark-text-muted">
            {{ formatDate(entry.changed_at) }}
          </p>
        </div>
        <p v-if="entry.comment" class="text-sm text-luxury-text-muted dark:text-luxury-dark-text-muted mt-1">
          {{ entry.comment }}
        </p>
      </div>
    </div>
  </div>
</template>
