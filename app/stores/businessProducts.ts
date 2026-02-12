import { defineStore } from 'pinia'
import { adminNetwork, type Product } from '~/network/admin'

export const useBusinessProductsStore = defineStore('businessProducts', () => {
  // State
  const products = ref<Product[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Actions
  const fetchProductsByBusiness = async (businessId: string) => {
    loading.value = true
    error.value = null
    try {
      const data = await adminNetwork.fetchProductsByBusiness(businessId)
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
