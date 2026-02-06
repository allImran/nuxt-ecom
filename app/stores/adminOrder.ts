// Admin order state management using Pinia Setup Store pattern
// Manages fetching and updating orders for admin users

import type { AdminOrderListItem, AdminOrderDetail, UpdateOrderStatusRequest, UpdateOrderRequest } from '~/types/order'

export const useAdminOrderStore = defineStore('adminOrder', () => {
  // State
  const orders = ref<AdminOrderListItem[]>([])
  const orderDetail = ref<AdminOrderDetail | null>(null)
  const loading = ref(false)
  const updating = ref(false)
  const error = ref<string | null>(null)

  // Filters state
  const filters = reactive({
    status: '',
    phone: '',
    orderId: ''
  })

  // Pagination state
  const pagination = reactive({
    currentPage: 1,
    itemsPerPage: 25,
    totalItems: 0
  })

  // Computed - Has orders data
  const hasOrders = computed(() => orders.value.length > 0)

  // Computed - Has order detail
  const hasOrderDetail = computed(() => orderDetail.value !== null)

  // Computed - Filtered orders
  const filteredOrders = computed(() => {
    let result = [...orders.value]

    if (filters.status) {
      result = result.filter(order => order.status === filters.status)
    }
    if (filters.phone) {
      result = result.filter(order => order.phone.includes(filters.phone))
    }
    if (filters.orderId) {
      result = result.filter(order => order.id.includes(filters.orderId))
    }

    return result
  })

  // Computed - Paginated orders
  const paginatedOrders = computed(() => {
    const start = (pagination.currentPage - 1) * pagination.itemsPerPage
    const end = start + pagination.itemsPerPage
    return filteredOrders.value.slice(start, end)
  })

  // Computed - Total pages
  const totalPages = computed(() => {
    return Math.ceil(filteredOrders.value.length / pagination.itemsPerPage)
  })

  // Actions - Fetch all orders
  async function fetchAllOrders(params?: { status?: string; phone?: string; limit?: number; offset?: number }) {
    loading.value = true
    error.value = null

    try {
      const { adminNetwork } = await import('~/network/admin')
      const data = await adminNetwork.fetchAllOrders(params)
      orders.value = data || []
      pagination.totalItems = data?.length || 0
    } catch (err) {
      console.error('Failed to fetch orders:', err)
      if (err && typeof err === 'object' && 'statusCode' in err) {
        if (err.statusCode === 401) {
          error.value = 'unauthorized'
        } else if (err.statusCode === 403) {
          error.value = 'forbidden'
        } else {
          error.value = 'generic'
        }
      } else {
        error.value = 'generic'
      }
      throw err
    } finally {
      loading.value = false
    }
  }

  // Actions - Fetch order by ID
  async function fetchOrderById(orderId: string) {
    loading.value = true
    error.value = null

    try {
      const { adminNetwork } = await import('~/network/admin')
      const data = await adminNetwork.fetchOrderDetail(orderId)
      orderDetail.value = data
      return data
    } catch (err) {
      console.error('Failed to fetch order:', err)
      if (err && typeof err === 'object' && 'statusCode' in err) {
        if (err.statusCode === 404) {
          error.value = 'notFound'
        } else if (err.statusCode === 401) {
          error.value = 'unauthorized'
        } else if (err.statusCode === 403) {
          error.value = 'forbidden'
        } else {
          error.value = 'generic'
        }
      } else {
        error.value = 'generic'
      }
      throw err
    } finally {
      loading.value = false
    }
  }

  // Actions - Update order status
  async function updateOrderStatus(orderId: string, request: UpdateOrderStatusRequest) {
    updating.value = true
    error.value = null

    try {
      const { adminNetwork } = await import('~/network/admin')
      const result = await adminNetwork.updateOrderStatus(orderId, request)

      // Update order detail if it's loaded
      if (orderDetail.value?.id === orderId) {
        orderDetail.value = { ...orderDetail.value, ...result }
      }

      // Update order in list
      const index = orders.value.findIndex(o => o.id === orderId)
      if (index !== -1 && result) {
        orders.value[index] = { ...orders.value[index], status: result.status }
      }

      return result
    } catch (err) {
      console.error('Failed to update order status:', err)
      error.value = 'generic'
      throw err
    } finally {
      updating.value = false
    }
  }

  // Actions - Update order
  async function updateOrder(orderId: string, request: UpdateOrderRequest) {
    updating.value = true
    error.value = null

    try {
      const { adminNetwork } = await import('~/network/admin')
      const result = await adminNetwork.updateOrder(orderId, request)

      // Update order detail if it's loaded
      if (orderDetail.value?.id === orderId) {
        orderDetail.value = { ...orderDetail.value, ...result }
      }

      return result
    } catch (err) {
      console.error('Failed to update order:', err)
      error.value = 'generic'
      throw err
    } finally {
      updating.value = false
    }
  }

  // Actions - Update filters
  function updateFilters(newFilters: Partial<typeof filters>) {
    Object.assign(filters, newFilters)
    pagination.currentPage = 1 // Reset to first page when filters change
  }

  // Actions - Reset filters
  function resetFilters() {
    filters.status = ''
    filters.phone = ''
    filters.orderId = ''
    pagination.currentPage = 1
  }

  // Actions - Update pagination
  function updatePagination(newPagination: Partial<typeof pagination>) {
    Object.assign(pagination, newPagination)
  }

  // Actions - Reset state
  function reset() {
    orders.value = []
    orderDetail.value = null
    loading.value = false
    updating.value = false
    error.value = null
    resetFilters()
  }

  return {
    // State
    orders,
    orderDetail,
    loading,
    updating,
    error,
    filters,
    pagination,

    // Computed
    hasOrders,
    hasOrderDetail,
    filteredOrders,
    paginatedOrders,
    totalPages,

    // Actions
    fetchAllOrders,
    fetchOrderById,
    updateOrderStatus,
    updateOrder,
    updateFilters,
    resetFilters,
    updatePagination,
    reset
  }
})
