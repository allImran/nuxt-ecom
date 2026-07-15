/**
 * Build-time Meta (Facebook/Instagram) product catalog feed — CSV format.
 *
 * Force-prerendered like sitemap.xml/robots.txt (see nuxt.config `nitro.prerender.routes`):
 * this deployment serves only `.output/public` with no runtime server, so the feed is
 * generated ONCE at build time into `.output/public/catalog.csv`. Point a Meta catalog
 * "scheduled feed" (or one-time upload) at `<site>/catalog.csv`; redeploy to refresh.
 *
 * The `id` column equals the product UUID — the SAME value the browser pixel sends as
 * content_ids (see usePixel) — so catalog/Advantage+ ads can match pixel events.
 *
 * Fails soft: if the backend is unreachable at build time, emits a header-only feed
 * rather than breaking the build. Requires NUXT_PUBLIC_SITE_URL for absolute product
 * links; without it, emits only the header and logs.
 */

interface FeedVariant {
  price?: number
}
interface FeedProduct {
  id: string
  name: string
  slug: string
  file_paths?: string[]
  // The list endpoint omits variants; only the per-slug detail endpoint returns them.
  variants?: FeedVariant[]
}

// Fetch in small concurrent batches so a large catalog doesn't fan out hundreds of
// simultaneous requests at the backend during build.
async function inBatches<T, R>(items: T[], size: number, fn: (item: T) => Promise<R>): Promise<R[]> {
  const out: R[] = []
  for (let i = 0; i < items.length; i += size) {
    const batch = items.slice(i, i + size)
    out.push(...await Promise.all(batch.map(fn)))
  }
  return out
}

// Meta required columns (one row per product; price is the lowest variant price).
const HEADER = ['id', 'title', 'description', 'availability', 'condition', 'price', 'link', 'image_link', 'brand']

const csvCell = (value: string | number) => {
  const s = String(value ?? '')
  // Always quote; escape embedded quotes by doubling (RFC 4180).
  return `"${s.replace(/"/g, '""')}"`
}

const lowestPrice = (p: FeedProduct) => {
  const prices = (p.variants ?? []).map(v => v.price).filter((x): x is number => x != null)
  return prices.length ? Math.min(...prices) : null
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const siteUrl = ((config.public.siteUrl as string) || '').trim().replace(/\/$/, '')
  const apiBaseURL = config.public.apiBaseURL as string | undefined
  const businessId = config.public.businessId as string | undefined
  const supabaseUrl = ((config.public.supabaseUrl as string) || '').replace(/\/$/, '')

  setHeader(event, 'Content-Type', 'text/csv; charset=utf-8')

  const rows: string[] = [HEADER.join(',')]

  if (!siteUrl) {
    console.error('[catalog] NUXT_PUBLIC_SITE_URL is not set — emitting header-only feed. Set it per deployment for a valid catalog.')
    return rows.join('\n') + '\n'
  }

  if (!apiBaseURL || !businessId) {
    console.error('[catalog] API base URL / business ID missing — emitting header-only feed.')
    return rows.join('\n') + '\n'
  }

  // Brand name from the business record (fallback to configured site name).
  let brand = (config.public.siteName as string) || ''
  try {
    const business = await $fetch<{ name?: string }>(`/businesses/${businessId}`, {
      baseURL: apiBaseURL,
      headers: { 'Content-Type': 'application/json' },
      timeout: 15000,
    })
    if (business?.name) brand = business.name
  } catch (e) {
    console.error('[catalog] failed to fetch business at build time; using configured site name as brand:', e)
  }

  let listed: FeedProduct[] = []
  try {
    listed = await $fetch<FeedProduct[]>(`/products/business/${businessId}`, {
      baseURL: apiBaseURL,
      headers: { 'Content-Type': 'application/json' },
      timeout: 15000,
    }) ?? []
  } catch (e) {
    console.error('[catalog] failed to fetch products at build time; emitting header-only feed:', e)
    return rows.join('\n') + '\n'
  }

  // The list endpoint omits variant prices; Meta requires price, so fetch each
  // product's detail to get variants. Fails soft per item (skips on error).
  const products = await inBatches(listed, 6, async (p) => {
    if (p.variants?.length) return p
    if (!p?.slug) return p
    try {
      const detail = await $fetch<FeedProduct>(`/products/slug/${p.slug}`, {
        baseURL: apiBaseURL,
        headers: { 'Content-Type': 'application/json' },
        timeout: 15000,
      })
      return { ...p, variants: detail?.variants }
    } catch (e) {
      console.error(`[catalog] failed to fetch detail for "${p.slug}"; skipping price:`, e)
      return p
    }
  })

  for (const p of products) {
    const price = lowestPrice(p)
    // Meta requires id, title, price, link, image_link — skip incomplete items.
    if (!p?.id || !p?.slug || !p?.name || price == null) continue

    const imagePath = p.file_paths?.[0]
    const imageLink = imagePath && supabaseUrl
      ? `${supabaseUrl}/storage/v1/object/public/product-images/${imagePath.startsWith('/') ? imagePath.slice(1) : imagePath}`
      : ''
    if (!imageLink) continue

    rows.push([
      csvCell(p.id),
      csvCell(p.name),
      csvCell(p.name), // no dedicated description field in the schema — reuse the title
      csvCell('in stock'),
      csvCell('new'),
      csvCell(`${price.toFixed(2)} BDT`),
      csvCell(`${siteUrl}/products/${p.slug}`),
      csvCell(imageLink),
      csvCell(brand),
    ].join(','))
  }

  return rows.join('\n') + '\n'
})
