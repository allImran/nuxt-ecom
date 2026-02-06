<script setup lang="ts">
import type { OrderStatusType } from '~/types/order'

interface Props {
  currentStatus: OrderStatusType
  getAvailableStatuses: (status: OrderStatusType) => OrderStatusType[]
  getStatusLabel: (status: string) => string
  getStatusColor: (status: string) => string
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  loading: false
})

const emit = defineEmits<{
  'status-select': [status: OrderStatusType, comment?: string]
}>()

// UI state
const isOpen = ref(false)
const selectedStatus = ref<OrderStatusType | ''>('')
const comment = ref('')

// Available statuses
const availableStatuses = computed(() => {
  return props.getAvailableStatuses(props.currentStatus)
})

// Handle status change request
function handleStatusChange() {
  if (selectedStatus.value && selectedStatus.value !== props.currentStatus) {
    emit('status-select', selectedStatus.value, comment.value || undefined)
    closeDropdown()
  }
}

// Close dropdown and reset state
function closeDropdown() {
  isOpen.value = false
  selectedStatus.value = ''
  comment.value = ''
}
</script>

<template>
  <div class="relative">
    <!-- Current Status Badge (Click to Open) -->
    <button
      type="button"
      :disabled="loading"
      class="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors hover:opacity-80 disabled:opacity-50"
      :class="getStatusColor(currentStatus)"
      @click="isOpen = !isOpen"
    >
      <span>{{ getStatusLabel(currentStatus) }}</span>
      <UiIcon
        :name="isOpen ? 'chevron-up' : 'chevron-down'"
        :size="16"
      />
    </button>

    <!-- Dropdown Modal -->
    <Teleport to="body">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <!-- Backdrop -->
        <div
          class="absolute inset-0 bg-black/50"
          @click="closeDropdown"
        />

        <!-- Modal Content -->
        <div class="relative bg-luxury-bg dark:bg-luxury-dark-bg rounded-luxury shadow-xl w-full max-w-md p-6 space-y-6">
          <!-- Header -->
          <div class="flex items-center justify-between">
            <h3 class="text-xl font-semibold text-luxury-text dark:text-luxury-dark-text">
              Update Order Status
            </h3>
            <button
              type="button"
              class="text-luxury-text-muted hover:text-luxury-text dark:hover:text-luxury-dark-text transition-colors"
              @click="closeDropdown"
            >
              <UiIcon name="x" :size="24" />
            </button>
          </div>

          <!-- Current Status -->
          <div>
            <label class="block text-sm font-medium text-luxury-text-muted dark:text-luxury-dark-text-muted mb-2">
              Current Status
            </label>
            <div
              class="inline-flex px-4 py-2 rounded-full text-sm font-medium"
              :class="getStatusColor(currentStatus)"
            >
              {{ getStatusLabel(currentStatus) }}
            </div>
          </div>

          <!-- Status Selection -->
          <div>
            <label class="block text-sm font-medium text-luxury-text-muted dark:text-luxury-dark-text-muted mb-2">
              New Status
            </label>
            <select
              v-model="selectedStatus"
              class="w-full px-3 py-2 bg-luxury-surface dark:bg-luxury-dark-surface border border-luxury-border dark:border-luxury-dark-border rounded-luxury text-luxury-text dark:text-luxury-dark-text focus:outline-none focus:ring-1 focus:ring-luxury-gold"
            >
              <option value="">Select a status...</option>
              <option
                v-for="status in availableStatuses"
                :key="status"
                :value="status"
              >
                {{ getStatusLabel(status) }}
              </option>
            </select>
          </div>

          <!-- Comment (Optional) -->
          <div>
            <label class="block text-sm font-medium text-luxury-text-muted dark:text-luxury-dark-text-muted mb-2">
              Comment (Optional)
            </label>
            <textarea
              v-model="comment"
              rows="3"
              placeholder="Add a note about this status change..."
              class="w-full px-3 py-2 bg-luxury-surface dark:bg-luxury-dark-surface border border-luxury-border dark:border-luxury-dark-border rounded-luxury text-luxury-text dark:text-luxury-dark-text placeholder-luxury-text-muted/50 dark:placeholder-luxury-dark-text-muted/50 focus:outline-none focus:ring-1 focus:ring-luxury-gold resize-none"
            />
          </div>

          <!-- Actions -->
          <div class="flex items-center justify-end gap-3 pt-2">
            <UiLuxuryButton variant="ghost" type="button" @click="closeDropdown">
              Cancel
            </UiLuxuryButton>
            <UiLuxuryButton
              type="button"
              :disabled="!selectedStatus || selectedStatus === currentStatus"
              :loading="loading"
              @click="handleStatusChange"
            >
              Update Status
            </UiLuxuryButton>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>
