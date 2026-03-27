<script setup lang="ts">
import type { UserSearchResult, CustomerInfo } from '~/types/instantOrder'

interface Props {
  modelValue: UserSearchResult | null
  customerInfo: CustomerInfo
  searchResults: UserSearchResult[]
  searchLoading: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: UserSearchResult | null]
  'update:customerInfo': [value: CustomerInfo]
  'search': [query: string]
  'selectUser': [user: UserSearchResult]
  'clearUser': []
}>()

const isManualEntry = ref(false)
const searchQuery = ref('')

// When switching to manual entry, clear selected user
watch(isManualEntry, (newValue) => {
  if (newValue && props.modelValue) {
    emit('clearUser')
  }
})

// Handle search input
function handleSearchInput(event: Event) {
  const target = event.target as HTMLInputElement
  searchQuery.value = target.value
  emit('search', target.value)
}

// Select user from search results
function handleSelectUser(user: UserSearchResult) {
  emit('selectUser', user)
  searchQuery.value = ''
  isManualEntry.value = false
}

// Clear selected user
function handleClearUser() {
  emit('clearUser')
  searchQuery.value = ''
}

// Update customer info field
function updateCustomerInfo(field: keyof CustomerInfo, value: string) {
  emit('update:customerInfo', {
    ...props.customerInfo,
    [field]: value
  })
}

// Show search results dropdown
const showDropdown = computed(() => {
  return searchQuery.value.length >= 2 && props.searchResults.length > 0 && !props.modelValue
})
</script>

<template>
  <div class="space-y-4">
    <!-- Mode Toggle -->
    <div class="flex items-center gap-4 mb-4">
      <label class="flex items-center gap-2 cursor-pointer">
        <input
          type="radio"
          :checked="!isManualEntry"
          @change="isManualEntry = false"
          class="w-4 h-4 text-luxury-gold border-luxury-border focus:ring-luxury-gold"
        />
        <span class="text-sm text-luxury-text dark:text-luxury-dark-text">Search Existing User</span>
      </label>
      <label class="flex items-center gap-2 cursor-pointer">
        <input
          type="radio"
          :checked="isManualEntry"
          @change="isManualEntry = true"
          class="w-4 h-4 text-luxury-gold border-luxury-border focus:ring-luxury-gold"
        />
        <span class="text-sm text-luxury-text dark:text-luxury-dark-text">Manual Entry</span>
      </label>
    </div>

    <!-- User Search -->
    <div v-if="!isManualEntry" class="relative">
      <div v-if="modelValue" class="flex items-center justify-between p-4 bg-luxury-bg dark:bg-luxury-dark-bg rounded-luxury border border-luxury-border dark:border-luxury-dark-border">
        <div>
          <div class="font-medium text-luxury-text dark:text-luxury-dark-text">{{ modelValue.name }}</div>
          <div class="text-sm text-luxury-text-muted dark:text-luxury-dark-text-muted">{{ modelValue.phone }}</div>
        </div>
        <UiLuxuryButton variant="outline" size="sm" @click="handleClearUser">
          Change
        </UiLuxuryButton>
      </div>

      <template v-else>
        <div class="relative">
          <UiLuxuryInput
            :model-value="searchQuery"
            type="text"
            placeholder="Search by name or phone..."
            :icon="'search'"
            @input="handleSearchInput"
          />
          <div
            v-if="searchLoading"
            class="absolute right-3 top-1/2 -translate-y-1/2"
          >
            <div class="w-4 h-4 border-2 border-luxury-gold border-t-transparent rounded-full animate-spin" />
          </div>
        </div>

        <!-- Search Results Dropdown -->
        <div
          v-if="showDropdown"
          class="absolute z-10 w-full mt-1 bg-luxury-surface dark:bg-luxury-dark-surface border border-luxury-border dark:border-luxury-dark-border rounded-luxury shadow-lg max-h-60 overflow-y-auto"
        >
          <div
            v-for="user in searchResults"
            :key="user.id"
            class="p-3 hover:bg-luxury-bg dark:hover:bg-luxury-dark-bg cursor-pointer transition-colors"
            @click="handleSelectUser(user)"
          >
            <div class="font-medium text-luxury-text dark:text-luxury-dark-text">{{ user.name }}</div>
            <div class="text-sm text-luxury-text-muted dark:text-luxury-dark-text-muted">{{ user.phone }}</div>
          </div>
        </div>
      </template>
    </div>

    <!-- Manual Entry -->
    <div v-if="isManualEntry || !modelValue" class="space-y-3">
      <UiLuxuryInput
        :model-value="customerInfo.name"
        type="text"
        label="Customer Name"
        placeholder="Enter customer name"
        required
        @update:model-value="updateCustomerInfo('name', $event)"
      />
      <UiLuxuryInput
        :model-value="customerInfo.phone"
        type="tel"
        label="Phone Number"
        placeholder="Enter phone number"
        required
        @update:model-value="updateCustomerInfo('phone', $event)"
      />
      <UiLuxuryInput
        :model-value="customerInfo.address"
        type="text"
        label="Delivery Address"
        placeholder="Enter delivery address"
        required
        @update:model-value="updateCustomerInfo('address', $event)"
      />
    </div>
  </div>
</template>
