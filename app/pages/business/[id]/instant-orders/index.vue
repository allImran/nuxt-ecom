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

// Error message
const errorMessage = computed(() => {
  if (error.value === 'unauthorized') return "You are not authorized to view instant orders."
  if (error.value === 'forbidden') return "You don't have permission to view instant orders."
  if (error.value) return "Failed to load instant orders. Please try again."
  return ""
})

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

// Format date for mobile card (e.g., "MARCH 26, 2026")
function formatCardDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).toUpperCase()
}

// Get status badge class for mobile
function getMobileStatusBadge(status: string): string {
  const statusLower = status.toLowerCase()
  switch (statusLower) {
    case 'pending':
      return 'bg-primary-fixed text-on-primary-fixed-variant'
    case 'delivered':
      return 'bg-secondary-fixed text-on-secondary-fixed-variant'
    case 'confirmed':
      return 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300'
    case 'paid':
      return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
    case 'shipped':
      return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300'
    case 'cancelled':
      return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
    default:
      return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
  }
}
</script>

<template>
  <div class="min-h-screen bg-luxury-bg dark:bg-luxury-dark-bg md:min-h-0">
    <!-- Mobile View -->
    <div class="md:hidden">
      <!-- Mobile Top Navigation Bar -->
      <header class="fixed top-0 left-0 w-full z-50 bg-luxury-bg dark:bg-luxury-dark-bg border-b border-luxury-border dark:border-luxury-dark-border flex items-center justify-between px-4 py-3 h-16">
        <div class="flex items-center gap-3">
          <button
            @click="router.push(`/business/${businessId}`)"
            class="p-2 -ml-2 hover:bg-luxury-border dark:hover:bg-luxury-dark-border/50 rounded-full transition-opacity active:opacity-70"
          >
            <UiIcon name="arrow-left" :size="20" class="text-luxury-accent dark:text-luxury-dark-accent" />
          </button>
          <h1 class="font-manrope text-sm font-semibold tracking-tight text-luxury-text dark:text-luxury-dark-text">
            Orders
          </h1>
        </div>
        <div class="flex items-center gap-2">
          <button
            @click="showSearch = !showSearch"
            class="p-2 hover:bg-luxury-border dark:hover:bg-luxury-dark-border/50 rounded-full transition-colors"
          >
            <UiIcon name="search" :size="20" class="text-luxury-text-muted dark:text-luxury-dark-text-muted" />
          </button>
          <button
            @click="showFilters = !showFilters"
            class="p-2 hover:bg-luxury-border dark:hover:bg-luxury-dark-border/50 rounded-full transition-colors"
          >
            <UiIcon name="tune" :size="20" class="text-luxury-text-muted dark:text-luxury-dark-text-muted" />
          </button>
        </div>
      </header>

      <main class="pt-20 px-5 pb-24">
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
            v-model="searchQuery"
            type="text"
            placeholder="Search orders..."
            class="w-full px-4 py-2.5 rounded-lg bg-luxury-surface dark:bg-luxury-dark-surface border border-luxury-border dark:border-luxury-dark-border text-luxury-text dark:text-luxury-dark-text placeholder:text-luxury-text-muted dark:placeholder:text-luxury-dark-text-muted focus:outline-none focus:ring-2 focus:ring-luxury-accent dark:focus:ring-luxury-dark-accent"
          />
        </div>

        <!-- Mobile Status Filter -->
        <div v-if="showFilters" class="mb-4">
          <select
            v-model="statusFilter"
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
          <p class="text-red-600 dark:text-red-400 text-sm">
            {{ errorMessage }}
          </p>
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
          <div
            v-for="order in filteredOrders"
            :key="order.id"
            @click="handleRowClick(order)"
            class="bg-luxury-surface dark:bg-luxury-dark-surface rounded-xl p-5 shadow-sm border border-luxury-border dark:border-luxury-dark-border active:scale-[0.98] transition-transform cursor-pointer"
          >
            <div class="flex justify-between items-start mb-4">
              <div class="flex flex-col">
                <span class="text-xs font-semibold tracking-wider text-luxury-text-muted dark:text-luxury-dark-text-muted mb-1 uppercase">
                  {{ formatCardDate(order.created_at) }}
                </span>
                <h3 class="text-lg font-semibold text-luxury-text dark:text-luxury-dark-text">
                  {{ order.customer_info?.name || 'Unknown' }}
                </h3>
                <p class="text-xs text-luxury-text-muted dark:text-luxury-dark-text-muted mt-0.5">
                  {{ order.customer_info?.address || 'No address' }}
                </p>
              </div>
              <span :class="['px-3 py-1 text-xs font-semibold rounded-full', getMobileStatusBadge(order.status)]">
                {{ getStatusLabel(order.status) }}
              </span>
            </div>

            <div class="h-px w-full bg-luxury-border dark:border-luxury-dark-border mb-4"></div>

            <div class="flex justify-between items-center">
              <div class="flex items-center gap-2">
                <UiIcon name="package-2" :size="18" class="text-luxury-text-muted dark:text-luxury-dark-text-muted" />
                <span class="text-sm text-luxury-text-muted dark:text-luxury-dark-text-muted">
                  {{ order.order_items?.length || 0 }} Items
                </span>
              </div>
              <div class="text-right">
                <span class="block text-xs text-luxury-text-muted dark:text-luxury-dark-text-muted">Total Amount</span>
                <span class="text-lg font-semibold text-luxury-accent dark:text-luxury-dark-accent">
                  {{ formatPrice(order.total) }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <!-- Floating Action Button -->
      <button
        @click="navigateToCreate"
        class="fixed right-6 w-14 h-14 bg-luxury-accent dark:bg-luxury-dark-accent text-white rounded-full shadow-lg flex items-center justify-center active:scale-90 transition-transform z-60 bottom-8"
      >
        <UiIcon name="add" :size="28" />
      </button>
    </div>

    <!-- Desktop View -->
    <div class="hidden md:block space-y-6">
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
      <div v-if="error" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-luxury p-4">
        <p class="text-red-600 dark:text-red-400">{{ errorMessage }}</p>
      </div>

      <!-- Filters -->
      <div class="flex gap-4">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search by name, phone, or order ID..."
          class="flex-1 max-w-md px-4 py-2 rounded-lg bg-luxury-surface dark:bg-luxury-dark-surface border border-luxury-border dark:border-luxury-dark-border text-luxury-text dark:text-luxury-dark-text placeholder:text-luxury-text-muted dark:placeholder:text-luxury-dark-text-muted focus:outline-none focus:ring-2 focus:ring-luxury-accent dark:focus:ring-luxury-dark-accent"
        />
        <select
          v-model="statusFilter"
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
      <div class="bg-luxury-surface dark:bg-luxury-dark-surface rounded-xl border border-luxury-border dark:border-luxury-dark-border overflow-hidden">
        <div v-if="loading" class="flex items-center justify-center py-12">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-luxury-accent dark:border-luxury-dark-accent"></div>
        </div>

        <div v-else-if="!filteredOrders.length" class="text-center py-12">
          <p class="text-luxury-text-muted dark:text-luxury-dark-text-muted">No orders found</p>
        </div>

        <div v-else class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-luxury-bg dark:bg-luxury-dark-bg">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-luxury-text-muted dark:text-luxury-dark-text-muted">
                  Order ID
                </th>
                <th class="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-luxury-text-muted dark:text-luxury-dark-text-muted">
                  Customer
                </th>
                <th class="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-luxury-text-muted dark:text-luxury-dark-text-muted">
                  Items
                </th>
                <th class="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-luxury-text-muted dark:text-luxury-dark-text-muted">
                  Total
                </th>
                <th class="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-luxury-text-muted dark:text-luxury-dark-text-muted">
                  Status
                </th>
                <th class="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-luxury-text-muted dark:text-luxury-dark-text-muted">
                  Date
                </th>
              </tr>
            </thead>
            <tbody class="divide-y divide-luxury-border dark:divide-luxury-dark-border">
              <tr
                v-for="order in filteredOrders"
                :key="order.id"
                @click="handleRowClick(order)"
                class="hover:bg-luxury-bg dark:hover:bg-luxury-dark-bg cursor-pointer transition-colors"
              >
                <td class="px-6 py-4 text-sm font-medium text-luxury-text dark:text-luxury-dark-text">
                  #{{ order.id }}
                </td>
                <td class="px-6 py-4">
                  <div class="text-sm font-medium text-luxury-text dark:text-luxury-dark-text">
                    {{ order.customer_info?.name || 'Unknown' }}
                  </div>
                  <div class="text-xs text-luxury-text-muted dark:text-luxury-dark-text-muted">
                    {{ order.customer_info?.phone || '-' }}
                  </div>
                </td>
                <td class="px-6 py-4 text-sm text-luxury-text-muted dark:text-luxury-dark-text-muted">
                  {{ order.order_items?.length || 0 }} items
                </td>
                <td class="px-6 py-4 text-sm font-semibold text-luxury-accent dark:text-luxury-dark-accent">
                  {{ formatPrice(order.total) }}
                </td>
                <td class="px-6 py-4">
                  <span :class="['px-3 py-1 text-xs font-semibold rounded-full', getStatusColor(order.status)]">
                    {{ getStatusLabel(order.status) }}
                  </span>
                </td>
                <td class="px-6 py-4 text-sm text-luxury-text-muted dark:text-luxury-dark-text-muted">
                  {{ formatDate(order.created_at) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>
