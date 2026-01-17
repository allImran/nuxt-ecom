/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'selector',
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        luxury: {
          /* Brand / Identity */
          charcoal: '#2C2C2C',

          /* Light Mode */
          bg: '#FFFFFF',
          surface: '#FFFFFF',
          text: '#2C2C2C',
          textMuted: 'rgba(44,44,44,0.7)',
          border: 'rgba(44,44,44,0.1)',

          /* Dark Mode */
          darkBg: '#121212',
          darkSurface: '#1A1A1A',
          darkText: '#F5F5F5',
          darkTextMuted: '#B3B3B3',
          darkBorder: '#2A2A2A',

          /* Accent */
          gold: '#AF8F6F',
          goldHover: '#C6A57E',
          goldMuted: '#8A7A68',
        },
      },

      borderRadius: {
        luxury: '1.5rem', // 24px – editorial feel
      },

      boxShadow: {
        luxury: '0 10px 30px rgba(0,0,0,0.08)',
        luxuryDark: '0 10px 30px rgba(0,0,0,0.4)',
      },

      letterSpacing: {
        luxury: '0.18em',
      },
    },
  },
  plugins: [],
}
