import { storeToRefs } from 'pinia'
import { useBusinessOrdersStore } from '~/stores/businessOrders'

export const useBusinessOrdersViewModel = () => {
  const store = useBusinessOrdersStore()
  const { orders, loading, error } = storeToRefs(store)

  const searchQuery = ref('')
  const statusFilter = ref('')

  const fetchOrders = async (businessId: string, params?: { status?: string }) => {
    await store.fetchOrdersByBusiness(businessId, params)
  }

  const filteredOrders = computed(() => {
    let result = orders.value

    if (statusFilter.value) {
      result = result.filter(o => o.status === statusFilter.value)
    }

    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase()
      result = result.filter(o =>
        o.id.toLowerCase().includes(query) ||
        o.phone?.includes(query)
      )
    }

    return result
  })

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20',
      confirmed: 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20',
      paid: 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20',
      shipped: 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20',
      delivered: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20',
      cancelled: 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20'
    }
    return colors[status] || 'text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/20'
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price)
  }

  const reset = () => {
    store.reset()
    searchQuery.value = ''
    statusFilter.value = ''
  }

  return {
    orders,
    loading,
    error,
    searchQuery,
    statusFilter,
    filteredOrders,
    fetchOrders,
    getStatusColor,
    formatPrice,
    reset
  }
}
