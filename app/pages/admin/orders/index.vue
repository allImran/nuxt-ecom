<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: 'admin'
})

const { t } = useI18n()
const router = useRouter()

// Use the composable
const {
  orders,
  filteredOrders,
  paginatedOrders,
  loading,
  error,
  filters,
  pagination,
  totalPages,
  hasOrders,
  formatPrice,
  formatDate,
  getStatusColor,
  getStatusLabel,
  fetchAllOrders,
  updateFilters,
  resetFilters,
  updatePagination,
  reset
} = useAdminOrderViewModel()

// Fetch orders on mount
onMounted(() => {
  fetchAllOrders({
    status: filters.status || undefined,
    phone: filters.phone || undefined,
    limit: pagination.itemsPerPage,
    offset: 0
  })
})

// Update page metadata
useHead({
  title: 'Order Management - Admin',
  meta: [
    {
      name: 'description',
      content: 'Manage and view all orders'
    }
  ]
})

// Clean up on unmount
onUnmounted(() => {
  reset()
})

// Handle filter changes
function handleFilterChange(newFilters: typeof filters) {
  updateFilters(newFilters)
  fetchAllOrders({
    status: newFilters.status || undefined,
    phone: newFilters.phone || undefined,
    limit: pagination.itemsPerPage,
    offset: 0
  })
}

// Handle filter apply
function handleApplyFilters() {
  pagination.currentPage = 1
  fetchAllOrders({
    status: filters.status || undefined,
    phone: filters.phone || undefined,
    limit: pagination.itemsPerPage,
    offset: 0
  })
}

// Handle filter clear
function handleClearFilters() {
  resetFilters()
  fetchAllOrders({
    limit: pagination.itemsPerPage,
    offset: 0
  })
}

// Handle row click (navigate to detail)
function handleRowClick(order: typeof orders.value[0]) {
  router.push(`/admin/orders/${order.id}`)
}

// Handle page change
function handlePageChange(page: number) {
  updatePagination({ currentPage: page })
  // Client-side pagination - no need to refetch
}

// Handle items per page change
function handleItemsPerPageChange(itemsPerPage: number) {
  updatePagination({ currentPage: 1, itemsPerPage })
  // Client-side pagination - no need to refetch
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-luxury-text dark:text-luxury-dark-text">Orders</h1>
        <p class="text-luxury-text-muted dark:text-luxury-dark-text-muted mt-1">
          Manage and track all customer orders
        </p>
      </div>
    </div>

    <!-- Error State -->
    <div v-if="error && !loading" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-luxury p-6">
      <div class="flex items-start gap-4">
        <UiIcon name="alert-circle" :size="24" class="text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
        <div>
          <h3 class="font-semibold text-red-900 dark:text-red-100">
            {{ error === 'unauthorized' ? 'Unauthorized' : error === 'forbidden' ? 'Access Denied' : 'Failed to load orders' }}
          </h3>
          <p class="text-sm text-red-700 dark:text-red-300 mt-1">
            {{ error === 'unauthorized'
              ? 'You need to log in to access this page.'
              : error === 'forbidden'
                ? 'You do not have permission to view orders.'
                : 'There was a problem loading the orders. Please try again.' }}
          </p>
          <UiLuxuryButton
            v-if="error !== 'unauthorized' && error !== 'forbidden'"
            variant="outline"
            size="sm"
            class="mt-3"
            @click="fetchAllOrders"
          >
            Retry
          </UiLuxuryButton>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <AdminOrderFilters
      :filters="filters"
      :loading="loading"
      @update:filters="handleFilterChange"
      @apply="handleApplyFilters"
      @clear="handleClearFilters"
    />

    <!-- Loading State -->
    <div v-if="loading && !hasOrders" class="flex items-center justify-center py-12">
      <div class="flex flex-col items-center gap-4">
        <UiIcon name="loader-2" :size="40" class="animate-spin text-luxury-gold" />
        <p class="text-luxury-text-muted dark:text-luxury-dark-text-muted">Loading orders...</p>
      </div>
    </div>

    <!-- Order List Table -->
    <AdminOrderListTable
      v-else
      :orders="paginatedOrders"
      :format-price="formatPrice"
      :format-date="formatDate"
      :get-status-color="getStatusColor"
      :get-status-label="getStatusLabel"
      :loading="loading"
      @row-click="handleRowClick"
    />

    <!-- Pagination (only show if we have orders) -->
    <AdminOrderPagination
      v-if="hasOrders"
      :current-page="pagination.currentPage"
      :total-pages="totalPages"
      :items-per-page="pagination.itemsPerPage"
      :total-items="filteredOrders.length"
      :loading="loading"
      @page-change="handlePageChange"
      @items-per-page-change="handleItemsPerPageChange"
    />
  </div>
</template>
