// Admin order view model composable
// Bridges the admin order store with components, providing business logic
// All logic is here, no logic in components

import { storeToRefs } from 'pinia'
import type { OrderItem, OrderStatusType } from '~/types/order'
import { getPublicImage } from '~/utils/image'

// Valid status transitions
const validTransitions: Record<OrderStatusType, OrderStatusType[]> = {
  pending: ['confirmed', 'cancelled'],
  conducted: ['confirmed', 'cancelled'],
  confirmed: ['paid', 'cancelled'],
  paid: ['shipped', 'cancelled'],
  shipped: ['delivered', 'partially_returned'],
  delivered: ['returned', 'partially_returned'],
  cancelled: [], // No transitions from cancelled
  returned: [], // No transitions from returned
  partially_returned: ['returned'] // Can fully return after partial
}

export function useAdminOrderViewModel() {
  const adminOrderStore = useAdminOrderStore()
  const localeStore = useLocaleStore()

  // Extract reactive state from store
  const {
    orders,
    orderDetail,
    loading,
    updating,
    requestingPickup,
    error,
    filters,
    pagination,
    hasOrders,
    hasOrderDetail,
    filteredOrders,
    paginatedOrders,
    totalPages
  } = storeToRefs(adminOrderStore)

  // Locale helpers
  const currentLocale = computed(() => localeStore.currentLocale)

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

  // Helper: Get product thumbnail URL using getPublicImage
  function getProductImage(item: OrderItem): string {
    if (item.product?.file_paths?.[0]) {
      return getPublicImage('product-images', item.product.file_paths[0])
    }
    return ''
  }

  // Helper: Get product slug from order item
  function getProductSlug(item: OrderItem): string {
    return item.product?.slug || ''
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
      case 'conducted':
        return 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
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
      case 'returned':
        return 'text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/20'
      case 'partially_returned':
        return 'text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20'
      default:
        return 'text-luxury-text dark:text-luxury-dark-text bg-luxury-border dark:bg-luxury-dark-border'
    }
  }

  // Helper: Get localized status label
  function getStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      pending: 'Pending',
      conducted: 'Conducted',
      confirmed: 'Confirmed',
      paid: 'Paid',
      shipped: 'Shipped',
      delivered: 'Delivered',
      cancelled: 'Cancelled',
      returned: 'Returned',
      partially_returned: 'Partially Returned'
    }
    return labels[status] || status
  }

  // Helper: Calculate order item total (price_at_purchase × quantity)
  function calculateItemTotal(item: OrderItem): number {
    const price = typeof item.price_at_purchase === 'string' ? parseFloat(item.price_at_purchase) : item.price_at_purchase
    const quantity = typeof item.quantity === 'string' ? parseInt(item.quantity, 10) : item.quantity
    return (price || 0) * (quantity || 0)
  }

  // Helper: Calculate subtotal from all items
  function calculateSubtotal(): number {
    if (!orderDetail.value?.order_items) return 0
    return orderDetail.value.order_items.reduce((sum, item) => sum + calculateItemTotal(item), 0)
  }

  // Helper: Get final total amount, factoring in a fallback 100 delivery charge if missing
  const displayTotalAmount = computed(() => {
    if (!orderDetail.value) return 0
    const subtotal = calculateSubtotal()
    const deliveryCharge = orderDetail.value.delivery_charge
    const deliveryFee = deliveryCharge != null
      ? (typeof deliveryCharge === 'string' ? parseFloat(deliveryCharge) : deliveryCharge)
      : 100
    return subtotal + deliveryFee
  })

  // Helper: Validate status transition
  function validateStatusTransition(currentStatus: OrderStatusType, newStatus: OrderStatusType): boolean {
    // Allow cancellation and return from any status
    if (newStatus === 'cancelled' || newStatus === 'returned' || newStatus === 'partially_returned') {
      return true
    }

    const allowed = validTransitions[currentStatus] || []
    return allowed.includes(newStatus)
  }

  // Helper: Get available statuses for current status
  function getAvailableStatuses(currentStatus: OrderStatusType): OrderStatusType[] {
    const allStatuses: OrderStatusType[] = [
      'pending',
      'conducted',
      'confirmed',
      'paid',
      'shipped',
      'delivered',
      'cancelled',
      'returned',
      'partially_returned'
    ]

    // Include cancellation and return options from any status
    const terminalStatuses: OrderStatusType[] = ['cancelled', 'returned', 'partially_returned']

    const allowed = validTransitions[currentStatus] || []
    return [...allowed, ...terminalStatuses]
  }

  // Helper: Filter orders
  function filterOrders(ordersList: typeof orders.value) {
    return filteredOrders.value
  }

  // Helper: Sort orders by field
  function sortOrders(ordersList: typeof orders.value, field: keyof typeof orders.value[0], direction: 'asc' | 'desc' = 'asc') {
    return [...ordersList].sort((a, b) => {
      const aVal = a[field]
      const bVal = b[field]

      if (aVal < bVal) return direction === 'asc' ? -1 : 1
      if (aVal > bVal) return direction === 'asc' ? 1 : -1
      return 0
    })
  }

  // Computed: Order items from detail
  const orderItems = computed(() => orderDetail.value?.order_items || [])

  return {
    // State from store
    orders,
    orderDetail,
    loading,
    updating,
    requestingPickup,
    error,
    filters,
    pagination,
    hasOrders,
    hasOrderDetail,
    filteredOrders,
    paginatedOrders,
    totalPages,
    orderItems,
    currentLocale,
    displayTotalAmount,

    // Helpers
    formatPrice,
    formatDate,
    getProductImage,
    getProductSlug,
    getStatusColor,
    getStatusLabel,
    calculateItemTotal,
    calculateSubtotal,
    validateStatusTransition,
    getAvailableStatuses,
    filterOrders,
    sortOrders,

    // Actions
    fetchAllOrders: adminOrderStore.fetchAllOrders,
    fetchOrderById: adminOrderStore.fetchOrderById,
    updateOrderStatus: adminOrderStore.updateOrderStatus,
    updateOrder: adminOrderStore.updateOrder,
    requestPickup: adminOrderStore.requestPickup,
    updateFilters: adminOrderStore.updateFilters,
    resetFilters: adminOrderStore.resetFilters,
    updatePagination: adminOrderStore.updatePagination,
    reset: adminOrderStore.reset
  }
}
