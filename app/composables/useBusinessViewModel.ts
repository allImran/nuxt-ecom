import type { Business, FileUploadResponse } from '~/network/admin'
import { useAdminBusinessStore } from '~/stores/adminBusiness'
import { debounce } from 'perfect-debounce'

// For business listing page (admin)
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

    // Update Business (for listing page)
    const updateBusiness = async (business: Business) => {
        try {
            await businessStore.updateBusiness(business.id, { name: business.name, slug: business.slug })
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
        businesses,
        loading,
        fetchBusinesses,
        addBusiness,
        updateBusiness,
        deleteBusiness,
        filteredBusinesses
    }
}

// For business edit page
export const useBusinessEditViewModel = () => {
  const businessStore = useAdminBusinessStore()

  // Business form state
  const businessForm = reactive<Partial<Business>>({
    name: '',
    slug: '',
    logo: '',
    slogan: '',
    primary_color: '',
    email: '',
    social: {},
    address: '',
    is_active: true
  })

  const loading = ref(false)
  const saving = ref(false)
  const uploading = ref(false)
  const error = ref<string | null>(null)

  // Current business being edited
  const currentBusiness = ref<Business | null>(null)

  // Fetch business by ID
  const fetchBusiness = async (id: string) => {
    loading.value = true
    error.value = null
    try {
      const { adminNetwork } = await import('~/network/admin')
      currentBusiness.value = await adminNetwork.fetchBusinessById(id)
      populateBusinessForm(currentBusiness.value)
      return currentBusiness.value
    } catch (e) {
      error.value = 'Failed to load business'
      console.error('Failed to fetch business:', e)
      throw e
    } finally {
      loading.value = false
    }
  }

  // Populate form from business data
  const populateBusinessForm = (business: Business) => {
    businessForm.name = business.name
    businessForm.slug = business.slug
    businessForm.logo = business.logo || ''
    businessForm.slogan = business.slogan || ''
    businessForm.primary_color = business.primary_color || ''
    businessForm.email = business.email || ''
    businessForm.social = business.social || {}
    businessForm.address = business.address || ''
    businessForm.is_active = business.is_active ?? true
  }

  // Debounced save function
  const debouncedSave = debounce(async (id: string) => {
    await saveBusiness(id)
  }, 800)

  // Save business
  const saveBusiness = async (id: string) => {
    saving.value = true
    error.value = null
    try {
      // Filter out empty values before sending
      const data: Partial<Business> = {}
      if (businessForm.name !== undefined && businessForm.name !== '') data.name = businessForm.name
      if (businessForm.slug !== undefined && businessForm.slug !== '') data.slug = businessForm.slug
      if (businessForm.logo !== undefined && businessForm.logo !== '') data.logo = businessForm.logo
      if (businessForm.slogan !== undefined && businessForm.slogan !== '') data.slogan = businessForm.slogan
      if (businessForm.primary_color !== undefined && businessForm.primary_color !== '') data.primary_color = businessForm.primary_color
      if (businessForm.email !== undefined && businessForm.email !== '') data.email = businessForm.email
      if (businessForm.address !== undefined && businessForm.address !== '') data.address = businessForm.address
      if (businessForm.social !== undefined && Object.keys(businessForm.social).length > 0) data.social = businessForm.social
      if (businessForm.is_active !== undefined) data.is_active = businessForm.is_active

      await businessStore.updateBusiness(id, data)
    } catch (e) {
      error.value = 'Failed to save business'
      console.error('Failed to save business:', e)
      throw e
    } finally {
      saving.value = false
    }
  }

  // Instant save for logo upload
  const uploadLogo = async (file: File): Promise<FileUploadResponse> => {
    uploading.value = true
    error.value = null
    try {
      const { adminNetwork } = await import('~/network/admin')
      const response = await adminNetwork.uploadFile(file)
      return response
    } catch (e) {
      error.value = 'Failed to upload logo'
      console.error('Failed to upload logo:', e)
      throw e
    } finally {
      uploading.value = false
    }
  }

  // Reset form
  const reset = () => {
    businessForm.name = ''
    businessForm.slug = ''
    businessForm.logo = ''
    businessForm.slogan = ''
    businessForm.primary_color = ''
    businessForm.email = ''
    businessForm.social = {}
    businessForm.address = ''
    businessForm.is_active = true
    currentBusiness.value = null
    error.value = null
  }

  return {
    // State
    businessForm,
    loading,
    saving,
    uploading,
    error,
    currentBusiness,
    // Methods
    fetchBusiness,
    populateBusinessForm,
    debouncedSave,
    saveBusiness,
    uploadLogo,
    reset
  }
}
