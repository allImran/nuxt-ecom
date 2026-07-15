# Handoff: continuing the FINDINGS.md audit fixes

Start here: read `FINDINGS.md` first (the full audit), then this file (what's actually
been done vs. what's left, and the gotchas discovered while doing it).

## Constraint that shapes everything: static hosting

This deploys to **Firebase Hosting serving only `.output/public`** — `firebase.json` has
no `functions`/rewrites entry, so even though `nuxt build` produces a Node server
(`nitro preset: node-server`), that server is never actually deployed or run. In
production there is no live backend process for this app at all — only whatever static
files got built. Concretely this means:
- No Nitro server routes / API routes will ever execute per-request in production
  (they'd only run at build time, if prerendered).
- No Conversions API, no live ISR/SWR — "SSR" fixes must mean **prerendering via
  `nuxt generate`** (fetch at build time, redeploy to refresh), not `useAsyncData` alone.
- Any Phase 2/3 item that assumes a request-time server (CAPI, live catalog feed,
  webhook-triggered rebuilds) needs to be reframed as build-time-only or explicitly
  flagged to the user as needing extra infra beyond this repo.

## What's done (Phase 1, committed on `audit` branch)

Commits `9606f69` and `9a2f8b8`. Scope was explicitly limited to Phase 1 of
FINDINGS.md's action plan (agreed with the user up front) — Phases 2-4 are untouched.

- **C1 — Pixel hardcoded**: fixed, but took two iterations, see "Pixel lesson" below.
  Final state: `nuxt.config.ts` builds the inline `fbq` snippet from
  `process.env.NUXT_PUBLIC_PIXEL_ID` (empty pixelId → script omitted entirely, loud
  `console.error` at build time, never falls back to INDOORSHOPPING's ID).
  `app/plugins/pixel-init.client.ts` adds `router.afterEach` → `fbq('track','PageView')`
  for SPA navigations (the inline snippet only covers the first hard load).
  `usePixel.ts` `trackPurchase` now passes `orderId` as `eventID` for future CAPI dedup.
- **C3 — checkout quantity/variant reset bug**: fixed. Root cause was two independent
  `initializeOrderProducts` calls racing (`checkout.vue` then `Order/Index.vue`'s own
  `onMounted`). Now `Order/Index.vue` is the single initializer; it takes
  `selectedVariants`/`initialQuantities` props, and `checkout.vue` computes them from the
  cart. Also added `variantId` to `CartItem` (previously only a display string was
  stored, so the exact chosen variant couldn't survive into checkout) and fixed cart item
  images always being blank (`product.media` doesn't exist — it's `file_paths`).
- Currency: home/listing grid used `Intl.NumberFormat` USD; rest of the site uses
  `"123 TK"`. Unified on the latter (`ProductShowcase.vue`, `useBusinessProductsViewModel.ts`,
  `useProductDetailViewModel.ts`).
- Product page: `ViewContent` now uses the selected variant's price; `og:image` now
  resolves a real image via `file_paths` (was reading a nonexistent `product.media`
  field) with `/cover.webp` as fallback (no dedicated OG image asset exists yet — worth
  commissioning one).
- Removed the duplicated-name "description" block — **there is no `description` field
  anywhere in the Product schema/API** (checked both `network/public.ts` and
  `network/admin.ts` Product interfaces). If you want a real description shown, that's a
  backend/schema change, not a frontend wiring fix.
- OG tags: `name: 'og:...'` → `property: 'og:...'` (Twitter tags correctly stay `name`).
  Added `siteUrl` to runtime config (`NUXT_PUBLIC_SITE_URL`) so hreflang/canonical URLs
  can resolve once that env var is set per deployment.
- `.env.example` added, documenting `BUSINESS_ID`, `NUXT_PUBLIC_PIXEL_ID`,
  `NUXT_PUBLIC_SITE_URL`, etc.
- Bonus fix (user caught this in review, wasn't in FINDINGS.md): `contact.vue` was
  falling back to env vars `FACEBOOK_URL`/`WHATSAPP_URL` when the business API's own
  `social.facebook`/`social.whatsapp` was empty. Since those env vars' defaults were
  literally INDOORSHOPPING's real links, that's the same brand-leak pattern as C1/C4.
  Removed the env fallback entirely — business API is now the sole source, and the
  contact card just hides itself if the business hasn't configured a link.

## What's done (Phase 2 static-safe subset, this session — UNCOMMITTED)

Agreed scope with the user up front: the static-hosting-safe parts of Phase 2 only
(dead deps, Quill scoping, fonts, hero LCP, C4 brand templatization). CAPI was
explicitly excluded (needs infra outside this repo). **These changes are in the
working tree but NOT yet committed** — review the diff before committing.

- **Dead dependency removal**: removed `@nuxt/content`, `better-sqlite3`, `jspdf`,
  `jspdf-autotable`, `lodash` (+ `@types/lodash`, `@types/jspdf`), `motion-v` from
  `package.json` after grep-confirming zero usage. Dropped `@nuxt/content` and
  `motion-v/nuxt` from `nuxt.config.ts` `modules`, and removed the stale
  `optimizeDeps: { include: ['jspdf', ...] }`. `better-sqlite3`/`lodash` still exist
  in `node_modules` but only as legit transitive deps now (i18n→unstorage→db0, and
  nitro→archiver) — not direct declarations, so not our concern.
- **Quill scoped to admin**: deleted the global `app/plugins/vue-quill.client.ts`.
  `ProductSectionManager.vue` now lazy-loads `QuillEditor` via `defineAsyncComponent`
  inside `<ClientOnly>` (Quill touches `document` at import, hence client-only). It
  no longer ships in every storefront page's bundle.
- **Fonts self-hosted**: dropped the render-blocking cross-origin Google Fonts
  `@import` from `app/assets/css/main.css`; added `@font-face` rules reusing the
  `.ttf` files ALREADY in `public/fonts/` (for the print pipeline) with
  `font-display: swap`, plus a preload of HindSiliguri-Regular in nuxt.config head.
  **NOT woff2-subset** — no `pyftsubset`/`woff2_compress` tooling on this machine.
  True subsetting of the ~950KB Bengali families is still a follow-up.
- **Hero LCP**: `HeroSection.vue` hero `<img>` got `fetchpriority="high"`, explicit
  `width/height`, `decoding="async"`, and `alt=""`/`aria-hidden` (decorative).
- **@nuxt/image / `<NuxtImg>` was deliberately NOT adopted** — on this static
  deployment there is no IPX server, so `/_ipx/...` transform URLs would 404 in prod.
  Real optimization needs either `nuxt generate` + `ipxStatic` (build-time prerender)
  or client-side Supabase Storage transforms (`/render/image/...?width=&format=webp`,
  only if enabled on the Supabase project — UNVERIFIED, backend on :3003 was down).
  Left as a decision point for a future session.
- **C4 brand templatization + URBANEASE purge**:
  - `nuxt.config.ts` head is now env-driven: new `NUXT_PUBLIC_SITE_NAME` (→
    `titleTemplate`, `og:site_name`, `runtimeConfig.public.siteName`) and
    `NUXT_PUBLIC_TWITTER_SITE` (→ `twitter:site`, omitted if unset). Generic when
    unset, never a hardcoded brand. Loud build-time `console.error` if SITE_NAME unset.
  - `app/plugins/business-branding.ts` now drives ALL brand-identity head tags at
    runtime from the business record (title, titleTemplate, og:site_name, description
    from slogan, og:image + twitter:image from logo, and a best-effort favicon
    override), not just `title`.
  - Invoice PDF: `useOrderPdf.ts` now brands from the branding store (name, logo,
    address, socials, email) exactly like `useInstantOrderPdf.ts` already did. Removed
    the hardcoded `COMPANY_DETAILS` (INDOORSHOPPING) and `LOGO_CONFIG`
    (`/urban-ease-logo.png`) from `pdfConfig.ts`; `COMPANY_DETAILS` is now a neutral
    fallback only. Deleted the 992KB `public/urban-ease-logo.png`.
  - Purged every literal `INDOORSHOPPING` string: `AppFooter.vue` (also fixed the
    `URBAN<span>EASE` fallback that rendered a literal `<span>` as text), the static
    page SEO blocks (shipping/faq/privacy/checkout/login/signup/about), the reactive
    ones (index/contact/products/index/products/[slug]/orders/[id]), and the about
    philosophy copy in `i18n/locales/en.json`. Titles now drop the ` | INDOORSHOPPING`
    suffix and let the global `titleTemplate` + `og:site_name` brand them (this also
    fixes the double-branding the audit flagged). URBANEASE is fully gone.

### Verification of this session

`npm run build` → exit 0. `npx nuxi typecheck` → 73 errors, IDENTICAL to the
pre-session baseline (all pre-existing, in admin/stores/business pages); zero new
errors in any touched file. NOT runtime-verified against live data — backend on
:3003 was down, so PDF branding / favicon override / plugin head tags are
build-clean and code-correct but not exercised against a real business record.

### Favicon caveat

The per-business favicon is a runtime override to the business logo URL — best-effort.
Ideally real `.ico`/`.png` favicon sizes are generated per business at build time; the
runtime override at least stops shipping the wrong brand's static favicons.

### Pixel lesson (read before touching tracking code again)

First attempt registered the `nuxt-meta-pixel` npm module (already an unused dependency
per finding C1) instead of hand-rolling. It was architecturally correct — config wiring,
build verified clean — but **Meta Pixel Helper reported "no pixels found"** even though
no console errors occurred and the SDK script loaded. Confirmed via A/B against the `dev`
branch (which still has the old hardcoded inline snippet and *does* get detected) that the
difference is timing: a Nuxt client plugin fires only after the full Vue app hydrates,
which is measurably too late for Pixel Helper's detection to catch reliably. **Verdict:
for anything Pixel-Helper/tag-manager-adjacent, an inline synchronous `<head>` script
beats a client plugin, even though the plugin approach is "cleaner."** `nuxt-meta-pixel`
was uninstalled again. If you reach for a tag-management module in the future, verify
with the actual browser extension before considering it done — a clean build and no
console errors are not sufficient evidence.

## What's done (Phase 3 SEO subset, this session — UNCOMMITTED)

Agreed scope with the user: the static-safe Phase 3 SEO items. Backend base URL
changed to `https://urbanease-backend-x60m.onrender.com/api` (now reachable — earlier
sessions had :3003 down), so this session IS runtime-verified against live data.
**Changes are in the working tree, NOT committed** — review the diff before committing.

- **Product cards are now real `<NuxtLink>`s** (`ProductShowcase.vue`): the grid item
  is a `<NuxtLink :to="/products/{slug}">` wrapping the card instead of a `@click`
  handler → `emit('viewProduct')` → parent `navigateTo`. Crawlable `<a href>`, and the
  prerequisite the audit flagged for `nuxt generate` crawler discovery (C2). The
  `viewProduct` emit is left declared (harmless) but no longer fired; parents' click
  nav path is gone, so no double-navigation.
- **Structured data (JSON-LD)** via a new reactive helper `app/composables/useJsonLd.ts`
  (injects an `application/ld+json` script through `useHead`, escapes `<`, emits an inert
  empty tag until data loads):
  - **Organization** — in `layouts/default.vue`, driven by the branding store (name, url,
    logo, `sameAs` socials). Renders server-side on every public page (branding plugin
    awaits its fetch on the server). Verified in SSR HTML.
  - **Product + AggregateOffer/Offer** and **BreadcrumbList** — on `products/[slug].vue`.
    Populate client-side only (product data is still `onMounted`-fetched — the C2
    limitation), so SSR shows well-formed *empty* `ld+json` placeholders that fill in
    after hydration. Once C2 lands (useAsyncData + `nuxt generate`) the SAME code emits
    them at build time with no changes.
  - **FAQPage** — on `faq.vue` from the (static) localized Q&A. Fully server-rendered
    (verified, Bengali text intact).
- **Canonical + `og:url` + fixed hreflang** (`components/seo/I18nMetaTags.vue`, global via
  default layout). New `app/composables/useSiteUrl.ts` resolves the origin and, crucially,
  treats an unset var OR the old `https://yourdomain.com` placeholder as "no origin" and
  then **emits none of these URL-bearing tags** rather than pointing crawlers at a bogus
  domain (the audit's hreflang bug). `nuxt.config.ts` `siteUrl` fallback changed from the
  placeholder to `''`.
- **Double-branded / stale titles fixed** on the primary pages (`index.vue`,
  `products/index.vue`, `faq.vue`): removed the `if (import.meta.server)` guards (titles
  were going stale on client-side nav) and dropped the business name from the page-level
  `title` (the global `titleTemplate` + branding plugin already append ` | <business>`).
  Verified: `Premium Luxury Products | Indoor Shopping`, `Products | Indoor Shopping`,
  `FAQ | Indoor Shopping` — single brand. **NOTE:** the low-traffic trust pages
  (`shipping/privacy/contact/about/login/signup/checkout`) still have the
  `import.meta.server` guard — left as a mechanical follow-up (their titles are plain, so
  no double-brand, only the minor stale-on-client-nav issue).
- **Sitemap + robots as build-time prerendered Nitro routes** (`server/routes/sitemap.xml.ts`,
  `server/routes/robots.txt.ts`, added to `nitro.prerender.routes` in nuxt.config; deleted
  the static `public/robots.txt`). Rationale: this deploy is `nuxt build` + serve
  `.output/public` with NO runtime server, so a *dynamic* `/sitemap.xml` route would 404
  in prod — forcing prerender writes real static files into `.output/public`. The sitemap
  fetches product slugs from the API **at build time** (15s timeout, fails soft to
  static-routes-only if the backend is cold/down — never breaks the build); redeploy to
  refresh. robots.txt carries the `Sitemap:` directive + disallows admin/business/checkout/
  orders/login/signup. Chose hand-rolled routes over `@nuxtjs/sitemap` to avoid a new dep
  and the module's prerender-forcing quirks on this non-standard build+static-serve setup.

### ⚠️ Deployment prerequisite (blocks canonical/sitemap value)

`NUXT_PUBLIC_SITE_URL` gates canonical/og:url/hreflang, the sitemap `<loc>`s, the
robots `Sitemap:` directive, and the catalog feed `link`s — when unset all of those are
**omitted/empty by design** (better than wrong URLs). It is **now set in `.env` to
`https://indoorshopping.web.app`** (the user added it), so the current build produces
fully-populated output. Each new business deployment must set its own real origin.
`NUXT_PUBLIC_SITE_NAME` is still unset (build logs a warning) — set it per deployment for
correct first-paint/no-JS/crawler branding before the business record loads client-side.

### Verification of this session

`npx nuxi typecheck` → 73 errors, IDENTICAL to baseline, zero in any touched file.
`npm run build` (with a temp `NUXT_PUBLIC_SITE_URL`) → exit 0; `.output/public/sitemap.xml`
generated with 7 static + **3 real live products** (filter-cartridge, faucet-filter,
underarm-sweatpad, with `lastmod`), `.output/public/robots.txt` with the Sitemap directive.
Ran the built server and curl-verified SSR head: canonical/og:url/hreflang absolute URLs,
Organization + FAQPage JSON-LD server-rendered, single-brand titles. **Not browser-verified**
(no headless browser on this machine): the `<NuxtLink>` anchor rendering and the client-side
population of Product/Breadcrumb JSON-LD — both build-clean and logically sound, SSR emits
well-formed empty placeholders, but not exercised in a real browser/Rich Results Test.

## What's done (Phase 3 discovery + catalog, this session — check commit state)

Second batch of Phase 3, on top of the SEO subset above. Runtime-verified against the
live onrender backend (typecheck 73/baseline, build exit 0, SSR curl-checked).

- **Storefront search / category filter / sort / pagination** (FINDINGS item 16) — the
  `/products` listing was a flat dump of up to 100 products; now:
  - New [ProductFilterBar.vue](app/components/product/ProductFilterBar.vue): search box,
    category dropdown (categories **derived client-side** from the loaded products — there
    is no public categories endpoint, but the list payload DOES include each product's
    `category` object), sort dropdown, result count, clear-filters.
  - New [ProductPagination.vue](app/components/product/ProductPagination.vue): compact
    windowed pager rendered as real `<NuxtLink>`s (crawlable, preserves active filters in
    the query), 12/page.
  - [products/index.vue](app/pages/products/index.vue) rewired: filter/sort/page state is
    **URL-query-backed** (`?q=&category=&sort=&page=`) so views are shareable/bookmarkable;
    search is debounced (300ms, `router.replace` to avoid history spam); page resets to 1
    on filter change; canonical stays `/products` (I18nMetaTags strips the query) so
    filtered views don't create duplicate-content URLs; page title/H1 reflect the active
    category ("Home & Kitchen | Indoor Shopping").
  - [ProductShowcase.vue](app/components/home/ProductShowcase.vue) got `showHeader` /
    `showViewAll` props (default true → home unchanged) so the listing hides the "Featured
    Products" header + "View All" button and owns its own chrome.
- **⚠️ Data-layer gotcha (important):** the public **list** endpoint
  `/products/business/{id}` returns products **WITHOUT `variants`** (so NO prices);
  `?include=variants` doesn't help. Only the **detail** endpoint `/products/slug/{slug}`
  returns variants. Consequences:
  - The storefront grid (home AND listing) **cannot show prices** from the list call —
    cards fall back to "Contact for pricing". This is **pre-existing**, not introduced
    here, but it's a real conversion gap. Fixing it needs either a backend change (include
    variants/min-price in the list payload) or per-product detail hydration.
  - Sort therefore offers **Featured / Newest / Name A–Z / Name Z–A** (fields the list
    payload has) — **no price sort** (would silently no-op).
- **Meta catalog feed** (FINDINGS item 17) — new build-time prerendered route
  [catalog.csv.ts](server/routes/catalog.csv.ts) (added to `nitro.prerender.routes`),
  same static-safe pattern as the sitemap. CSV with Meta's required columns; `id` = the
  product UUID (same value the pixel sends as `content_ids`, so catalog/Advantage+ ads can
  match pixel events). Because the list endpoint lacks prices, the route **fetches each
  product's detail** (batched, concurrency 6, per-item soft-fail) to get the lowest variant
  price. `description` reuses the title (no description field in the schema). Verified:
  `.output/public/catalog.csv` generated with all 3 live products, correct prices
  (240/1100/99 BDT), absolute links + Supabase image links, brand "Indoor Shopping".
  Point a Meta catalog scheduled feed at `<site>/catalog.csv`; redeploy to refresh.
- **Bonus:** removed the production `console.log('Fetched products', …)` full-payload dump
  in `stores/businessProducts.ts` (audit medium issue).

### Phase 3 items still remaining

- **True SEO category *landing pages*** (own crawlable URL + SSR content per category)
  need C2 (useAsyncData + `nuxt generate`) + real routing; what shipped is client-side
  category *filtering* on `/products` with shareable query URLs.
- **Product/Breadcrumb JSON-LD + shareable product social previews only truly work once
  C2 is done** — currently client-rendered (Google's rendering crawler sees them; FB/WhatsApp
  scrapers don't). Verify with the Rich Results Test after C2.
- Storefront grid **price display** — blocked on the list-endpoint-has-no-variants issue
  above (backend change or detail hydration).
- **Not browser-verified** this session (no headless browser): actual client-side
  filtering/pagination behavior and client-population of product JSON-LD. Components render
  correctly in SSR and logic is typecheck-clean, but drive it in a real browser before
  calling it done.
- Submit the sitemap + run structured data through Google Search Console / Rich Results Test
  now that `NUXT_PUBLIC_SITE_URL` is live.

## What's done (C2 — rendering foundation: useAsyncData + nuxt generate, this session — UNCOMMITTED)

Agreed scope with the user up front: **C2 only** (Phase 2 item 7 — the keystone). This is
the deployment-model change the earlier handoff kept flagging as a prerequisite. Changes
are in the working tree, **NOT committed** — review the diff before committing. Verified
against the live onrender backend; `nuxt generate` exit 0, typecheck 73/baseline.

- **Home / listing / product-detail now fetch at setup via `useAsyncData`** (was
  `onMounted`, which never runs on the server → empty SSR shell). The three pages are
  now prerendered with **real content** — verified in the generated HTML:
  - `products/<slug>/index.html` carries the real `<title>`, `og:title`, `og:image`
    (real Supabase URL), canonical + `og:url`, the `<h1>`, and **fully-populated
    Product + AggregateOffer JSON-LD** (price 1100 etc.) — no skeletons. This is the
    fix for the "Product - INDOORSHOPPING + broken image" social-share bug: FB/WhatsApp
    scrapers (which don't run JS) now see real previews.
  - Home + listing render crawlable product `<NuxtLink>`s in the served HTML, so the
    `nuxt generate` crawler discovers every product page (all 3 live products
    prerendered as `/products/<slug>/`).
- **⚠️ Pinia is NOT serialized into the payload** on this setup (confirmed: the extracted
  `_payload.json` contained only the useAsyncData keys, no store state). So relying on
  the store to survive SSR→client hydration silently blanks the grid on hydration. The
  fix carries the data through **useAsyncData's return value** (the canonical Nuxt
  mechanism, always serialized):
  - Home (`pages/index.vue`) and listing (`pages/products/index.vue`) read `data`
    directly (`publicNetwork.fetchProductsByBusiness`), not the store. Listing's
    filter/sort/paginate computeds now hang off a `products` computed over `data`.
  - Product detail (`pages/products/[slug].vue`) keeps the productDetail store (for its
    rich getters: price/media/variant selection) but the handler **returns the product**
    and a `watchEffect` mirrors it back into the store via a new
    `productDetail.setProduct()` action — runs synchronously at setup so client
    hydration matches SSR (no mismatch). Accessories ride in the same `data`.
- **SSR-context gotchas fixed** (both would 500 the product-page prerender):
  - `getPublicImage` calls `useRuntimeConfig()` at call-time; it was invoked lazily from
    the `og:image` / JSON-LD head getters that unhead resolves *after* setup (outside the
    Nuxt instance). `useProductDetailViewModel` now captures `supabaseUrl` once at setup
    and `getImageUrl` builds the URL from that closure — no composable call at head-resolve
    time.
  - The accessory fetch ran *after* `await loadProduct`, and Nuxt loses the instance
    context after the first await inside a `useAsyncData` handler → `useRuntimeConfig()`
    in the network layer threw "instance unavailable". Fixed by starting the accessory
    fetch **before** awaiting the product (both network calls resolve their baseURL
    synchronously while context is still alive). NB: the network layer calling
    `useRuntimeConfig()` per-request is the underlying fragility — worth resolving baseURL
    once if this bites again.
- **Deploy model → `nuxt generate`** (`nuxt.config.ts` nitro.prerender): `crawlLinks: true`
  (follow product/pagination links), `failOnError: false` (a cold/slow backend can't abort
  the whole deploy over one route — same fail-soft stance as the sitemap), page routes
  `/` + `/products` added to the seed list, and `ignore: ['/admin','/business','/orders']`
  so the heavy admin bundle can't get pulled into the crawl. **Deploy with `npm run
  generate`, not `npm run build`.**
- **Firebase SPA fallback** (`firebase.json`): added `trailingSlash: false` + a `**` →
  `/200.html` rewrite. Prerendered pages are static files and are served directly ahead of
  the rewrite (crawlers still get real HTML); only routes with no prerendered file —
  `/orders/<id>`, checkout deep-links, admin/business, and products added after the last
  build — fall through to the client-rendered shell. This also fixes the pre-existing
  latent bug where a deep-link refresh would hit Firebase's own 404 (nothing was
  prerendered before, and the firebase function isn't deployed).

### Verification of this session

`npm run generate` → exit 0, 33 routes prerendered. `npx nuxi typecheck` → 73 errors,
IDENTICAL to baseline (the 2 now shown in `productDetail.ts` are pre-existing —
`autoSelectFirstVariant` / `extractYouTubeId` — line-shifted by the new `setProduct`).
Served `.output/public` statically and curl-verified: clean product URLs resolve to the
prerendered files with real `<title>`; `_payload.json` now contains the product data
(home 10KB w/ all slugs, detail w/ name+price) so hydration is consistent. **NOT
browser-verified** (no headless browser on this machine): live client hydration, the
`watchEffect` store-mirror on hard load, and client-side product→product navigation are
build-clean and logically sound but not exercised in a real browser. Also **not
Firebase-runtime-verified** — the `trailingSlash:false` + rewrite routing is a reasoned
standard config, confirmed only against a local static server (directory-index serving
matches), not a real Firebase deploy. Deploy to a preview channel and confirm: (a) a clean
product URL returns prerendered HTML (not the 200.html shell), (b) `/orders/<id>` refresh
loads the app.

### C2 unblocks (now newly viable, still TODO)

- **Product/Breadcrumb JSON-LD + product social previews** — the code was already there
  (Phase 3 session) emitting empty placeholders client-side; **it now renders server-side
  with real data**. Run the live URLs through the Rich Results Test / FB Sharing Debugger
  once deployed to confirm.
- **Image optimization** — `nuxt generate` is now in place, so `@nuxt/image` + `ipxStatic`
  (build-time image transforms baked into `.output/public`) is finally viable on this
  static deploy. Still TODO.
- **True per-category SEO landing pages** — still need their own crawlable routes; C2
  (the SSR half) is no longer the blocker, only the routing/pages remain.

## What's left (Phases 2-4, unstarted)

Straight from FINDINGS.md, adapted for the static-hosting constraint above:

**Phase 2** — rendering & measurement foundation:
- ~~Convert home/listing/product-detail to `useAsyncData` + `nuxt generate`~~ **DONE this
  session (C2)** — see "What's done (C2 …)" above. Deploy with `npm run generate`.
- CAPI (Conversions API): **not achievable purely in this repo** on static hosting — flag
  to the user that it needs a separate serverless function (Cloudflare Worker, small
  Vercel/Netlify function, etc.) if they want it; don't build a Nitro server route
  expecting it to run per-request.
- Dead dependency removal, Quill scoping, font self-hosting, hero LCP, and C4 brand
  templating are **DONE this session** (see "What's done (Phase 2 static-safe subset)"
  above). Still remaining under Phase 2:
  - **Full image optimization** — `<NuxtImg>`/IPX doesn't work on static hosting (see
    that section); needs `nuxt generate` + `ipxStatic` or Supabase transforms. Only the
    hero LCP got attributes so far; product/gallery images still serve raw
    full-resolution Supabase originals with no resizing/WebP/dimensions.
  - **woff2 font subsetting** — fonts are self-hosted but still full `.ttf`; subset to
    woff2 once `pyftsubset`/`woff2_compress` tooling is available.
  - **Real per-business favicons** at build time (current fix is a runtime override).

**Phase 3** — SEO & discovery: structured data, sitemap, canonical/`og:url`, crawlable
product links, storefront **search/category-filter/sort/pagination**, and the **Meta
catalog feed** are all **DONE** (see the two "What's done (Phase 3 …)" sections above).
Remaining: true per-category SEO *landing pages* and shareable product social previews are
gated on C2 (`useAsyncData` + `nuxt generate`); storefront price display is gated on the
list-endpoint-lacks-variants backend issue.

**Phase 4** — conversion optimization: district/upazila capture at checkout (the
cascading selectors exist in the codebase already per the audit — just never rendered),
cart drawer/review step, discount/stock display, reviews, order lookup, richer
confirmation screen, abandonment recovery.

## How to start

1. Confirm branch is `audit` and pull latest.
2. Re-read FINDINGS.md, then this file.
3. **Scope the session with the user first** — Phase 2/3/4 are each multi-day efforts on
   their own; don't assume "fix everything" is wanted in one sitting. The pattern that
   worked well here: use `AskUserQuestion` to pick a phase/subset before touching code,
   and call out any static-hosting-driven reframing (like C2/CAPI above) *before* writing
   code so the user can weigh in on the trade-off, not after.
4. For anything touching Facebook Pixel / analytics: verify with the actual Pixel Helper
   extension (or equivalent), not just a clean build — see "Pixel lesson" above.
5. Verification commands used throughout: `npm run build` (must complete with no errors)
   and `npx nuxi typecheck` (compare error count/lines before-and-after your change,
   since this codebase already has a number of pre-existing, unrelated type errors —
   don't mistake those for something you introduced).
6. No backend is guaranteed to be running locally — check `lsof -iTCP -sTCP:LISTEN` for
   port 3003 (the API base URL in `.env`) before assuming you can click-test live data
   end-to-end; if it's not up, say so explicitly rather than claiming a UI test passed.
