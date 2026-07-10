<script setup lang="ts">
import { getAccessorySlugs } from '~/data/accessories-mapper'
import { publicNetwork } from '~/network/public'

const route = useRoute()
const { t } = useI18n()
const cartStore = useCartStore()
const toast = useToast()

// Ref to the order section for the "scroll to order" button
const orderSection = ref<HTMLElement | null>(null)

// Scroll smoothly to the order section
const scrollToOrder = () => {
  orderSection.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
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

// Accessories state
const accessories = ref<import('~/network/public').Product[]>([])
const loadingAccessories = ref(false)

// Fetch product on mount
onMounted(async () => {
  if (slug.value) {
    await loadProduct(slug.value)
    await loadAccessories(slug.value)

    // Track ViewContent event with Meta Pixel
    if (product.value) {
      const { trackViewContent } = usePixel()
      trackViewContent(
        product.value.id,
        product.value.name,
        product.value.variants?.[0]?.price || 0,
        'BDT',
        product.value.category?.name
      )
    }
  }
})

// Load accessories for the current product
async function loadAccessories(productSlug: string) {
  const accessorySlugs = getAccessorySlugs(productSlug)

  if (accessorySlugs.length === 0) {
    return
  }

  loadingAccessories.value = true

  try {
    // Fetch all accessory products in parallel
    const accessoryPromises = accessorySlugs.map(slug =>
      publicNetwork.fetchProductBySlug(slug)
    )

    const fetchedAccessories = await Promise.all(accessoryPromises)
    accessories.value = fetchedAccessories
  } catch (err) {
    console.error('Failed to load accessories:', err)
    // Don't fail the page if accessories fail to load
  } finally {
    loadingAccessories.value = false
  }
}

// Computed property for all products to pass to Order component
const productsForOrder = computed(() => {
  if (!product.value) return []

  // Combine main product with accessories
  return [
    product.value,
    ...accessories.value
  ]
})

// Computed property for selected variants mapping
const selectedVariantsMap = computed(() => {
  const map: Record<string, string> = {}
  if (product.value && selectedVariant.value) {
    map[product.value.id] = selectedVariant.value.id
  }
  // For accessories, use their first variant as default
  accessories.value.forEach(accessory => {
    map[accessory.id] = accessory.variants?.[0]?.id || ''
  })
  return map
})

// Update page metadata with functional getters for reactive SEO
useSeoMeta({
  title: () => product.value ? `${product.value.name} - INDOORSHOPPING` : 'Product - INDOORSHOPPING',
  description: () => product.value?.description || product.value?.name || 'Discover premium luxury products at INDOORSHOPPING.',
  ogTitle: () => product.value ? `${product.value.name} - INDOORSHOPPING` : 'Product - INDOORSHOPPING',
  ogDescription: () => product.value?.description || product.value?.name || 'Discover premium luxury products at INDOORSHOPPING.',
  ogType: 'website',
  ogImage: () => product.value?.media?.[0]?.url || '/og-image.jpg',
  twitterCard: 'summary_large_image',
  twitterTitle: () => product.value ? `${product.value.name} - INDOORSHOPPING` : 'Product - INDOORSHOPPING',
  twitterDescription: () => product.value?.description || product.value?.name || 'Discover premium luxury products at INDOORSHOPPING.',
  twitterImage: () => product.value?.media?.[0]?.url || '/og-image.jpg',
})

// Handle variant selection
const handleSelectVariant = (variant: import('~/network/public').ProductVariant) => {
  selectVariant(variant)
}

// Watch for variant changes to update the selectedVariantsMap
watch(selectedVariant, (newVariant) => {
  if (product.value && newVariant) {
    // The selectedVariantsMap computed will automatically update
    // No additional action needed as the Order component watches the prop
  }
})

// Handle media selection
const handleSelectMedia = (index: number) => {
  setSelectedMediaIndex(index)
}

// Handle add to cart
const handleAddToCart = () => {
  if (!product.value) return

  const firstImage = product.value.media?.[0]
  const price = selectedVariant.value?.price || product.value.variants?.[0]?.price || 0

  cartStore.addItem({
    id: product.value.id,
    name: product.value.name,
    price,
    slug: slug.value,
    image: firstImage?.url,
    variant: selectedVariant.value?.attributes
      ? Object.entries(selectedVariant.value.attributes).map(([name, value]) => `${name}: ${value}`).join(', ')
      : undefined
  })

  // Show feedback so the user knows the item was added
  toast.success({
    title: t('product.addToCart'),
    description: product.value.name
  })

  // Track AddToCart event with Meta Pixel
  const { trackAddToCart } = usePixel()
  trackAddToCart(
    product.value.id,
    product.value.name,
    price,
    1,
    'BDT'
  )
}
</script>

<template>
  <div class="min-h-screen bg-luxury-bg dark:bg-luxury-dark-bg">
    <main class="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <!-- Breadcrumbs -->
      <nav aria-label="Breadcrumb">
        <ProductBreadcrumbs>
          <ProductBreadcrumbsItem href="/">Home</ProductBreadcrumbsItem>
          <ProductBreadcrumbsItem :href="`/products/${slug}`" :last="true">
            {{ product?.name || 'Product' }}
          </ProductBreadcrumbsItem>
        </ProductBreadcrumbs>
      </nav>

      <!-- Error State -->
      <div v-if="error && !loading" class="text-center py-12">
        <div class="inline-flex items-center justify-center w-20 h-20 rounded-full bg-luxury-surface dark:bg-luxury-dark-surface mb-4">
          <UiIcon name="alert-circle" :size="40" class="text-luxury-text-muted dark:text-luxury-dark-text-muted" />
        </div>
        <h1 class="text-2xl font-bold text-luxury-text dark:text-luxury-dark-text mb-2">
          Product Not Found
        </h1>
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
        <div class="lg:col-span-2 space-y-6">
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

          <!-- Animated Scroll to Order Button -->
          <button
            @click="scrollToOrder"
            class="group relative w-full overflow-hidden rounded-lg bg-gradient-to-r from-luxury-gold to-amber-600 px-8 py-4 text-lg font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
          >
            <span class="relative z-10 flex items-center justify-center gap-3">
              <span>{{ t('order.scrollToOrder') }}</span>
              <UiIcon
                name="arrow-down"
                :size="20"
                class="animate-bounce"
              />
            </span>
            <div class="absolute inset-0 -translate-x-full group-hover:animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          </button>
        </div>

        <!-- Right Column - Product Info (40%) -->
        <div class="lg:col-span-3 space-y-8">
          <!-- Product Name (h1 for SEO) -->
          <h1 class="text-3xl sm:text-4xl font-bold text-luxury-text dark:text-luxury-dark-text">
            {{ product?.name || 'Product' }}
          </h1>

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

          <!-- Add to Cart Button -->
          <UiLuxuryButton
            class="w-full"
            @click="handleAddToCart"
          >
            <div class="flex items-center justify-center space-x-2">
              <UiIcon name="shopping-cart" :size="20" />
              <span>{{ t('product.addToCart') }}</span>
            </div>
          </UiLuxuryButton>

          <!-- Content Sections -->
          <ProductContentSections
            v-if="product?.sections"
            :sections="product.sections"
            :get-image-url="getImageUrl"
          />
        </div>
      </div>

    </main>

    <section ref="orderSection" class="bg-luxury-gold/4 py-20 border-t border-luxury-border dark:border-luxury-dark-border" aria-labelledby="order-title">
      <h2 id="order-title" class="text-xl lg:text-2xl font-semibold text-center">{{ t('order.title') }}</h2>

      <Order v-if="productsForOrder.length > 0" :products="productsForOrder" :selected-variants="selectedVariantsMap" />
    </section>
  </div>
</template>
