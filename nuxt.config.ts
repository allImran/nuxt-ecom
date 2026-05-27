// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

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
        { name: 'og:type', content: 'website' },
        { name: 'og:site_name', content: 'INDOORSHOPPING' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:site', content: '@theINDOORSHOPPING' },
      ],
      script: [
        {
          innerHTML: '!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version=\'2.0\';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window, document,\'script\',\'https://connect.facebook.net/en_US/fbevents.js\');fbq(\'init\', \'1469591844791219\');fbq(\'track\', \'PageView\');',
          type: 'text/javascript',
          tagPosition: 'head',
        }
      ],
      noscript: [
        {
          innerHTML: '<img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=1469591844791219&ev=PageView&noscript=1" />',
          tagPosition: 'head',
        }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' },
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-icon-180x180.png' },
        { rel: 'icon', type: 'image/png', sizes: '192x192', href: '/android-chrome-192x192.png' },
        // { rel: 'icon', type: 'image/png', sizes: '512x512', href: '/android-chrome-512x512.png' },
      ]
    }
  },

  runtimeConfig: {
    public: {
      supabaseUrl: process.env.SUPABASE_URL,
      supabasePublishableKey: process.env.SUPABASE_PUBLISHABLE_KEY,
      apiBaseURL: process.env.API_BASE_URL,
      facebookUrl: process.env.FACEBOOK_URL || 'https://www.facebook.com/theINDOORSHOPPING',
      whatsappUrl: process.env.WHATSAPP_URL || 'https://wa.me/8801521203588',
      businessId: process.env.BUSINESS_ID || '71beba50-acf2-41b1-9f9b-d58e3166c16d',
      pixelId: process.env.NUXT_PUBLIC_PIXEL_ID,
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