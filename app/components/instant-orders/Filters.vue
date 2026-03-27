<script setup lang="ts">
import type { InstantOrderStatus } from '~/types/instantOrder'

interface Props {
  searchQuery?: string
  statusFilter?: InstantOrderStatus | ''
  dateRange?: { start: string; end: string }
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:searchQuery': [value: string]
  'update:statusFilter': [value: InstantOrderStatus | '']
  'update:dateRange': [value: { start: string; end: string }]
  'reset': []
}>()

const localSearchQuery = computed({
  get: () => props.searchQuery || '',
  set: (value) => emit('update:searchQuery', value)
})

const localStatusFilter = computed({
  get: () => props.statusFilter || '',
  set: (value) => emit('update:statusFilter', value as InstantOrderStatus | '')
})

const localDateRange = computed({
  get: () => props.dateRange || { start: '', end: '' },
  set: (value) => emit('update:dateRange', value)
})

const statusOptions: Array<{ value: InstantOrderStatus | ''; label: string }> = [
  { value: '', label: 'All Statuses' },
  { value: 'pending', label: 'Pending' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'paid', label: 'Paid' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' }
]

function handleReset() {
  emit('update:searchQuery', '')
  emit('update:statusFilter', '')
  emit('update:dateRange', { start: '', end: '' })
  emit('reset')
}

const hasActiveFilters = computed(() => {
  return !!(localSearchQuery.value || localStatusFilter.value || localDateRange.value.start || localDateRange.value.end)
})
</script>

<template>
  <div class="bg-luxury-surface dark:bg-luxury-dark-surface rounded-luxury shadow-luxury p-6 mb-6">
    <div class="flex flex-wrap items-center gap-4">
      <!-- Search Input -->
      <div class="flex-1 min-w-[200px]">
        <UiLuxuryInput
          v-model="localSearchQuery"
          type="text"
          placeholder="Search by customer name, phone, or order ID..."
          :icon="'search'"
        />
      </div>

      <!-- Status Filter -->
      <div class="w-48">
        <UiLuxurySelect
          v-model="localStatusFilter"
          :options="statusOptions"
          label="Status"
        />
      </div>

      <!-- Date Range -->
      <div class="flex items-center gap-2">
        <UiLuxuryInput
          v-model="localDateRange.start"
          type="date"
          placeholder="Start date"
        />
        <span class="text-luxury-text-muted dark:text-luxury-dark-text-muted">to</span>
        <UiLuxuryInput
          v-model="localDateRange.end"
          type="date"
          placeholder="End date"
        />
      </div>

      <!-- Reset Button -->
      <UiLuxuryButton
        v-if="hasActiveFilters"
        variant="outline"
        size="sm"
        @click="handleReset"
      >
        Reset Filters
      </UiLuxuryButton>
    </div>
  </div>
</template>
