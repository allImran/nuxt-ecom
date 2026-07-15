import { storeToRefs } from 'pinia'
import type { Product, ProductVariant } from '~/network/public'

export const useProductDetailViewModel = () => {
  const productDetailStore = useProductDetailStore()

  // Resolve the Supabase base once, here in setup where the Nuxt instance is
  // available. getImageUrl below closes over it and must NOT call useRuntimeConfig
  // itself: it is invoked lazily from useSeoMeta / JSON-LD head getters that unhead
  // resolves after setup, outside the instance context — calling a Nuxt composable
  // there throws "instance unavailable" and 500s the prerender of every product page.
  const runtimeConfig = useRuntimeConfig()
  const supabaseUrl = (runtimeConfig.public.supabaseUrl as string | undefined) ?? ''

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
    return `${price} TK`
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

  // Build a Supabase public image URL from the setup-captured base (no composable
  // call at invocation time — see the supabaseUrl note above). Mirrors getPublicImage.
  const getImageUrl = (path: string): string => {
    if (!supabaseUrl) {
      console.error('Supabase URL missing in runtime config')
      return ''
    }
    const cleanPath = path.startsWith('/') ? path.slice(1) : path
    return `${supabaseUrl}/storage/v1/object/public/product-images/${cleanPath}`
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

  // Mirror server-fetched, payload-serialized product data into the store (client
  // hydration / cached slug-change nav) so the derived getters and selection state work.
  const setProduct = (data: Product | null) => {
    productDetailStore.setProduct(data)
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
    setProduct,
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
