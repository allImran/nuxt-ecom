/**
 * Resolve the deployment's public origin for canonical / og:url / hreflang / JSON-LD.
 *
 * runtimeConfig.public.siteUrl comes from NUXT_PUBLIC_SITE_URL. Until that is set
 * per deployment it defaults to the placeholder "https://yourdomain.com" — emitting
 * canonical/hreflang URLs against that placeholder is worse than emitting none
 * (it tells crawlers the canonical lives on a domain that isn't ours), so callers
 * gate on `hasSiteUrl` and skip those tags when it's false.
 */
const PLACEHOLDER = 'https://yourdomain.com'

export function useSiteUrl() {
  const config = useRuntimeConfig()

  const siteUrl = computed(() => {
    const raw = (config.public.siteUrl as string | undefined)?.trim().replace(/\/$/, '')
    if (!raw || raw === PLACEHOLDER) return ''
    return raw
  })

  const hasSiteUrl = computed(() => siteUrl.value.length > 0)

  /** Absolute URL for a path, or '' if no real origin is configured. */
  const absoluteUrl = (path: string) => {
    if (!hasSiteUrl.value) return ''
    return `${siteUrl.value}${path.startsWith('/') ? path : `/${path}`}`
  }

  return { siteUrl, hasSiteUrl, absoluteUrl }
}
