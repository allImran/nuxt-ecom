<script setup lang="ts">
import type { OrderStatusType } from '~/types/order'

interface Props {
  isOpen: boolean
  currentStatus: OrderStatusType
  newStatus: OrderStatusType
  getStatusLabel: (status: string) => string
  getStatusColor: (status: string) => string
  comment?: string
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  loading: false
})

const emit = defineEmits<{
  confirm: []
  cancel: []
}>()

// Handle confirm
function handleConfirm() {
  emit('confirm')
}

// Handle cancel
function handleCancel() {
  emit('cancel')
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
        @click="handleCancel"
      />

      <!-- Modal Content -->
      <div class="relative bg-luxury-bg dark:bg-luxury-dark-bg rounded-luxury shadow-xl w-full max-w-md p-6 space-y-6">
        <!-- Header -->
        <div class="flex items-start gap-4">
          <div class="flex-shrink-0 w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/20 flex items-center justify-center">
            <UiIcon name="alert-triangle" :size="24" class="text-amber-600 dark:text-amber-400" />
          </div>
          <div class="flex-1">
            <h3 class="text-xl font-semibold text-luxury-text dark:text-luxury-dark-text mb-2">
              Confirm Status Change
            </h3>
            <p class="text-sm text-luxury-text-muted dark:text-luxury-dark-text-muted">
              Are you sure you want to change the order status? This action will be recorded in the order history.
            </p>
          </div>
        </div>

        <!-- Status Change Summary -->
        <div class="bg-luxury-surface dark:bg-luxury-dark-surface rounded-luxury p-4 space-y-3">
          <div class="flex items-center justify-between">
            <span class="text-sm text-luxury-text-muted dark:text-luxury-dark-text-muted">From:</span>
            <div
              class="px-3 py-1 rounded-full text-sm font-medium"
              :class="getStatusColor(currentStatus)"
            >
              {{ getStatusLabel(currentStatus) }}
            </div>
          </div>
          <div class="flex items-center justify-center">
            <UiIcon name="arrow-down" :size="18" class="text-luxury-text-muted dark:text-luxury-dark-text-muted" />
          </div>
          <div class="flex items-center justify-between">
            <span class="text-sm text-luxury-text-muted dark:text-luxury-dark-text-muted">To:</span>
            <div
              class="px-3 py-1 rounded-full text-sm font-medium"
              :class="getStatusColor(newStatus)"
            >
              {{ getStatusLabel(newStatus) }}
            </div>
          </div>
        </div>

        <!-- Comment (if provided) -->
        <div v-if="comment" class="bg-luxury-surface dark:bg-luxury-dark-surface rounded-luxury p-4">
          <p class="text-sm font-medium text-luxury-text-muted dark:text-luxury-dark-text-muted mb-1">
            Comment:
          </p>
          <p class="text-sm text-luxury-text dark:text-luxury-dark-text">
            {{ comment }}
          </p>
        </div>

        <!-- Actions -->
        <div class="flex items-center justify-end gap-3 pt-2">
          <UiLuxuryButton variant="ghost" type="button" :disabled="loading" @click="handleCancel">
            Cancel
          </UiLuxuryButton>
          <UiLuxuryButton
            type="button"
            :loading="loading"
            @click="handleConfirm"
          >
            Confirm Change
          </UiLuxuryButton>
        </div>
      </div>
    </div>
  </Teleport>
</template>
