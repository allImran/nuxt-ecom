import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { publicNetwork, type Product } from '~/network/public'

export const useHomeStore = defineStore('home', () => {
  // State
  const featuredProducts = ref<Product[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Computed
  const hasProducts = computed(() => featuredProducts.value.length > 0)
  const productsCount = computed(() => featuredProducts.value.length)

  // Actions
  const fetchFeaturedProducts = async (limit = 8) => {
    loading.value = true
    error.value = null
    try {
      const data = await publicNetwork.fetchFeaturedProducts(limit)
      featuredProducts.value = data || []
    } catch (e) {
      console.error('Failed to fetch featured products:', e)
      error.value = 'Failed to load featured products'
      throw e
    } finally {
      loading.value = false
    }
  }

  const reset = () => {
    featuredProducts.value = []
    loading.value = false
    error.value = null
  }

  return {
    // State
    featuredProducts,
    loading,
    error,
    // Computed
    hasProducts,
    productsCount,
    // Actions
    fetchFeaturedProducts,
    reset
  }
})
