<script setup lang="ts">
import type { InstantOrderForm, InstantOrderStatus, UserSearchResult, CustomerInfo } from '~/types/instantOrder'

interface Props {
  modelValue: InstantOrderForm
  loading?: boolean
  mode?: 'create' | 'edit'
  submitLabel?: string
  validationErrors?: Record<string, string>
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  mode: 'create',
  submitLabel: 'Submit',
  validationErrors: () => ({})
})

const emit = defineEmits<{
  'update:modelValue': [value: InstantOrderForm]
  'submit': [form: InstantOrderForm]
}>()

const form = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

// Customer search
const {
  searchQuery: customerSearchQuery,
  searchResults: customerSearchResults,
  loading: customerSearchLoading,
  selectedUser: selectedCustomerUser,
  searchUsers,
  selectUser,
  clearUser,
  getCustomerInfo: getSelectedCustomerInfo
} = useCustomerSearch()

// Sync with form
const customerInfo = computed({
  get: () => form.value.customer_info,
  set: (value) => {
    form.value = { ...form.value, customer_info: value }
  }
})

// When a user is selected, update form
watch(selectedCustomerUser, (user) => {
  if (user) {
    form.value = {
      ...form.value,
      user_id: user.id,
      customer_info: {
        name: user.name,
        phone: user.phone,
        address: form.value.customer_info.address // Keep existing address
      }
    }
  }
})

// Handle user selection
function handleSelectUser(user: UserSearchResult) {
  selectUser(user)
}

// Handle clear user
function handleClearUser() {
  clearUser()
  form.value = { ...form.value, user_id: null }
}

// Update customer info
function handleUpdateCustomerInfo(value: CustomerInfo) {
  customerInfo.value = value
}

// Status options
const statusOptions: Array<{ value: InstantOrderStatus; label: string }> = [
  { value: 'pending', label: 'Pending' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'paid', label: 'Paid' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' }
]

// Calculate total
const totalAmount = computed(() => {
  const itemsTotal = form.value.order_items.reduce((sum, item) => {
    return sum + (item.price * item.quantity)
  }, 0)
  return itemsTotal + (form.value.delivery_charge || 0)
})

// Check if form has validation errors
const hasErrors = computed(() => {
  return Object.keys(props.validationErrors).length > 0
})

// Handle form submission
function handleSubmit() {
  emit('submit', form.value)
}
</script>

<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <!-- Customer Section -->

      <InstantOrdersCustomerSelector
        :model-value="selectedCustomerUser"
        :customer-info="customerInfo"
        :search-results="customerSearchResults"
        :search-loading="customerSearchLoading"
        @update:model-value="handleSelectUser"
        @update:customer-info="handleUpdateCustomerInfo"
        @search="searchUsers"
        @select-user="handleSelectUser"
        @clear-user="handleClearUser"
      />

      <p v-if="validationErrors['customer_info.name']" class="mt-2 text-sm text-red-600 dark:text-red-400">
        {{ validationErrors['customer_info.name'] }}
      </p>

    <!-- Order Items Section -->
    <div class="bg-luxury-surface dark:bg-luxury-dark-surface rounded-luxury shadow-luxury p-6">
      <InstantOrdersOrderItemsEditor
        :model-value="form.order_items"
        :validation-errors="validationErrors"
        @update:model-value="form = { ...form, order_items: $event }"
      />

      <p v-if="validationErrors['order_items']" class="mt-2 text-sm text-red-600 dark:text-red-400">
        {{ validationErrors['order_items'] }}
      </p>
    </div>

    <!-- Additional Details Section -->
    <div class="bg-luxury-surface dark:bg-luxury-dark-surface rounded-luxury shadow-luxury p-6">
      <h3 class="text-lg font-medium text-luxury-text dark:text-luxury-dark-text mb-4">Additional Details</h3>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <!-- Delivery Charge -->
        <div>
          <UiLuxuryInput
            :model-value="form.delivery_charge"
            type="number"
            label="Delivery Charge"
            placeholder="0"
            min="0"
            step="0.01"
            @update:model-value="form = { ...form, delivery_charge: parseFloat($event) || 0 }"
          />
        </div>

        <!-- COD Reference -->
        <div>
          <UiLuxuryInput
            :model-value="form.cod_reference"
            type="text"
            label="COD Reference (optional)"
            placeholder="Enter COD reference"
            @update:model-value="form = { ...form, cod_reference: $event }"
          />
        </div>

        <!-- Status -->
        <div>
          <UiLuxurySelect
            :model-value="form.status"
            :options="statusOptions"
            label="Status"
            @update:model-value="form = { ...form, status: $event }"
          />
        </div>
      </div>
    </div>

    <!-- Total Summary -->
    <div class="bg-luxury-surface dark:bg-luxury-dark-surface rounded-luxury shadow-luxury p-6">
      <div class="flex justify-between items-center">
        <span class="text-lg font-medium text-luxury-text dark:text-luxury-dark-text">Total Amount</span>
        <span class="text-2xl font-bold text-luxury-gold">{{ totalAmount.toFixed(2) }}</span>
      </div>
    </div>

    <!-- Form Actions -->
    <div class="flex justify-end gap-3">
      <slot name="actions" :loading="loading" :has-errors="hasErrors">
        <UiLuxuryButton
          type="submit"
          :loading="loading"
          :disabled="loading || hasErrors"
        >
          {{ submitLabel }}
        </UiLuxuryButton>
      </slot>
    </div>
  </form>
</template>
