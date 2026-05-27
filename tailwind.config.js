export default {
  darkMode: 'selector',

  content: [
    './app/app.vue',
    './app/**/*.{vue,js,ts,jsx,tsx}',
    './components/**/*.{vue,js,ts,jsx,tsx}',
    './layouts/**/*.{vue,js,ts,jsx,tsx}',
    './pages/**/*.{vue,js,ts,jsx,tsx}',
    './plugins/**/*.{js,ts}',
    './nuxt.config.{js,ts}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          'Hind Siliguri',
          'Noto Sans Bengali',
          'Arial',
          'sans-serif'
        ]
      },
      keyframes: {
        shimmer: {
          '100%': {
            transform: 'translateX(100%)'
          }
        }
      },
      animation: {
        shimmer: 'shimmer 1.5s infinite'
      }
    }
  },
  plugins: [],
}
