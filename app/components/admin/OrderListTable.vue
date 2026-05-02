<script setup lang="ts">
import type { AdminOrderListItem } from '~/types/order'

interface Props {
  orders: AdminOrderListItem[]
  formatPrice: (price: number) => string
  formatDate: (date: string) => string
  getStatusColor: (status: string) => string
  getStatusLabel: (status: string) => string
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  loading: false
})

const emit = defineEmits<{
  'row-click': [order: AdminOrderListItem]
}>()

// Sort state
const sortField = ref<keyof AdminOrderListItem>('created_at')
const sortDirection = ref<'asc' | 'desc'>('desc')

// Sorted orders
const sortedOrders = computed(() => {
  return [...props.orders].sort((a, b) => {
    const aVal = a[sortField.value]
    const bVal = b[sortField.value]

    if (aVal < bVal) return sortDirection.value === 'asc' ? -1 : 1
    if (aVal > bVal) return sortDirection.value === 'asc' ? 1 : -1
    return 0
  })
})

// Handle column header click for sorting
function handleSort(field: keyof AdminOrderListItem) {
  if (sortField.value === field) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortField.value = field
    sortDirection.value = 'asc'
  }
}

// Handle row click
function handleRowClick(order: AdminOrderListItem) {
  emit('row-click', order)
}

// Get the latest status from history
function getLatestStatus(order: AdminOrderListItem): string {
  if (order.history && order.history.length > 0) {
    // Sort history by changed_at descending and get the first item
    const sortedHistory = [...order.history].sort((a, b) =>
      new Date(b.changed_at).getTime() - new Date(a.changed_at).getTime()
    )
    return sortedHistory[0].status
  }
  return order.status
}
</script>

<template>
  <div class="bg-luxury-surface dark:bg-luxury-dark-surface rounded-luxury shadow-luxury overflow-hidden">
    <!-- Loading State -->
    <div v-if="loading" class="p-8">
      <div class="space-y-4">
        <div v-for="i in 5" :key="i" class="h-16 bg-luxury-border dark:bg-luxury-dark-border rounded animate-pulse" />
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="orders.length === 0" class="p-12 text-center">
      <UiIcon name="package" :size="48" class="mx-auto mb-4 text-luxury-text-muted/30 dark:text-luxury-dark-text-muted/30" />
      <h3 class="text-lg font-medium text-luxury-text dark:text-luxury-dark-text mb-2">
        No orders found
      </h3>
      <p class="text-luxury-text-muted dark:text-luxury-dark-text-muted">
        Try adjusting your filters or check back later.
      </p>
    </div>

    <!-- Mobile Card View -->
    <div v-else class="divide-y divide-luxury-border dark:divide-luxury-dark-border lg:hidden">
      <div
        v-for="order in sortedOrders"
        :key="order.id"
        class="p-4 cursor-pointer hover:bg-luxury-bg/50 dark:hover:bg-luxury-dark-bg/50 transition-colors"
        @click="handleRowClick(order)"
      >
        <!-- Order Header -->
        <div class="flex items-start justify-between mb-3">
          <div>
            <span class="text-sm font-mono text-luxury-text dark:text-luxury-dark-text font-medium">
              #{{ order.id.slice(0, 8) }}
            </span>
            <p class="text-xs text-luxury-text-muted dark:text-luxury-dark-text-muted mt-1">
              {{ formatDate(order.created_at) }}
            </p>
          </div>
          <OrderDetailStatusBadge
            :status="getLatestStatus(order)"
            :get-status-color="getStatusColor"
          />
        </div>

        <!-- Customer Info -->
        <div class="space-y-2 mb-3">
          <div class="flex items-start gap-2">
            <UiIcon name="user" :size="16" class="text-luxury-text-muted dark:text-luxury-dark-text-muted mt-0.5 flex-shrink-0" />
            <div>
              <p class="text-sm text-luxury-text dark:text-luxury-dark-text">
                {{ order.shipping_address?.full_name }}
              </p>
              <p class="text-xs text-luxury-text-muted dark:text-luxury-dark-text-muted">
                {{ order.shipping_address?.address }}
              </p>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <UiIcon name="phone" :size="16" class="text-luxury-text-muted dark:text-luxury-dark-text-muted flex-shrink-0" />
            <p class="text-sm font-mono text-luxury-text-muted dark:text-luxury-dark-text-muted">
              {{ order.shipping_address?.mobile }}
            </p>
          </div>
        </div>

        <!-- Total -->
        <div class="flex items-center justify-between pt-3 border-t border-luxury-border/50 dark:border-luxury-dark-border/50">
          <span class="text-sm text-luxury-text-muted dark:text-luxury-dark-text-muted">Total</span>
          <span class="text-lg font-semibold text-luxury-text dark:text-luxury-dark-text">
            {{ formatPrice(order.total_amount) }}
          </span>
        </div>
      </div>
    </div>

    <!-- Desktop Table View -->
    <div v-else class="hidden lg:block overflow-x-auto">
      <table class="w-full">
        <thead class="bg-luxury-bg dark:bg-luxury-dark-bg border-b border-luxury-border dark:border-luxury-dark-border">
          <tr>
            <th
              v-for="field in [
                { key: 'id', label: 'Order ID' },
                { key: 'customer_name', label: 'Customer' },
                { key: 'phone', label: 'Phone' },
                { key: 'status', label: 'Status' },
                { key: 'total_amount', label: 'Total' },
                { key: 'created_at', label: 'Date' }
              ] as const"
              :key="field.key"
              class="px-6 py-3 text-left text-xs font-medium text-luxury-text-muted dark:text-luxury-dark-text-muted uppercase tracking-wider cursor-pointer hover:text-luxury-gold transition-colors"
              @click="handleSort(field.key as keyof AdminOrderListItem)"
            >
              <div class="flex items-center gap-1">
                {{ field.label }}
                <UiIcon
                  v-if="sortField === field.key"
                  :name="sortDirection === 'asc' ? 'chevron-up' : 'chevron-down'"
                  :size="14"
                />
              </div>
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-luxury-border dark:divide-luxury-dark-border">
          <tr
            v-for="order in sortedOrders"
            :key="order.id"
            class="hover:bg-luxury-bg/50 dark:hover:bg-luxury-dark-bg/50 cursor-pointer transition-colors"
            @click="handleRowClick(order)"
          >
            <td class="px-6 py-4 whitespace-nowrap">
              <span class="text-sm font-mono text-luxury-text dark:text-luxury-dark-text">
                {{ order.id.slice(0, 8) }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span class="text-sm text-luxury-text dark:text-luxury-dark-text">
                {{ order.shipping_address?.full_name }}
              </span>
              <div class="text-sm text-luxury-text-muted dark:text-luxury-dark-text-muted">
                {{ order.shipping_address?.address }}
              </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span class="text-sm font-mono text-luxury-text-muted dark:text-luxury-dark-text-muted">
                {{ order.shipping_address?.mobile }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <OrderDetailStatusBadge
                :status="getLatestStatus(order)"
                :get-status-color="getStatusColor"
              />
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span class="text-sm font-medium text-luxury-text dark:text-luxury-dark-text">
                {{ formatPrice(order.total_amount) }}
              </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <span class="text-sm text-luxury-text-muted dark:text-luxury-dark-text-muted">
                {{ formatDate(order.created_at) }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
