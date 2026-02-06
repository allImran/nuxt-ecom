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
        
      </div>
    </div>
  </div>
</template>
