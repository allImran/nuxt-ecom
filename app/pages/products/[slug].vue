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
  setProduct,
  selectVariant,
  setSelectedMediaIndex,
  getImageUrl,
  getAttributeEntries
} = useProductDetailViewModel()

// Fetch the product + its accessories at setup time so the page is prerendered
// with real content (C2): the SSR HTML carries the h1/title/og:image/JSON-LD and
// crawlers/social scrapers see a populated page instead of an empty shell. The
// product lives in the Pinia store (serialized into the payload and rehydrated
// with no client refetch on hard load); accessories are a local list returned
// from the handler so they survive to the client the same way. Re-runs on slug
// change so product→product client navigation loads fresh data.
const { data: pageData } = await useAsyncData(
  () => `product-${slug.value}`,
  async () => {
    // Start both fetches before the first await: each network call resolves its
    // baseURL via useRuntimeConfig() synchronously, and the Nuxt instance context
    // is lost after an await inside the handler. Awaiting the product first and
    // only then calling loadAccessories 500s the accessory fetch during prerender.
    const accessoriesPromise = loadAccessories(slug.value)
    try {
      await loadProduct(slug.value)
    } catch {
      // The store already records the error; the template shows the not-found
      // state. Swallow here so a single bad slug doesn't abort prerendering.
    }
    // Return the product itself (not just rely on the store): the Pinia store is
    // NOT serialized into the payload, so the product must ride in useAsyncData's
    // data to survive to the client. It's mirrored back into the store below.
    return { product: product.value, accessories: await accessoriesPromise }
  },
  { watch: [slug] }
)

const accessories = computed<import('~/network/public').Product[]>(() => pageData.value?.accessories ?? [])

// Mirror the serialized product into the store on client hydration and on cached
// slug-change navigation (when the handler returns payload data without re-running),
// so all the store's derived getters — price, media, variants, selection — work.
watchEffect(() => {
  const p = pageData.value?.product
  if (p && product.value?.id !== p.id) setProduct(p)
})

// Fire the ViewContent pixel client-side only (fbq is browser-only). Product data
// is already resolved by the time this runs.
onMounted(() => {
  if (product.value) {
    const { trackViewContent } = usePixel()
    trackViewContent(
      product.value.id,
      product.value.name,
      selectedVariant.value?.price || product.value.variants?.[0]?.price || 0,
      'BDT',
      product.value.category?.name
    )
  }
})

// Resolve the accessory products mapped to this slug (empty list if none / on error,
// so the main product page never fails because of an accessory fetch).
async function loadAccessories(productSlug: string): Promise<import('~/network/public').Product[]> {
  const accessorySlugs = getAccessorySlugs(productSlug)
  if (accessorySlugs.length === 0) return []
  try {
    return await Promise.all(accessorySlugs.map(s => publicNetwork.fetchProductBySlug(s)))
  } catch (err) {
    console.error('Failed to load accessories:', err)
    return []
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
const productImage = computed(() => {
  const path = product.value?.file_paths?.[0]
  return path ? getImageUrl(path) : '/cover.webp'
})

useSeoMeta({
  title: () => product.value?.name || 'Product',
  description: () => product.value?.name || 'Discover our premium luxury products.',
  ogTitle: () => product.value?.name || 'Product',
  ogDescription: () => product.value?.name || 'Discover our premium luxury products.',
  ogType: 'website',
  ogImage: () => productImage.value,
  twitterCard: 'summary_large_image',
  twitterTitle: () => product.value?.name || 'Product',
  twitterDescription: () => product.value?.name || 'Discover our premium luxury products.',
  twitterImage: () => productImage.value,
})

// Structured data (schema.org) for rich results — populated once the product loads.
const { absoluteUrl, hasSiteUrl } = useSiteUrl()

const productJsonLd = computed(() => {
  const p = product.value
  if (!p) return null

  const images = (p.file_paths && p.file_paths.length > 0)
    ? p.file_paths.map(path => getImageUrl(path)).filter(Boolean)
    : [productImage.value]

  const prices = (p.variants ?? [])
    .map(v => v.price)
    .filter((price): price is number => price != null)

  let offers: Record<string, any> | undefined
  if (prices.length > 0) {
    const low = Math.min(...prices)
    const high = Math.max(...prices)
    const canonical = hasSiteUrl.value ? absoluteUrl(`/products/${slug.value}`) : undefined
    const common = {
      priceCurrency: 'BDT',
      availability: 'https://schema.org/InStock',
      ...(canonical ? { url: canonical } : {}),
    }
    offers = low === high
      ? { '@type': 'Offer', price: low, ...common }
      : { '@type': 'AggregateOffer', lowPrice: low, highPrice: high, offerCount: prices.length, ...common }
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: p.name,
    image: images,
    ...(p.category?.name ? { category: p.category.name } : {}),
    ...(offers ? { offers } : {}),
  }
})

const breadcrumbJsonLd = computed(() => {
  const p = product.value
  if (!p) return null

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', ...(hasSiteUrl.value ? { item: absoluteUrl('/') } : {}) },
      { '@type': 'ListItem', position: 2, name: p.name, ...(hasSiteUrl.value ? { item: absoluteUrl(`/products/${slug.value}`) } : {}) },
    ],
  }
})

useJsonLd(productJsonLd)
useJsonLd(breadcrumbJsonLd)

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

  const firstImagePath = product.value.file_paths?.[0]
  const price = selectedVariant.value?.price || product.value.variants?.[0]?.price || 0

  cartStore.addItem({
    id: product.value.id,
    name: product.value.name,
    price,
    slug: slug.value,
    image: firstImagePath ? getImageUrl(firstImagePath) : undefined,
    variant: selectedVariant.value?.attributes
      ? Object.entries(selectedVariant.value.attributes).map(([name, value]) => `${name}: ${value}`).join(', ')
      : undefined,
    variantId: selectedVariant.value?.id ?? null
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
