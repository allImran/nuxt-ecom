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
  <div class="bg-luxury-surface dark:bg-luxury-dark-surface rounded-3xl sm:rounded-[32px] p-6 sm:px-8 sm:py-7 shadow-sm border border-luxury-border/30 dark:border-luxury-dark-border/30">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 sm:gap-8">
      <!-- Left: Order ID and Date -->
      <OrderDetailHeaderInfo
        :order-id="orderId"
        :created-at="createdAt"
        :format-date="formatDate"
      />

      <!-- Right: Badge and Total -->
      <div class="flex items-center justify-between sm:justify-end gap-5 sm:gap-6 mt-1 sm:mt-0 w-full sm:w-auto">
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
