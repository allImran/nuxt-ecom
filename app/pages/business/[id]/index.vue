<template>
  <div class="space-y-6">
    <!-- Loading -->
    <div v-if="loading" class="flex items-center justify-center py-12">
      <UiIcon name="loader-2" :size="32" class="animate-spin text-luxury-gold" />
    </div>

    <!-- Error -->
    <div v-else-if="error" class="text-center py-12">
      <h2 class="text-xl font-semibold text-red-600">{{ error }}</h2>
      <UiLuxuryButton variant="outline" class="mt-4" @click="router.push('/admin')">
        Back to Admin
      </UiLuxuryButton>
    </div>

    <!-- Business Dashboard -->
    <div v-else-if="business">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-luxury-text dark:text-luxury-dark-text">
            {{ business.name }}
          </h1>
          <p class="text-luxury-text-muted dark:text-luxury-dark-text-muted mt-1">
            {{ business.slug }}
          </p>
        </div>
        <UiLuxuryButton variant="ghost" @click="router.push('/admin')">
          <UiIcon name="arrow-left" :size="16" class="mr-2" />
          Back
        </UiLuxuryButton>
      </div>

      <!-- Navigation Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
        <UiBaseCard
          hover
          class="cursor-pointer"
          @click="router.push(`/business/${businessId}/edit`)"
        >
          <div class="text-center">
            <div class="text-4xl mb-3">✏️</div>
            <h3 class="text-lg font-semibold text-luxury-text dark:text-luxury-dark-text">
              Edit Business
            </h3>
            <p class="text-sm text-luxury-text-muted dark:text-luxury-dark-text-muted mt-1">
              Update business information
            </p>
          </div>
        </UiBaseCard>

        <UiBaseCard
          hover
          class="cursor-pointer"
          @click="router.push(`/business/${businessId}/categories`)"
        >
          <div class="text-center">
            <div class="text-4xl mb-3">📂</div>
            <h3 class="text-lg font-semibold text-luxury-text dark:text-luxury-dark-text">
              Categories
            </h3>
            <p class="text-sm text-luxury-text-muted dark:text-luxury-dark-text-muted mt-1">
              Manage categories
            </p>
          </div>
        </UiBaseCard>

        <UiBaseCard
          hover
          class="cursor-pointer"
          @click="router.push(`/business/${businessId}/products`)"
        >
          <div class="text-center">
            <div class="text-4xl mb-3">🛍️</div>
            <h3 class="text-lg font-semibold text-luxury-text dark:text-luxury-dark-text">
              Products
            </h3>
            <p class="text-sm text-luxury-text-muted dark:text-luxury-dark-text-muted mt-1">
              Manage products
            </p>
          </div>
        </UiBaseCard>

        <UiBaseCard
          hover
          class="cursor-pointer"
          @click="router.push(`/business/${businessId}/orders`)"
        >
          <div class="text-center">
            <div class="text-4xl mb-3">📦</div>
            <h3 class="text-lg font-semibold text-luxury-text dark:text-luxury-dark-text">
              Orders
            </h3>
            <p class="text-sm text-luxury-text-muted dark:text-luxury-dark-text-muted mt-1">
              View orders
            </p>
          </div>
        </UiBaseCard>
      </div>
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

// Fetch business details
const business = ref<any>(null)
const loading = ref(false)
const error = ref<string | null>(null)

const fetchBusiness = async () => {
  loading.value = true
  error.value = null
  try {
    const { adminNetwork } = await import('~/network/admin')
    business.value = await adminNetwork.fetchBusinessById(businessId.value)
  } catch (e) {
    error.value = 'Failed to load business'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchBusiness()
})

// Server-side SEO - admin pages should not be indexed
if (import.meta.server) {
  useSeoMeta({
    title: () => business.value ? `${business.value.name} - Admin` : 'Business Dashboard - Admin',
    robots: 'noindex, nofollow',
  })
}

watch(businessId, () => {
  fetchBusiness()
})
</script>
