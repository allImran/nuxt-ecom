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
  { value: 'piece', label: 'piece' },
  { value: 'kg', label: 'kg' },
  { value: 'gram', label: 'gram' },
  { value: 'lb', label: 'lb' },
  { value: 'oz', label: 'oz' },
  { value: 'box', label: 'box' },
  { value: 'pack', label: 'pack' },
  { value: 'set', label: 'set' }
]

function addItem() {
  items.value = [
    ...items.value,
    {
      title: '',
      price: 0,
      quantity: 1,
      unit: 'piece',
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
      unit: 'piece',
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

function incrementQuantity(index: number) {
  const item = items.value[index]
  if (item) {
    updateItem(index, 'quantity', (item.quantity || 1) + 1)
  }
}

function decrementQuantity(index: number) {
  const item = items.value[index]
  if (item && (item.quantity || 1) > 1) {
    updateItem(index, 'quantity', (item.quantity || 1) - 1)
  }
}
</script>

<template>
  <UiM3Card padding="none" class="overflow-hidden">
    <!-- Card Header -->
    <div class="px-card-padding py-4 border-b border-outline-variant/20 flex items-center justify-between">
      <h2 class="font-h2 text-h2 text-on-surface">Order Items</h2>
      <UiLuxuryButton
        type="button"
        @click="addItem"
      >
        Add Item
      </UiLuxuryButton>
    </div>

    <!-- Card Body -->
    <div class="p-card-padding flex flex-col gap-stack-lg">
      <!-- Table Header (Desktop Only) -->
      <div class="hidden md:grid grid-cols-12 gap-4 border-b border-outline-variant/10 pb-2">
        <div class="col-span-5 font-label-caps text-label-caps text-on-surface-variant">ITEM DETAILS</div>
        <div class="col-span-2 font-label-caps text-label-caps text-on-surface-variant">UNIT</div>
        <div class="col-span-4 font-label-caps text-label-caps text-on-surface-variant text-right">PRICE & QTY</div>
        <div class="col-span-1"></div>
      </div>

      <!-- Order Items Rows -->
      <div
        v-for="(item, index) in items"
        :key="index"
        class="grid grid-cols-1 md:grid-cols-12 gap-4 items-start group"
      >
        <!-- Item Details (Title + Description) -->
        <div class="col-span-1 md:col-span-5 flex flex-col gap-2">
          <input
            :value="item.title"
            type="text"
            placeholder="Item Title"
            class="w-full bg-surface-container-lowest border-none focus:ring-1 focus:ring-primary rounded-lg py-2 px-3 text-on-surface font-semibold transition-all"
            @input="updateItem(index, 'title', ($event.target as HTMLInputElement).value)"
          />
          <textarea
            :value="item.description || ''"
            placeholder="Optional Description"
            rows="1"
            class="w-full bg-surface-container-lowest border-none focus:ring-1 focus:ring-primary rounded-lg py-2 px-3 text-body-md text-on-surface-variant resize-none transition-all"
            @input="updateItem(index, 'description', ($event.target as HTMLTextAreaElement).value)"
          />
          <p v-if="getValidationError(index, 'title')" class="text-body-md text-error">
            {{ getValidationError(index, 'title') }}
          </p>
        </div>

        <!-- Unit -->
        <div class="col-span-1 md:col-span-2">
          <select
            :value="item.unit"
            class="w-full bg-surface-container-lowest border-none focus:ring-1 focus:ring-primary rounded-lg py-2 px-3 text-on-surface appearance-none cursor-pointer transition-all"
            @change="updateItem(index, 'unit', ($event.target as HTMLSelectElement).value)"
          >
            <option
              v-for="unit in unitOptions"
              :key="unit.value"
              :value="unit.value"
            >
              {{ unit.label }}
            </option>
          </select>
        </div>

        <!-- Price & Quantity Side by Side -->
        <div class="col-span-1 md:col-span-4 flex items-center gap-3">
          <!-- Price -->
          <div class="relative flex-1">
            <span class="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">$</span>
            <input
              :value="item.price"
              type="number"
              min="0"
              step="0.01"
              class="w-full pl-7 bg-surface-container-lowest border-none focus:ring-1 focus:ring-primary rounded-lg py-2 px-3 text-on-surface text-right transition-all"
              @input="updateItem(index, 'price', parseFloat(($event.target as HTMLInputElement).value) || 0)"
            />
          </div>

          <!-- Quantity Stepper -->
          <div class="flex items-center gap-3 bg-surface-container-low px-2 py-1 rounded-full">
            <button
              type="button"
              class="material-symbols-outlined text-sm text-on-surface-variant hover:text-on-surface disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              :disabled="(item.quantity || 1) <= 1"
              @click="decrementQuantity(index)"
            >
              <UiIcon name="minus" :size="20" />
            </button>
            <span class="text-body-md font-bold w-4 text-center">{{ item.quantity || 1 }}</span>
            <button
              type="button"
              class="material-symbols-outlined text-sm text-on-surface-variant hover:text-on-surface transition-colors"
              @click="incrementQuantity(index)"
            >
              <UiIcon name="plus" :size="20" />
            </button>
          </div>
        </div>

        <!-- Actions -->
        <div class="col-span-1 flex justify-end md:justify-center pt-2">
          <button
            v-if="items.length > 1"
            type="button"
            class="text-error/70 hover:text-error transition-colors"
            @click="removeItem(index)"
          >
            <span class="material-symbols-outlined">delete</span>
          </button>
        </div>
      </div>

      <!-- Empty State / Add More -->
      <div
        v-if="items.length === 0 || (items.length === 1 && !items[0].title)"
        class="text-center py-6 text-on-surface-variant"
      >
        <p class="text-body-md">No items added yet. Click "Add Line" to add items.</p>
      </div>
    </div>
  </UiM3Card>
</template>
