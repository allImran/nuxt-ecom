import { defineStore } from 'pinia'
import { adminNetwork } from '~/network/admin'

export const useAdminCategoryStore = defineStore('adminCategory', () => {
    interface Category {
        id: string
        name: string
        business_id: string
        [key: string]: any
    }

    const categories = ref<Category[]>([])
    const loading = ref(false)

    const fetchCategories = async () => {
        loading.value = true
        try {
            const data = await adminNetwork.fetchCategories()
            categories.value = data || []
        } catch (e) {
            console.error('Failed to fetch categories:', e)
            throw e
        } finally {
            loading.value = false
        }
    }

    const addCategory = async (name: string, business_id: string) => {
        loading.value = true
        try {
            await adminNetwork.createCategory({ name, business_id })
            await fetchCategories()
        } catch (e) {
            console.error('Failed to add category:', e)
            throw e
        } finally {
            loading.value = false
        }
    }

    const updateCategory = async (id: string, name: string) => {
        try {
            await adminNetwork.updateCategory(id, { name })
        } catch (e) {
            console.error('Failed to update category:', e)
            throw e
        }
    }

    const deleteCategory = async (id: string) => {
        try {
            await adminNetwork.deleteCategory(id)
            categories.value = categories.value.filter(c => c.id !== id)
        } catch (e) {
            console.error('Failed to delete category:', e)
            throw e
        }
    }

    return {
        categories,
        loading,
        fetchCategories,
        addCategory,
        updateCategory,
        deleteCategory
    }
})
