<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-luxury-text dark:text-luxury-dark-text">Products</h1>
        <p class="text-luxury-text-muted dark:text-luxury-dark-text-muted mt-1">
          Manage your product catalog
        </p>
      </div>
      <UiLuxuryButton @click="openCreateModal">
        <UiIcon name="plus" :size="16" class="mr-2" />
        Create Product
      </UiLuxuryButton>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center py-12">
      <UiIcon name="loader-2" :size="32" class="animate-spin text-luxury-gold" />
    </div>

    <!-- Products Grid -->
    <div v-else-if="products.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      <div
        v-for="product in products"
        :key="product.id"
        class="group bg-luxury-surface dark:bg-luxury-dark-surface border border-luxury-border dark:border-luxury-dark-border rounded-luxury overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
        @click="navigateToProduct(product.id)"
      >
        <!-- Product Image -->
        <div class="aspect-square bg-luxury-bg dark:bg-luxury-dark-bg relative overflow-hidden">
          <img
            v-if="product.file_paths && product.file_paths.length > 0 && product.file_paths[0]"
            :src="getImageUrl(product.file_paths[0]!)"
            :alt="product.name"
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div v-else class="w-full h-full flex items-center justify-center">
            <UiIcon name="image" :size="64" class="text-luxury-text-muted/30 dark:text-luxury-dark-text-muted/30" />
          </div>
        </div>

        <!-- Product Info -->
        <div class="p-4 space-y-2">
          <h3 class="font-medium text-luxury-text dark:text-luxury-dark-text truncate">
            {{ product.name }}
          </h3>
          <p class="text-sm text-luxury-text-muted dark:text-luxury-dark-text-muted">
            {{ product.category?.name || 'No category' }}
          </p>
          <div class="flex items-center justify-between">
            <span class="text-xs font-mono text-luxury-text-muted/70 dark:text-luxury-dark-text-muted/70">
              {{ product.slug }}
            </span>
            <span v-if="product.variants && product.variants.length > 0" class="text-sm font-medium text-luxury-gold">
              {{ formatPriceRange(product.variants) }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-16">
      <UiIcon name="package" :size="64" class="mx-auto mb-4 text-luxury-text-muted/30 dark:text-luxury-dark-text-muted/30" />
      <h3 class="text-lg font-medium text-luxury-text dark:text-luxury-dark-text mb-2">
        No products yet
      </h3>
      <p class="text-luxury-text-muted dark:text-luxury-dark-text-muted mb-6">
        Get started by creating your first product.
      </p>
      <UiLuxuryButton @click="openCreateModal">
        Create Product
      </UiLuxuryButton>
    </div>

    <!-- Create Product Modal -->
    <Teleport to="body">
      <div
        v-if="showCreateModal"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <!-- Backdrop -->
        <div
          class="absolute inset-0 bg-black/50"
          @click="closeCreateModal"
        ></div>

        <!-- Modal Content -->
        <div class="relative bg-luxury-bg dark:bg-luxury-dark-bg rounded-luxury shadow-xl w-full max-w-md p-6 space-y-6">
          <div class="flex items-center justify-between">
            <h3 class="text-xl font-semibold text-luxury-text dark:text-luxury-dark-text">
              Create Product
            </h3>
            <button
              type="button"
              class="text-luxury-text-muted hover:text-luxury-text dark:hover:text-luxury-dark-text transition-colors"
              @click="closeCreateModal"
            >
              <UiIcon name="x" :size="24" />
            </button>
          </div>

          <form @submit.prevent="handleCreateProduct" class="space-y-4">
            <!-- Name -->
            <UiLuxuryInput
              id="product-name"
              v-model="createForm.name"
              label="Product Name"
              placeholder="e.g., Premium Leather Bag"
            />

            <!-- Slug -->
            <UiLuxuryInput
              id="product-slug"
              v-model="createForm.slug"
              label="Slug"
              placeholder="e.g., premium-leather-bag"
            />

            <!-- Category Selection -->
            <div class="space-y-2">
              <label class="text-sm font-medium text-luxury-text-muted dark:text-luxury-dark-text-muted">
                Category <span class="text-red-500">*</span>
              </label>

              <!-- Loading categories -->
              <div v-if="loadingCategories" class="flex items-center gap-2 text-luxury-text-muted">
                <UiIcon name="loader-2" :size="16" class="animate-spin" />
                <span class="text-sm">Loading categories...</span>
              </div>

              <!-- Category list -->
              <div v-else-if="rootCategories.length > 0" class="space-y-2 max-h-48 overflow-y-auto">
                <label
                  v-for="category in rootCategories"
                  :key="category.id"
                  class="flex items-center gap-3 p-3 border rounded-luxury cursor-pointer transition-colors"
                  :class="[
                    createForm.category_id === category.id
                      ? 'border-luxury-gold bg-luxury-gold/5'
                      : 'border-luxury-border dark:border-luxury-dark-border hover:border-luxury-gold/50'
                  ]"
                >
                  <input
                    v-model="createForm.category_id"
                    type="radio"
                    :value="category.id"
                    class="sr-only"
                  />
                  <div
                    class="w-4 h-4 rounded-full border-2 flex items-center justify-center"
                    :class="[
                      createForm.category_id === category.id
                        ? 'border-luxury-gold'
                        : 'border-luxury-border dark:border-luxury-dark-border'
                    ]"
                  >
                    <div
                      v-if="createForm.category_id === category.id"
                      class="w-2 h-2 rounded-full bg-luxury-gold"
                    ></div>
                  </div>
                  <span class="text-luxury-text dark:text-luxury-dark-text">
                    {{ category.name }}
                  </span>
                </label>
              </div>

              <!-- No categories -->
              <div v-else class="text-sm text-luxury-text-muted dark:text-luxury-dark-text-muted p-3 border border-dashed border-luxury-border dark:border-luxury-dark-border rounded-luxury">
                No categories available. Please create a category first.
              </div>
            </div>

            <!-- Actions -->
            <div class="flex items-center justify-end gap-3 pt-4">
              <UiLuxuryButton variant="ghost" type="button" @click="closeCreateModal">
                Cancel
              </UiLuxuryButton>
              <UiLuxuryButton
                type="submit"
                :loading="creating"
                :disabled="!canCreate"
              >
                Create
              </UiLuxuryButton>
            </div>
          </form>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import type { ProductVariant } from '~/network/admin'
import { useProductViewModel } from '~/composables/useProductViewModel'
import { useAdminCategoryStore } from '~/stores/adminCategory'
import { getPublicImage } from '~/utils/image'

definePageMeta({
  layout: 'admin',
  middleware: 'admin'
})

const router = useRouter()

const {
  products,
  loading,
  fetchProducts,
  createProduct: createProductFromVM
} = useProductViewModel()

const categoryStore = useAdminCategoryStore()
const { categories } = storeToRefs(categoryStore)

// Modal state
const showCreateModal = ref(false)
const creating = ref(false)
const loadingCategories = ref(false)

// Create form
const createForm = reactive({
  name: '',
  slug: '',
  category_id: ''
})

const canCreate = computed(() => {
  return createForm.name.trim() && createForm.slug.trim() && createForm.category_id
})

const rootCategories = computed(() => {
  return categories.value.filter(c => !c.parent_id)
})

// Fetch products
const loadProducts = async () => {
  await fetchProducts()
}

// Modal handlers
const openCreateModal = async () => {
  createForm.name = ''
  createForm.slug = ''
  createForm.category_id = ''
  showCreateModal.value = true
  loadingCategories.value = true
  try {
    await categoryStore.fetchCategories()
  } finally {
    loadingCategories.value = false
  }
}

const closeCreateModal = () => {
  showCreateModal.value = false
}

// Auto-generate slug from name
watch(() => createForm.name, (name) => {
  if (!createForm.slug || createForm.slug === slugify(createForm.name.slice(0, -1))) {
    createForm.slug = slugify(name)
  }
})

const slugify = (text: string) => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

// Create product
const handleCreateProduct = async () => {
  if (!canCreate.value) return

  creating.value = true
  try {
    // Find the selected category to get its business_id
    const selectedCategory = categories.value.find(c => c.id === createForm.category_id)
    if (!selectedCategory) {
      throw new Error('Selected category not found')
    }

    const product = await createProductFromVM({
      name: createForm.name,
      slug: createForm.slug,
      category_id: createForm.category_id,
      business_id: selectedCategory.business_id
    })
    closeCreateModal()
    navigateToProduct(product.id)
  } catch (error) {
    console.error('Failed to create product:', error)
  } finally {
    creating.value = false
  }
}

// Navigation
const navigateToProduct = (id: string) => {
  router.push(`/admin/products/${id}`)
}

// Helpers
const getImageUrl = (path: string) => {
  return getPublicImage('product-images', path)
}

const formatPriceRange = (variants: ProductVariant[]) => {
  if (!variants || variants.length === 0) return ''
  const prices = variants.map(v => v.price).sort((a, b) => a - b)
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  })
  const minPrice = prices[0]
  const maxPrice = prices[prices.length - 1]
  if (minPrice === undefined) return ''
  if (prices.length === 1 || minPrice === maxPrice) {
    return formatter.format(minPrice)
  }
  return `${formatter.format(minPrice)} - ${formatter.format(maxPrice ?? minPrice)}`
}

// Initialize
onMounted(() => {
  loadProducts()
})
</script>
