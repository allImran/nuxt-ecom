/**
 * Build-time sitemap.
 *
 * This deployment serves only `.output/public` (no runtime Nitro server), so this
 * route is force-prerendered via `nitro.prerender.routes` in nuxt.config — it runs
 * ONCE at build time and the resulting XML is written to `.output/public/sitemap.xml`.
 * Redeploy to refresh the product list.
 *
 * Product slugs are fetched from the API at build time and fail soft: if the
 * backend is unreachable, the sitemap still emits the static routes rather than
 * breaking the build. A real origin (NUXT_PUBLIC_SITE_URL) is required for the
 * <loc>s to be absolute/valid — without it we skip the product routes and log,
 * since a sitemap of relative URLs is invalid.
 */

interface SitemapProduct {
  slug: string
  updated_at?: string
}

const STATIC_PATHS = ['/', '/products', '/about', '/contact', '/faq', '/shipping', '/privacy']

const xmlEscape = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;')

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const siteUrl = ((config.public.siteUrl as string) || '').trim().replace(/\/$/, '')
  const apiBaseURL = config.public.apiBaseURL as string | undefined
  const businessId = config.public.businessId as string | undefined

  setHeader(event, 'Content-Type', 'application/xml; charset=utf-8')

  if (!siteUrl) {
    console.error('[sitemap] NUXT_PUBLIC_SITE_URL is not set — emitting an empty sitemap. Set it per deployment for a valid sitemap.')
    return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>`
  }

  const entries: { path: string, lastmod?: string }[] = STATIC_PATHS.map(path => ({ path }))

  if (apiBaseURL && businessId) {
    try {
      const products = await $fetch<SitemapProduct[]>(`/products/business/${businessId}`, {
        baseURL: apiBaseURL,
        headers: { 'Content-Type': 'application/json' },
        timeout: 15000,
      })
      for (const p of products ?? []) {
        if (p?.slug) entries.push({ path: `/products/${p.slug}`, lastmod: p.updated_at })
      }
    } catch (e) {
      console.error('[sitemap] failed to fetch products at build time; emitting static routes only:', e)
    }
  }

  const urls = entries
    .map(({ path, lastmod }) => {
      const loc = xmlEscape(`${siteUrl}${path}`)
      const lastmodTag = lastmod ? `<lastmod>${xmlEscape(new Date(lastmod).toISOString())}</lastmod>` : ''
      return `  <url><loc>${loc}</loc>${lastmodTag}</url>`
    })
    .join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`
})
