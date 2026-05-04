<script setup lang="ts">
import type { UserSearchResult, CustomerInfo } from '~/types/instantOrder'

interface Props {
  modelValue: UserSearchResult | null
  customerInfo: CustomerInfo
  searchResults: UserSearchResult[]
  searchLoading: boolean
  validationErrors?: Record<string, string>
}

const props = withDefaults(defineProps<Props>(), {
  validationErrors: () => ({})
})

const emit = defineEmits<{
  'update:modelValue': [value: UserSearchResult | null]
  'update:customerInfo': [value: CustomerInfo]
  'search': [query: string]
  'selectUser': [user: UserSearchResult]
  'clearUser': []
}>()

const entryMode = ref<'manual' | 'search'>('manual')
const searchQuery = ref('')

// When switching mode, clear selected user if going to manual
watch(entryMode, (newValue) => {
  if (newValue === 'manual' && props.modelValue) {
    emit('clearUser')
  }
})

// Handle search input with debounce
const searchDebounced = ref('')
watch(searchDebounced, (newValue) => {
  if (newValue.length >= 2) {
    emit('search', newValue)
  }
})

// Select user from search results
function handleSelectUser(user: UserSearchResult) {
  emit('selectUser', user)
  searchQuery.value = ''
  searchDebounced.value = ''
}

// Clear selected user
function handleClearUser() {
  emit('clearUser')
  searchQuery.value = ''
  searchDebounced.value = ''
}

// Update customer info field
function updateCustomerInfo(field: keyof CustomerInfo, value: string | number) {
  emit('update:customerInfo', {
    ...props.customerInfo,
    [field]: String(value)
  })
}

// Show search results dropdown
const showDropdown = computed(() => {
  return searchQuery.value.length >= 2 && props.searchResults.length > 0 && !props.modelValue
})

const entryModeOptions = [
  { value: 'manual', label: 'Manual' },
  { value: 'search', label: 'Search' }
]
</script>

<template>
  <UiM3Card padding="none" class="overflow-hidden">
    <!-- Card Header with Toggle -->
    <div class="px-card-padding py-4 border-b border-outline-variant/20 flex items-center justify-between flex-wrap gap-3">
      <h2 class="font-h2 text-h2 text-on-surface">Customer Information</h2>
      <div class="flex bg-surface-container-lowest p-1 rounded-lg">
        <UiM3SegmentedButton
          v-model="entryMode"
          :segments="entryModeOptions"
        />
      </div>
    </div>

    <!-- Card Body -->
    <div class="p-card-padding">
      <!-- Search Existing Mode -->
      <div v-if="entryMode === 'search'" class="space-y-4">
        <!-- Selected User Display -->
        <div v-if="modelValue" class="flex items-center justify-between p-4 bg-surface-container-low rounded-lg">
          <div>
            <div class="font-semibold text-on-surface">{{ modelValue.name }}</div>
            <div class="text-body-md text-on-surface-variant">{{ modelValue.phone }}</div>
            <div v-if="modelValue.email" class="text-body-md text-on-surface-variant">{{ modelValue.email }}</div>
          </div>
          <button
            type="button"
            class="text-primary font-semibold hover:bg-primary/10 px-3 py-1 rounded-full transition-colors"
            @click="handleClearUser"
          >
            Change
          </button>
        </div>

        <!-- Search Input -->
        <div v-else class="relative">
          <UiM3Input
            :model-value="searchQuery"
            type="text"
            label="SEARCH CUSTOMER"
            placeholder="Search by name or phone number..."
            @update:model-value="(val) => { searchQuery = String(val); searchDebounced = String(val) }"
          />
          <div
            v-if="searchLoading"
            class="absolute right-4 top-10"
          >
            <div class="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>

          <!-- Search Results Dropdown -->
          <div
            v-if="showDropdown"
            class="absolute z-10 w-full mt-1 bg-surface-container-lowest border border-outline-variant/30 rounded-xl shadow-lg max-h-60 overflow-y-auto"
          >
            <div
              v-for="user in searchResults"
              :key="user.id"
              class="p-3 hover:bg-surface-container-low cursor-pointer transition-colors border-b border-outline-variant/10 last:border-0"
              @click="handleSelectUser(user)"
            >
              <div class="font-medium text-on-surface">{{ user.name }}</div>
              <div class="text-body-md text-on-surface-variant">{{ user.phone }}</div>
              <div v-if="user.email" class="text-body-md text-on-surface-variant">{{ user.email }}</div>
            </div>
          </div>
        </div>

        <!-- Manual entry fields always show when no user selected -->
        <div v-if="!modelValue" class="grid grid-cols-1 md:grid-cols-2 gap-stack-md pt-2">
          <UiM3Input
            :model-value="customerInfo.name"
            type="text"
            label="FULL NAME"
            placeholder="e.g. Alexander Pierce"
            :error="validationErrors['customer_info.name']"
            @update:model-value="updateCustomerInfo('name', $event)"
          />
          <UiM3Input
            :model-value="customerInfo.phone"
            type="tel"
            label="PHONE NUMBER"
            placeholder="e.g. +1 234 567 8900"
            :error="validationErrors['customer_info.phone']"
            @update:model-value="updateCustomerInfo('phone', $event)"
          />
        </div>
      </div>

      <!-- Manual Entry Mode -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-stack-md">
        <UiM3Input
          :model-value="customerInfo.name"
          type="text"
          label="FULL NAME"
          placeholder="e.g. Alexander Pierce"
          :error="validationErrors['customer_info.name']"
          @update:model-value="updateCustomerInfo('name', $event)"
        />
        <UiM3Input
          :model-value="customerInfo.phone"
          type="tel"
          label="PHONE NUMBER"
          placeholder="e.g. +1 234 567 8900"
          :error="validationErrors['customer_info.phone']"
          @update:model-value="updateCustomerInfo('phone', $event)"
        />
      </div>

      <!-- Shipping Address - Always visible -->
      <div class="mt-4">
        <UiM3Input
          :model-value="customerInfo.address"
          type="text"
          label="SHIPPING ADDRESS"
          placeholder="Enter full shipping address..."
          :rows="3"
          :error="validationErrors['customer_info.address']"
          @update:model-value="updateCustomerInfo('address', $event)"
        />
      </div>
    </div>
  </UiM3Card>
</template>
