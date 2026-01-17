export const useCategoryViewModel = () => {
    const categoryStore = useAdminCategoryStore()
    const businessStore = useAdminBusinessStore()
    
    const { categories, loading } = storeToRefs(categoryStore)
    const { businesses } = storeToRefs(businessStore)

    const searchQuery = ref('')
    const newCategoryName = ref('')
    const newCategoryBusinessId = ref('')

    // Fetch Data
    const fetchBusinesses = async () => {
        await businessStore.fetchBusinesses()
    }

    const fetchCategories = async () => {
        await categoryStore.fetchCategories()
    }

    // Helpers
    const getBusinessName = (id: string) => {
        const biz = businesses.value.find(b => b.id === id)
        return biz ? biz.name : 'Unknown Business'
    }

    // Add Category
    const addCategory = async () => {
        if (!newCategoryName.value.trim() || !newCategoryBusinessId.value) return

        try {
            const name = newCategoryName.value.trim()
            const business_id = newCategoryBusinessId.value
            
            await categoryStore.addCategory(name, business_id)
            newCategoryName.value = ''
        } catch (e) {
            alert('Failed to create category')
        }
    }

    // Update Category
    const updateCategory = async (category: any) => {
        try {
            await categoryStore.updateCategory(category.id, category.name)
        } catch (e) {
            // Error handled
        }
    }

    // Delete Category
    const deleteCategory = async (id: string) => {
        if (!confirm('Are you sure you want to delete this category?')) return
        try {
            await categoryStore.deleteCategory(id)
        } catch (e) {
            alert('Failed to delete category')
        }
    }

    const filteredCategories = computed(() => {
        if (!searchQuery.value) return categories.value
        const query = searchQuery.value.toLowerCase()
        return categories.value.filter(c =>
            c.name.toLowerCase().includes(query) ||
            getBusinessName(c.business_id).toLowerCase().includes(query)
        )
    })

    return {
        searchQuery,
        newCategoryName,
        newCategoryBusinessId,
        categories,
        businesses,
        loading,
        fetchBusinesses,
        fetchCategories,
        getBusinessName,
        addCategory,
        updateCategory,
        deleteCategory,
        filteredCategories
    }
}
