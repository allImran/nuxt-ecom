<script setup lang="ts">
import type { OrderItem } from '~/types/order'

interface Props {
  items: OrderItem[]
  getProductImage: (item: OrderItem) => string
  getProductSlug: (item: OrderItem) => string
  formatPrice: (price: number) => string
  calculateItemTotal: (item: OrderItem) => number
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  loading: false
})

const emit = defineEmits<{
  'edit-quantity': [item: OrderItem]
}>()

// Track which item is being edited
const editingItemId = ref<string | null>(null)

// Open quantity editor for item
function openQuantityEditor(item: OrderItem) {
  editingItemId.value = item.id
  emit('edit-quantity', item)
}

// Close quantity editor
function closeQuantityEditor() {
  editingItemId.value = null
}

// Provide editor state to child components
provide('editorOpen', computed(() => editingItemId.value))
provide('closeEditor', closeQuantityEditor)
</script>

<template>
  <div class="bg-luxury-surface dark:bg-luxury-dark-surface rounded-luxury p-6 sm:p-8 shadow-luxury">
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-lg font-semibold text-luxury-text dark:text-luxury-dark-text tracking-luxury">
        Order Items
      </h2>
      <span class="text-sm text-luxury-text-muted dark:text-luxury-dark-text-muted">
        {{ items.length }} {{ items.length === 1 ? 'item' : 'items' }}
      </span>
    </div>

    <div class="space-y-4">
      <div
        v-for="item in items"
        :key="item.id"
        class="flex items-start gap-4 p-4 bg-luxury-bg dark:bg-luxury-dark-bg rounded-luxury border border-luxury-border dark:border-luxury-dark-border"
      >
        <!-- Product Image -->
        <NuxtLink
          :to="`/product/${getProductSlug(item)}`"
          class="flex-shrink-0 w-20 h-20 bg-luxury-surface dark:bg-luxury-dark-surface rounded overflow-hidden"
        >
          <img
            v-if="getProductImage(item)"
            :src="getProductImage(item)"
            :alt="item.snapshot_name"
            class="w-full h-full object-cover"
          />
          <div v-else class="w-full h-full flex items-center justify-center">
            <UiIcon name="image" :size="32" class="text-luxury-text-muted/30 dark:text-luxury-dark-text-muted/30" />
          </div>
        </NuxtLink>

        <!-- Product Info -->
        <div class="flex-1 min-w-0">
          <NuxtLink
            :to="`/product/${getProductSlug(item)}`"
            class="block text-sm font-medium text-luxury-text dark:text-luxury-dark-text hover:text-luxury-gold transition-colors truncate"
          >
            {{ item.snapshot_name }}
          </NuxtLink>

          <!-- Variant Info (if any) -->
          <p v-if="item.variant_id" class="text-xs text-luxury-text-muted dark:text-luxury-dark-text-muted mt-1">
            Variant: {{ item.variant_id.slice(0, 8) }}
          </p>

          <!-- Quantity and Price -->
          <div class="flex items-center gap-4 mt-2">
            <span class="text-sm text-luxury-text-muted dark:text-luxury-dark-text-muted">
              Qty: {{ item.quantity }}
            </span>
            <span class="text-sm text-luxury-gold">
              {{ formatPrice(typeof item.price_at_purchase === 'string' ? parseFloat(item.price_at_purchase) : item.price_at_purchase) }}
              <span class="text-luxury-text-muted dark:text-luxury-dark-text-muted">each</span>
            </span>
          </div>
        </div>

        <!-- Item Total and Edit Button -->
        <div class="flex flex-col items-end gap-2">
          <span class="text-lg font-semibold text-luxury-text dark:text-luxury-dark-text">
            {{ formatPrice(calculateItemTotal(item)) }}
          </span>
          <UiLuxuryButton
            size="sm"
            variant="outline"
            :disabled="loading"
            @click="openQuantityEditor(item)"
          >
            <UiIcon name="edit-2" :size="14" class="mr-1" />
            Edit
          </UiLuxuryButton>
        </div>
      </div>
    </div>
  </div>
</template>
