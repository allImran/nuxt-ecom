/**
 * Business Branding Plugin
 * Fetches business data on app initialization and applies branding
 */

export default defineNuxtPlugin(async () => {
  const businessBrandingStore = useBusinessBrandingStore()
  const config = useRuntimeConfig()
  const businessId = config.public.businessId

  // Only fetch on client side
  if (process.client && businessId) {
    try {
      businessBrandingStore.setLoading(true)

      const { publicNetwork } = await import('~/network/public')
      const businessData = await publicNetwork.fetchBusinessById(businessId)

      if (businessData) {
        businessBrandingStore.setBusiness(businessData)

        // Update page title with business name
        useHead({
          title: businessData.name || 'UrbanEase'
        })
      }
    } catch (error) {
      console.error('Failed to fetch business branding:', error)
      businessBrandingStore.setError('Failed to load business branding')
    } finally {
      businessBrandingStore.setLoading(false)
    }
  }
})
