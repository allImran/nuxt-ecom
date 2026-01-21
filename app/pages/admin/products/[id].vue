<template>
  <div class="space-y-6">
    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center py-12">
      <svg class="animate-spin h-8 w-8 text-luxury-gold" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-12">
      <svg class="h-16 w-16 mx-auto mb-4 text-red-500/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
      <h3 class="text-lg font-medium text-luxury-text dark:text-luxury-dark-text mb-2">
        Product not found
      </h3>
      <p class="text-luxury-text-muted dark:text-luxury-dark-text-muted mb-6">
        {{ error }}
      </p>
      <UiLuxuryButton variant="outline" @click="router.push('/admin/products')">
        Back to Products
      </UiLuxuryButton>
    </div>

    <!-- Product Edit Form -->
    <template v-else-if="product">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-4">
          <button
            type="button"
            class="p-2 text-luxury-text-muted hover:text-luxury-text dark:hover:text-luxury-dark-text transition-colors"
            @click="router.push('/admin/products')"
          >
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div>
            <h1 class="text-2xl font-bold text-luxury-text dark:text-luxury-dark-text">
              {{ product.name }}
            </h1>
            <p class="text-luxury-text-muted dark:text-luxury-dark-text-muted mt-1">
              {{ product.category?.name || 'No category' }}
            </p>
          </div>
        </div>
        <div class="flex items-center gap-3">
          <UiLuxuryButton variant="ghost" @click="confirmDelete">
            <svg class="h-4 w-4 mr-2 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Delete
          </UiLuxuryButton>
          <UiLuxuryButton :loading="saving" @click="saveProduct">
            <svg class="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            Save Changes
          </UiLuxuryButton>
        </div>
      </div>

      <!-- Tabs -->
      <div class="border-b border-luxury-border dark:border-luxury-dark-border">
        <nav class="flex gap-8">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            type="button"
            class="py-3 text-sm font-medium border-b-2 transition-colors"
            :class="[
              activeTab === tab.id
                ? 'border-luxury-gold text-luxury-gold'
                : 'border-transparent text-luxury-text-muted hover:text-luxury-text dark:hover:text-luxury-dark-text'
            ]"
            @click="activeTab = tab.id"
          >
            {{ tab.label }}
          </button>
        </nav>
      </div>

      <!-- Tab Content -->
      <div class="py-4">
        <!-- Overview Tab -->
        <div v-if="activeTab === 'overview'" class="space-y-6 max-w-2xl">
          <UiLuxuryInput
            id="product-name"
            v-model="form.name"
            label="Product Name"
            placeholder="e.g., Premium Leather Bag"
          />

          <UiLuxuryInput
            id="product-slug"
            v-model="form.slug"
            label="Slug"
            placeholder="e.g., premium-leather-bag"
          />

          <UiLuxuryInput
            id="product-youtube"
            v-model="form.youtube_url"
            label="YouTube URL (optional)"
            placeholder="e.g., https://youtube.com/watch?v=..."
          />

          <div class="p-4 bg-luxury-surface dark:bg-luxury-dark-surface rounded-luxury">
            <p class="text-sm text-luxury-text-muted dark:text-luxury-dark-text-muted">
              <span class="font-medium">Category:</span> {{ product.category?.name || 'None' }}
            </p>
            <p class="text-xs text-luxury-text-muted/70 dark:text-luxury-dark-text-muted/70 mt-1">
              Category cannot be changed after creation.
            </p>
          </div>
        </div>

        <!-- Media Tab -->
        <div v-else-if="activeTab === 'media'" class="space-y-6">
          <AdminProductsProductImageUploader v-model="form.file_paths" />
        </div>

        <!-- Content Tab -->
        <div v-else-if="activeTab === 'content'" class="space-y-6">
          <AdminProductsProductSectionManager v-model="form.sections" />
        </div>

        <!-- Variants Tab -->
        <div v-else-if="activeTab === 'variants'" class="space-y-6">
          <AdminProductsProductVariantManager
            :product-id="product.id"
            v-model="variants"
          />
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { adminNetwork, type Product, type ProductSection, type ProductVariant } from '~/network/admin'

definePageMeta({
  layout: 'admin',
//   middleware: 'admin'
})

const route = useRoute()
const router = useRouter()

const productId = computed(() => route.params.id as string)

// State
const product = ref<Product | null>(null)
const variants = ref<ProductVariant[]>([])
const loading = ref(true)
const saving = ref(false)
const error = ref<string | null>(null)
const activeTab = ref('overview')

// Form state
const form = reactive({
  name: '',
  slug: '',
  youtube_url: '',
  file_paths: [] as string[],
  sections: [] as ProductSection[]
})

// Tabs
const tabs = [
  { id: 'overview', label: 'Overview' },
  { id: 'media', label: 'Media' },
  { id: 'content', label: 'Content' },
  { id: 'variants', label: 'Variants' }
]

// Fetch product
const fetchProduct = async () => {
  loading.value = true
  error.value = null
  try {
    const data = await adminNetwork.fetchProduct(productId.value)
    product.value = data
    variants.value = data.variants || []

    // Populate form
    form.name = data.name
    form.slug = data.slug
    form.youtube_url = data.youtube_url || ''
    form.file_paths = data.file_paths || []
    form.sections = data.sections || []
  } catch (err) {
    console.error('Failed to fetch product:', err)
    error.value = 'Failed to load product. Please try again.'
  } finally {
    loading.value = false
  }
}

// Save product
const saveProduct = async () => {
  if (!product.value) return

  saving.value = true
  try {
    const updated = await adminNetwork.updateProduct(product.value.id, {
      name: form.name,
      slug: form.slug,
      youtube_url: form.youtube_url || undefined,
      file_paths: form.file_paths,
      sections: form.sections
    })
    product.value = updated
  } catch (err) {
    console.error('Failed to save product:', err)
  } finally {
    saving.value = false
  }
}

// Delete product
const confirmDelete = async () => {
  if (!product.value) return
  if (!confirm(`Are you sure you want to delete "${product.value.name}"? This action cannot be undone.`)) return

  try {
    await adminNetwork.deleteProduct(product.value.id)
    router.push('/admin/products')
  } catch (err) {
    console.error('Failed to delete product:', err)
  }
}

// Initialize
onMounted(() => {
  fetchProduct()
})

// Watch for route changes
watch(productId, () => {
  fetchProduct()
})
</script>
