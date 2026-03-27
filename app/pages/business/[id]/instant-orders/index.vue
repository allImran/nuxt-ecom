<script setup lang="ts">
import type { InstantOrderListItem } from '~/types/instantOrder'

// Get route params
const route = useRoute()
const router = useRouter()
const businessId = computed(() => route.params.id as string)

// Page meta
definePageMeta({
  layout: 'admin',
  middleware: 'admin'
})

// View model
const {
  orders,
  currentOrder,
  loading,
  error,
  searchQuery,
  statusFilter,
  dateRange,
  filteredOrders,
  formatPrice,
  formatDate,
  getStatusColor,
  getStatusLabel,
  fetchOrdersByBusiness,
  reset
} = useInstantOrdersViewModel()

// Fetch business info
const business = ref<any>(null)

// Fetch data on mount
onMounted(async () => {
  try {
    const { adminNetwork } = await import('~/network/admin')
    const [businessData] = await Promise.all([
      adminNetwork.fetchBusinessById(businessId.value),
      fetchOrdersByBusiness(businessId.value)
    ])
    business.value = businessData
  } catch (err) {
    console.error('Failed to fetch data:', err)
  }
})

// Reset state on unmount
onUnmounted(() => {
  reset()
})

// Watch for businessId changes
watch(businessId, (newId) => {
  if (newId) {
    fetchOrdersByBusiness(newId)
  }
})

// Handle row click
function handleRowClick(order: InstantOrderListItem) {
  router.push(`/business/${businessId.value}/instant-orders/edit/${order.id}`)
}

// Navigate to create page
function navigateToCreate() {
  router.push(`/business/${businessId.value}/instant-orders/create`)
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-4">
        <UiLuxuryButton variant="ghost" @click="router.push(`/business/${businessId}`)">
          <UiIcon name="arrow-left" :size="16" class="mr-2" />
          Back
        </UiLuxuryButton>
        <div>
          <h1 class="text-2xl font-bold text-luxury-text dark:text-luxury-dark-text">
            Instant Orders
          </h1>
          <p class="text-sm text-luxury-text-muted dark:text-luxury-dark-text-muted">
            {{ business?.name || 'Business' }}
          </p>
        </div>
      </div>
      <UiLuxuryButton @click="navigateToCreate">
        <UiIcon name="plus" :size="16" class="mr-2" />
        Create Order
      </UiLuxuryButton>
    </div>

    <!-- Error State -->
    <div v-if="error === 'unauthorized'" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-luxury p-4">
      <p class="text-red-600 dark:text-red-400">You are not authorized to view instant orders.</p>
    </div>

    <div v-else-if="error === 'forbidden'" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-luxury p-4">
      <p class="text-red-600 dark:text-red-400">You don't have permission to view instant orders.</p>
    </div>

    <div v-else-if="error" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-luxury p-4">
      <p class="text-red-600 dark:text-red-400">Failed to load instant orders. Please try again.</p>
    </div>

    <!-- Filters -->
    <InstantOrdersFilters
      v-model:search-query="searchQuery"
      v-model:status-filter="statusFilter"
      v-model:date-range="dateRange"
    />

    <!-- Orders Table -->
    <InstantOrdersTable
      :orders="filteredOrders"
      :loading="loading"
      :format-price="formatPrice"
      :format-date="formatDate"
      :get-status-color="getStatusColor"
      :get-status-label="getStatusLabel"
      @row-click="handleRowClick"
    />
  </div>
</template>
