// Order detail view model composable
// Bridges the order detail store with components, providing business logic
// All logic is here, no logic in components

import { storeToRefs } from 'pinia'
import type { OrderItem } from '~/types/order'
import { getPublicImage } from '~/utils/image'

export function useOrderDetailViewModel() {
  const orderDetailStore = useOrderDetailStore()
  const localeStore = useLocaleStore()

  // Extract reactive state from store
  const { order, loading, error, hasOrder, orderItems, statusHistory } = storeToRefs(orderDetailStore)

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
    // Return empty string - component should show placeholder
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
      case 'processing':
        return 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20'
      case 'shipped':
        return 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20'
      case 'delivered':
        return 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20'
      case 'cancelled':
        return 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20'
      case 'returned':
        return 'text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/20'
      default:
        return 'text-luxury-text dark:text-luxury-dark-text bg-luxury-border dark:bg-luxury-dark-border'
    }
  }

  // Helper: Calculate order item total (price_at_purchase × quantity)
  function calculateItemTotal(item: OrderItem): number {
    const price = typeof item.price_at_purchase === 'string' ? parseFloat(item.price_at_purchase) : item.price_at_purchase
    const quantity = typeof item.quantity === 'string' ? parseInt(item.quantity, 10) : item.quantity
    return (price || 0) * (quantity || 0)
  }

  // Helper: Calculate subtotal from all items
  function calculateSubtotal(): number {
    return orderItems.value.reduce((sum, item) => sum + calculateItemTotal(item), 0)
  }

  // Helper: Get final total amount, factoring in a fallback 100 delivery charge if missing
  const displayTotalAmount = computed(() => {
    if (!order.value) return 0
    const subtotal = calculateSubtotal()
    const deliveryCharge = order.value.delivery_charge
    const deliveryFee = deliveryCharge != null
      ? (typeof deliveryCharge === 'string' ? parseFloat(deliveryCharge) : deliveryCharge)
      : 100
    return subtotal + deliveryFee
  })

  return {
    // State from store
    order,
    loading,
    error,
    hasOrder,
    orderItems,
    statusHistory,
    currentLocale,
    displayTotalAmount,

    // Helpers
    formatPrice,
    formatDate,
    getProductImage,
    getProductSlug,
    getStatusColor,
    calculateItemTotal,
    calculateSubtotal,

    // Actions
    fetchOrderById: orderDetailStore.fetchOrderById,
    reset: orderDetailStore.reset
  }
}
