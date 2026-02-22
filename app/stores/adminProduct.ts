import { defineStore } from 'pinia'
import { adminNetwork, type Product, type ProductSection, type ProductVariant, type CreateProductData, type UpdateProductData, type CreateVariantData, type UpdateVariantData, type FileUploadResponse } from '~/network/admin'

export const useAdminProductStore = defineStore('adminProduct', () => {
  // State
  const products = ref<Product[]>([])
  const currentProduct = ref<Product | null>(null)
  const currentVariants = ref<ProductVariant[]>([])
  const loading = ref(false)
  const saving = ref(false)
  const uploading = ref(false)
  const error = ref<string | null>(null)

  // Form state
  const productForm = reactive({
    name: '',
    slug: '',
    youtube_url: '',
    file_paths: [] as string[],
    sections: [] as ProductSection[],
    delivery_type: 'flat' as const,
    delivery_charge: 100
  })

  const variantForm = reactive({
    sku: '',
    price: 0,
    attributes: [] as { key: string; value: string }[]
  })

  // Modal/UI state
  const showVariantModal = ref(false)
  const editingVariant = ref<ProductVariant | null>(null)
  const deletingVariant = ref<string | null>(null)
  const uploadingSection = ref<number | null>(null)
  const activeTab = ref('overview')

  // Actions - Products
  const fetchProducts = async () => {
    loading.value = true
    error.value = null
    try {
      const data = await adminNetwork.fetchProducts()
      products.value = data || []
    } catch (e) {
      console.error('Failed to fetch products:', e)
      error.value = 'Failed to fetch products'
      throw e
    } finally {
      loading.value = false
    }
  }

  const fetchProduct = async (id: string) => {
    loading.value = true
    error.value = null
    try {
      const data = await adminNetwork.fetchProduct(id)
      currentProduct.value = data
      currentVariants.value = data.variants || []
      return data
    } catch (e) {
      console.error('Failed to fetch product:', e)
      error.value = 'Failed to fetch product'
      throw e
    } finally {
      loading.value = false
    }
  }

  const createProduct = async (data: CreateProductData) => {
    loading.value = true
    error.value = null
    try {
      const created = await adminNetwork.createProduct(data)
      products.value.push(created)
      return created
    } catch (e) {
      console.error('Failed to create product:', e)
      error.value = 'Failed to create product'
      throw e
    } finally {
      loading.value = false
    }
  }

  const updateProduct = async (id: string, data: UpdateProductData) => {
    saving.value = true
    error.value = null
    try {
      const updated = await adminNetwork.updateProduct(id, data)
      const index = products.value.findIndex(p => p.id === id)
      if (index !== -1) {
        products.value[index] = updated
      }
      if (currentProduct.value?.id === id) {
        currentProduct.value = updated
      }
      return updated
    } catch (e) {
      console.error('Failed to update product:', e)
      error.value = 'Failed to update product'
      throw e
    } finally {
      saving.value = false
    }
  }

  const deleteProduct = async (id: string) => {
    try {
      await adminNetwork.deleteProduct(id)
      products.value = products.value.filter(p => p.id !== id)
      if (currentProduct.value?.id === id) {
        currentProduct.value = null
        currentVariants.value = []
      }
    } catch (e) {
      console.error('Failed to delete product:', e)
      error.value = 'Failed to delete product'
      throw e
    }
  }

  // Actions - Product Variants
  const createVariant = async (productId: string, data: CreateVariantData) => {
    try {
      const created = await adminNetwork.createVariant(productId, data)
      currentVariants.value.push(created)
      return created
    } catch (e) {
      console.error('Failed to create variant:', e)
      error.value = 'Failed to create variant'
      throw e
    }
  }

  const updateVariant = async (id: string, data: UpdateVariantData) => {
    try {
      const updated = await adminNetwork.updateVariant(id, data)
      const index = currentVariants.value.findIndex(v => v.id === id)
      if (index !== -1) {
        currentVariants.value[index] = updated
      }
      return updated
    } catch (e) {
      console.error('Failed to update variant:', e)
      error.value = 'Failed to update variant'
      throw e
    }
  }

  const deleteVariant = async (id: string) => {
    try {
      await adminNetwork.deleteVariant(id)
      currentVariants.value = currentVariants.value.filter(v => v.id !== id)
    } catch (e) {
      console.error('Failed to delete variant:', e)
      error.value = 'Failed to delete variant'
      throw e
    }
  }

  const updateVariants = (variants: ProductVariant[]) => {
    currentVariants.value = variants
  }

  // Actions - File Upload
  const uploadFile = async (file: File): Promise<FileUploadResponse> => {
    uploading.value = true
    error.value = null
    try {
      const response = await adminNetwork.uploadFile(file)
      return response
    } catch (e) {
      console.error('Failed to upload file:', e)
      error.value = 'Failed to upload file'
      throw e
    } finally {
      uploading.value = false
    }
  }

  const deleteFile = async (path: string) => {
    try {
      await adminNetwork.deleteFile(path)
    } catch (e) {
      console.error('Failed to delete file:', e)
      error.value = 'Failed to delete file'
      throw e
    }
  }

  // Reset
  const reset = () => {
    currentProduct.value = null
    currentVariants.value = []
    error.value = null
    productForm.name = ''
    productForm.slug = ''
    productForm.youtube_url = ''
    productForm.file_paths = []
    productForm.sections = []
    productForm.delivery_type = 'flat'
    productForm.delivery_charge = 100
    variantForm.sku = ''
    variantForm.price = 0
    variantForm.attributes = []
    showVariantModal.value = false
    editingVariant.value = null
    deletingVariant.value = null
    uploadingSection.value = null
    activeTab.value = 'overview'
  }

  return {
    // State
    products,
    currentProduct,
    currentVariants,
    loading,
    saving,
    uploading,
    error,
    // Form state
    productForm,
    variantForm,
    // Modal/UI state
    showVariantModal,
    editingVariant,
    deletingVariant,
    uploadingSection,
    activeTab,
    // Actions - Products
    fetchProducts,
    fetchProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    // Actions - Variants
    createVariant,
    updateVariant,
    deleteVariant,
    updateVariants,
    // Actions - Files
    uploadFile,
    deleteFile,
    // Reset
    reset
  }
})
