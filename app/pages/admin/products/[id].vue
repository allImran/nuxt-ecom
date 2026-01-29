<template>
  <div class="space-y-6">
    <!-- Loading State -->
    <div v-if="loading" class="flex items-center justify-center py-12">
      <UiIcon name="loader-2" :size="32" class="animate-spin text-luxury-gold" />
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="text-center py-12">
      <UiIcon name="alert-triangle" :size="64" class="mx-auto mb-4 text-red-500/50" />
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
    <template v-else-if="currentProduct">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-4">
          <button
            type="button"
            class="p-2 text-luxury-text-muted hover:text-luxury-text dark:hover:text-luxury-dark-text transition-colors"
            @click="router.push('/admin/products')"
          >
            <UiIcon name="chevron-left" :size="20" />
          </button>
          <div>
            <h1 class="text-2xl font-bold text-luxury-text dark:text-luxury-dark-text">
              {{ currentProduct.name }}
            </h1>
            <p class="text-luxury-text-muted dark:text-luxury-dark-text-muted mt-1">
              {{ currentProduct.category?.name || 'No category' }}
            </p>
          </div>
        </div>
        <div class="flex items-center gap-3">
          <UiLuxuryButton variant="ghost" @click="confirmDelete">
            <UiIcon name="trash-2" :size="16" class="mr-2 text-red-500" />
            Delete
          </UiLuxuryButton>
          <UiLuxuryButton :loading="saving" @click="handleSaveProduct">
            <UiIcon name="check" :size="16" class="mr-2" />
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
            v-model="productForm.name"
            label="Product Name"
            placeholder="e.g., Premium Leather Bag"
          />

          <UiLuxuryInput
            id="product-slug"
            v-model="productForm.slug"
            label="Slug"
            placeholder="e.g., premium-leather-bag"
          />

          <UiLuxuryInput
            id="product-youtube"
            v-model="productForm.youtube_url"
            label="YouTube URL (optional)"
            placeholder="e.g., https://youtube.com/watch?v=..."
          />

          <div class="p-4 bg-luxury-surface dark:bg-luxury-dark-surface rounded-luxury">
            <p class="text-sm text-luxury-text-muted dark:text-luxury-dark-text-muted">
              <span class="font-medium">Category:</span> {{ currentProduct.category?.name || 'None' }}
            </p>
            <p class="text-xs text-luxury-text-muted/70 dark:text-luxury-dark-text-muted/70 mt-1">
              Category cannot be changed after creation.
            </p>
          </div>
        </div>

        <!-- Media Tab -->
        <div v-else-if="activeTab === 'media'" class="space-y-6">
          <AdminProductsProductImageUploader />
        </div>

        <!-- Content Tab -->
        <div v-else-if="activeTab === 'content'" class="space-y-6">
          <AdminProductsProductSectionManager />
        </div>

        <!-- Variants Tab -->
        <div v-else-if="activeTab === 'variants'" class="space-y-6">
          <AdminProductsProductVariantManager
            :product-id="currentProduct.id"
            v-model="currentVariants"
          />
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { useProductViewModel } from '~/composables/useProductViewModel'

definePageMeta({
  layout: 'admin',
  // middleware: 'admin'
})

const route = useRoute()
const router = useRouter()

const productId = computed(() => route.params.id as string)

const {
  currentProduct,
  currentVariants,
  loading,
  saving,
  error,
  productForm,
  activeTab,
  tabs,
  fetchProduct,
  saveProduct,
  deleteProduct,
  reset
} = useProductViewModel()

// Fetch product
const loadProduct = async () => {
  await fetchProduct(productId.value)
}

// Save product
const handleSaveProduct = async () => {
  await saveProduct()
}

// Delete product
const confirmDelete = async () => {
  if (!currentProduct.value) return
  if (!confirm(`Are you sure you want to delete "${currentProduct.value.name}"? This action cannot be undone.`)) return

  await deleteProduct()
  router.push('/admin/products')
}

// Initialize
onMounted(() => {
  loadProduct()
})

// Watch for route changes
watch(productId, () => {
  reset()
  loadProduct()
})

// Cleanup on unmount
onUnmounted(() => {
  reset()
})
</script>
