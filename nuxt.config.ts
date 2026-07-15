// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

const pixelId = process.env.NUXT_PUBLIC_PIXEL_ID
if (!pixelId) {
  // Loud, build-time warning: without this, the pixel silently stays disabled
  // rather than falling back to another business's ad account.
  console.error('[nuxt-meta-pixel] NUXT_PUBLIC_PIXEL_ID is not set for this deployment — Facebook Pixel will NOT be initialized.')
}

// Per-business identity for the static head tags. Kept generic when unset (never
// a hardcoded brand) — the branding plugin overrides these at runtime once the
// business record loads. Set NUXT_PUBLIC_SITE_NAME per deployment for correct
// first-paint / no-JS / crawler branding.
const siteName = process.env.NUXT_PUBLIC_SITE_NAME
const twitterSite = process.env.NUXT_PUBLIC_TWITTER_SITE
if (!siteName) {
  console.error('[branding] NUXT_PUBLIC_SITE_NAME is not set for this deployment — page titles and og:site_name will be generic until branding loads client-side.')
}

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',

  app: {
    head: {
      titleTemplate: siteName ? `%s | ${siteName}` : '%s',
      title: siteName || '',
      htmlAttrs: {
        lang: 'bn'
      },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Experience the finest selection of curated products. Quality meets elegance in every piece we offer.' },
        { property: 'og:type', content: 'website' },
        ...(siteName ? [{ property: 'og:site_name', content: siteName }] : []),
        { property: 'og:image', content: '/cover.webp' },
        { name: 'twitter:card', content: 'summary_large_image' },
        ...(twitterSite ? [{ name: 'twitter:site', content: twitterSite }] : []),
        { name: 'twitter:image', content: '/cover.webp' },
      ],
      // Inline + synchronous, matching the original snippet's proven timing (runs before
      // the Vue/Nuxt bundle even downloads) — a client plugin fires too late for Pixel
      // Helper to reliably detect. Only emitted when a pixel ID is actually configured.
      script: pixelId ? [
        {
          innerHTML: `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window, document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init', '${pixelId}');fbq('track', 'PageView');`,
          type: 'text/javascript',
          tagPosition: 'head',
        }
      ] : [],
      noscript: pixelId ? [
        {
          innerHTML: `<img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1" />`,
          tagPosition: 'head',
        }
      ] : [],
      link: [
        // Preload the primary body font (Hind Siliguri Regular) — it is used for
        // essentially all on-screen text, so preloading it shortens the swap window.
        { rel: 'preload', as: 'font', type: 'font/ttf', href: '/fonts/HindSiliguri-Regular.ttf', crossorigin: '' },
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' },
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
        { rel: 'icon', type: 'image/png', sizes: '192x192', href: '/android-chrome-192x192.png' },
        { rel: 'icon', type: 'image/png', sizes: '512x512', href: '/android-chrome-512x512.png' },
      ]
    }
  },

  runtimeConfig: {
    public: {
      supabaseUrl: process.env.SUPABASE_URL,
      supabasePublishableKey: process.env.SUPABASE_PUBLISHABLE_KEY,
      apiBaseURL: process.env.API_BASE_URL,
      businessId: process.env.BUSINESS_ID || '6cadb262-2726-4a19-8a3e-90ef1b98aba3',
      // Empty until set per deployment. Canonical/og:url/hreflang/sitemap URLs
      // are omitted while empty rather than pointing at a placeholder domain.
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || '',
      siteName: siteName || undefined,
      // Only exposed when actually configured — an unset var must never let the
      // client fall back to firing events under another business's pixel ID.
      pixelId: pixelId || undefined,
    },
  },
  devtools: { enabled: true },
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
  css: ['./app/assets/css/main.css'],
  modules: ['@nuxt/image', '@pinia/nuxt', '@nuxtjs/i18n'],

  i18n: {
    locales: [
      {
        code: 'bn',
        iso: 'bn-BD',
        name: 'বাংলা',
        file: 'bn.json'
      },
      {
        code: 'en',
        iso: 'en-US',
        name: 'English',
        file: 'en.json'
      }
    ],
    defaultLocale: 'bn',
    strategy: 'no_prefix',
    langDir: 'locales/',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_locale',
      alwaysRedirect: false,
      fallbackLocale: 'bn'
    },
    vueI18n: './app/i18n.config.ts'
  },
  nitro: {
    firebase: {
      gen: 2
    },
    // This deployment serves only .output/public with no runtime server, so the
    // whole storefront is prerendered to static HTML at build time (C2). Deploy
    // with `npm run generate` (nuxt generate): it prerenders `/` and `/products`,
    // then `crawlLinks` follows the product <NuxtLink>s (and pagination links) to
    // discover and prerender every /products/<slug> page. The data-bearing routes
    // (sitemap/robots/catalog) fetch from the API at build time and fail soft.
    //   - failOnError: false keeps a cold/slow backend from aborting the whole
    //     deploy over a single route (same fail-soft stance as the sitemap route);
    //     a partial static site is better than a failed deploy. Redeploy to refresh.
    //   - Admin/business/order routes are never linked from public pages, but are
    //     ignored explicitly so a stray link can't pull the heavy admin bundle into
    //     the prerender crawl. They render client-side via the SPA fallback.
    prerender: {
      crawlLinks: true,
      failOnError: false,
      routes: ['/', '/products', '/sitemap.xml', '/robots.txt', '/catalog.csv'],
      ignore: ['/admin', '/business', '/orders'],
    },
  }
})