<script setup lang="ts">
import { adminNetwork, type ProductVariant, type CreateVariantData, type UpdateVariantData } from '~/network/admin'

interface Props {
  productId: string
  modelValue: ProductVariant[]
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: ProductVariant[]): void
}>()

const variants = computed({
  get: () => props.modelValue || [],
  set: (value) => emit('update:modelValue', value)
})

// Modal state
const showModal = ref(false)
const editingVariant = ref<ProductVariant | null>(null)
const saving = ref(false)
const deleting = ref<string | null>(null)

// Form state
const form = reactive({
  sku: '',
  price: 0,
  attributes: [] as { key: string; value: string }[]
})

const isEditing = computed(() => editingVariant.value !== null)

const openCreateModal = () => {
  editingVariant.value = null
  form.sku = ''
  form.price = 0
  form.attributes = [{ key: '', value: '' }]
  showModal.value = true
}

const openEditModal = (variant: ProductVariant) => {
  editingVariant.value = variant
  form.sku = variant.sku
  form.price = variant.price
  form.attributes = Object.entries(variant.attributes || {}).map(([key, value]) => ({ key, value }))
  if (form.attributes.length === 0) {
    form.attributes = [{ key: '', value: '' }]
  }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  editingVariant.value = null
}

const addAttribute = () => {
  form.attributes.push({ key: '', value: '' })
}

const removeAttribute = (index: number) => {
  form.attributes.splice(index, 1)
  if (form.attributes.length === 0) {
    form.attributes.push({ key: '', value: '' })
  }
}

const getAttributesObject = (): Record<string, string> => {
  const attrs: Record<string, string> = {}
  for (const attr of form.attributes) {
    if (attr.key.trim() && attr.value.trim()) {
      attrs[attr.key.trim()] = attr.value.trim()
    }
  }
  return attrs
}

const saveVariant = async () => {
  if (!form.sku.trim()) return

  saving.value = true
  try {
    const attributes = getAttributesObject()

    if (isEditing.value && editingVariant.value) {
      // Update existing variant
      const data: UpdateVariantData = {
        sku: form.sku,
        price: form.price,
        attributes
      }
      const updated = await adminNetwork.updateVariant(editingVariant.value.id, data)
      const index = variants.value.findIndex(v => v.id === editingVariant.value!.id)
      if (index !== -1) {
        const newVariants = [...variants.value]
        newVariants[index] = updated
        variants.value = newVariants
      }
    } else {
      // Create new variant
      const data: CreateVariantData = {
        sku: form.sku,
        price: form.price,
        attributes,
        product_id: props.productId
      }
      const created = await adminNetwork.createVariant(props.productId, data)
      variants.value = [...variants.value, created]
    }

    closeModal()
  } catch (error) {
    console.error('Failed to save variant:', error)
  } finally {
    saving.value = false
  }
}

const deleteVariant = async (variant: ProductVariant) => {
  if (!confirm(`Are you sure you want to delete variant "${variant.sku}"?`)) return

  deleting.value = variant.id
  try {
    await adminNetwork.deleteVariant(variant.id)
    variants.value = variants.value.filter(v => v.id !== variant.id)
  } catch (error) {
    console.error('Failed to delete variant:', error)
  } finally {
    deleting.value = null
  }
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(price)
}

const formatAttributes = (attributes: Record<string, string>) => {
  return Object.entries(attributes || {})
    .map(([key, value]) => `${key}: ${value}`)
    .join(', ')
}
</script>

<template>
  <div class="space-y-4">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <h3 class="text-lg font-medium text-luxury-text dark:text-luxury-dark-text">
        Variants
      </h3>
      <UiLuxuryButton variant="outline" @click="openCreateModal">
        <svg class="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
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
                  @click="openEditModal(variant)"
                >
                  <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  type="button"
                  class="p-2 text-luxury-text-muted hover:text-red-500 transition-colors"
                  :class="{ 'opacity-50 pointer-events-none': deleting === variant.id }"
                  title="Delete variant"
                  @click="deleteVariant(variant)"
                >
                  <svg v-if="deleting !== variant.id" class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  <svg v-else class="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-8 text-luxury-text-muted dark:text-luxury-dark-text-muted">
      <svg class="h-12 w-12 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
      <p>No variants yet. Add your first variant to define pricing and attributes.</p>
    </div>

    <!-- Modal -->
    <Teleport to="body">
      <div
        v-if="showModal"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <!-- Backdrop -->
        <div
          class="absolute inset-0 bg-black/50"
          @click="closeModal"
        ></div>

        <!-- Modal Content -->
        <div class="relative bg-luxury-bg dark:bg-luxury-dark-bg rounded-luxury shadow-xl w-full max-w-md p-6 space-y-6">
          <div class="flex items-center justify-between">
            <h3 class="text-xl font-semibold text-luxury-text dark:text-luxury-dark-text">
              {{ isEditing ? 'Edit Variant' : 'Add Variant' }}
            </h3>
            <button
              type="button"
              class="text-luxury-text-muted hover:text-luxury-text dark:hover:text-luxury-dark-text transition-colors"
              @click="closeModal"
            >
              <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form @submit.prevent="saveVariant" class="space-y-4">
            <!-- SKU -->
            <UiLuxuryInput
              id="variant-sku"
              v-model="form.sku"
              label="SKU"
              placeholder="e.g., PROD-001-RED-M"
            />

            <!-- Price -->
            <div class="relative group">
              <input
                id="variant-price"
                v-model.number="form.price"
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
                  @click="addAttribute"
                >
                  + Add Attribute
                </button>
              </div>

              <div
                v-for="(attr, index) in form.attributes"
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
                  @click="removeAttribute(index)"
                >
                  <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <!-- Actions -->
            <div class="flex items-center justify-end gap-3 pt-4">
              <UiLuxuryButton variant="ghost" type="button" @click="closeModal">
                Cancel
              </UiLuxuryButton>
              <UiLuxuryButton type="submit" :loading="saving">
                {{ isEditing ? 'Update' : 'Create' }}
              </UiLuxuryButton>
            </div>
          </form>
        </div>
      </div>
    </Teleport>
  </div>
</template>
