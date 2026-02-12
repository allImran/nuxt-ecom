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
            Categories
          </h1>
          <p class="text-sm text-luxury-text-muted dark:text-luxury-dark-text-muted">
            {{ business?.name || 'Business' }}
          </p>
        </div>
      </div>
    </div>

    <!-- Search -->
    <UiLuxuryInput
      v-model="searchQuery"
      placeholder="Search categories..."
      class="max-w-md"
    />

    <!-- Loading -->
    <div v-if="loading" class="text-center py-12">
      <UiIcon name="loader-2" :size="32" class="animate-spin text-luxury-gold" />
    </div>

    <!-- Categories Grid -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <AdminCategoryCard
        v-for="category in filteredCategories"
        :key="category.id"
        :category="category"
        :business-name="business?.name || ''"
      />
    </div>

    <!-- Empty State -->
    <div v-if="!loading && filteredCategories.length === 0" class="text-center py-12">
      <p class="text-luxury-text-muted dark:text-luxury-dark-text-muted">
        No categories found
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
  categories,
  loading,
  searchQuery,
  filteredCategories,
  fetchCategories,
  reset
} = useBusinessCategoriesViewModel()

const business = ref<any>(null)

onMounted(async () => {
  await Promise.all([
    fetchCategories(businessId.value),
    (async () => {
      const { adminNetwork } = await import('~/network/admin')
      business.value = await adminNetwork.fetchBusinessById(businessId.value)
    })()
  ])
})

watch(businessId, () => {
  reset()
  fetchCategories(businessId.value)
})

onUnmounted(() => {
  reset()
})
</script>
