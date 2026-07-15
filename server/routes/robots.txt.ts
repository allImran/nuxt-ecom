/**
 * Build-time robots.txt (force-prerendered like sitemap.xml — see that file).
 *
 * Replaces the previous static public/robots.txt so the Sitemap: directive can
 * carry the per-deployment origin. The directive is emitted only once
 * NUXT_PUBLIC_SITE_URL is set (a Sitemap: line needs an absolute URL).
 */
export default defineEventHandler((event) => {
  const config = useRuntimeConfig()
  const siteUrl = ((config.public.siteUrl as string) || '').trim().replace(/\/$/, '')

  const lines = [
    'User-Agent: *',
    'Allow: /',
    // Non-public surfaces: admin dashboard, per-business management, and the
    // transactional flows (already noindexed, but keep crawlers out entirely).
    'Disallow: /admin',
    'Disallow: /business',
    'Disallow: /checkout',
    'Disallow: /orders',
    'Disallow: /login',
    'Disallow: /signup',
  ]

  if (siteUrl) {
    lines.push('', `Sitemap: ${siteUrl}/sitemap.xml`)
  }

  setHeader(event, 'Content-Type', 'text/plain; charset=utf-8')
  return lines.join('\n') + '\n'
})
