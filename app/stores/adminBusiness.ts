import { defineStore } from 'pinia'
import { adminNetwork, type Business } from '~/network/admin'

export const useAdminBusinessStore = defineStore('adminBusiness', () => {
    const businesses = ref<Business[]>([])
    const loading = ref(false)

    const fetchBusinesses = async () => {
        loading.value = true
        try {
            const data = await adminNetwork.fetchBusinesses()
            businesses.value = data || []
        } catch (e) {
            console.error('Failed to fetch businesses:', e)
            throw e
        } finally {
            loading.value = false
        }
    }

    const addBusiness = async (name: string, slug: string) => {
        loading.value = true
        try {
            await adminNetwork.createBusiness({ name, slug })
            await fetchBusinesses()
        } catch (e) {
            console.error('Failed to add business:', e)
            throw e
        } finally {
            loading.value = false
        }
    }

    const updateBusiness = async (id: string, data: Partial<Business>) => {
        try {
            await adminNetwork.updateBusiness(id, data)
        } catch (e) {
            console.error('Failed to update business:', e)
            throw e
        }
    }

    const deleteBusiness = async (id: string) => {
        try {
            await adminNetwork.deleteBusiness(id)
            businesses.value = businesses.value.filter(b => b.id !== id)
        } catch (e) {
            console.error('Failed to delete business:', e)
            throw e
        }
    }

    return {
        businesses,
        loading,
        fetchBusinesses,
        addBusiness,
        updateBusiness,
        deleteBusiness
    }
})
