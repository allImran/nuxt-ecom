<script setup lang="ts">
type DeliveryStatus =
  | 'pending'
  | 'delivered'
  | 'partial_delivered'
  | 'cancelled'
  | 'hold'
  | 'in_review'
  | 'delivered_approval_pending'
  | 'partial_delivered_approval_pending'
  | 'cancelled_approval_pending'
  | 'unknown_approval_pending'
  | 'unknown'

interface CourierStatusData {
  success: boolean
  delivery_status: DeliveryStatus
}

interface Props {
  isOpen: boolean
  trackingCode: string
  loading?: boolean
  statusData?: CourierStatusData | null
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  statusData: null
})

const emit = defineEmits<{
  close: []
  refresh: []
}>()

// Status labels and colors
const statusConfig: Record<DeliveryStatus, { label: string; color: string; bgColor: string }> = {
  pending: { label: 'Pending', color: 'text-amber-600 dark:text-amber-400', bgColor: 'bg-amber-100 dark:bg-amber-900/20' },
  delivered: { label: 'Delivered', color: 'text-green-600 dark:text-green-400', bgColor: 'bg-green-100 dark:bg-green-900/20' },
  partial_delivered: { label: 'Partially Delivered', color: 'text-blue-600 dark:text-blue-400', bgColor: 'bg-blue-100 dark:bg-blue-900/20' },
  cancelled: { label: 'Cancelled', color: 'text-red-600 dark:text-red-400', bgColor: 'bg-red-100 dark:bg-red-900/20' },
  hold: { label: 'On Hold', color: 'text-orange-600 dark:text-orange-400', bgColor: 'bg-orange-100 dark:bg-orange-900/20' },
  in_review: { label: 'In Review', color: 'text-purple-600 dark:text-purple-400', bgColor: 'bg-purple-100 dark:bg-purple-900/20' },
  delivered_approval_pending: { label: 'Delivery - Approval Pending', color: 'text-yellow-600 dark:text-yellow-400', bgColor: 'bg-yellow-100 dark:bg-yellow-900/20' },
  partial_delivered_approval_pending: { label: 'Partial Delivery - Approval Pending', color: 'text-yellow-600 dark:text-yellow-400', bgColor: 'bg-yellow-100 dark:bg-yellow-900/20' },
  cancelled_approval_pending: { label: 'Cancellation - Approval Pending', color: 'text-yellow-600 dark:text-yellow-400', bgColor: 'bg-yellow-100 dark:bg-yellow-900/20' },
  unknown_approval_pending: { label: 'Unknown - Approval Pending', color: 'text-gray-600 dark:text-gray-400', bgColor: 'bg-gray-100 dark:bg-gray-900/20' },
  unknown: { label: 'Unknown Status', color: 'text-gray-600 dark:text-gray-400', bgColor: 'bg-gray-100 dark:bg-gray-900/20' }
}

const currentStatusConfig = computed(() => {
  if (!props.statusData?.delivery_status) return null
  return statusConfig[props.statusData.delivery_status] || statusConfig.unknown
})

function handleClose() {
  emit('close')
}

function handleRefresh() {
  emit('refresh')
}
</script>

<template>
  <Teleport to="body">
    <div
      v-if="isOpen"
      class="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <!-- Backdrop -->
      <div
        class="absolute inset-0 bg-black/50"
        @click="handleClose"
      />

      <!-- Modal Content -->
      <div class="relative bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md overflow-hidden">
        <!-- Header -->
        <div class="flex items-center justify-between p-card-padding border-b border-outline-variant/30">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full bg-luxury-gold/10 flex items-center justify-center">
              <UiIcon name="truck" :size="20" class="text-luxury-gold" />
            </div>
            <h3 class="text-lg font-semibold text-luxury-text dark:text-luxury-dark-text">
              Courier Status
            </h3>
          </div>
          <button
            type="button"
            class="p-1 hover:bg-black/5 dark:hover:bg-white/10 rounded-lg transition-colors"
            @click="handleClose"
          >
            <UiIcon name="x" :size="20" class="text-on-surface-variant" />
          </button>
        </div>

        <!-- Content -->
        <div class="p-card-padding space-y-4">
          <!-- Tracking Code -->
          <UiM3Card padding="md">
            <div class="flex items-center justify-between">
              <span class="text-sm text-on-surface-variant">Tracking Code</span>
              <div class="flex items-center gap-2">
                <span class="font-mono text-sm font-medium text-on-surface">{{ trackingCode }}</span>
                <button
                  type="button"
                  class="p-1 hover:bg-black/5 dark:hover:bg-white/10 rounded transition-colors"
                  :disabled="loading"
                  @click="handleRefresh"
                >
                  <UiIcon
                    name="refresh-cw"
                    :size="14"
                    class="text-on-surface-variant"
                    :class="{ 'animate-spin': loading }"
                  />
                </button>
              </div>
            </div>
          </UiM3Card>

          <!-- Status Display -->
          <UiM3Card v-if="statusData" padding="lg" class="text-center">
            <p class="text-sm text-on-surface-variant mb-3">Current Status</p>
            <div
              v-if="currentStatusConfig"
              class="inline-flex items-center gap-2 px-4 py-2 rounded-full"
              :class="currentStatusConfig.bgColor"
            >
              <UiIcon
                :name="statusData.delivery_status === 'delivered' ? 'check-circle' : statusData.delivery_status === 'cancelled' ? 'x-circle' : 'clock'"
                :size="18"
                :class="currentStatusConfig.color"
              />
              <span class="font-medium" :class="currentStatusConfig.color">
                {{ currentStatusConfig.label }}
              </span>
            </div>
          </UiM3Card>

          <!-- Loading State -->
          <div v-else-if="loading" class="flex flex-col items-center justify-center py-8">
            <UiIcon name="loader-2" :size="32" class="animate-spin text-luxury-gold mb-3" />
            <p class="text-sm text-on-surface-variant">Fetching delivery status...</p>
          </div>

          <!-- Error/Empty State -->
          <div v-else class="flex flex-col items-center justify-center py-8">
            <UiIcon name="info" :size="32" class="text-on-surface-variant/50 mb-3" />
            <p class="text-sm text-on-surface-variant">Click refresh to check delivery status</p>
          </div>
        </div>

        <!-- Footer -->
        <div class="flex items-center justify-end gap-3 p-card-padding border-t border-outline-variant/30">
          <UiLuxuryButton
            variant="ghost"
            type="button"
            :disabled="loading"
            @click="handleClose"
          >
            Close
          </UiLuxuryButton>
          <UiLuxuryButton
            type="button"
            :loading="loading"
            @click="handleRefresh"
          >
            <UiIcon name="refresh-cw" :size="16" class="mr-2" />
            Refresh
          </UiLuxuryButton>
        </div>
      </div>
    </div>
  </Teleport>
</template>
