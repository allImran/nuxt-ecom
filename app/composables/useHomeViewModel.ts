export const useHomeViewModel = () => {
  const homeStore = useHomeStore()

  const { featuredProducts, loading, error, hasProducts, productsCount } = storeToRefs(homeStore)

  // Fetch featured products on mount
  const loadFeaturedProducts = async (limit = 8) => {
    try {
      await homeStore.fetchFeaturedProducts(limit)
    } catch (e) {
      console.error('Failed to load featured products:', e)
    }
  }

  // Get lowest price from product variants
  const getProductPrice = (product: any) => {
    if (product.variants && product.variants.length > 0) {
      const prices = product.variants.map((v: any) => v.price).filter((p: number) => p != null)
      if (prices.length > 0) {
        const minPrice = Math.min(...prices)
        const maxPrice = Math.max(...prices)
        return minPrice === maxPrice ? `$${minPrice}` : `$${minPrice} - $${maxPrice}`
      }
    }
    return null
  }

  // Get primary image from product
  const getProductImage = (product: any) => {
    return product.file_paths && product.file_paths.length > 0 ? product.file_paths[0] : null
  }

  // Navigate to product detail (placeholder for future)
  const viewProduct = (slug: string) => {
    navigateTo(`/products/${slug}`)
  }

  return {
    // State from store
    featuredProducts,
    loading,
    error,
    hasProducts,
    productsCount,
    // Actions
    loadFeaturedProducts,
    // Helpers
    getProductPrice,
    getProductImage,
    viewProduct
  }
}
