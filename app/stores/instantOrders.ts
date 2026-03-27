// Instant order state management using Pinia Setup Store pattern
// Manages fetching and updating instant orders for admin users

import type {
  InstantOrder,
  InstantOrderListItem,
  CreateInstantOrderRequest,
  UpdateInstantOrderRequest
} from '~/types/instantOrder'

export const useInstantOrdersStore = defineStore('instantOrders', () => {
  // State
  const orders = ref<InstantOrderListItem[]>([])
  const currentOrder = ref<InstantOrder | null>(null)
  const loading = ref(false)
  const updating = ref(false)
  const error = ref<string | null>(null)

  // Pagination state
  const pagination = reactive({
    limit: 25,
    offset: 0,
    total: 0
  })

  // Computed - Has orders data
  const hasOrders = computed(() => orders.value.length > 0)

  // Computed - Has current order detail
  const hasCurrentOrder = computed(() => currentOrder.value !== null)

  // Actions - Fetch orders by business
  async function fetchOrdersByBusiness(
    businessId: string,
    params?: { status?: string; search?: string; limit?: number; offset?: number }
  ) {
    loading.value = true
    error.value = null

    try {
      const { adminNetwork } = await import('~/network/admin')
      const response = await adminNetwork.fetchInstantOrders(businessId, params)

      // API returns { data: [...], pagination: {...} }
      const ordersData = response?.data || []
      const paginationData = response?.pagination

      // Map API response to list item format
      orders.value = ordersData.map((order: any) => ({
        id: order.id,
        customer_name: order.customer_info?.name || 'N/A',
        phone: order.customer_info?.phone || '',
        status: order.status,
        total_amount: order.total || 0, // API uses 'total' not 'total_amount'
        created_at: order.created_at
      }))

      pagination.total = paginationData?.total || 0
      pagination.limit = paginationData?.limit || 25
      pagination.offset = paginationData?.offset || 0
    } catch (err) {
      console.error('Failed to fetch instant orders:', err)
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
      const response = await adminNetwork.fetchInstantOrder(orderId)

      // API might return wrapped data
      const data = response?.data || response

      // Map API response to InstantOrder format
      currentOrder.value = {
        id: data.id,
        business_id: data.business_id,
        user_id: data.user_id,
        customer_info: data.customer_info,
        order_items: data.order_items,
        delivery_charge: data.delivery_charge,
        cod_reference: data.cod_reference,
        status: data.status,
        total_amount: data.total || 0, // API uses 'total' not 'total_amount'
        created_at: data.created_at,
        updated_at: data.updated_at || data.created_at
      }

      return currentOrder.value
    } catch (err) {
      console.error('Failed to fetch instant order:', err)
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

  // Actions - Create instant order
  async function createOrder(request: CreateInstantOrderRequest) {
    updating.value = true
    error.value = null

    try {
      const { adminNetwork } = await import('~/network/admin')
      const response = await adminNetwork.createInstantOrder(request)

      // API might return wrapped data
      const data = response?.data || response
      return data
    } catch (err) {
      console.error('Failed to create instant order:', err)
      if (err && typeof err === 'object' && 'statusCode' in err) {
        if (err.statusCode === 401) {
          error.value = 'unauthorized'
        } else if (err.statusCode === 403) {
          error.value = 'forbidden'
        } else if (err.statusCode === 400) {
          error.value = 'validation'
        } else {
          error.value = 'generic'
        }
      } else {
        error.value = 'generic'
      }
      throw err
    } finally {
      updating.value = false
    }
  }

  // Actions - Update instant order
  async function updateOrder(orderId: string, request: UpdateInstantOrderRequest) {
    updating.value = true
    error.value = null

    try {
      const { adminNetwork } = await import('~/network/admin')
      const response = await adminNetwork.updateInstantOrder(orderId, request)

      // API might return wrapped data
      const result = response?.data || response

      // Update current order if it's loaded
      if (currentOrder.value?.id === orderId) {
        currentOrder.value = { ...currentOrder.value, ...result }
      }

      // Update order in list
      const index = orders.value.findIndex(o => o.id === orderId)
      if (index !== -1 && result) {
        orders.value[index] = { ...orders.value[index], ...result }
      }

      return result
    } catch (err) {
      console.error('Failed to update instant order:', err)
      if (err && typeof err === 'object' && 'statusCode' in err) {
        if (err.statusCode === 404) {
          error.value = 'notFound'
        } else if (err.statusCode === 401) {
          error.value = 'unauthorized'
        } else if (err.statusCode === 403) {
          error.value = 'forbidden'
        } else if (err.statusCode === 400) {
          error.value = 'validation'
        } else {
          error.value = 'generic'
        }
      } else {
        error.value = 'generic'
      }
      throw err
    } finally {
      updating.value = false
    }
  }

  // Actions - Reset state
  function reset() {
    orders.value = []
    currentOrder.value = null
    loading.value = false
    updating.value = false
    error.value = null
    pagination.limit = 25
    pagination.offset = 0
    pagination.total = 0
  }

  return {
    // State
    orders,
    currentOrder,
    loading,
    updating,
    error,
    pagination,

    // Computed
    hasOrders,
    hasCurrentOrder,

    // Actions
    fetchOrdersByBusiness,
    fetchOrderById,
    createOrder,
    updateOrder,
    reset
  }
})
