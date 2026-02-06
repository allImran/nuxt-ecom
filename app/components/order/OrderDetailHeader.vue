<script setup lang="ts">
interface Props {
  orderId: string
  status: string
  createdAt: string
  total: number
  formatDate: (date: string) => string
  formatPrice: (price: number) => string
  getStatusColor: (status: string) => string
}

const props = defineProps<Props>()

// Get order data from store for PDF generation
const orderDetailStore = useOrderDetailStore()
const { order } = storeToRefs(orderDetailStore)

// PDF generation composable
const { generateOrderPdf, isGenerating } = useOrderPdf()

// Handle PDF download
async function handleDownloadPdf() {
  if (!order.value) return

  try {
    await generateOrderPdf(order.value)
  } catch (error) {
    console.error('Failed to download PDF:', error)
    // Error is already set in the composable
  }
}
</script>

<template>
  <div class="bg-luxury-surface dark:bg-luxury-dark-surface rounded-luxury p-6 sm:p-8 shadow-luxury">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <!-- Left: Order ID and Date -->
      <OrderDetailHeaderInfo
        :order-id="orderId"
        :created-at="createdAt"
        :format-date="formatDate"
      />

      <!-- Right: Status, Total, and Download Button -->
      <div class="flex items-center gap-4">
        <OrderDetailStatusBadge
          :status="status"
          :get-status-color="getStatusColor"
        />
        <OrderDetailHeaderTotal
          :total="total"
          :format-price="formatPrice"
        />
        <button
          @click="handleDownloadPdf"
          :disabled="isGenerating"
          class="flex items-center gap-2 px-4 py-2 bg-luxury-accent dark:bg-luxury-dark-accent text-luxury-text dark:text-luxury-dark-text rounded-lg hover:bg-opacity-80 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          title="Download PDF"
        >
          <UiIcon
            :name="isGenerating ? 'loader' : 'download'"
            :size="18"
            :class="{ 'animate-spin': isGenerating }"
          />
          <span class="text-sm font-medium">PDF</span>
        </button>
      </div>
    </div>
  </div>
</template>
