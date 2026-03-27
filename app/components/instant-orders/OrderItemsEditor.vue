<script setup lang="ts">
import type { OrderItemForm } from '~/types/instantOrder'

interface Props {
  modelValue: OrderItemForm[]
  validationErrors?: Record<string, string>
}

const props = withDefaults(defineProps<Props>(), {
  validationErrors: () => ({})
})

const emit = defineEmits<{
  'update:modelValue': [value: OrderItemForm[]]
}>()

const items = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const unitOptions = [
  { value: 'pcs', label: 'Pieces' },
  { value: 'kg', label: 'Kilograms' },
  { value: 'g', label: 'Grams' },
  { value: 'lb', label: 'Pounds' },
  { value: 'oz', label: 'Ounces' },
  { value: 'l', label: 'Liters' },
  { value: 'ml', label: 'Milliliters' },
  { value: 'm', label: 'Meters' },
  { value: 'cm', label: 'Centimeters' },
  { value: 'box', label: 'Box' },
  { value: 'pack', label: 'Pack' },
  { value: 'set', label: 'Set' }
]

function addItem() {
  items.value = [
    ...items.value,
    {
      title: '',
      price: 0,
      quantity: 1,
      unit: 'pcs',
      description: ''
    }
  ]
}

function removeItem(index: number) {
  if (items.value.length > 1) {
    items.value = items.value.filter((_, i) => i !== index)
  } else {
    // Clear the only item instead of removing
    items.value = [{
      title: '',
      price: 0,
      quantity: 1,
      unit: 'pcs',
      description: ''
    }]
  }
}

function updateItem(index: number, field: keyof OrderItemForm, value: any) {
  items.value = items.value.map((item, i) =>
    i === index ? { ...item, [field]: value } : item
  )
}

function getItemSubtotal(item: OrderItemForm): number {
  return (item.price || 0) * (item.quantity || 0)
}

function getValidationError(index: number, field: string): string | undefined {
  const key = `order_items.${index}.${field}`
  return props.validationErrors[key]
}

// Calculate total
const total = computed(() => {
  return items.value.reduce((sum, item) => sum + getItemSubtotal(item), 0)
})
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <h3 class="text-lg font-medium text-luxury-text dark:text-luxury-dark-text">Order Items</h3>
      <UiLuxuryButton variant="outline" size="sm" @click="addItem">
        <UiIcon name="plus" :size="16" class="mr-1" />
        Add Item
      </UiLuxuryButton>
    </div>

    <div class="space-y-3">
      <div
        v-for="(item, index) in items"
        :key="index"
        class="p-4 bg-luxury-bg dark:bg-luxury-dark-bg border border-luxury-border dark:border-luxury-dark-border rounded-luxury"
      >
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
          <!-- Title -->
          <div class="lg:col-span-2">
            <UiLuxuryInput
              :model-value="item.title"
              type="text"
              label="Item Title"
              placeholder="e.g., Custom Cake"
              required
              :error="getValidationError(index, 'title')"
              @update:model-value="updateItem(index, 'title', $event)"
            />
          </div>

          <!-- Price -->
          <div>
            <UiLuxuryInput
              :model-value="item.price"
              type="number"
              label="Price"
              placeholder="0"
              min="0"
              step="0.01"
              required
              :error="getValidationError(index, 'price')"
              @update:model-value="updateItem(index, 'price', parseFloat($event) || 0)"
            />
          </div>

          <!-- Quantity & Unit -->
          <div class="flex gap-2">
            <div class="flex-1">
              <UiLuxuryInput
                :model-value="item.quantity"
                type="number"
                label="Quantity"
                placeholder="1"
                min="1"
                required
                :error="getValidationError(index, 'quantity')"
                @update:model-value="updateItem(index, 'quantity', parseInt($event) || 1)"
              />
            </div>
            <div class="w-24">
              <UiLuxurySelect
                :model-value="item.unit"
                :options="unitOptions"
                label="Unit"
                @update:model-value="updateItem(index, 'unit', $event)"
              />
            </div>
          </div>
        </div>

        <!-- Description (optional) -->
        <div class="mb-3">
          <UiLuxuryInput
            :model-value="item.description"
            type="text"
            label="Description (optional)"
            placeholder="Additional details about this item"
            @update:model-value="updateItem(index, 'description', $event)"
          />
        </div>

        <!-- Item Subtotal & Remove Button -->
        <div class="flex items-center justify-between pt-2 border-t border-luxury-border dark:border-luxury-dark-border">
          <span class="text-sm text-luxury-text-muted dark:text-luxury-dark-text-muted">
            Subtotal: <span class="font-medium text-luxury-text dark:text-luxury-dark-text">{{ total.toFixed(2) }}</span>
          </span>
          <UiLuxuryButton
            variant="outline"
            size="sm"
            class="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
            @click="removeItem(index)"
          >
            <UiIcon name="trash" :size="16" class="mr-1" />
            Remove
          </UiLuxuryButton>
        </div>
      </div>
    </div>

    <!-- Items Total -->
    <div class="flex justify-end p-3 bg-luxury-surface dark:bg-luxury-dark-surface border border-luxury-border dark:border-luxury-dark-border rounded-luxury">
      <span class="text-lg font-medium text-luxury-text dark:text-luxury-dark-text">
        Items Total: {{ total.toFixed(2) }}
      </span>
    </div>
  </div>
</template>
