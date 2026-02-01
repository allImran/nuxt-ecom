// Order state management using Pinia Setup Store pattern
// Manages order products, shipping address, and submission state

import type { Product } from '~/network/public'
import type { OrderProduct } from '~/types/order'
import { districts, upazilas, filterLocationsByParent } from '~/utils/location'

export const useOrderStore = defineStore('order', () => {
  // State
  const orderProducts = ref<OrderProduct[]>([])
  const products = ref<Product[]>([])

  // Address fields
  const selectedDivision = ref<string | null>(null)
  const selectedDistrict = ref<string | null>(null)
  const selectedUpazila = ref<string | null>(null)
  const fullAddress = ref('')
  const mobileNumber = ref('')

  // UI state
  const loading = ref(false)
  const error = ref<string | null>(null)
  const success = ref(false)

  // Constants
  const DELIVERY_FEE = 100

  // Computed - Available locations for cascading dropdowns
  const availableDistricts = computed(() => {
    if (!selectedDivision.value) return []
    return filterLocationsByParent(districts, selectedDivision.value, 'division_id')
  })

  const availableUpazilas = computed(() => {
    if (!selectedDistrict.value) return []
    return filterLocationsByParent(upazilas, selectedDistrict.value, 'district_id')
  })

  // Computed - Products ready for API submission (quantity > 0)
  const productsForSubmission = computed(() => {
    return orderProducts.value.filter(p => p.quantity > 0)
  })

  // Computed - Price calculations
  const subtotal = computed(() => {
    return orderProducts.value.reduce((sum, p) => {
      const product = products.value.find(prod => prod.id === p.id)
      const price = product?.variants?.[0]?.price || 0
      return sum + (price * p.quantity)
    }, 0)
  })

  const total = computed(() => subtotal.value + DELIVERY_FEE)

  // Actions - Product management
  function initializeOrderProducts(productList: Product[]) {
    products.value = productList
    orderProducts.value = productList.map(product => ({
      id: product.id,
      variant_id: product.variants?.[0]?.id || null,
      quantity: 0
    }))
  }

  function updateQuantity(productId: string, variantId: string | null, quantity: number) {
    const existing = orderProducts.value.find(
      p => p.id === productId && p.variant_id === variantId
    )
    if (existing) {
      existing.quantity = Math.max(0, quantity)
    }
  }

  // Actions - Address management
  function setAddressField(field: 'selectedDivision' | 'selectedDistrict' | 'selectedUpazila' | 'fullAddress' | 'mobileNumber', value: string | null) {
    switch (field) {
      case 'selectedDivision':
        selectedDivision.value = value
        selectedDistrict.value = null
        selectedUpazila.value = null
        break
      case 'selectedDistrict':
        selectedDistrict.value = value
        selectedUpazila.value = null
        break
      case 'selectedUpazila':
        selectedUpazila.value = value
        break
      case 'fullAddress':
        fullAddress.value = value as string
        break
      case 'mobileNumber':
        mobileNumber.value = value as string
        break
    }
  }

  // Actions - Validation
  function validateOrder(): { valid: boolean; message: string | null } {
    // Check if at least one product has quantity > 0
    if (productsForSubmission.value.length === 0) {
      return { valid: false, message: 'noProducts' }
    }

    // Check required address fields
    if (!selectedDivision.value) {
      return { valid: false, message: 'division' }
    }

    if (!fullAddress.value.trim()) {
      return { valid: false, message: 'address' }
    }

    if (!mobileNumber.value.trim()) {
      return { valid: false, message: 'mobile' }
    }

    // Basic mobile validation (should be numeric and reasonable length)
    const mobileClean = String(mobileNumber.value || '').replace(/\s/g, '')
    if (!/^\d{10,15}$/.test(mobileClean)) {
      return { valid: false, message: 'invalidPhone' }
    }

    return { valid: true, message: null }
  }

  // Actions - Order submission
  async function submitOrder(shippingAddress: {
    division: string
    division_name: string
    district?: string
    district_name?: string
    upazila?: string
    upazila_name?: string
    address: string
    mobile: string
  }) {
    const validation = validateOrder()
    if (!validation.valid) {
      error.value = validation.message || 'Validation failed'
      return false
    }

    loading.value = true
    error.value = null
    success.value = false

    try {
      const { publicNetwork } = await import('~/network/public')
      await publicNetwork.createOrder({
        user_id: null,
        status: 'pending',
        shipping_address: shippingAddress,
        products: productsForSubmission.value.map(p => ({
          id: p.id,
          variant_id: p.variant_id,
          quantity: p.quantity
        }))
      })

      success.value = true
      return true
    } catch (err) {
      console.error('Order submission failed:', err)
      error.value = 'generic'
      return false
    } finally {
      loading.value = false
    }
  }

  function resetOrder() {
    orderProducts.value = orderProducts.value.map(p => ({ ...p, quantity: 0 }))
    selectedDivision.value = null
    selectedDistrict.value = null
    selectedUpazila.value = null
    fullAddress.value = ''
    mobileNumber.value = ''
    error.value = null
    success.value = false
  }

  return {
    // State
    orderProducts,
    products,
    selectedDivision,
    selectedDistrict,
    selectedUpazila,
    fullAddress,
    mobileNumber,
    loading,
    error,
    success,

    // Constants
    DELIVERY_FEE,

    // Computed
    availableDistricts,
    availableUpazilas,
    productsForSubmission,
    subtotal,
    total,

    // Actions
    initializeOrderProducts,
    updateQuantity,
    setAddressField,
    validateOrder,
    submitOrder,
    resetOrder
  }
})
