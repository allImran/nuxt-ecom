<template>
  <div class="order-component max-w-4xl mx-auto p-6">
    <!-- Success state -->
    <div v-if="success && !loading" class="text-center py-12">
      <div class="text-6xl mb-4">✓</div>
      <h2 class="text-2xl font-semibold text-green-600 dark:text-green-400 mb-2">{{ t('common.success') }}</h2>
      <p class="text-luxury-text-muted dark:text-luxury-dark-text-muted">{{ successMessage }}</p>
      <button
        type="button"
        class="mt-6 px-6 py-3 bg-luxury-gold hover:bg-luxury-gold-hover text-white rounded-luxury transition-colors"
        @click="handleReset"
      >
        {{ t('common.confirm') }}
      </button>
    </div>

    <!-- Order form -->
    <form v-else class="grid grid-cols-1 lg:grid-cols-2 gap-8" @submit.prevent="handleSubmit">
      <!-- Left column: Products and Payment -->
      <div class="space-y-8">
        <OrderProductSection
          :products="products"
          :order-products="orderProducts"
          :get-product-price="getProductPrice"
          @increase="handleQuantityIncrease"
          @decrease="handleQuantityDecrease"
        />

        <OrderPaymentSection />
      </div>

      <!-- Right column: Address and Summary -->
      <div class="space-y-8">
        <OrderAddressSection
          :selected-division="selectedDivision"
          :selected-district="selectedDistrict"
          :selected-upazila="selectedUpazila"
          :full-address="fullAddress"
          :mobile-number="mobileNumber"
          :is-bangla="isBangla"
          :available-districts="availableDistricts"
          :available-upazilas="availableUpazilas"
          :search-divisions="searchDivisions"
          :search-districts="searchDistricts"
          :search-upazilas="searchUpazilas"
          @division-change="setDivision"
          @district-change="setDistrict"
          @upazila-change="setUpazila"
          @address-change="setAddress"
          @mobile-change="setMobile"
        />

        <OrderSummary
          :subtotal="subtotal"
          :delivery-fee="DELIVERY_FEE"
          :total="total"
          :loading="loading"
          :success="success"
          :error="!!error"
          :error-message="errorMessage"
          :success-message="successMessage"
          :has-products="productsForSubmission.length > 0"
          @submit="handleSubmit"
        />
      </div>
    </form>

    <!-- Loading overlay -->
    <div
      v-if="loading"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
    >
      <div class="bg-white dark:bg-luxury-dark-surface rounded-luxury p-8 flex items-center gap-4">
        <div class="animate-spin text-2xl">⟳</div>
        <span>{{ t('common.loading') }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Product } from '~/network/public'

interface Props {
  products: Product[]
}

const props = defineProps<Props>()

const vm = useOrderViewModel()
const { t } = useI18n()

// Extract state from composable
const {
  orderProducts,
  selectedDivision,
  selectedDistrict,
  selectedUpazila,
  fullAddress,
  mobileNumber,
  loading,
  error,
  success,
  getDeliveryFee,
  availableDistricts,
  availableUpazilas,
  productsForSubmission,
  subtotal,
  total,
  errorMessage,
  successMessage,
  isBangla,
  getProductPrice,
  searchDivisions,
  searchDistricts,
  searchUpazilas,
  setDivision,
  setDistrict,
  setUpazila,
  setAddress,
  setMobile,
  handleSubmit: vmHandleSubmit,
  resetOrder
} = vm

const DELIVERY_FEE = getDeliveryFee()

// Initialize products on mount
onMounted(() => {
  vm.initializeOrderProducts(props.products)
})

// Watch for products prop changes
watch(() => props.products, (newProducts) => {
  vm.initializeOrderProducts(newProducts)
}, { deep: true })

// Quantity handlers
function handleQuantityIncrease(productId: string, variantId: string | null) {
  vm.handleQuantityChange(productId, variantId, 1)
}

function handleQuantityDecrease(productId: string, variantId: string | null) {
  vm.handleQuantityChange(productId, variantId, -1)
}

// Reset handler
async function handleReset() {
  resetOrder()
  vm.initializeOrderProducts(props.products)
}

// Submit handler
async function handleSubmit(e?: Event) {
  e?.preventDefault()
  const success = await vmHandleSubmit()
  if (success) {
    // Form will show success state
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}
</script>

<style scoped>
.order-component {
  font-family: 'Hind Siliguri', 'Noto Sans Bengali', sans-serif;
}

html[lang="bn"] .order-component {
  letter-spacing: 0.01em;
}
</style>
