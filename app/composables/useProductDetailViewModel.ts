import { storeToRefs } from 'pinia'
import { getPublicImage } from '~/utils/image'
import type { Product, ProductVariant } from '~/network/public'

export const useProductDetailViewModel = () => {
  const productDetailStore = useProductDetailStore()

  const {
    product,
    selectedVariant,
    selectedMediaIndex,
    loading,
    error,
    hasProduct,
    hasVariants,
    displayPrice,
    priceDisplay,
    orderedMedia,
    hasMedia
  } = storeToRefs(productDetailStore)

  // Format price for display
  const formatPrice = (price: number): string => {
    return `$${price}`
  }

  // Get attribute value from variant
  const getAttributeValue = (variant: ProductVariant, key: string): string | undefined => {
    return variant.attributes?.[key]
  }

  // Get all attributes as entries
  const getAttributeEntries = (variant: ProductVariant): Array<{ key: string; value: string }> => {
    if (!variant.attributes) return []
    return Object.entries(variant.attributes).map(([key, value]) => ({ key, value: String(value) }))
  }

  // Extract YouTube ID from URL (supports watch, embed, shorts, and youtu.be URLs)
  const extractYouTubeId = (url: string): string | null => {
    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|shorts\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
    const match = url.match(regex)
    return match ? match[1]! : null
  }

  // Get image URL using the getPublicImage utility
  const getImageUrl = (path: string): string => {
    return getPublicImage('product-images', path)
  }

  // Get YouTube embed URL
  const getYouTubeEmbedUrl = (youtubeId: string): string => {
    return `https://www.youtube.com/embed/${youtubeId}`
  }

  // Fetch product by slug
  const loadProduct = async (slug: string) => {
    try {
      await productDetailStore.fetchProductBySlug(slug)
    } catch (e) {
      console.error('Failed to load product:', e)
      throw e
    }
  }

  // Select a variant
  const selectVariant = (variant: ProductVariant) => {
    productDetailStore.selectVariant(variant)
  }

  // Set selected media index
  const setSelectedMediaIndex = (index: number) => {
    productDetailStore.setSelectedMediaIndex(index)
  }

  // Reset state
  const reset = () => {
    productDetailStore.reset()
  }

  return {
    // State from store
    product,
    selectedVariant,
    selectedMediaIndex,
    loading,
    error,
    hasProduct,
    hasVariants,
    displayPrice,
    priceDisplay,
    orderedMedia,
    hasMedia,
    // Actions
    loadProduct,
    selectVariant,
    setSelectedMediaIndex,
    reset,
    // Helpers
    formatPrice,
    getAttributeValue,
    getAttributeEntries,
    extractYouTubeId,
    getImageUrl,
    getYouTubeEmbedUrl
  }
}
