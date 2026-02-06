<script setup lang="ts">
import type { OrderStatusType } from '~/types/order'

definePageMeta({
  layout: 'admin',
  middleware: 'admin'
})

const route = useRoute()
const { t } = useI18n()
const router = useRouter()
const toast = useToast()

// Get the order ID from route
const orderId = computed(() => route.params.id as string)

// Use the composable
const {
  orderDetail,
  loading,
  updating,
  error,
  hasOrderDetail,
  orderItems,
  formatPrice,
  formatDate,
  getProductImage,
  getProductSlug,
  getStatusColor,
  getStatusLabel,
  calculateItemTotal,
  calculateSubtotal,
  getAvailableStatuses,
  fetchOrderById,
  updateOrderStatus,
  updateOrder,
  reset
} = useAdminOrderViewModel()

// Status change modal state
const showStatusDialog = ref(false)
const pendingStatusChange = ref<{ status: string; comment?: string } | null>(null)

// Quantity editor state
const showQuantityEditor = ref(false)
const editingItem = ref<any>(null)

// Fetch order on mount
onMounted(() => {
  if (orderId.value) {
    fetchOrderById(orderId.value)
  }
})

// Update page metadata
watchEffect(() => {
  if (orderDetail.value) {
    useHead({
      title: `Order ${orderDetail.value.id.slice(0, 8)} - Admin`,
      meta: [
        {
          name: 'description',
          content: `Order details for ${orderDetail.value.id}`
        }
      ]
    })
  }
})

// Clean up on unmount
onUnmounted(() => {
  reset()
})

// Navigate back to orders list
const navigateBack = () => {
  router.push('/admin/orders')
}

// Handle status selection
const handleStatusSelect = (status: string, comment?: string) => {
  pendingStatusChange.value = { status, comment }
  showStatusDialog.value = true
}

// Confirm status change
const confirmStatusChange = async () => {
  if (!pendingStatusChange.value || !orderId.value) return

  try {
    await updateOrderStatus(orderId.value, pendingStatusChange.value)
    toast.success({
      title: 'Status updated',
      description: `Order status has been changed to ${getStatusLabel(pendingStatusChange.value.status)}`
    })
    showStatusDialog.value = false
    pendingStatusChange.value = null
  } catch (err) {
    console.error('Failed to update status:', err)
    toast.error({
      title: 'Failed to update status',
      description: 'Please try again'
    })
  }
}

// Cancel status change
const cancelStatusChange = () => {
  showStatusDialog.value = false
  pendingStatusChange.value = null
}

// Handle quantity edit request
const handleEditQuantity = (item: any) => {
  editingItem.value = item
  showQuantityEditor.value = true
}

// Handle quantity save
const handleQuantitySave = async (newQuantity: number) => {
  if (!editingItem.value || !orderDetail.value) return

  try {
    // Create updated items array
    const updatedItems = orderDetail.value.order_items.map(item =>
      item.id === editingItem.value.id
        ? { ...item, quantity: newQuantity }
        : item
    )

    await updateOrder(orderId.value, {
      items: updatedItems.map(item => ({ id: item.id, quantity: item.quantity }))
    })

    toast.success({
      title: 'Quantity updated',
      description: 'Item quantity has been updated successfully'
    })
    showQuantityEditor.value = false
    editingItem.value = null
  } catch (err) {
    console.error('Failed to update quantity:', err)
    toast.error({
      title: 'Failed to update quantity',
      description: 'Please try again'
    })
  }
}

// Cancel quantity edit
const cancelQuantityEdit = () => {
  showQuantityEditor.value = false
  editingItem.value = null
}

</script>

<template>
  <div class="space-y-6">
    <!-- Back Button -->
    <button
      @click="navigateBack"
      class="flex items-center gap-2 text-luxury-text-muted dark:text-luxury-dark-text-muted hover:text-luxury-text dark:hover:text-luxury-dark-text transition-colors"
    >
      <UiIcon name="arrow-left" :size="20" />
      <span>Back to Orders</span>
    </button>

    <!-- Error State -->
    <div v-if="error && !loading" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-luxury p-6">
      <div class="flex items-start gap-4">
        <UiIcon name="alert-circle" :size="24" class="text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
        <div>
          <h3 class="font-semibold text-red-900 dark:text-red-100">
            {{ error === 'notFound' ? 'Order Not Found' : error === 'unauthorized' ? 'Unauthorized' : error === 'forbidden' ? 'Access Denied' : 'Failed to load order' }}
          </h3>
          <p class="text-sm text-red-700 dark:text-red-300 mt-1">
            {{ error === 'notFound'
              ? 'The order you are looking for does not exist.'
              : error === 'unauthorized'
                ? 'You need to log in to access this page.'
                : error === 'forbidden'
                  ? 'You do not have permission to view this order.'
                  : 'There was a problem loading the order details. Please try again.' }}
          </p>
          <UiLuxuryButton
            v-if="error !== 'unauthorized' && error !== 'forbidden' && error !== 'notFound'"
            variant="outline"
            size="sm"
            class="mt-3"
            @click="() => orderId && fetchOrderById(orderId)"
          >
            Retry
          </UiLuxuryButton>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-else-if="loading" class="space-y-8">
      <OrderDetailHeaderSkeleton />
      <OrderDetailItemsSkeleton />
      <OrderDetailShippingAddressSkeleton />
      <OrderDetailStatusHistorySkeleton />
      <OrderDetailTotalsSkeleton />
    </div>

    <!-- Order Detail -->
    <div v-else-if="hasOrderDetail && orderDetail" class="space-y-8">
      <!-- Header Section with Status Management -->
      <div class="bg-luxury-surface dark:bg-luxury-dark-surface rounded-luxury p-6 sm:p-8 shadow-luxury">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <!-- Left: Order ID and Date -->
          <OrderDetailHeaderInfo
            :order-id="orderDetail.id"
            :created-at="orderDetail.created_at"
            :format-date="formatDate"
          />

          <!-- Right: Status Management -->
          <div class="flex items-center gap-4">
            <AdminOrderStatusDropdown
              :current-status="orderDetail.status"
              :get-available-statuses="getAvailableStatuses"
              :get-status-label="getStatusLabel"
              :get-status-color="getStatusColor"
              :loading="updating"
              @status-select="handleStatusSelect"
            />
            <OrderDetailHeaderTotal
              :total="orderDetail.total_amount"
              :format-price="formatPrice"
            />
          </div>
        </div>
      </div>

      <!-- Order Items Section with Edit Capabilities -->
      <AdminOrderItems
        v-if="orderItems.length > 0"
        :items="orderItems"
        :get-product-image="getProductImage"
        :get-product-slug="getProductSlug"
        :format-price="formatPrice"
        :calculate-item-total="calculateItemTotal"
        :loading="updating"
        @edit-quantity="handleEditQuantity"
      />

      <!-- Shipping Address Section -->
      <OrderDetailShippingAddress
        :shipping-address="orderDetail.shipping_address"
      />

      <!-- Status History Section -->
      <OrderDetailStatusHistory
        v-if="orderDetail.history && orderDetail.history.length > 0"
        :history="orderDetail.history"
        :format-date="formatDate"
        :get-status-color="getStatusColor"
      />

      <!-- Totals Section -->
      <OrderDetailTotals
        :items="orderItems"
        :total="orderDetail.total_amount"
        :format-price="formatPrice"
        :calculate-item-total="calculateItemTotal"
        :calculate-subtotal="calculateSubtotal"
      />
    </div>

    <!-- Status Change Confirmation Dialog -->
    <AdminOrderConfirmDialog
      v-if="orderDetail"
      :is-open="showStatusDialog"
      :current-status="orderDetail.status"
      :new-status="pendingStatusChange?.status || orderDetail.status"
      :comment="pendingStatusChange?.comment"
      :get-status-label="getStatusLabel"
      :get-status-color="getStatusColor"
      :loading="updating"
      @confirm="confirmStatusChange"
      @cancel="cancelStatusChange"
    />

    <!-- Quantity Editor Modal -->
    <AdminOrderQuantityEditor
      v-if="editingItem"
      :is-open="showQuantityEditor"
      :item="editingItem"
      :format-price="formatPrice"
      :loading="updating"
      @save="handleQuantitySave"
      @cancel="cancelQuantityEdit"
    />
  </div>
</template>
