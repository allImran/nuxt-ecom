// Order detail state management using Pinia Setup Store pattern
// Manages fetching and displaying a single order's details

import type { OrderDetail } from '~/types/order'

export const useOrderDetailStore = defineStore('orderDetail', () => {
  // State
  const order = ref<OrderDetail | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Computed - Has order data
  const hasOrder = computed(() => order.value !== null)

  // Computed - Order items
  const orderItems = computed(() => order.value?.items || [])

  // Computed - Status history
  const statusHistory = computed(() => order.value?.order_history || [])

  // Computed - Formatted date
  const formattedDate = computed(() => {
    if (!order.value?.created_at) return ''
    return new Date(order.value.created_at).toLocaleString()
  })

  // Computed - Formatted total
  const formattedTotal = computed(() => {
    if (!order.value?.total) return ''
    return new Intl.NumberFormat('en-BD', {
      style: 'currency',
      currency: 'BDT'
    }).format(order.value.total)
  })

  // Actions - Fetch order by ID
  async function fetchOrderById(orderId: string) {
    loading.value = true
    error.value = null

    try {
      const { publicNetwork } = await import('~/network/public')
      const result = await publicNetwork.fetchOrderById(orderId)
      order.value = result
    } catch (err) {
      console.error('Failed to fetch order:', err)
      // Handle 404 specifically
      if (err && typeof err === 'object' && 'statusCode' in err && err.statusCode === 404) {
        error.value = 'notFound'
      } else {
        error.value = 'generic'
      }
    } finally {
      loading.value = false
    }
  }

  // Actions - Reset state
  function reset() {
    order.value = null
    loading.value = false
    error.value = null
  }

  return {
    // State
    order,
    loading,
    error,

    // Computed
    hasOrder,
    orderItems,
    statusHistory,
    formattedDate,
    formattedTotal,

    // Actions
    fetchOrderById,
    reset
  }
})
