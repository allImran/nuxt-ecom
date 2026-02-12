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
            Orders
          </h1>
          <p class="text-sm text-luxury-text-muted dark:text-luxury-dark-text-muted">
            {{ business?.name || 'Business' }}
          </p>
        </div>
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
                {{ order.status }}
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

onMounted(async () => {
  await Promise.all([
    fetchOrders(businessId.value),
    (async () => {
      const { adminNetwork } = await import('~/network/admin')
      business.value = await adminNetwork.fetchBusinessById(businessId.value)
    })()
  ])
})

watch(businessId, () => {
  reset()
  fetchOrders(businessId.value)
})

onUnmounted(() => {
  reset()
})
</script>
