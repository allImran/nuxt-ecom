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

// Mobile UI state
const showFilters = ref(false)
const showSearch = ref(false)

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

// Handle mobile back button
function handleBackClick() {
  router.push(`/business/${businessId}`)
}

// Error message
const errorMessage = computed(() => {
  if (error.value === 'unauthorized') return "You are not authorized to view instant orders."
  if (error.value === 'forbidden') return "You don't have permission to view instant orders."
  if (error.value) return "Failed to load instant orders. Please try again."
  return ""
})
</script>

<template>
  <div class="min-h-screen bg-luxury-bg dark:bg-luxury-dark-bg md:min-h-0">
    <!-- Mobile View -->
    <div class="md:hidden">
      <InstantOrdersMobileHeader
        :business-id="businessId"
        @back-click="handleBackClick"
        @search-click="showSearch = !showSearch"
        @filters-click="showFilters = !showFilters"
      >
        <!-- Header Section -->
        <section class="mb-6">
          <h2 class="text-xl font-bold text-luxury-text dark:text-luxury-dark-text">Recent activity</h2>
          <p class="text-sm text-luxury-text-muted dark:text-luxury-dark-text-muted mt-1">
            Manage and track your instant orders.
          </p>
        </section>

        <!-- Mobile Search Bar -->
        <div v-if="showSearch" class="mb-4">
          <input
            :value="searchQuery"
            @input="searchQuery = ($event.target as HTMLInputElement).value"
            type="text"
            placeholder="Search orders..."
            class="w-full px-4 py-2.5 rounded-lg bg-luxury-surface dark:bg-luxury-dark-surface border border-luxury-border dark:border-luxury-dark-border text-luxury-text dark:text-luxury-dark-text placeholder:text-luxury-text-muted dark:placeholder:text-luxury-dark-text-muted focus:outline-none focus:ring-2 focus:ring-luxury-accent dark:focus:ring-luxury-dark-accent"
          />
        </div>

        <!-- Mobile Status Filter -->
        <div v-if="showFilters" class="mb-4">
          <select
            :value="statusFilter"
            @change="statusFilter = ($event.target as HTMLSelectElement).value as any"
            class="w-full px-4 py-2.5 rounded-lg bg-luxury-surface dark:bg-luxury-dark-surface border border-luxury-border dark:border-luxury-dark-border text-luxury-text dark:text-luxury-dark-text focus:outline-none focus:ring-2 focus:ring-luxury-accent dark:focus:ring-luxury-dark-accent"
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="paid">Paid</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <!-- Error State -->
        <div v-if="error" class="mb-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
          <p class="text-red-600 dark:text-red-400 text-sm">{{ errorMessage }}</p>
        </div>

        <!-- Loading State -->
        <div v-else-if="loading" class="flex items-center justify-center py-12">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-luxury-accent dark:border-luxury-dark-accent"></div>
        </div>

        <!-- Empty State -->
        <div v-else-if="!filteredOrders.length" class="text-center py-12">
          <UiIcon name="shopping-bag" :size="48" class="text-luxury-text-muted dark:text-luxury-dark-text-muted mx-auto mb-3" />
          <p class="text-luxury-text-muted dark:text-luxury-dark-text-muted">No orders found</p>
        </div>

        <!-- Orders Card List -->
        <div v-else class="flex flex-col gap-4">
          <InstantOrdersCard
            v-for="order in filteredOrders"
            :key="order.id"
            :order="order"
            :format-price="formatPrice"
            :format-date="formatDate"
            :get-status-label="getStatusLabel"
            @click="handleRowClick"
          />
        </div>
      </InstantOrdersMobileHeader>

      <!-- Floating Action Button -->
      <button
        @click="navigateToCreate"
        class="fixed right-6 size-10 bg-[#765939] dark:bg-[#B08D6A] text-white rounded-full shadow-lg flex items-center justify-center active:scale-90 transition-transform z-60 bottom-8"
      >
        <UiIcon name="plus" :size="28" />
      </button>
    </div>

    <!-- Desktop View -->
    <div class="hidden md:block space-y-6">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-4">
          <UiLuxuryButton variant="ghost" @click="handleBackClick">
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
      <div v-if="error" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-luxury p-4">
        <p class="text-red-600 dark:text-red-400">{{ errorMessage }}</p>
      </div>

      <!-- Filters -->
      <div v-else class="flex gap-4">
        <input
          :value="searchQuery"
          @input="searchQuery = ($event.target as HTMLInputElement).value"
          type="text"
          placeholder="Search by name, phone, or order ID..."
          class="flex-1 max-w-md px-4 py-2 rounded-lg bg-luxury-surface dark:bg-luxury-dark-surface border border-luxury-border dark:border-luxury-dark-border text-luxury-text dark:text-luxury-dark-text placeholder:text-luxury-text-muted dark:placeholder:text-luxury-dark-text-muted focus:outline-none focus:ring-2 focus:ring-luxury-accent dark:focus:ring-luxury-dark-accent"
        />
        <select
          :value="statusFilter"
          @change="statusFilter = ($event.target as HTMLSelectElement).value as any"
          class="px-4 py-2 rounded-lg bg-luxury-surface dark:bg-luxury-dark-surface border border-luxury-border dark:border-luxury-dark-border text-luxury-text dark:text-luxury-dark-text focus:outline-none focus:ring-2 focus:ring-luxury-accent dark:focus:ring-luxury-dark-accent"
        >
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="paid">Paid</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <!-- Desktop Table -->
      <InstantOrdersTable
        v-if="!error"
        :orders="filteredOrders"
        :loading="loading"
        :format-price="formatPrice"
        :format-date="formatDate"
        :get-status-color="getStatusColor"
        :get-status-label="getStatusLabel"
		:business="business"
        @row-click="handleRowClick"
      />
    </div>
  </div>
</template>
