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

    <!-- Edit Form -->
    <div v-else-if="currentBusiness">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-luxury-text dark:text-luxury-dark-text">
            Edit Business
          </h1>
          <p class="text-luxury-text-muted dark:text-luxury-dark-text-muted mt-1">
            {{ businessForm.name || 'Untitled Business' }}
          </p>
        </div>
        <div class="flex items-center gap-3">
          <div v-if="saving" class="flex items-center gap-2 text-sm text-luxury-text-muted dark:text-luxury-dark-text-muted">
            <UiIcon name="loader-2" :size="14" class="animate-spin" />
            Saving...
          </div>
          <UiLuxuryButton variant="ghost" @click="router.push(`/business/${businessId}`)">
            <UiIcon name="arrow-left" :size="16" class="mr-2" />
            Back to Dashboard
          </UiLuxuryButton>
        </div>
      </div>

      <!-- Form -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        <!-- Left Column: Main Info -->
        <div class="lg:col-span-2 space-y-6">
          <UiBaseCard class="p-6">
            <h2 class="text-xl font-semibold text-luxury-text dark:text-luxury-dark-text mb-6">
              Basic Information
            </h2>

            <div class="space-y-6">
              <!-- Name -->
              <UiLuxuryInput
                v-model="businessForm.name"
                label="Business Name"
                placeholder="Enter business name"
                id="business-name"
                @input="handleFieldChange"
              />

              <!-- Slug -->
              <UiLuxuryInput
                v-model="businessForm.slug"
                label="Slug"
                placeholder="business-slug"
                id="business-slug"
                @input="handleFieldChange"
              />

              <!-- Slogan -->
              <UiLuxuryInput
                v-model="businessForm.slogan"
                label="Slogan"
                placeholder="Your tagline or slogan"
                id="business-slogan"
                @input="handleFieldChange"
              />

              <!-- Email -->
              <UiLuxuryInput
                v-model="businessForm.email"
                type="email"
                label="Email"
                placeholder="contact@example.com"
                id="business-email"
                @input="handleFieldChange"
              />

              <!-- Address -->
              <UiLuxuryInput
                v-model="businessForm.address"
                label="Address"
                placeholder="Business address"
                id="business-address"
                @input="handleFieldChange"
              />

              <!-- Primary Color -->
              <div>
                <label class="block text-sm font-medium text-luxury-text dark:text-luxury-dark-text mb-2">
                  Primary Color
                </label>
                <div class="flex items-center gap-3">
                  <input
                    v-model="businessForm.primary_color"
                    type="color"
                    class="w-12 h-12 rounded-luxury cursor-pointer border border-luxury-border dark:border-luxury-dark-border"
                    @input="handleFieldChange"
                  />
                  <UiLuxuryInput
                    v-model="businessForm.primary_color"
                    placeholder="#000000"
                    id="business-color"
                    @input="handleFieldChange"
                  />
                </div>
              </div>
            </div>
          </UiBaseCard>

          <!-- Social Links -->
          <UiBaseCard class="p-6">
            <h2 class="text-xl font-semibold text-luxury-text dark:text-luxury-dark-text mb-6">
              Social Media Links
            </h2>
            <AdminBusinessSocialLinks
              v-model="businessForm.social"
              @update:model-value="handleSocialChange"
            />
          </UiBaseCard>
        </div>

        <!-- Right Column: Logo -->
        <div class="space-y-6">
          <UiBaseCard class="p-6">
            <h2 class="text-xl font-semibold text-luxury-text dark:text-luxury-dark-text mb-6">
              Logo
            </h2>
            <AdminBusinessLogoUploader
              v-model="businessForm.logo"
              @update:model-value="handleLogoChange"
            />
          </UiBaseCard>

          <!-- Status -->
          <UiBaseCard class="p-6">
            <h2 class="text-xl font-semibold text-luxury-text dark:text-luxury-dark-text mb-4">
              Status
            </h2>
            <div class="flex items-center justify-between">
              <span class="text-luxury-text-muted dark:text-luxury-dark-text-muted">
                Active
              </span>
              <button
                type="button"
                class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors"
                :class="businessForm.is_active ? 'bg-luxury-gold' : 'bg-luxury-border dark:bg-luxury-dark-border'"
                @click="toggleStatus"
              >
                <span
                  class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
                  :class="businessForm.is_active ? 'translate-x-6' : 'translate-x-1'"
                />
              </button>
            </div>
          </UiBaseCard>
        </div>
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

// Use business edit view model
const {
  businessForm,
  loading,
  saving,
  uploading,
  error,
  currentBusiness,
  fetchBusiness,
  debouncedSave,
  uploadLogo
} = useBusinessEditViewModel()

// Fetch business data on mount
onMounted(async () => {
  await fetchBusiness(businessId.value)
})

// Watch for route changes
watch(businessId, async (newId) => {
  if (newId) {
    await fetchBusiness(newId)
  }
})

// Handle field changes with debounced save
const handleFieldChange = () => {
  debouncedSave(businessId.value)
}

// Handle social links change
const handleSocialChange = () => {
  debouncedSave(businessId.value)
}

// Handle logo change - instant save
const handleLogoChange = async () => {
  await debouncedSave(businessId.value)
}

// Toggle business status
const toggleStatus = () => {
  businessForm.is_active = !businessForm.is_active
  debouncedSave(businessId.value)
}
</script>
