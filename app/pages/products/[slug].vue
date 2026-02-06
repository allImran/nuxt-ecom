<script setup lang="ts">
const route = useRoute()
const { t } = useI18n()
// Define layout for this page
definePageMeta({
  layout: 'default'
})

// Get the slug from route
const slug = computed(() => route.params.slug as string)

// Use the composable
const {
  product,
  selectedVariant,
  selectedMediaIndex,
  loading,
  error,
  hasProduct,
  hasVariants,
  priceDisplay,
  orderedMedia,
  hasMedia,
  loadProduct,
  selectVariant,
  setSelectedMediaIndex,
  getImageUrl,
  getAttributeEntries
} = useProductDetailViewModel()

// Fetch product on mount
onMounted(() => {
  if (slug.value) {
    loadProduct(slug.value)
  }
})

// Update page metadata
watchEffect(() => {
  if (product.value) {
    useHead({
      title: `${product.value.name} - URBANEASE`,
      meta: [
        {
          name: 'description',
          content: product.value.name
        }
      ]
    })
  }
})

// Handle variant selection
const handleSelectVariant = (variant: import('~/network/public').ProductVariant) => {
  selectVariant(variant)
}

// Handle media selection
const handleSelectMedia = (index: number) => {
  setSelectedMediaIndex(index)
}
</script>

<template>
  <div class="min-h-screen bg-luxury-bg dark:bg-luxury-dark-bg">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <!-- Breadcrumbs -->
      <ProductBreadcrumbs>
        <ProductBreadcrumbsItem href="/">Home</ProductBreadcrumbsItem>
        <ProductBreadcrumbsItem :href="`/products/${slug}`" :last="true">
          {{ product?.name || 'Product' }}
        </ProductBreadcrumbsItem>
      </ProductBreadcrumbs>

      <!-- Error State -->
      <div v-if="error && !loading" class="text-center py-12">
        <div class="inline-flex items-center justify-center w-20 h-20 rounded-full bg-luxury-surface dark:bg-luxury-dark-surface mb-4">
          <UiIcon name="alert-circle" :size="40" class="text-luxury-text-muted dark:text-luxury-dark-text-muted" />
        </div>
        <h2 class="text-2xl font-bold text-luxury-text dark:text-luxury-dark-text mb-2">
          Product Not Found
        </h2>
        <p class="text-luxury-text-muted dark:text-luxury-dark-text-muted mb-6">
          {{ error }}
        </p>
        <UiLuxuryButton variant="outline" @click="navigateTo('/')">
          Return Home
        </UiLuxuryButton>
      </div>

      <!-- Loading State -->
      <div v-else-if="loading" class="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
        <!-- Media Gallery Skeleton -->
        <div class="lg:col-span-2">
          <ProductMediaGallerySkeleton />
        </div>

        <!-- Product Info Skeleton -->
        <div class="lg:col-span-3 space-y-8">
          <ProductInfoSkeleton />
          <ProductVariantSkeleton />
        </div>
      </div>

      <!-- Product Detail -->
      <div v-else-if="hasProduct" class="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
        <!-- Left Column - Media Gallery (60%) -->
        <div class="lg:col-span-2">
          <ProductMediaGallery
            v-if="hasMedia"
            :media="orderedMedia"
            :selected-index="selectedMediaIndex"
            :get-image-url="getImageUrl"
            @select-media="handleSelectMedia"
          />
          <div v-else class="w-full aspect-square bg-luxury-surface dark:bg-luxury-dark-surface rounded-lg flex items-center justify-center">
            <UiIcon name="image" :size="80" class="text-luxury-text-muted dark:text-luxury-dark-text-muted" />
          </div>
        </div>

        <!-- Right Column - Product Info (40%) -->
        <div class="lg:col-span-3 space-y-8">
          <!-- Basic Info -->
          <ProductInfoSection
            :name="product?.name"
            :category="product?.category?.name"
            :price="priceDisplay"
            :description="product?.name"
          />

          <!-- Variant Selector -->
          <ProductVariantSelector
            v-if="hasVariants && product?.variants"
            :variants="product.variants"
            :selected-variant="selectedVariant"
            :get-attribute-entries="getAttributeEntries"
            @select-variant="handleSelectVariant"
          />

          <!-- Content Sections -->
          <ProductContentSections
            v-if="product?.sections"
            :sections="product.sections"
            :get-image-url="getImageUrl"
          />
        </div>
      </div>

    </div>

    <div class="bg-luxury-gold/4 py-20 border-t border-luxury-border dark:border-luxury-dark-border">
      <h2 class="text-xl lg:text-2xl  font-semibold text-center">{{ t('order.title') }}</h2>

      <Order v-if="product" :products="[product]" />
    </div>
  </div>
</template>
