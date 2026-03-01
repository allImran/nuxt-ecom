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
  const fullName = ref('')

  // UI state
  const loading = ref(false)
  const error = ref<string | null>(null)
  const success = ref(false)
  const orderId = ref<string | null>(null)

  // Validation errors state for individual fields
  const validationErrors = ref<Record<string, string>>({})

  // Whether form has been attempted to submit (to trigger error display)
  const submitAttempted = ref(false)

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
    orderProducts.value = productList.map((product, index) => ({
      id: product.id,
      variant_id: product.variants?.[0]?.id || null,
      quantity: index === 0 ? 1 : 0
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
  function setAddressField(field: 'selectedDivision' | 'selectedDistrict' | 'selectedUpazila' | 'fullAddress' | 'mobileNumber' | 'fullName', value: string | null) {
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
      case 'fullName':
        fullName.value = value as string
        break
    }
  }

  // Actions - Validation
  function validateOrder(): { valid: boolean; message: string | null } {
    // Clear previous errors
    validationErrors.value = {}

    // Check if at least one product has quantity > 0
    if (productsForSubmission.value.length === 0) {
      validationErrors.value.products = 'add a product'
    }

    // Check required address fields
    if (!selectedDivision.value) {
      validationErrors.value.division = 'please select this'
    }

    if (!fullAddress.value.trim()) {
      validationErrors.value.fullAddress = 'this field is required'
    }

    if (!mobileNumber.value.trim()) {
      validationErrors.value.mobileNumber = 'this field is required'
    } else {
      // Basic mobile validation (should be numeric and reasonable length)
      const mobileClean = String(mobileNumber.value || '').replace(/\s/g, '')
      if (!/^\d{10,15}$/.test(mobileClean)) {
        validationErrors.value.mobileNumber = 'invalid phone number'
      }
    }

    const hasErrors = Object.keys(validationErrors.value).length > 0
    if (hasErrors) {
      return { valid: false, message: Object.values(validationErrors.value)[0] || 'Validation failed' }
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
    full_name?: string
  }) {
    submitAttempted.value = true
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

      // Get business_id from the first product's category
      const firstProduct = products.value.find(p => p.id === productsForSubmission.value[0]?.id)
      const businessId = firstProduct?.category?.business_id || firstProduct?.category?.business?.id

      // Format phone number - add 880 prefix if not present
      let formattedPhone = mobileNumber.value
      if (!formattedPhone.startsWith('88')) {
        formattedPhone = '88' + formattedPhone
      }

      const result = await publicNetwork.createOrder({
        user_id: null,
        status: 'pending',
        // full_name: fullName.value,
        phone: formattedPhone,
        business_id: businessId,
        shipping_address: shippingAddress,
        items: productsForSubmission.value.map(p => ({
          product_id: p.id,
          variant_id: p.variant_id,
          quantity: p.quantity
        }))
      })

      orderId.value = (result as any).id
      success.value = true

      // Track Purchase event with Facebook Pixel
      if (import.meta.client && (window as any).fbq) {
        const orderItems = productsForSubmission.value.map(p => {
          const product = products.value.find(prod => prod.id === p.id)
          return {
            content_name: product?.name || 'Product',
            content_ids: [p.id],
            quantity: p.quantity
          }
        })

        ;(window as any).fbq('track', 'Purchase', {
          content_ids: productsForSubmission.value.map(p => p.id),
          content_name: 'Order',
          contents: orderItems,
          content_type: 'product',
          value: total.value,
          currency: 'BDT',
          num_items: productsForSubmission.value.reduce((sum, p) => sum + p.quantity, 0)
        })
      }

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
    fullName.value = ''
    error.value = null
    success.value = false
    orderId.value = null
    validationErrors.value = {}
    submitAttempted.value = false
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
    fullName,
    loading,
    error,
    success,
    orderId,
    validationErrors,
    submitAttempted,

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
