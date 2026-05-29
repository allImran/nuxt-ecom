import { defineStore } from 'pinia'
import { publicNetwork, type Product } from '~/network/public'

export const useBusinessProductsStore = defineStore('businessProducts', () => {
  // State
  const products = ref<Product[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Actions
  const fetchProductsByBusiness = async (businessId: string, limit?: number) => {
    loading.value = true
    error.value = null
    try {
      const data = await publicNetwork.fetchProductsByBusiness(businessId, limit)
      console.log('Fetched products:', data)
      products.value = data || []
    } catch (e) {
      console.error('Failed to fetch business products:', e)
      error.value = 'Failed to fetch products'
      throw e
    } finally {
      loading.value = false
    }
  }

  const reset = () => {
    products.value = []
    error.value = null
  }

  return {
    products,
    loading,
    error,
    fetchProductsByBusiness,
    reset
  }
})
