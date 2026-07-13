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
      // Only registers a pixel when the deployment actually configured one —
      // an unset var must never fall back to another business's pixel ID.
      metapixel: pixelId ? { default: { id: pixelId } } : {},
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
  modules: ['@nuxt/image', '@nuxt/content', 'motion-v/nuxt', '@pinia/nuxt', '@nuxtjs/i18n', 'nuxt-meta-pixel'],

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