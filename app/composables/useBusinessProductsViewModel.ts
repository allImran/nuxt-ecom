import { storeToRefs } from 'pinia'
import { useBusinessProductsStore } from '~/stores/businessProducts'

export const useBusinessProductsViewModel = () => {
  const store = useBusinessProductsStore()
  const { products, loading, error } = storeToRefs(store)

  const searchQuery = ref('')

  const fetchProducts = async (businessId: string) => {
    await store.fetchProductsByBusiness(businessId)
  }

  const filteredProducts = computed(() => {
    if (!searchQuery.value) return products.value
    const query = searchQuery.value.toLowerCase()
    return products.value.filter(p =>
      p.name.toLowerCase().includes(query) ||
      p.slug.toLowerCase().includes(query)
    )
  })

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price)
  }

  const reset = () => {
    store.reset()
    searchQuery.value = ''
  }

  return {
    products,
    loading,
    error,
    searchQuery,
    filteredProducts,
    fetchProducts,
    formatPrice,
    reset
  }
}
