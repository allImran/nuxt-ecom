<template>
  <div class="min-h-screen bg-luxury-bg dark:bg-luxury-dark-bg md:min-h-0">
    <!-- Mobile View -->
    <div class="md:hidden">
        <!-- Top Action Buttons -->
        <div class="flex items-center justify-between gap-3 mb-5">
            <button
            @click="router.push(`/business/${businessId}`)"
            class=" hover:bg-luxury-border dark:hover:bg-luxury-dark-border/50 rounded-full transition-opacity active:opacity-70"
          >
            <UiIcon name="arrow-left" :size="20" class="text-luxury-accent dark:text-luxury-dark-accent" />
          </button>
           <button
            @click="router.push(`/business/${businessId}/instant-orders`)"
            class="flex items-center gap-1 text-sm font-medium text-luxury-accent dark:text-luxury-dark-accent hover:bg-luxury-border dark:hover:bg-luxury-dark-border/50 rounded-full transition-colors"
          >
            <UiIcon name="layout-list" :size="18" />
            <span>Instant Orders</span>
          </button>
        </div>

        <!-- Header Section -->
        <section class="mb-6">
            <h2 class="text-xl font-bold text-luxury-text dark:text-luxury-dark-text">Orders</h2>
        </section>

        <!-- Mobile Search Bar -->
        <div class="mb-4">
          <input
            :value="searchQuery"
            @input="searchQuery = ($event.target as HTMLInputElement).value"
            type="text"
            placeholder="Search orders..."
            class="w-full px-4 py-2.5 rounded-lg bg-luxury-surface dark:bg-luxury-dark-surface border border-luxury-border dark:border-luxury-dark-border text-luxury-text dark:text-luxury-dark-text placeholder:text-luxury-text-muted dark:placeholder:text-luxury-dark-text-muted focus:outline-none focus:ring-2 focus:ring-luxury-accent dark:focus:ring-luxury-dark-accent"
          />
        </div>

        <!-- Mobile Status Filter -->
        <div class="mb-4">
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

        <!-- Loading State -->
        <div v-if="loading" class="flex items-center justify-center py-12">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-luxury-accent dark:border-luxury-dark-accent"></div>
        </div>

        <!-- Empty State -->
        <div v-else-if="!filteredOrders.length" class="text-center py-12">
          <UiIcon name="shopping-bag" :size="48" class="text-luxury-text-muted dark:text-luxury-dark-text-muted mx-auto mb-3" />
          <p class="text-luxury-text-muted dark:text-luxury-dark-text-muted">No orders found</p>
        </div>

        <!-- Orders Card List -->
        <div v-else class="flex flex-col gap-4">
          <OrdersCard
            v-for="order in filteredOrders"
            :key="order.id"
            :order="order"
            :format-price="formatPrice"
            :get-status-label="getStatusLabel"
            @click="router.push(`/admin/orders/${order.id}`)"
          />
        </div>

      <!-- Floating Action Button -->
      <button
        @click="router.push(`/business/${businessId}/instant-orders/create`)"
        class="fixed right-6 size-10 bg-[#765939] dark:bg-[#B08D6A] text-white rounded-full shadow-lg flex items-center justify-center active:scale-90 transition-transform z-60 bottom-8"
      >
        <UiIcon name="plus" :size="20" />
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
              Orders
            </h1>
            <p class="text-sm text-luxury-text-muted dark:text-luxury-dark-text-muted">
              {{ business?.name || 'Business' }}
            </p>
          </div>
        </div>
        <div class="flex gap-2">
          <UiLuxuryButton variant="outline" @click="router.push(`/business/${businessId}/instant-orders`)">
            <UiIcon name="layout-list" :size="16" class="mr-2" />
            Instant Orders
          </UiLuxuryButton>
          <UiLuxuryButton @click="router.push(`/business/${businessId}/instant-orders/create`)">
            <UiIcon name="plus" :size="16" class="mr-2" />
            New Instant Order
          </UiLuxuryButton>
        </div>
      </div>

      <!-- Filters -->
      <div class="flex gap-4">
        <UiLuxuryInput
          v-model="searchQuery"
          placeholder="Search orders..."
          class="max-w-md"
        />
        <UiLuxurySelect v-model="statusFilter" placeholder="Filter by status">
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="paid">Paid</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </UiLuxurySelect>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="text-center py-12">
        <UiIcon name="loader-2" :size="32" class="animate-spin text-luxury-gold" />
      </div>

      <!-- Orders Table -->
      <div v-else class="bg-luxury-surface dark:bg-luxury-dark-surface rounded-lg overflow-hidden">
        <table class="w-full">
          <thead class="bg-luxury-border/10 dark:bg-luxury-dark-border/20">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-luxury-text-muted dark:text-luxury-dark-text-muted uppercase tracking-wider">
                Order ID
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-luxury-text-muted dark:text-luxury-dark-text-muted uppercase tracking-wider">
                Customer
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-luxury-text-muted dark:text-luxury-dark-text-muted uppercase tracking-wider">
                Status
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-luxury-text-muted dark:text-luxury-dark-text-muted uppercase tracking-wider">
                Total
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-luxury-text-muted dark:text-luxury-dark-text-muted uppercase tracking-wider">
                Date
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-luxury-border dark:divide-luxury-dark-border">
            <tr
              v-for="order in filteredOrders"
              :key="order.id"
              class="hover:bg-luxury-border/5 dark:hover:bg-luxury-dark-border/10 cursor-pointer"
              @click="router.push(`/admin/orders/${order.id}`)"
            >
              <td class="px-6 py-4 whitespace-nowrap text-sm text-luxury-text dark:text-luxury-dark-text">
                {{ order.id.slice(0, 8) }}...
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-luxury-text dark:text-luxury-dark-text">
                {{ order.full_name || order.phone }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="['px-2 py-1 text-xs font-medium rounded-full', getStatusColor(order.status)]">
                  {{ getStatusLabel(order.status) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-luxury-text dark:text-luxury-dark-text">
                {{ formatPrice(order.total_amount) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-luxury-text-muted dark:text-luxury-dark-text-muted">
                {{ new Date(order.created_at).toLocaleDateString() }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Empty State -->
      <div v-if="!loading && filteredOrders.length === 0" class="text-center py-12">
        <p class="text-luxury-text-muted dark:text-luxury-dark-text-muted">
          No orders found
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: 'admin'
})

const route = useRoute()
const router = useRouter()

const businessId = computed(() => route.params.id as string)

const {
  orders,
  loading,
  searchQuery,
  statusFilter,
  filteredOrders,
  fetchOrders,
  getStatusColor,
  formatPrice,
  reset
} = useBusinessOrdersViewModel()

const business = ref<any>(null)

// Helper: Get localized status label
function getStatusLabel(status: string): string {
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

onMounted(async () => {
  await Promise.all([
    fetchOrders(businessId.value),
    (async () => {
      const { adminNetwork } = await import('~/network/admin')
      business.value = await adminNetwork.fetchBusinessById(businessId.value)
    })()
  ])
})

// Server-side SEO - admin pages should not be indexed
if (import.meta.server) {
  useSeoMeta({
    title: () => business.value ? `Orders - ${business.value.name}` : 'Orders - Business Admin',
    robots: 'noindex, nofollow',
  })
}

watch(businessId, () => {
  reset()
  fetchOrders(businessId.value)
})

onUnmounted(() => {
  reset()
})
</script>
