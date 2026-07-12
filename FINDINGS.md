E-commerce Optimization Audit — nuxt-ecom
Verdict: Not yet ready for scaled paid advertising or organic growth. The purchase funnel works end-to-end (guest COD checkout, complete client-side pixel funnel, bilingual trust pages), but there are two show-stoppers: every deployment fires the hardcoded INDOORSHOPPING pixel regardless of environment config, and all product content renders client-side only, so crawlers and social scrapers see an empty shell. On top of that, a checkout bug silently resets cart quantities and variants, meaning customers can receive the wrong order.

Scores
Area Score Summary
Overall 36 / 100 Functional store, but tracking, SEO, and rendering foundations undermine it
Facebook Pixel readiness 40 / 100 Good client event coverage; no CAPI, no dedup, broken enhanced matching, hardcoded ID
SEO 22 / 100 Empty SSR HTML, no structured data, no sitemap, non-crawlable product links
E-commerce conversion readiness 45 / 100 Solid guest COD flow, but funnel bugs + missing discovery/trust features
Performance 35 / 100 SSR negated by client fetching, unoptimized images, blocking fonts, dead dependencies
Multi-business architecture 30 / 100 Brand and pixel leak across deployments; env config is partly dead
Critical issues (fix before spending on ads)
C1. Pixel ID is hardcoded — every business reports to INDOORSHOPPING's ad account
Where: nuxt.config.ts:25 and nuxt.config.ts:32 inline fbq('init', '1469591844791219'). The NUXT_PUBLIC_PIXEL_ID env var populates runtimeConfig.public.pixelId (nuxt.config.ts:55) but nothing in the codebase reads it — changing the env var has zero effect. nuxt-meta-pixel is installed but never registered in modules.
Impact: Any business deployed from a branch sends all its conversion data (including Purchase values) to the wrong Meta ad account. Their campaigns can't optimize; INDOORSHOPPING's data gets polluted.
Fix: Delete the inline snippet; initialize the pixel in a client plugin from config.public.pixelId (or register nuxt-meta-pixel, which does exactly this). Fail loudly if the env var is unset.
Business impact: This is the difference between paid ads being measurable per business vs. entirely broken. Nothing else in the pixel area matters until this is fixed.
C2. Storefront is client-rendered — SSR produces an empty shell
Where: No useFetch/useAsyncData anywhere. Home (app/pages/index.vue:43), listing (app/pages/products/index.vue:38), and product detail (app/pages/products/[slug].vue:49) all fetch in onMounted, which never runs on the server.
Impact: Server HTML contains only skeletons. Product titles/descriptions in useSeoMeta resolve from product.value which is null during SSR, so shared product links show "Product - INDOORSHOPPING" with a broken image on Facebook/WhatsApp — the exact channels this store sells through. Google gets degraded signals; LCP is a multi-hop client waterfall (bundle → hydrate → branding fetch → product fetch → paint).
Fix: Move fetches into useAsyncData in setup() across home, listing, and product detail (the stores/network layer can stay; call them from useAsyncData handlers). Then add routeRules with swr/ISR caching for /, /products, /products/\*\*.
Business impact: Directly improves ad landing-page speed (lower CPC via better quality ranking), makes product links shareable with real previews, and unlocks organic search as a channel.
C3. Checkout silently resets quantities and variants (functional bug)
Where: app/pages/checkout.vue:60-68 sets quantities from the cart, but the embedded order form's own onMounted re-runs initializeOrderProducts (app/components/order/Index.vue:133 → app/stores/order.ts:104-114), resetting to "first product qty 1, rest 0." Checkout also re-selects variants[0] (checkout.vue:65), discarding the customer's chosen variant.
Impact: A customer who adds 3 units of a blue variant checks out with 1 unit of whatever the first variant is. Wrong orders → COD refusals, returns, lost trust — and corrupted Purchase values in ads reporting.
Fix: Make the order form accept initial quantities/variants as props and initialize once; carry the selected variant ID (not a display string) through the cart (app/pages/products/[slug].vue:163).
Business impact: Removes a direct revenue leak and COD-failure driver.
C4. Multi-business brand leakage across ~20 files
Where: INDOORSHOPPING hardcoded in nuxt.config.ts:9-21 (titleTemplate, og:site_name, twitter:site), static page SEO blocks (shipping/faq/privacy/login/signup/checkout/about), i18n copy (i18n/locales/en.json:70), invoice PDFs (app/config/pdfConfig.ts:42-46); leftover URBANEASE brand in app/components/layout/AppFooter.vue:16 and public/urban-ease-logo.png; static INDOORSHOPPING favicons; the branding plugin (app/plugins/business-branding.ts:23-25) only overrides title — not titleTemplate, OG tags, description, or favicon. There's also no .env.example, and .env is missing BUSINESS_ID/WHATSAPP_URL/FACEBOOK_URL, so deployments silently inherit INDOORSHOPPING defaults.
Fix: Drive all head tags from the branding store in the plugin; move brand fallbacks to env; source PDF company details from the branding store; add .env.example documenting all seven required vars.
Business impact: Makes "new business = new branch + env file" actually true. Today every new deployment ships another brand's identity on invoices, social shares, and browser tabs.
C5. Business data scoping is inconsistent (data-leak risk)
Where: Featured products fetch is not scoped by business (app/network/public.ts:112-122) — the homepage can show other businesses' products. Order business_id is inferred from the first product's category (app/stores/order.ts:225-240) instead of the deployment's businessId.
Fix: Pass businessId on every public query; stamp orders with config.public.businessId.
Business impact: Prevents cross-tenant product exposure and misattributed orders/revenue.
High-severity issues
Facebook Pixel & tracking

No Conversions API. No server/ directory exists at all; all events are browser-only. In Bangladesh's mobile-heavy market with ad blockers and iOS ITP, expect meaningful signal loss. Fix: add a Nitro endpoint that forwards Purchase (at minimum) server-side with hashed customer phone. Impact: Meta typically reports materially better event match quality and cheaper conversions with CAPI + enhanced matching.
No event deduplication. trackPurchase receives the orderId but discards it (app/composables/usePixel.ts:204-219); no eventID is ever sent. Required before CAPI can coexist with the browser pixel. Fix: pass {eventID: orderId} as fbq's 4th arg.
Enhanced matching is wired wrong and never used. usePixel passes userData as fbq's 4th positional arg (usePixel.ts:98), which Facebook treats as the options object, not advanced matching — and no call site supplies it anyway, despite the checkout collecting the customer's phone. Fix: set matching data via fbq('init', id, {ph: hashedPhone}) or fbq('set', ...) post-order.
PageView never fires on SPA navigation — only the initial hard load. Fix: router.afterEach(() => trackPageView()) in a client plugin.
Event payload bugs: ViewContent always uses variants[0].price not the selected variant ([slug].vue:60); AddToCart hardcodes quantity 1 ([slug].vue:180); InitiateCheckout re-fires on every checkout mount/reload (checkout.vue:38); Search/Lead helpers exist but are never called.
No catalog feed. content_ids are internal UUIDs with no Meta catalog publishing them, so dynamic/Advantage+ catalog ads can't work. Fix: a Nitro route emitting a Meta-format product feed (id = same UUIDs), one feed per business.
SEO

No structured data at all — no Product/Offer, BreadcrumbList, Organization, or FAQPage JSON-LD anywhere. Impact: no rich results (price/availability stars in SERPs). Fix: add Product + BreadcrumbList schema on product detail once SSR data exists (C2 is a prerequisite).
No sitemap; public/robots.txt allows all but has no Sitemap: directive. Fix: @nuxtjs/sitemap with a dynamic product-slug source, per business domain.
Product cards aren't links. app/components/home/ProductShowcase.vue:88-93 uses a click handler + navigateTo — no <a href>, so crawlers have no path to product pages and no link equity flows. Fix: wrap cards in <NuxtLink>.
Open Graph base tags are ignored by scrapers: nuxt.config.ts:18-19 uses name="og:_" instead of property="og:_".
og:image is always broken on product pages: products/[slug].vue:125 reads product.value.media, a field that doesn't exist on the Product type (it's file_paths), falling back to /og-image.jpg — which doesn't exist in public/ (404).
hreflang URLs point to https://yourdomain.com — config.public.siteUrl used in app/components/seo/I18nMetaTags.vue:7 is never defined in runtimeConfig.
No canonical URL or og:url on any page; double branding in titles (titleTemplate + page-level suffix → "Bag - INDOORSHOPPING | INDOORSHOPPING"); useSeoMeta wrapped in if (import.meta.server) on most pages means titles go stale on client-side navigation.
Performance

No caching of any kind — no routeRules, no SWR/ISR, no Nitro cache; every request hits the Firebase function, then the client re-fetches from the external API anyway.
@nuxt/image is installed but never used. Every image is a raw <img> serving full-resolution Supabase Storage originals (app/utils/image.ts:19) with no resizing, no WebP, no width/height (CLS), no fetchpriority on the hero LCP image (HeroSection.vue:15).
Render-blocking Google Fonts @import at app/assets/css/main.css:1 pulling 9 weights of two heavy Bengali families, with no preconnect — while ~950KB of duplicate .ttf copies sit in public/fonts/ for the print pipeline. Fix: self-host subset woff2, drop the @import.
Dead weight shipped to the storefront: Quill is globally registered for every page but used in one admin component (app/plugins/vue-quill.client.ts); @nuxt/content + better-sqlite3 (native module inflating Firebase cold starts) and motion-v are registered but completely unused; jspdf, jspdf-autotable, and lodash are dead dependencies (PDF actually uses an iframe-print pipeline).
Blocking async branding plugin awaits a network call on both server and client before the app is ready (business-branding.ts); product detail has a serial fetch waterfall plus per-accessory fan-out ([slug].vue:52-84).
Conversion UX

Product description is never shown — products/[slug].vue:273 passes :description="product?.name", so the description block renders the product's name. The real description appears only in meta tags.
Currency inconsistency: listing grid shows USD $ via Intl.NumberFormat (useBusinessProductsViewModel.ts:23-28, ProductShowcase.vue:29) while detail/checkout show "TK". Confusing at the exact moment of price discovery.
No product search, no category pages, no filters/sorting, no pagination — the listing dumps a flat 100 products. Discovery collapses as the catalog grows.
No district/upazila capture at checkout — the cascading selectors exist in the codebase but are never rendered; buildShippingAddress() submits empty strings (useOrderViewModel.ts:80-91). This blocks automated Steadfast courier handoff (admin has to do it manually) and increases delivery failure.
No cart review step — the header cart icon jumps straight to checkout (AppHeader.vue:63); items can't be removed at checkout, only decremented (first item pinned to 1).
Medium/low issues (condensed)
No discount/compare-at pricing or stock/urgency display anywhere (major COD-market levers); no reviews/ratings or social proof; no sticky mobile buy bar (relies on a "scroll to order" button); Contact page has only Facebook/WhatsApp links — no phone/email/address; no order lookup by phone for guests; no abandonment recovery (contact details captured only at final submit); confirmation screen omits order number and COD amount; login/signup pages not noindexed; generic/empty image alt text on gallery images; brand-color CSS variables applied client-only → flash of default gold on first paint; SSR brand color flash; leftover console.log of full product payloads in production (stores/businessProducts.ts:16); duplicate phone-normalization logic (880 vs 88 prefixes in two code paths).

Genuine strengths worth keeping: guest COD checkout with no forced signup, localStorage cart persistence, complete client-side pixel funnel (ViewContent → AddToCart → InitiateCheckout → Purchase with value/currency/content_ids), flexible per-product delivery-fee model, real bilingual trust pages, slug-based product URLs, correctly noindexed admin/order pages, and admin code split away from the storefront via dynamic imports.

Prioritized action plan
Phase 1 — Before spending another taka on ads (days):

Make the pixel env-driven (C1) and add router.afterEach PageView tracking.
Fix the checkout quantity/variant reset bug (C3) and the description bug.
Fix the $/TK currency inconsistency.
Add eventID (order ID) to Purchase; fix ViewContent/AddToCart payloads.
Fix OG property= tags and the broken og:image; add a real fallback og-image.jpg.
Create .env.example; set BUSINESS_ID, NUXT_PUBLIC_PIXEL_ID, WHATSAPP_URL, FACEBOOK_URL in each deployment.
Phase 2 — Rendering & measurement foundation (1–2 weeks): 7. Convert home/listing/product-detail to useAsyncData (C2), then add routeRules SWR caching. 8. Add Conversions API via a Nitro endpoint for Purchase with hashed phone (enhanced matching), deduped by the eventID from step 4. 9. Adopt <NuxtImg> with a provider + explicit dimensions; fetchpriority="high" on the hero. 10. Self-host subset woff2 fonts; remove the Google @import. 11. Remove dead weight: @nuxt/content/better-sqlite3, motion-v, jspdf\*, lodash; scope Quill to admin. 12. Templatize all head tags + favicons + PDF branding from the business record (C4); purge URBANEASE.

Phase 3 — SEO & discovery (2–4 weeks): 13. Product + BreadcrumbList JSON-LD; Organization schema; FAQPage on the FAQ. 14. Sitemap module + Sitemap: directive in robots.txt; define siteUrl per deployment. 15. Make product cards real <NuxtLink>s; add canonical/og:url site-wide; fix double-branded titles. 16. Storefront search, category pages, and pagination. 17. Meta catalog feed endpoint per business (unlocks Advantage+ catalog ads).

Phase 4 — Conversion optimization (ongoing): 18. District/upazila capture at checkout → automated courier handoff. 19. Cart drawer/review step with remove controls; sticky mobile buy bar. 20. Discount/compare-at pricing and stock display; reviews; order lookup by phone; richer confirmation (order #, COD amount); floating WhatsApp button + early phone capture for abandonment recovery.

The single highest-leverage sequencing insight: Phases 1–2 are prerequisites for paid ads being measurable at all; Phase 3 unlocks organic and catalog ads; Phase 4 compounds conversion on top. If you'd like, I can start implementing Phase 1 — items 1–6 are all small, well-localized changes.
