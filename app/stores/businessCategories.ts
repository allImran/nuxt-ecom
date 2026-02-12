import { defineStore } from 'pinia'
import { adminNetwork, type Category } from '~/network/admin'

export const useBusinessCategoriesStore = defineStore('businessCategories', () => {
  // State
  const categories = ref<Category[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Actions
  const fetchCategoriesByBusiness = async (businessId: string) => {
    loading.value = true
    error.value = null
    try {
      const data = await adminNetwork.fetchCategoriesByBusiness(businessId)
      categories.value = data || []
    } catch (e) {
      console.error('Failed to fetch business categories:', e)
      error.value = 'Failed to fetch categories'
      throw e
    } finally {
      loading.value = false
    }
  }

  const reset = () => {
    categories.value = []
    error.value = null
  }

  return {
    categories,
    loading,
    error,
    fetchCategoriesByBusiness,
    reset
  }
})
