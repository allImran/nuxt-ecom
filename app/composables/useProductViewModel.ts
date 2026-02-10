import type { Product, ProductVariant, ProductSection, CreateVariantData, UpdateVariantData, FileUploadResponse } from '~/network/admin'
import { useAdminProductStore } from '~/stores/adminProduct'

export const useProductViewModel = () => {
  const productStore = useAdminProductStore()
  const {
    products,
    currentProduct,
    currentVariants,
    loading,
    saving,
    uploading,
    error,
    showVariantModal,
    editingVariant,
    deletingVariant,
    uploadingSection,
    activeTab
  } = storeToRefs(productStore)

  // Reactive objects from store (not wrapped in storeToRefs)
  const productForm = productStore.productForm
  const variantForm = productStore.variantForm

  // Computed
  const isEditingVariant = computed(() => editingVariant.value !== null)

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'media', label: 'Media' },
    { id: 'content', label: 'Content' },
    { id: 'variants', label: 'Variants' }
  ]

  // Products
  const fetchProducts = async () => {
    await productStore.fetchProducts()
  }

  const fetchProduct = async (id: string) => {
    const product = await productStore.fetchProduct(id)
    if (product) {
      populateProductForm(product)
    }
    return product
  }

  const populateProductForm = (product: Product) => {
    productForm.name = product.name
    productForm.slug = product.slug
    productForm.youtube_url = product.youtube_url || ''
    productForm.file_paths = product.file_paths || []
    productForm.sections = product.sections || []
  }

  const createProduct = async (data: { name: string; slug: string; category_id: string; business_id: string }) => {
    return await productStore.createProduct({
      ...data,
      file_paths: productForm.file_paths,
      youtube_url: productForm.youtube_url || undefined,
      sections: productForm.sections
    })
  }

  const saveProduct = async () => {
    if (!currentProduct.value) return

    return await productStore.updateProduct(currentProduct.value.id, {
      name: productForm.name,
      slug: productForm.slug,
      youtube_url: productForm.youtube_url || undefined,
      file_paths: productForm.file_paths,
      sections: productForm.sections
    })
  }

  const deleteProduct = async () => {
    if (!currentProduct.value) return
    await productStore.deleteProduct(currentProduct.value.id)
  }

  // Variants
  const openCreateVariantModal = () => {
    editingVariant.value = null
    variantForm.sku = ''
    variantForm.price = 0
    variantForm.attributes = [{ key: '', value: '' }]
    showVariantModal.value = true
  }

  const openEditVariantModal = (variant: ProductVariant) => {
    editingVariant.value = variant
    variantForm.sku = variant.sku
    variantForm.price = variant.price
    variantForm.attributes = Object.entries(variant.attributes || {}).map(([key, value]) => ({ key, value }))
    if (variantForm.attributes.length === 0) {
      variantForm.attributes = [{ key: '', value: '' }]
    }
    showVariantModal.value = true
  }

  const closeVariantModal = () => {
    showVariantModal.value = false
    editingVariant.value = null
  }

  const addVariantAttribute = () => {
    variantForm.attributes.push({ key: '', value: '' })
  }

  const removeVariantAttribute = (index: number) => {
    variantForm.attributes.splice(index, 1)
    if (variantForm.attributes.length === 0) {
      variantForm.attributes.push({ key: '', value: '' })
    }
  }

  const getAttributesObject = (): Record<string, string> => {
    const attrs: Record<string, string> = {}
    for (const attr of variantForm.attributes) {
      if (attr.key.trim() && attr.value.trim()) {
        attrs[attr.key.trim()] = attr.value.trim()
      }
    }
    return attrs
  }

  const saveVariant = async (productId: string) => {
    if (!variantForm.sku.trim()) return

    const attributes = getAttributesObject()

    if (isEditingVariant.value && editingVariant.value) {
      const data: UpdateVariantData = {
        sku: variantForm.sku,
        price: variantForm.price,
        attributes
      }
      await productStore.updateVariant(editingVariant.value.id, data)
    } else {
      const data: CreateVariantData = {
        sku: variantForm.sku,
        price: variantForm.price,
        attributes,
        product_id: productId
      }
      await productStore.createVariant(productId, data)
    }

    closeVariantModal()
  }

  const deleteVariant = async (variant: ProductVariant) => {
    deletingVariant.value = variant.id
    try {
      await productStore.deleteVariant(variant.id)
    } finally {
      deletingVariant.value = null
    }
  }

  const updateVariants = (variants: ProductVariant[]) => {
    productStore.updateVariants(variants)
  }

  // Sections
  const addSection = (type: 'text' | 'media') => {
    const newSection: ProductSection = type === 'text'
      ? { type: 'text', content: '' }
      : { type: 'media', file_paths: [] }
    productForm.sections = [...productForm.sections, newSection]
  }

  const removeSection = (index: number) => {
    const newSections = [...productForm.sections]
    newSections.splice(index, 1)
    productForm.sections = newSections
  }

  const updateSectionContent = (index: number, content: string) => {
    const newSections = [...productForm.sections]
    const section = newSections[index]
    if (section) {
      newSections[index] = { type: section.type, content, file_paths: section.file_paths }
      productForm.sections = newSections
    }
  }

  const moveSection = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= productForm.sections.length) return
    const newSections = [...productForm.sections]
    const [removed] = newSections.splice(fromIndex, 1)
    if (removed) {
      newSections.splice(toIndex, 0, removed)
      productForm.sections = newSections
    }
  }

  const handleSectionFileUpload = async (index: number, files: FileList) => {
    uploadingSection.value = index
    try {
      const newPaths: string[] = []
      for (const file of Array.from(files)) {
        if (!file.type.startsWith('image/')) continue
        const response = await productStore.uploadFile(file)
        newPaths.push(response.path)
      }

      if (newPaths.length > 0) {
        const newSections = [...productForm.sections]
        const section = newSections[index]
        if (section) {
          const currentPaths = section.file_paths || []
          newSections[index] = {
            type: section.type,
            content: section.content,
            file_paths: [...currentPaths, ...newPaths]
          }
          productForm.sections = newSections
        }
      }
    } catch (e) {
      console.error('Failed to upload files:', e)
    } finally {
      uploadingSection.value = null
    }
  }

  const removeSectionMediaFile = (sectionIndex: number, fileIndex: number) => {
    const newSections = [...productForm.sections]
    const section = newSections[sectionIndex]
    if (section) {
      const currentPaths = [...(section.file_paths || [])]
      currentPaths.splice(fileIndex, 1)
      newSections[sectionIndex] = {
        type: section.type,
        content: section.content,
        file_paths: currentPaths
      }
      productForm.sections = newSections
    }
  }

  // Helpers
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price)
  }

  const formatAttributes = (attributes: Record<string, string>) => {
    return Object.entries(attributes || {})
      .map(([key, value]) => `${key}: ${value}`)
      .join(', ')
  }

  const reset = () => {
    productStore.reset()
    productForm.name = ''
    productForm.slug = ''
    productForm.youtube_url = ''
    productForm.file_paths = []
    productForm.sections = []
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
    productForm,
    variantForm,
    showVariantModal,
    editingVariant,
    deletingVariant,
    uploadingSection,
    activeTab,
    isEditingVariant,
    tabs,
    // Products
    fetchProducts,
    fetchProduct,
    createProduct,
    saveProduct,
    deleteProduct,
    // Variants
    openCreateVariantModal,
    openEditVariantModal,
    closeVariantModal,
    addVariantAttribute,
    removeVariantAttribute,
    saveVariant,
    deleteVariant,
    updateVariants,
    // Sections
    addSection,
    removeSection,
    updateSectionContent,
    moveSection,
    handleSectionFileUpload,
    removeSectionMediaFile,
    // Files
    uploadFile: (file: File) => productStore.uploadFile(file),
    // Helpers
    formatPrice,
    formatAttributes,
    reset
  }
}
