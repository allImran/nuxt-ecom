import { storeToRefs } from 'pinia'
import { useBusinessCategoriesStore } from '~/stores/businessCategories'

export const useBusinessCategoriesViewModel = () => {
  const store = useBusinessCategoriesStore()
  const { categories, loading, error } = storeToRefs(store)

  const searchQuery = ref('')

  const fetchCategories = async (businessId: string) => {
    await store.fetchCategoriesByBusiness(businessId)
  }

  const filteredCategories = computed(() => {
    if (!searchQuery.value) return categories.value
    const query = searchQuery.value.toLowerCase()
    return categories.value.filter(c =>
      c.name.toLowerCase().includes(query)
    )
  })

  const reset = () => {
    store.reset()
    searchQuery.value = ''
  }

  return {
    categories,
    loading,
    error,
    searchQuery,
    filteredCategories,
    fetchCategories,
    reset
  }
}
