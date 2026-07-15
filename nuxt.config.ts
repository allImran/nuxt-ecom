// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

const pixelId = process.env.NUXT_PUBLIC_PIXEL_ID
if (!pixelId) {
  // Loud, build-time warning: without this, the pixel silently stays disabled
  // rather than falling back to another business's ad account.
  console.error('[nuxt-meta-pixel] NUXT_PUBLIC_PIXEL_ID is not set for this deployment — Facebook Pixel will NOT be initialized.')
}

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',

  app: {
    head: {
      titleTemplate: '%s | INDOORSHOPPING',
      title: 'INDOORSHOPPING',
      htmlAttrs: {
        lang: 'bn'
      },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Experience the finest selection of curated products. Quality meets elegance in every piece we offer.' },
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: 'INDOORSHOPPING' },
        { property: 'og:image', content: '/cover.webp' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:site', content: '@theINDOORSHOPPING' },
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
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'https://yourdomain.com',
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
    optimizeDeps: {
      include: ['jspdf', 'jspdf-autotable']
    }
  },
  css: ['./app/assets/css/main.css'],
  modules: ['@nuxt/image', '@nuxt/content', 'motion-v/nuxt', '@pinia/nuxt', '@nuxtjs/i18n'],

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
    }
  }
})