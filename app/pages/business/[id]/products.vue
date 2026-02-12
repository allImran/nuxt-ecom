<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-4">
        <UiLuxuryButton variant="ghost" @click="router.push(`/business/${businessId}`)">
          <UiIcon name="arrow-left" :size="16" class="mr-2" />
          Back
        </UiLuxuryButton>
        <div>
          <h1 class="text-2xl font-bold text-luxury-text dark:text-luxury-dark-text">
            Products
          </h1>
          <p class="text-sm text-luxury-text-muted dark:text-luxury-dark-text-muted">
            {{ business?.name || 'Business' }}
          </p>
        </div>
      </div>
      <UiLuxuryButton @click="router.push(`/admin/products/create?business_id=${businessId}`)">
        <UiIcon name="plus" :size="16" class="mr-2" />
        Add Product
      </UiLuxuryButton>
    </div>

    <!-- Search -->
    <UiLuxuryInput
      v-model="searchQuery"
      placeholder="Search products..."
      class="max-w-md"
    />

    <!-- Loading -->
    <div v-if="loading" class="text-center py-12">
      <UiIcon name="loader-2" :size="32" class="animate-spin text-luxury-gold" />
    </div>

    <!-- Products Grid -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <UiBaseCard
        v-for="product in filteredProducts"
        :key="product.id"
        hover
        class="cursor-pointer"
        @click="router.push(`/admin/products/${product.id}`)"
      >
        <div class="aspect-square bg-luxury-border/10 dark:bg-luxury-dark-border/20 rounded-lg mb-4 flex items-center justify-center">
          <UiIcon v-if="!product.file_paths?.length" name="image" :size="48" class="text-luxury-text-muted/30" />
        </div>
        <h3 class="font-semibold text-luxury-text dark:text-luxury-dark-text truncate">
          {{ product.name }}
        </h3>
        <p class="text-sm text-luxury-text-muted dark:text-luxury-dark-text-muted">
          {{ product.category?.name || 'No category' }}
        </p>
      </UiBaseCard>
    </div>

    <!-- Empty State -->
    <div v-if="!loading && filteredProducts.length === 0" class="text-center py-12">
      <p class="text-luxury-text-muted dark:text-luxury-dark-text-muted">
        No products found
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: 'admin'
})

const route = useRoute()
const router = useRouter()

const businessId = computed(() => route.params.id as string)

const {
  products,
  loading,
  searchQuery,
  filteredProducts,
  fetchProducts,
  reset
} = useBusinessProductsViewModel()

const business = ref<any>(null)

onMounted(async () => {
  await Promise.all([
    fetchProducts(businessId.value),
    (async () => {
      const { adminNetwork } = await import('~/network/admin')
      business.value = await adminNetwork.fetchBusinessById(businessId.value)
    })()
  ])
})

watch(businessId, () => {
  reset()
  fetchProducts(businessId.value)
})

onUnmounted(() => {
  reset()
})
</script>
