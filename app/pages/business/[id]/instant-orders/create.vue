<script setup lang="ts">
import type { InstantOrderForm } from '~/types/instantOrder'

// Get route params
const route = useRoute()
const router = useRouter()
const businessId = computed(() => route.params.id as string)

// Page meta
definePageMeta({
  layout: 'admin',
  middleware: 'admin'
})

// Form composable
const {
  form,
  validationErrors,
  isValid,
  totalAmount,
  validate,
  reset: resetForm
} = useInstantOrderForm()

// Store
const { updating, error, createOrder } = useInstantOrdersStore()

// Toast notification
const toast = useToast()

// Business info
const business = ref<any>(null)

// Fetch business info on mount
onMounted(async () => {
  try {
    const { adminNetwork } = await import('~/network/admin')
    business.value = await adminNetwork.fetchBusinessById(businessId.value)
  } catch (err) {
    console.error('Failed to fetch business:', err)
  }
})

// Reset form on unmount
onUnmounted(() => {
  resetForm()
})

// Handle form submission
async function handleSubmit() {
  // Validate form
  const errors = validate()
  if (Object.keys(errors).length > 0) {
    return
  }

  try {
    // Prepare request data
    const requestData = {
      business_id: businessId.value,
      user_id: form.value.user_id || undefined,
      customer_info: form.value.customer_info,
      order_items: form.value.order_items,
      delivery_charge: form.value.delivery_charge,
      cod_reference: form.value.cod_reference || undefined,
      status: form.value.status
    }

    // Create order
    const result = await createOrder(requestData)

    // Show success message
    toast.success('Instant order created successfully!')

    // Navigate to list or edit page
    router.push(`/business/${businessId.value}/instant-orders/edit/${result.id}`)
  } catch (err) {
    console.error('Failed to create instant order:', err)

    // Show error message
    if (error.value === 'validation') {
      toast.error('Please fix the validation errors and try again.')
    } else if (error.value === 'unauthorized') {
      toast.error('You are not authorized to create instant orders.')
    } else if (error.value === 'forbidden') {
      toast.error('You don\'t have permission to create instant orders.')
    } else {
      toast.error('Failed to create instant order. Please try again.')
    }
  }
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center gap-4">
      <UiLuxuryButton variant="ghost" @click="router.push(`/business/${businessId}/instant-orders`)">
        <UiIcon name="arrow-left" :size="16" class="mr-2" />
        Back
      </UiLuxuryButton>
      <div>
        <h1 class="text-2xl font-bold text-luxury-text dark:text-luxury-dark-text">
          Create Instant Order
        </h1>
        <p class="text-sm text-luxury-text-muted dark:text-luxury-dark-text-muted">
          {{ business?.name || 'Business' }}
        </p>
      </div>
    </div>

    <!-- Error State -->
    <div v-if="error === 'unauthorized'" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-luxury p-4">
      <p class="text-red-600 dark:text-red-400">You are not authorized to create instant orders.</p>
    </div>

    <div v-else-if="error === 'forbidden'" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-luxury p-4">
      <p class="text-red-600 dark:text-red-400">You don't have permission to create instant orders.</p>
    </div>

    <!-- Form -->
    <InstantOrdersForm
      v-model="form"
      :loading="updating"
      mode="create"
      submit-label="Create Order"
      :validation-errors="validationErrors"
      @submit="handleSubmit"
    />
  </div>
</template>
