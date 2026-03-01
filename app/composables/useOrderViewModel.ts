// Order view model composable
// Bridges the order store with components, providing business logic
// All logic is here, no logic in components

import { storeToRefs } from 'pinia'
import type { Product } from '~/network/public'
import type { LocationData } from '~/types/location'
import type { ShippingAddress } from '~/types/order'
import { divisions, districts, upazilas, getLocationName, searchLocations } from '~/utils/location'

export function useOrderViewModel() {
  const orderStore = useOrderStore()
  const localeStore = useLocaleStore()
  const { t } = useI18n()

  // Extract reactive state from store
  const {
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
    availableDistricts,
    availableUpazilas,
    productsForSubmission,
    subtotal,
    total,
    validationErrors,
    submitAttempted
  } = storeToRefs(orderStore)

  // Locale helpers
  const isBangla = computed(() => localeStore.isBangla)

  // Price helpers
  function getDeliveryFee(): number {
    return orderStore.DELIVERY_FEE
  }

  function getProductPrice(product: Product): number {
    return product.variants?.[0]?.price || 0
  }

  // Location name helpers (bilingual)
  function getDivisionName(division: LocationData): string {
    return getLocationName(division, isBangla.value)
  }

  function getDistrictName(district: LocationData): string {
    return getLocationName(district, isBangla.value)
  }

  function getUpazilaName(upazila: LocationData): string {
    return getLocationName(upazila, isBangla.value)
  }

  // Search functions
  function searchDivisions(query: string): LocationData[] {
    return searchLocations(divisions, query)
  }

  function searchDistricts(query: string): LocationData[] {
    return searchLocations(availableDistricts.value, query)
  }

  function searchUpazilas(query: string): LocationData[] {
    return searchLocations(availableUpazilas.value, query)
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
  function setDivision(value: string | null) {
    orderStore.setAddressField('selectedDivision', value)
  }

  function setDistrict(value: string | null) {
    orderStore.setAddressField('selectedDistrict', value)
  }

  function setUpazila(value: string | null) {
    orderStore.setAddressField('selectedUpazila', value)
  }

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
    const division = divisions.find(d => d.id === selectedDivision.value)
    const district = districts.find(d => d.id === selectedDistrict.value)
    const upazila = upazilas.find(u => u.id === selectedUpazila.value)

    // Format phone number - add 880 prefix if not present
    let formattedMobile = mobileNumber.value.replace(/\s/g, '')
    if (!formattedMobile.startsWith('880')) {
      formattedMobile = '880' + formattedMobile
    }

    return {
      division: selectedDivision.value || '',
      division_name: division ? getDivisionName(division) : '',
      district: selectedDistrict.value || undefined,
      district_name: district ? getDistrictName(district) : undefined,
      upazila: selectedUpazila.value || undefined,
      upazila_name: upazila ? getUpazilaName(upazila) : undefined,
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
    if (error.value === 'noProducts') return t('order.noProducts')
    if (error.value === 'division') return t('validation.required')
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
    availableDistricts,
    availableUpazilas,
    productsForSubmission,
    subtotal,
    total,
    errorMessage,
    successMessage,
    isBangla,
    validationErrors,
    submitAttempted,

    // Helpers
    getDeliveryFee,
    getProductPrice,
    getDivisionName,
    getDistrictName,
    getUpazilaName,

    // Search
    searchDivisions,
    searchDistricts,
    searchUpazilas,

    // Actions
    initializeOrderProducts: orderStore.initializeOrderProducts,
    handleQuantityChange,
    setQuantity,
    setDivision,
    setDistrict,
    setUpazila,
    setAddress,
    setMobile,
    setFullName,
    handleSubmit,
    resetOrder: orderStore.resetOrder
  }
}
