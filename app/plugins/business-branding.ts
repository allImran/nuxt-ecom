/**
 * Business Branding Plugin
 * Fetches business data on app initialization and applies branding
 */

export default defineNuxtPlugin(async () => {
  const businessBrandingStore = useBusinessBrandingStore()
  const config = useRuntimeConfig()
  const businessId = config.public.businessId

  // Fetch on both server and client
  if (businessId) {
    try {
      businessBrandingStore.setLoading(true)

      const { publicNetwork } = await import('~/network/public')
      const businessData = await publicNetwork.fetchBusinessById(businessId)

      if (businessData) {
        businessBrandingStore.setBusiness(businessData)

        const name = businessData.name
        if (name) {
          // Drive all brand-identity head tags from the business record so a
          // deployment never ships another business's title/OG/favicon. Runs
          // after nuxt.config's generic defaults and before page-level setup, so
          // pages can still override their own title/description on top of these.
          useHead({
            titleTemplate: (chunk) => (chunk ? `${chunk} | ${name}` : name),
            title: name,
          })

          const logoUrl = businessBrandingStore.logoUrl
          useSeoMeta({
            ogSiteName: name,
            ...(businessData.slogan
              ? { description: businessData.slogan, ogDescription: businessData.slogan }
              : {}),
            ...(logoUrl ? { ogImage: logoUrl, twitterImage: logoUrl } : {}),
          })

          if (logoUrl) {
            // Best-effort per-business favicon. Ideally these are generated as
            // real .ico/.png sizes at build time; overriding at runtime at least
            // stops shipping the wrong brand's static favicons.
            useHead({
              link: [
                { rel: 'icon', type: 'image/png', href: logoUrl },
                { rel: 'apple-touch-icon', href: logoUrl },
              ],
            })
          }
        }
      }
    } catch (error) {
      console.error('Failed to fetch business branding:', error)
      businessBrandingStore.setError('Failed to load business branding')
    } finally {
      businessBrandingStore.setLoading(false)
    }
  }
})
