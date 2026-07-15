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

## What's left (Phases 2-4, unstarted)

Straight from FINDINGS.md, adapted for the static-hosting constraint above:

**Phase 2** — rendering & measurement foundation:
- Convert home/listing/product-detail to `useAsyncData`, but the deploy story must be
  `nuxt generate` (prerender at build time) rather than relying on request-time SSR.
  Fixing "product cards aren't links" (`ProductShowcase.vue` uses a click handler, not
  `<NuxtLink>`) is a prerequisite — the Nitro crawler during `nuxt generate` only
  discovers pages via real `<a href>`, so that SEO fix and this rendering fix are coupled.
- CAPI (Conversions API): **not achievable purely in this repo** on static hosting — flag
  to the user that it needs a separate serverless function (Cloudflare Worker, small
  Vercel/Netlify function, etc.) if they want it; don't build a Nitro server route
  expecting it to run per-request.
- Image/font optimization, dead dependency removal (`@nuxt/content` + `better-sqlite3`,
  `motion-v`, `jspdf*`, `lodash` — confirm still unused before deleting), brand
  templating (C4 — this INDOORSHOPPING hardcoding is still present in ~20 files per the
  original audit; Phase 1 did NOT touch this).

**Phase 3** — SEO & discovery: structured data, sitemap (can be a static file generated
at `nuxt generate` time — compatible with static hosting), canonical/`og:url`, storefront
search/category/pagination, Meta catalog feed (also fine as a static-generated file, not
a live endpoint).

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
