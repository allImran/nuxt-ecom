// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  runtimeConfig: {
    public: {
      supabaseUrl: process.env.SUPABASE_URL,
      supabasePublishableKey: process.env.SUPABASE_PUBLISHABLE_KEY,
      apiBaseURL: process.env.API_BASE_URL,
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
    lazy: true,
    langDir: 'locales/',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_locale',
      cookieMaxAge: 365 * 24 * 60 * 60,
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