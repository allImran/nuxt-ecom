import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { getPublicImage } from '~/utils/image'

export interface BusinessBranding {
  id: string
  name: string
  slug: string
  logo?: string
  slogan?: string
  primary_color?: string
  email?: string
  social?: {
    facebook?: string
    whatsapp?: string
    youtube?: string
    instagram?: string
    twitter?: string
    linkedin?: string
  }
  address?: string
  is_active?: boolean
}

export const useBusinessBrandingStore = defineStore('businessBranding', () => {
  const business = ref<BusinessBranding | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Get public URL for logo using getPublicImage utility
  const logoUrl = computed(() => {
    if (!business.value?.logo) return null
    // Use 'product-images' bucket for business logos (consistent with file upload system)
    return getPublicImage('product-images', business.value.logo)
  })

  // Get primary color or fallback to default
  const primaryColor = computed(() => {
    return business.value?.primary_color || '#af8f6f'
  })

  // Update CSS variables with brand colors
  const updateCSSVariables = () => {
    if (process.client && business.value?.primary_color) {
      const root = document.documentElement
      const color = business.value.primary_color

      // Update luxury-gold color variables
      root.style.setProperty('--color-luxury-gold', color)

      // Generate a slightly lighter hover color
      root.style.setProperty('--color-luxury-gold-hover', adjustColorBrightness(color, 20))

      // Generate a slightly darker muted color
      root.style.setProperty('--color-luxury-gold-muted', adjustColorBrightness(color, -20))
    }
  }

  // Helper function to adjust color brightness
  const adjustColorBrightness = (hex: string, percent: number): string => {
    const num = parseInt(hex.replace('#', ''), 16)
    const amt = Math.round(2.55 * percent)
    const R = (num >> 16) + amt
    const G = (num >> 8 & 0x00FF) + amt
    const B = (num & 0x0000FF) + amt
    return '#' + (
      0x1000000 +
      (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
      (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
      (B < 255 ? B < 1 ? 0 : B : 255)
    ).toString(16).slice(1)
  }

  // Set business data and update CSS
  const setBusiness = (data: BusinessBranding) => {
    business.value = data
    error.value = null
    updateCSSVariables()
  }

  // Clear business data
  const clearBusiness = () => {
    business.value = null
    error.value = null
  }

  // Set loading state
  const setLoading = (loading: boolean) => {
    isLoading.value = loading
  }

  // Set error
  const setError = (err: string | null) => {
    error.value = err
  }

  return {
    business,
    isLoading,
    error,
    logoUrl,
    primaryColor,
    setBusiness,
    clearBusiness,
    setLoading,
    setError,
    updateCSSVariables
  }
})
