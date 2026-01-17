export const useBusinessViewModel = () => {
    const businessStore = useAdminBusinessStore()
    const { businesses, loading } = storeToRefs(businessStore)
    
    const searchQuery = ref('')
    const newBusinessName = ref('')

    // Fetch Businesses
    const fetchBusinesses = async () => {
        await businessStore.fetchBusinesses()
    }

    // Add Business
    const addBusiness = async () => {
        if (!newBusinessName.value.trim()) return
        
        const name = newBusinessName.value.trim()
        const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

        try {
            await businessStore.addBusiness(name, slug)
            newBusinessName.value = ''
        } catch (e) {
            alert('Failed to create business')
        }
    }

    // Update Business
    const updateBusiness = async (business: any) => {
        try {
            await businessStore.updateBusiness(business.id, business.name, business.slug)
        } catch (e) {
            // Error handled in store or UI
        }
    }

    // Delete Business
    const deleteBusiness = async (id: string) => {
        if (!confirm('Are you sure you want to delete this business?')) return
        try {
            await businessStore.deleteBusiness(id)
        } catch (e) {
            alert('Failed to delete business')
        }
    }

    const filteredBusinesses = computed(() => {
        if (!searchQuery.value) return businesses.value
        const query = searchQuery.value.toLowerCase()
        return businesses.value.filter(b =>
            b.name.toLowerCase().includes(query) ||
            b.slug.toLowerCase().includes(query)
        )
    })

    return {
        searchQuery,
        newBusinessName,
        businesses, // Make sure this is reactive
        loading,
        fetchBusinesses,
        addBusiness,
        updateBusiness,
        deleteBusiness,
        filteredBusinesses
    }
}
