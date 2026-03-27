<script setup lang="ts">
import type { InstantOrderStatus } from '~/types/instantOrder'

interface Props {
  status: InstantOrderStatus
  getStatusColor?: (status: string) => string
  getStatusLabel?: (status: string) => string
}

const props = withDefaults(defineProps<Props>(), {
  getStatusColor: (status: string) => {
    const colors: Record<string, string> = {
      pending: 'text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20',
      confirmed: 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20',
      paid: 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20',
      shipped: 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20',
      delivered: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20',
      cancelled: 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20'
    }
    return colors[status] || 'text-luxury-text dark:text-luxury-dark-text bg-luxury-border dark:bg-luxury-dark-border'
  },
  getStatusLabel: (status: string) => {
    const labels: Record<string, string> = {
      pending: 'Pending',
      confirmed: 'Confirmed',
      paid: 'Paid',
      shipped: 'Shipped',
      delivered: 'Delivered',
      cancelled: 'Cancelled'
    }
    return labels[status] || status
  }
})

const formattedStatus = computed(() => props.getStatusLabel(props.status))
const statusColor = computed(() => props.getStatusColor(props.status))
</script>

<template>
  <div
    class="px-4 py-2 rounded-full text-sm font-medium inline-flex items-center"
    :class="statusColor"
  >
    {{ formattedStatus }}
  </div>
</template>
