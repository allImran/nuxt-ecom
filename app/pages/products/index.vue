<script setup lang="ts">
import { storeToRefs } from 'pinia'

definePageMeta({
  layout: 'default'
})

const config = useRuntimeConfig()
const businessId = config.public.businessId as string | undefined
const route = useRoute()
const router = useRouter()

const { products, loading, fetchProducts } = useBusinessProductsViewModel()

const businessBrandingStore = useBusinessBrandingStore()
const { business } = storeToRefs(businessBrandingStore)

const PAGE_SIZE = 12

// --- URL-backed state (shareable / bookmarkable discovery) ---
const activeCategory = computed(() => (route.query.category as string) || 'all')
const activeSort = computed(() => (route.query.sort as string) || 'featured')
const activeSearch = computed(() => (route.query.q as string) || '')
const currentPage = computed(() => {
  const n = parseInt((route.query.page as string) || '1', 10)
  return Number.isFinite(n) && n > 0 ? n : 1
})

// Merge a patch into the query, dropping empty keys.
const setQuery = (patch: Record<string, string | undefined>, mode: 'push' | 'replace' = 'push') => {
  const next: Record<string, string> = { ...(route.query as Record<string, string>) }
  for (const [k, v] of Object.entries(patch)) {
    if (v === undefined || v === '') delete next[k]
    else next[k] = v
  }
  router[mode]({ path: route.path, query: next })
}

// Local search mirror with debounced write-through to the URL (avoids a history
// entry per keystroke while keeping the query shareable).
const searchInput = ref(activeSearch.value)
watch(activeSearch, (v) => { if (v !== searchInput.value) searchInput.value = v })

let searchTimer: ReturnType<typeof setTimeout> | undefined
const onSearch = (value: string) => {
  searchInput.value = value
  if (searchTimer) clearTimeout(searchTimer)
  searchTimer = setTimeout(() => setQuery({ q: value || undefined, page: undefined }, 'replace'), 300)
}
onBeforeUnmount(() => { if (searchTimer) clearTimeout(searchTimer) })

const onCategory = (value: string) => setQuery({ category: value === 'all' ? undefined : value, page: undefined })
const onSort = (value: string) => setQuery({ sort: value === 'featured' ? undefined : value, page: undefined })
const clearFilters = () => {
  searchInput.value = ''
  setQuery({ q: undefined, category: undefined, sort: undefined, page: undefined })
}

// --- Derived data ---
// Categories are derived from the loaded products (no public categories endpoint).
const categories = computed(() => {
  const map = new Map<string, string>()
  for (const p of products.value) {
    if (p.category?.id && p.category?.name) map.set(p.category.id, p.category.name)
  }
  return Array.from(map, ([id, name]) => ({ id, name })).sort((a, b) => a.name.localeCompare(b.name))
})

const filteredProducts = computed(() => {
  let list = products.value.slice()

  if (activeCategory.value !== 'all') {
    list = list.filter(p => p.category?.id === activeCategory.value)
  }

  const q = activeSearch.value.trim().toLowerCase()
  if (q) {
    list = list.filter(p => p.name.toLowerCase().includes(q) || p.slug.toLowerCase().includes(q))
  }

  // The public list endpoint doesn't return variant prices, so we sort only on
  // fields it actually provides (recency, name).
  switch (activeSort.value) {
    case 'newest':
      list.sort((a, b) => new Date(b.created_at ?? 0).getTime() - new Date(a.created_at ?? 0).getTime())
      break
    case 'name-asc':
      list.sort((a, b) => a.name.localeCompare(b.name))
      break
    case 'name-desc':
      list.sort((a, b) => b.name.localeCompare(a.name))
      break
  }

  return list
})

const totalPages = computed(() => Math.max(1, Math.ceil(filteredProducts.value.length / PAGE_SIZE)))
const clampedPage = computed(() => Math.min(currentPage.value, totalPages.value))
const pageProducts = computed(() => {
  const start = (clampedPage.value - 1) * PAGE_SIZE
  return filteredProducts.value.slice(start, start + PAGE_SIZE)
})

const activeCategoryName = computed(() =>
  activeCategory.value === 'all' ? '' : (categories.value.find(c => c.id === activeCategory.value)?.name ?? '')
)
const pageHeading = computed(() => activeCategoryName.value || 'All Products')

// SEO — title reflects the active category ("Water Filters | <business>"). The
// global titleTemplate appends the brand, so we don't repeat it here. Canonical
// stays /products (I18nMetaTags strips the query) so filtered views don't create
// duplicate-content URLs.
const seoTitle = computed(() => activeCategoryName.value || 'Products')
const seoDescription = computed(() =>
  `Browse ${activeCategoryName.value ? activeCategoryName.value.toLowerCase() : 'our complete collection of premium luxury products'}${business.value ? ` at ${business.value.name}` : ''}.`
)
useSeoMeta({
  title: () => seoTitle.value,
  description: () => seoDescription.value,
  ogTitle: () => seoTitle.value,
  ogDescription: () => seoDescription.value,
  ogType: 'website',
  twitterCard: 'summary_large_image',
  twitterTitle: () => seoTitle.value,
  twitterDescription: () => seoDescription.value,
})

const viewProduct = (slug: string) => {
  navigateTo(`/products/${slug}`)
}

onMounted(() => {
  if (businessId) {
    fetchProducts(businessId, 100)
  }
})
</script>

<template>
  <div>
    <!-- Page Header -->
    <section class="py-12 lg:py-16 bg-luxury-surface dark:bg-luxury-dark-surface transition-colors duration-200">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center">
          <h1 class="text-4xl sm:text-5xl font-bold tracking-luxury text-luxury-text dark:text-luxury-dark-text mb-4">
            {{ pageHeading }}
          </h1>
          <p class="text-lg text-luxury-text-muted dark:text-luxury-dark-text-muted max-w-2xl mx-auto">
            Explore our complete collection of premium luxury products
          </p>
        </div>
      </div>
    </section>

    <!-- Discovery toolbar -->
    <section class="pt-10 bg-luxury-bg dark:bg-luxury-dark-bg transition-colors duration-200">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <ProductFilterBar
          :search="searchInput"
          :category="activeCategory"
          :sort="activeSort"
          :categories="categories"
          :result-count="filteredProducts.length"
          :total-count="products.length"
          @update:search="onSearch"
          @update:category="onCategory"
          @update:sort="onSort"
          @clear="clearFilters"
        />
      </div>
    </section>

    <!-- Product Grid (header + view-all hidden; listing owns its own chrome) -->
    <HomeProductShowcase
      :products="pageProducts"
      :loading="loading"
      :show-header="false"
      :show-view-all="false"
      @view-product="viewProduct"
    />

    <!-- Pagination -->
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 pb-20">
      <ProductPagination :current-page="clampedPage" :total-pages="totalPages" />
    </div>
  </div>
</template>
