import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { publicNetwork, type Product, type ProductVariant } from '~/network/public'

export const useProductDetailStore = defineStore('productDetail', () => {
  // State
  const product = ref<Product | null>(null)
  const selectedVariant = ref<ProductVariant | null>(null)
  const selectedMediaIndex = ref(0)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Computed
  const hasProduct = computed(() => product.value !== null)
  const hasVariants = computed(() => product.value?.variants && product.value.variants.length > 0)

  const displayPrice = computed(() => {
    if (selectedVariant.value) return selectedVariant.value.price

    const variants = product.value?.variants
    if (variants && variants.length > 0) {
      const prices = variants.map(v => v.price).filter(p => p != null)
      if (prices.length > 0) {
        return {
          min: Math.min(...prices),
          max: Math.max(...prices)
        }
      }
    }
    return null
  })

  const priceDisplay = computed(() => {
    const price = displayPrice.value
    if (price === null) return null

    if (typeof price === 'number') {
      return `${price} TK`
    }

    return price.min === price.max ? `${price.min} TK` : `${price.min} TK - ${price.max} TK`
  })

  const orderedMedia = computed(() => {
    const media: Array<{ type: 'image' | 'video'; url: string; youtubeId?: string }> = []

    if (product.value?.youtube_url) {
      const youtubeId = extractYouTubeId(product.value.youtube_url)
      if (youtubeId) {
        media.push({ type: 'video', url: product.value.youtube_url, youtubeId })
      }
    }

    product.value?.file_paths?.forEach(path => {
      media.push({ type: 'image', url: path })
    })

    return media
  })

  const hasMedia = computed(() => orderedMedia.value.length > 0)

  // Actions
  const fetchProductBySlug = async (slug: string) => {
    loading.value = true
    error.value = null
    try {
      const data = await publicNetwork.fetchProductBySlug(slug)
      product.value = data || null
      // Reset selection
      selectedVariant.value = null
      selectedMediaIndex.value = 0
      // Auto-select first variant if available
      autoSelectFirstVariant()
    } catch (e) {
      console.error('Failed to fetch product by slug:', e)
      error.value = 'Failed to load product'
      product.value = null
      throw e
    } finally {
      loading.value = false
    }
  }

  const selectVariant = (variant: ProductVariant) => {
    selectedVariant.value = variant
  }

  // Auto-select first variant if available
  const autoSelectFirstVariant = () => {
    const variants = product.value?.variants
    if (variants && variants.length > 0 && !selectedVariant.value) {
      selectedVariant.value = variants[0]
    }
  }

  const setSelectedMediaIndex = (index: number) => {
    selectedMediaIndex.value = index
  }

  const reset = () => {
    product.value = null
    selectedVariant.value = null
    selectedMediaIndex.value = 0
    loading.value = false
    error.value = null
  }

  return {
    // State
    product,
    selectedVariant,
    selectedMediaIndex,
    loading,
    error,
    // Computed
    hasProduct,
    hasVariants,
    displayPrice,
    priceDisplay,
    orderedMedia,
    hasMedia,
    // Actions
    fetchProductBySlug,
    selectVariant,
    setSelectedMediaIndex,
    reset,
    autoSelectFirstVariant
  }
})

// Helper function to extract YouTube ID (supports watch, embed, shorts, and youtu.be URLs)
function extractYouTubeId(url: string): string | null {
  const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|shorts\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
  const match = url.match(regex)
  return match ? match[1] : null
}
