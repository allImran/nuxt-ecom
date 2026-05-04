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
      <InstantOrdersOrderItemsEditor
        :model-value="form.order_items"
        :validation-errors="validationErrors"
        @update:model-value="form = { ...form, order_items: $event }"
      />

      <p v-if="validationErrors['order_items']" class="mt-2 text-sm text-red-600 dark:text-red-400">
        {{ validationErrors['order_items'] }}
      </p>

    <!-- Additional Details Section -->
    <UiM3Card padding="lg" class="flex flex-col gap-stack-md">
      <span class="font-label-caps text-label-caps text-on-surface-variant opacity-60 uppercase">ORDER DETAILS</span>

      <div class="grid grid-cols-1 gap-stack-md">
        <!-- Delivery Charge -->
        <div class="flex justify-between items-center border-b border-outline-variant/30 pb-3">
          <span class="text-body-md text-on-surface-variant">Delivery Charge</span>
          <div class="flex items-center gap-2">
            <span class="text-on-surface-variant">$</span>
            <input
              :value="form.delivery_charge.toFixed(2)"
              type="number"
              min="0"
              step="0.01"
              class="w-20 bg-transparent border-none p-0 text-right focus:ring-0 font-bold text-on-surface"
              @input="form = { ...form, delivery_charge: parseFloat(($event.target as HTMLInputElement).value) || 0 }"
            />
          </div>
        </div>

        <!-- COD Reference -->
        <div class="flex justify-between items-center border-b border-outline-variant/30 pb-3">
          <span class="text-body-md text-on-surface-variant">COD Reference</span>
          <input
            :value="form.cod_reference"
            type="text"
            placeholder="Ref # (Optional)"
            class="w-36 bg-transparent border-none p-0 text-right focus:ring-0 text-body-md text-on-surface placeholder:text-on-surface-variant/50"
            @input="form = { ...form, cod_reference: ($event.target as HTMLInputElement).value }"
          />
        </div>

        <!-- Order Status -->
        <div class="flex justify-between items-center pb-1">
          <span class="text-body-md text-on-surface-variant">Order Status</span>
          <div class="relative">
            <select
              :value="form.status"
              class="appearance-none bg-transparent border-none p-0 text-right focus:ring-0 pr-6 cursor-pointer font-bold text-primary"
              @change="form = { ...form, status: ($event.target as HTMLSelectElement).value as InstantOrderStatus }"
            >
              <option
                v-for="option in statusOptions"
                :key="option.value"
                :value="option.value"
              >
                {{ option.label }}
              </option>
            </select>
            <span class="material-symbols-outlined text-[18px] absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-primary">
              expand_more
            </span>
          </div>
        </div>
      </div>
    </UiM3Card>

    <!-- Total Summary -->
    <!-- <div class="bg-luxury-surface dark:bg-luxury-dark-surface rounded-luxury shadow-luxury p-6"> -->
      <div class="flex justify-between items-center mt-4">
        <span class="text-lg font-medium text-luxury-text dark:text-luxury-dark-text">Total Amount</span>
        <span class="text-3xl font-bold text-luxury-gold">{{ totalAmount.toFixed(2) }}</span>
      </div>
    <!-- </div> -->

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
