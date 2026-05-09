<script setup lang="ts">
import type { InstantOrder, InstantOrderForm } from '~/types/instantOrder'

// Get route params
const route = useRoute()
const router = useRouter()
const businessId = computed(() => route.params.id as string)
const orderId = computed(() => route.params.orderId as string)

// Page meta
definePageMeta({
  layout: 'admin',
  middleware: 'admin'
})

// Store
const { loading, updating, error, fetchOrderById, updateOrder } = useInstantOrdersStore()

// Toast notification
const toast = useToast()

// Courier request loading state
const courierLoading = ref(false)

// Form composable - will be initialized after fetching order
const {
  form,
  validationErrors,
  isValid,
  totalAmount,
  validate,
  reset: resetForm
} = useInstantOrderForm()

// Business info
const business = ref<any>(null)
const orderLoaded = ref(false)

// Fetch data on mount
onMounted(async () => {
  try {
    const { adminNetwork } = await import('~/network/admin')
    const [businessData, orderData] = await Promise.all([
      adminNetwork.fetchBusinessById(businessId.value),
      fetchOrderById(Number(orderId.value))
    ])
    business.value = businessData

    // Initialize form with order data
    if (orderData) {
      form.value = {
        user_id: orderData.user_id || null,
        customer_info: { ...orderData.customer_info },
        order_items: orderData.order_items.map(item => ({
          title: item.title,
          price: item.price,
          quantity: item.quantity,
          unit: item.unit,
          description: item.description || ''
        })),
        delivery_charge: orderData.delivery_charge,
        cod_reference: orderData.cod_reference || '',
        status: orderData.status
      }
      orderLoaded.value = true
    }
  } catch (err) {
    console.error('Failed to fetch data:', err)
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
    const requestData: Partial<InstantOrderForm> = {
      user_id: form.value.user_id || undefined,
      customer_info: form.value.customer_info,
      order_items: form.value.order_items,
      delivery_charge: form.value.delivery_charge,
      cod_reference: form.value.cod_reference || undefined,
      status: form.value.status
    }

    // Update order
    await updateOrder(Number(orderId.value), requestData)

    // Show success message
    toast.success({ title: 'Instant order updated successfully!' })
  } catch (err) {
    console.error('Failed to update instant order:', err)

    // Extract error message from response
    let errorMessage = 'Failed to update instant order. Please try again.'
    if (err && typeof err === 'object') {
      if ('message' in err && typeof err.message === 'string') {
        errorMessage = err.message
      } else if ('response' in err && err.response && typeof err.response === 'object') {
        const data = (err.response as any)._data || (err.response as any).data
        if (data?.message) {
          errorMessage = data.message
        }
      }
    }

    toast.error({ title: errorMessage })
  }
}

// Handle courier request creation
async function handleCreateCourierRequest() {
  if (courierLoading.value) return

  courierLoading.value = true
  try {
    const { adminNetwork } = await import('~/network/admin')

    // Prepare courier request with required fields only
    const courierRequest = {
      recipient_name: form.value.customer_info.name,
      recipient_phone: form.value.customer_info.phone,
      recipient_address: form.value.customer_info.address,
      cod_amount: totalAmount.value
    }

    const response = await adminNetwork.createCourierOrder(courierRequest)

    // Update cod_reference with tracking code
    form.value.cod_reference = response.consignment.tracking_code

    // Update the order with the new cod_reference
    await updateOrder(Number(orderId.value), {
      cod_reference: response.consignment.tracking_code
    })

    toast.success({ title: `Courier request created! Tracking: ${response.consignment.tracking_code}` })
  } catch (err) {
    console.error('Failed to create courier request:', err)

    let errorMessage = 'Failed to create courier request. Please try again.'
    if (err && typeof err === 'object') {
      if ('message' in err && typeof err.message === 'string') {
        errorMessage = err.message
      } else if ('response' in err && err.response && typeof err.response === 'object') {
        const data = (err.response as any)._data || (err.response as any).data
        if (data?.message) {
          errorMessage = data.message
        }
      }
    }

    toast.error({ title: errorMessage })
  } finally {
    courierLoading.value = false
  }
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex justify-between gap-4">
      <div>
        <p class="text-xs text-luxury-text-muted dark:text-luxury-dark-text-muted">
          {{ business?.name || 'Business' }}
        </p>
        <h1 class="text-2xl font-bold text-luxury-text dark:text-luxury-dark-text">
          Edit Instant Order
        </h1>
      </div>
      <UiLuxuryButton variant="secondary" @click="router.push(`/business/${businessId}/instant-orders`)">
        <UiIcon name="arrow-left" :size="16" class="mr-2" />
      </UiLuxuryButton>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center py-12">
      <UiIcon name="loader-2" :size="32" class="animate-spin text-luxury-gold" />
    </div>

    <!-- Error States -->
    <div v-else-if="error === 'notFound'" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-luxury p-4">
      <p class="text-red-600 dark:text-red-400">Order not found.</p>
    </div>

    <div v-else-if="error === 'unauthorized'" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-luxury p-4">
      <p class="text-red-600 dark:text-red-400">You are not authorized to view this order.</p>
    </div>

    <div v-else-if="error === 'forbidden'" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-luxury p-4">
      <p class="text-red-600 dark:text-red-400">You don't have permission to view this order.</p>
    </div>

    <div v-else-if="error" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-luxury p-4">
      <p class="text-red-600 dark:text-red-400">Failed to load order. Please try again.</p>
    </div>

    <!-- Form -->
    <InstantOrdersForm
      v-else-if="orderLoaded"
      v-model="form"
      :loading="updating"
      :courier-loading="courierLoading"
      mode="edit"
      submit-label="Update Order"
      :validation-errors="validationErrors"
      @submit="handleSubmit"
      @create-courier-request="handleCreateCourierRequest"
    />
  </div>
</template>
