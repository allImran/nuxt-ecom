// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',

  app: {
    head: {
      title: 'Business',
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
      facebookUrl: process.env.FACEBOOK_URL || 'https://www.facebook.com/theurbanease',
      whatsappUrl: process.env.WHATSAPP_URL || 'https://wa.me/8801521203588',
      businessId: process.env.BUSINESS_ID || '6cadb262-2726-4a19-8a3e-90ef1b98aba3',
      pixelId: process.env.NUXT_PUBLIC_PIXEL_ID,
    },
  },
  devtools: { enabled: true },
  vite: {
    plugins: [
      tailwindcss(),
    ],
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
    seo: false,
    vueI18n: './app/i18n.config.ts'
  },
  nitro: {
    firebase: {
      gen: 2
    }
  }
})