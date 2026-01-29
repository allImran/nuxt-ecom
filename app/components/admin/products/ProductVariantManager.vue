<script setup lang="ts">
import type { ProductVariant } from '~/network/admin'
import { useProductViewModel } from '~/composables/useProductViewModel'

interface Props {
  productId: string
  modelValue: ProductVariant[]
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: ProductVariant[]): void
}>()

const {
  variantForm,
  showVariantModal,
  editingVariant,
  deletingVariant,
  isEditingVariant,
  openCreateVariantModal,
  openEditVariantModal,
  closeVariantModal,
  addVariantAttribute,
  removeVariantAttribute,
  saveVariant,
  deleteVariant,
  updateVariants,
  formatPrice,
  formatAttributes
} = useProductViewModel()

const variants = computed({
  get: () => props.modelValue || [],
  set: (value) => {
    emit('update:modelValue', value)
    updateVariants(value)
  }
})

const handleSaveVariant = async () => {
  await saveVariant(props.productId)
}
</script>

<template>
  <div class="space-y-4">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <h3 class="text-lg font-medium text-luxury-text dark:text-luxury-dark-text">
        Variants
      </h3>
      <UiLuxuryButton variant="outline" @click="openCreateVariantModal">
        <UiIcon name="plus" :size="16" class="mr-2" />
        Add Variant
      </UiLuxuryButton>
    </div>

    <!-- Variants Table -->
    <div v-if="variants.length > 0" class="overflow-x-auto">
      <table class="w-full">
        <thead>
          <tr class="border-b border-luxury-border dark:border-luxury-dark-border">
            <th class="text-left py-3 px-4 text-sm font-medium text-luxury-text-muted dark:text-luxury-dark-text-muted">SKU</th>
            <th class="text-left py-3 px-4 text-sm font-medium text-luxury-text-muted dark:text-luxury-dark-text-muted">Price</th>
            <th class="text-left py-3 px-4 text-sm font-medium text-luxury-text-muted dark:text-luxury-dark-text-muted">Attributes</th>
            <th class="text-right py-3 px-4 text-sm font-medium text-luxury-text-muted dark:text-luxury-dark-text-muted">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="variant in variants"
            :key="variant.id"
            class="border-b border-luxury-border/50 dark:border-luxury-dark-border/50 hover:bg-luxury-surface/50 dark:hover:bg-luxury-dark-surface/50"
          >
            <td class="py-3 px-4 text-luxury-text dark:text-luxury-dark-text font-mono text-sm">
              {{ variant.sku }}
            </td>
            <td class="py-3 px-4 text-luxury-text dark:text-luxury-dark-text">
              {{ formatPrice(variant.price) }}
            </td>
            <td class="py-3 px-4 text-luxury-text-muted dark:text-luxury-dark-text-muted text-sm">
              {{ formatAttributes(variant.attributes) || '—' }}
            </td>
            <td class="py-3 px-4 text-right">
              <div class="flex items-center justify-end gap-2">
                <button
                  type="button"
                  class="p-2 text-luxury-text-muted hover:text-luxury-gold transition-colors"
                  title="Edit variant"
                  @click="openEditVariantModal(variant)"
                >
                  <UiIcon name="pencil" :size="16" />
                </button>
                <button
                  type="button"
                  class="p-2 text-luxury-text-muted hover:text-red-500 transition-colors"
                  :class="{ 'opacity-50 pointer-events-none': deletingVariant === variant.id }"
                  title="Delete variant"
                  @click="deleteVariant(variant)"
                >
                  <UiIcon v-if="deletingVariant !== variant.id" name="trash-2" :size="16" />
                  <UiIcon v-else name="loader-2" :size="16" class="animate-spin" />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-8 text-luxury-text-muted dark:text-luxury-dark-text-muted">
      <UiIcon name="package" :size="48" class="mx-auto mb-4 opacity-50" />
      <p>No variants yet. Add your first variant to define pricing and attributes.</p>
    </div>

    <!-- Modal -->
    <Teleport to="body">
      <div
        v-if="showVariantModal"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <!-- Backdrop -->
        <div
          class="absolute inset-0 bg-black/50"
          @click="closeVariantModal"
        ></div>

        <!-- Modal Content -->
        <div class="relative bg-luxury-bg dark:bg-luxury-dark-bg rounded-luxury shadow-xl w-full max-w-md p-6 space-y-6">
          <div class="flex items-center justify-between">
            <h3 class="text-xl font-semibold text-luxury-text dark:text-luxury-dark-text">
              {{ isEditingVariant ? 'Edit Variant' : 'Add Variant' }}
            </h3>
            <button
              type="button"
              class="text-luxury-text-muted hover:text-luxury-text dark:hover:text-luxury-dark-text transition-colors"
              @click="closeVariantModal"
            >
              <UiIcon name="x" :size="24" />
            </button>
          </div>

          <form @submit.prevent="handleSaveVariant" class="space-y-4">
            <!-- SKU -->
            <UiLuxuryInput
              id="variant-sku"
              v-model="variantForm.sku"
              label="SKU"
              placeholder="e.g., PROD-001-RED-M"
            />

            <!-- Price -->
            <div class="relative group">
              <input
                id="variant-price"
                v-model.number="variantForm.price"
                type="number"
                step="0.01"
                min="0"
                placeholder=" "
                class="peer w-full bg-transparent border-b-2 border-luxury-border dark:border-luxury-dark-border py-3 px-1 text-luxury-text dark:text-luxury-dark-text focus:outline-none focus:border-luxury-gold transition-colors duration-300 placeholder-transparent"
              />
              <label
                for="variant-price"
                class="absolute left-1 top-3 text-luxury-text-muted dark:text-luxury-dark-text-muted text-base transition-all duration-300 
                       peer-placeholder-shown:top-3 peer-placeholder-shown:text-base 
                       peer-focus:-top-4 peer-focus:text-xs peer-focus:text-luxury-gold
                       peer-not-placeholder-shown:-top-4 peer-not-placeholder-shown:text-xs"
              >
                Price
              </label>
            </div>

            <!-- Attributes -->
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <label class="text-sm font-medium text-luxury-text-muted dark:text-luxury-dark-text-muted">
                  Attributes
                </label>
                <button
                  type="button"
                  class="text-sm text-luxury-gold hover:text-luxury-gold-hover transition-colors"
                  @click="addVariantAttribute"
                >
                  + Add Attribute
                </button>
              </div>

              <div
                v-for="(attr, index) in variantForm.attributes"
                :key="index"
                class="flex items-center gap-2"
              >
                <input
                  v-model="attr.key"
                  type="text"
                  placeholder="Key (e.g., Color)"
                  class="flex-1 bg-transparent border-b border-luxury-border dark:border-luxury-dark-border py-2 px-1 text-sm text-luxury-text dark:text-luxury-dark-text focus:outline-none focus:border-luxury-gold transition-colors"
                />
                <input
                  v-model="attr.value"
                  type="text"
                  placeholder="Value (e.g., Red)"
                  class="flex-1 bg-transparent border-b border-luxury-border dark:border-luxury-dark-border py-2 px-1 text-sm text-luxury-text dark:text-luxury-dark-text focus:outline-none focus:border-luxury-gold transition-colors"
                />
                <button
                  type="button"
                  class="p-1 text-luxury-text-muted hover:text-red-500 transition-colors"
                  @click="removeVariantAttribute(index)"
                >
                  <UiIcon name="x" :size="16" />
                </button>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex items-center justify-end gap-3 pt-4">
              <UiLuxuryButton variant="ghost" type="button" @click="closeVariantModal">
                Cancel
              </UiLuxuryButton>
              <UiLuxuryButton type="submit">
                {{ isEditingVariant ? 'Update' : 'Create' }}
              </UiLuxuryButton>
            </div>
          </form>
        </div>
      </div>
    </Teleport>
  </div>
</template>
