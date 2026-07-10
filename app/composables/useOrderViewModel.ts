// Order view model composable
// Bridges the order store with components, providing business logic
// All logic is here, no logic in components

import { storeToRefs } from 'pinia'
import type { Product } from '~/network/public'
import type { ShippingAddress } from '~/types/order'

export function useOrderViewModel() {
  const orderStore = useOrderStore()
  const { t } = useI18n()

  // Extract reactive state from store
  const {
    orderProducts,
    products,
    fullAddress,
    mobileNumber,
    fullName,
    loading,
    error,
    success,
    orderId,
    productsForSubmission,
    subtotal,
    deliveryFee,
    total,
    validationErrors,
    submitAttempted
  } = storeToRefs(orderStore)

  function getProductPrice(product: Product, variantId?: string | null): number {
    if (variantId) {
      const variant = product.variants?.find(v => v.id === variantId)
      if (variant) return variant.price
    }
    return product.variants?.[0]?.price || 0
  }

  // Quantity handlers
  function handleQuantityChange(productId: string, variantId: string | null, delta: number) {
    const orderProduct = orderProducts.value.find(
      p => p.id === productId && p.variant_id === variantId
    )
    if (orderProduct) {
      // Check if this is the first product
      const isFirstProduct = orderProducts.value[0]?.id === productId
      // First product has minimum quantity of 1, others have minimum of 0
      const minQuantity = isFirstProduct ? 1 : 0
      const newQuantity = Math.max(minQuantity, orderProduct.quantity + delta)
      orderStore.updateQuantity(productId, variantId, newQuantity)
    }
  }

  function setQuantity(productId: string, variantId: string | null, quantity: number) {
    orderStore.updateQuantity(productId, variantId, Math.max(0, quantity))
  }

  // Address handlers
  function setAddress(value: string) {
    orderStore.setAddressField('fullAddress', value)
  }

  function setMobile(value: string) {
    orderStore.setAddressField('mobileNumber', value)
  }

  function setFullName(value: string) {
    orderStore.setAddressField('fullName', value)
  }

  // Build shipping address for API submission
  function buildShippingAddress(): ShippingAddress {
    // Format phone number - add 880 prefix if not present
    let formattedMobile = mobileNumber.value.replace(/\s/g, '')
    if (!formattedMobile.startsWith('880')) {
      formattedMobile = '880' + formattedMobile
    }

    return {
      division: '',
      division_name: '',
      district: undefined,
      district_name: undefined,
      upazila: undefined,
      upazila_name: undefined,
      address: fullAddress.value,
      full_name: fullName.value,
      mobile: formattedMobile
    }
  }

  // Submit handler
  async function handleSubmit(): Promise<boolean> {
    const shippingAddress = buildShippingAddress()
    return await orderStore.submitOrder(shippingAddress)
  }

  // Get error message for display
  const errorMessage = computed(() => {
    if (!error.value) return ''
    if (error.value === 'formErrors') return t('validation.fillFormCorrectly')
    if (error.value === 'noProducts') return t('order.noProducts')
    if (error.value === 'address') return t('validation.required')
    if (error.value === 'mobile') return t('validation.required')
    if (error.value === 'invalidPhone') return t('order.invalidPhone')
    return t('errors.generic')
  })

  // Success message
  const successMessage = computed(() => t('order.orderSuccess'))

  return {
    // State from store
    orderProducts,
    products,
    fullAddress,
    mobileNumber,
    fullName,
    loading,
    error,
    success,
    orderId,
    productsForSubmission,
    subtotal,
    deliveryFee,
    total,
    errorMessage,
    successMessage,
    validationErrors,
    submitAttempted,

    // Helpers
    getProductPrice,

    // Actions
    initializeOrderProducts: orderStore.initializeOrderProducts,
    updateSelectedVariants: orderStore.updateSelectedVariants,
    handleQuantityChange,
    setQuantity,
    setAddress,
    setMobile,
    setFullName,
    handleSubmit,
    resetOrder: orderStore.resetOrder
  }
}
