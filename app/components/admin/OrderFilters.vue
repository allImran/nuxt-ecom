<script setup lang="ts">
import type { OrderStatusType } from '~/types/order'

interface Props {
  filters: {
    status: string
    phone: string
    orderId: string
  }
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  loading: false
})

const emit = defineEmits<{
  'update:filters': [filters: Props['filters']]
  'apply': []
  'clear': []
}>()

// Local filter state
const localFilters = reactive({
  status: props.filters.status,
  phone: props.filters.phone,
  orderId: props.filters.orderId
})

// Available statuses
const statuses: { value: OrderStatusType | ''; label: string }[] = [
  { value: '', label: 'All Statuses' },
  { value: 'pending', label: 'Pending' },
  { value: 'conducted', label: 'Conducted' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'paid', label: 'Paid' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' },
  { value: 'returned', label: 'Returned' },
  { value: 'partially_returned', label: 'Partially Returned' }
]

// Watch props changes
watch(() => props.filters, (newFilters) => {
  Object.assign(localFilters, newFilters)
}, { deep: true })

// Apply filters
function applyFilters() {
  emit('update:filters', { ...localFilters })
  emit('apply')
}

// Clear filters
function clearFilters() {
  localFilters.status = ''
  localFilters.phone = ''
  localFilters.orderId = ''
  emit('update:filters', { ...localFilters })
  emit('clear')
}

// Check if filters are active
const hasActiveFilters = computed(() => {
  return !!(localFilters.status || localFilters.phone || localFilters.orderId)
})
</script>

<template>
  <div class="bg-luxury-surface dark:bg-luxury-dark-surface rounded-luxury p-4 sm:p-6 shadow-luxury">
    <div class="flex flex-col gap-4">
      <!-- Filter Inputs -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <!-- Status Filter -->
        <div>
          <label class="block text-sm font-medium text-luxury-text-muted dark:text-luxury-dark-text-muted mb-1">
            Status
          </label>
          <select
            v-model="localFilters.status"
            class="w-full px-3 py-2 bg-luxury-bg dark:bg-luxury-dark-bg border border-luxury-border dark:border-luxury-dark-border rounded-luxury text-luxury-text dark:text-luxury-dark-text focus:outline-none focus:ring-1 focus:ring-luxury-gold"
          >
            <option v-for="status in statuses" :key="status.value" :value="status.value">
              {{ status.label }}
            </option>
          </select>
        </div>

        <!-- Phone Search -->
        <div>
          <label class="block text-sm font-medium text-luxury-text-muted dark:text-luxury-dark-text-muted mb-1">
            Phone Number
          </label>
          <input
            v-model="localFilters.phone"
            type="text"
            placeholder="Search by phone..."
            class="w-full px-3 py-2 bg-luxury-bg dark:bg-luxury-dark-bg border border-luxury-border dark:border-luxury-dark-border rounded-luxury text-luxury-text dark:text-luxury-dark-text placeholder-luxury-text-muted/50 dark:placeholder-luxury-dark-text-muted/50 focus:outline-none focus:ring-1 focus:ring-luxury-gold"
          />
        </div>

        <!-- Order ID Search -->
        <div>
          <label class="block text-sm font-medium text-luxury-text-muted dark:text-luxury-dark-text-muted mb-1">
            Order ID
          </label>
          <input
            v-model="localFilters.orderId"
            type="text"
            placeholder="Search by order ID..."
            class="w-full px-3 py-2 bg-luxury-bg dark:bg-luxury-dark-bg border border-luxury-border dark:border-luxury-dark-border rounded-luxury text-luxury-text dark:text-luxury-dark-text placeholder-luxury-text-muted/50 dark:placeholder-luxury-dark-text-muted/50 focus:outline-none focus:ring-1 focus:ring-luxury-gold"
          />
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
        <UiLuxuryButton
          variant="outline"
          @click="clearFilters"
          :disabled="!hasActiveFilters || loading"
          class="w-full sm:w-auto"
        >
          Clear
        </UiLuxuryButton>
        <UiLuxuryButton
          @click="applyFilters"
          :loading="loading"
          class="w-full sm:w-auto"
        >
          Apply Filters
        </UiLuxuryButton>
      </div>
    </div>
  </div>
</template>
