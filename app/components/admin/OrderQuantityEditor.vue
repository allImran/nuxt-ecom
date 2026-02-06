<script setup lang="ts">
import type { OrderItem } from '~/types/order'

interface Props {
  isOpen: boolean
  item: OrderItem
  formatPrice: (price: number) => string
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  loading: false
})

const emit = defineEmits<{
  save: [quantity: number]
  cancel: []
}>()

// Local quantity state
const localQuantity = ref(props.item.quantity)

// Computed: New total
const newTotal = computed(() => {
  const price = typeof props.item.price_at_purchase === 'string'
    ? parseFloat(props.item.price_at_purchase)
    : props.item.price_at_purchase
  return (price || 0) * (localQuantity.value || 0)
})

// Computed: Total changed
const totalChanged = computed(() => {
  return newTotal.value !== props.calculateItemTotal?.(props.item) ?? false
})

// Handle quantity increment
function incrementQuantity() {
  localQuantity.value = Math.min(999, localQuantity.value + 1)
}

// Handle quantity decrement
function decrementQuantity() {
  localQuantity.value = Math.max(1, localQuantity.value - 1)
}

// Handle direct input
function handleInput(event: Event) {
  const value = parseInt((event.target as HTMLInputElement).value, 10)
  if (!isNaN(value) && value >= 1 && value <= 999) {
    localQuantity.value = value
  }
}

// Handle save
function handleSave() {
  if (localQuantity.value >= 1 && localQuantity.value !== props.item.quantity) {
    emit('save', localQuantity.value)
  }
}

// Handle cancel
function handleCancel() {
  localQuantity.value = props.item.quantity
  emit('cancel')
}

// Reset local quantity when item changes
watch(() => props.item, (newItem) => {
  localQuantity.value = newItem.quantity
}, { immediate: true })
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
        <div class="flex items-center justify-between">
          <h3 class="text-xl font-semibold text-luxury-text dark:text-luxury-dark-text">
            Edit Quantity
          </h3>
          <button
            type="button"
            class="text-luxury-text-muted hover:text-luxury-text dark:hover:text-luxury-dark-text transition-colors"
            :disabled="loading"
            @click="handleCancel"
          >
            <UiIcon name="x" :size="24" />
          </button>
        </div>

        <!-- Product Info -->
        <div class="flex items-center gap-4 bg-luxury-surface dark:bg-luxury-dark-surface rounded-luxury p-4">
          <img
            v-if="item.product?.file_paths?.[0]"
            :src="item.product.file_paths[0]"
            :alt="item.snapshot_name"
            class="w-16 h-16 object-cover rounded"
          />
          <div v-else class="w-16 h-16 bg-luxury-border dark:bg-luxury-dark-border rounded flex items-center justify-center">
            <UiIcon name="image" :size="24" class="text-luxury-text-muted/30 dark:text-luxury-dark-text-muted/30" />
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-luxury-text dark:text-luxury-dark-text truncate">
              {{ item.snapshot_name }}
            </p>
            <p class="text-sm text-luxury-gold">
              {{ formatPrice(typeof item.price_at_purchase === 'string' ? parseFloat(item.price_at_purchase) : item.price_at_purchase) }}
              <span class="text-luxury-text-muted dark:text-luxury-dark-text-muted">each</span>
            </p>
          </div>
        </div>

        <!-- Quantity Control -->
        <div class="space-y-3">
          <label class="block text-sm font-medium text-luxury-text-muted dark:text-luxury-dark-text-muted">
            Quantity
          </label>
          <div class="flex items-center gap-3">
            <!-- Decrement Button -->
            <button
              type="button"
              :disabled="localQuantity <= 1 || loading"
              class="w-12 h-12 rounded-luxury bg-luxury-surface dark:bg-luxury-dark-surface border border-luxury-border dark:border-luxury-dark-border text-luxury-text dark:text-luxury-dark-text hover:bg-luxury-bg dark:hover:bg-luxury-dark-bg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              @click="decrementQuantity"
            >
              <UiIcon name="minus" :size="18" />
            </button>

            <!-- Quantity Input -->
            <input
              :value="localQuantity"
              type="number"
              min="1"
              max="999"
              :disabled="loading"
              class="flex-1 h-12 px-4 text-center bg-luxury-surface dark:bg-luxury-dark-surface border border-luxury-border dark:border-luxury-dark-border rounded-luxury text-lg font-medium text-luxury-text dark:text-luxury-dark-text focus:outline-none focus:ring-1 focus:ring-luxury-gold disabled:opacity-50"
              @input="handleInput"
            />

            <!-- Increment Button -->
            <button
              type="button"
              :disabled="localQuantity >= 999 || loading"
              class="w-12 h-12 rounded-luxury bg-luxury-surface dark:bg-luxury-dark-surface border border-luxury-border dark:border-luxury-dark-border text-luxury-text dark:text-luxury-dark-text hover:bg-luxury-bg dark:hover:bg-luxury-dark-bg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              @click="incrementQuantity"
            >
              <UiIcon name="plus" :size="18" />
            </button>
          </div>
        </div>

        <!-- Total Preview -->
        <div class="bg-luxury-surface dark:bg-luxury-dark-surface rounded-luxury p-4">
          <div class="flex items-center justify-between">
            <span class="text-sm text-luxury-text-muted dark:text-luxury-dark-text-muted">
              New Item Total:
            </span>
            <span
              class="text-lg font-semibold"
              :class="totalChanged ? 'text-luxury-gold' : 'text-luxury-text dark:text-luxury-dark-text'"
            >
              {{ formatPrice(newTotal) }}
            </span>
          </div>
          <p v-if="totalChanged" class="text-xs text-luxury-text-muted dark:text-luxury-dark-text-muted mt-1">
            Changed from {{ formatPrice(typeof item.price_at_purchase === 'string' ? parseFloat(item.price_at_purchase) * item.quantity : item.price_at_purchase * item.quantity) }}
          </p>
        </div>

        <!-- Actions -->
        <div class="flex items-center justify-end gap-3 pt-2">
          <UiLuxuryButton variant="ghost" type="button" :disabled="loading" @click="handleCancel">
            Cancel
          </UiLuxuryButton>
          <UiLuxuryButton
            type="button"
            :disabled="localQuantity === item.quantity"
            :loading="loading"
            @click="handleSave"
          >
            Save Changes
          </UiLuxuryButton>
        </div>
      </div>
    </div>
  </Teleport>
</template>
