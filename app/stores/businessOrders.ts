import { defineStore } from 'pinia'
import { adminNetwork } from '~/network/admin'

export const useBusinessOrdersStore = defineStore('businessOrders', () => {
  // State
  const orders = ref<any[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Actions
  const fetchOrdersByBusiness = async (businessId: string, params?: { status?: string; limit?: number; offset?: number }) => {
    loading.value = true
    error.value = null
    try {
      const data = await adminNetwork.fetchOrdersByBusiness(businessId, params)
      orders.value = data || []
    } catch (e) {
      console.error('Failed to fetch business orders:', e)
      error.value = 'Failed to fetch orders'
      throw e
    } finally {
      loading.value = false
    }
  }

  const reset = () => {
    orders.value = []
    error.value = null
  }

  return {
    orders,
    loading,
    error,
    fetchOrdersByBusiness,
    reset
  }
})
