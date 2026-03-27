// Instant order view model composable
// Bridges the instant orders store with components, providing business logic

import { storeToRefs } from 'pinia'
import type { InstantOrderStatus, InstantOrderItem } from '~/types/instantOrder'

export function useInstantOrdersViewModel() {
  const instantOrdersStore = useInstantOrdersStore()
  const localeStore = useLocaleStore()

  // Extract reactive state from store
  const {
    orders,
    currentOrder,
    loading,
    updating,
    error,
    pagination,
    hasOrders,
    hasCurrentOrder
  } = storeToRefs(instantOrdersStore)

  // Locale helpers
  const currentLocale = computed(() => localeStore.currentLocale)

  // Filter refs
  const searchQuery = ref('')
  const statusFilter = ref<InstantOrderStatus | ''>('')
  const dateRange = ref<{ start: string; end: string }>({ start: '', end: '' })

  // Helper: Format price as BDT currency according to locale
  function formatPrice(price: number): string {
    return new Intl.NumberFormat(currentLocale.value, {
      style: 'currency',
      currency: 'BDT'
    }).format(price)
  }

  // Helper: Format date according to locale
  function formatDate(dateString: string): string {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat(currentLocale.value, {
      dateStyle: 'long',
      timeStyle: 'short'
    }).format(date)
  }

  // Helper: Get color class for order status
  function getStatusColor(status: string): string {
    if (!status) {
      return 'text-luxury-text dark:text-luxury-dark-text bg-luxury-border dark:bg-luxury-dark-border'
    }
    const statusLower = status.toLowerCase()
    switch (statusLower) {
      case 'pending':
        return 'text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20'
      case 'confirmed':
        return 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20'
      case 'paid':
        return 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20'
      case 'shipped':
        return 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20'
      case 'delivered':
        return 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20'
      case 'cancelled':
        return 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20'
      default:
        return 'text-luxury-text dark:text-luxury-dark-text bg-luxury-border dark:bg-luxury-dark-border'
    }
  }

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

  // Helper: Calculate item total (price × quantity)
  function calculateItemTotal(item: InstantOrderItem): number {
    const price = typeof item.price === 'string' ? parseFloat(item.price) : item.price
    const quantity = typeof item.quantity === 'string' ? parseInt(item.quantity, 10) : item.quantity
    return (price || 0) * (quantity || 0)
  }

  // Helper: Calculate subtotal from all items
  function calculateSubtotal(): number {
    if (!currentOrder.value?.order_items) return 0
    return currentOrder.value.order_items.reduce((sum, item) => sum + calculateItemTotal(item), 0)
  }

  // Computed: Filtered orders
  const filteredOrders = computed(() => {
    let result = [...orders.value]

    // Apply search filter
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase()
      result = result.filter(order => {
        const customerName = order.customer_name?.toLowerCase() || ''
        const phone = order.phone?.toLowerCase() || ''
        const id = order.id?.toLowerCase() || ''
        return customerName.includes(query) || phone.includes(query) || id.includes(query)
      })
    }

    // Apply status filter
    if (statusFilter.value) {
      result = result.filter(order => order.status === statusFilter.value)
    }

    // Apply date range filter
    if (dateRange.value.start || dateRange.value.end) {
      result = result.filter(order => {
        const orderDate = new Date(order.created_at)
        const startDate = dateRange.value.start ? new Date(dateRange.value.start) : null
        const endDate = dateRange.value.end ? new Date(dateRange.value.end) : null

        if (startDate && orderDate < startDate) return false
        if (endDate && orderDate > endDate) return false
        return true
      })
    }

    return result
  })

  // Helper: Reset filters
  function resetFilters() {
    searchQuery.value = ''
    statusFilter.value = ''
    dateRange.value = { start: '', end: '' }
  }

  return {
    // State from store
    orders,
    currentOrder,
    loading,
    updating,
    error,
    pagination,
    hasOrders,
    hasCurrentOrder,
    currentLocale,

    // Filter state
    searchQuery,
    statusFilter,
    dateRange,

    // Computed
    filteredOrders,

    // Helpers
    formatPrice,
    formatDate,
    getStatusColor,
    getStatusLabel,
    calculateItemTotal,
    calculateSubtotal,
    resetFilters,

    // Actions
    fetchOrdersByBusiness: instantOrdersStore.fetchOrdersByBusiness,
    fetchOrderById: instantOrdersStore.fetchOrderById,
    createOrder: instantOrdersStore.createOrder,
    updateOrder: instantOrdersStore.updateOrder,
    reset: instantOrdersStore.reset
  }
}
