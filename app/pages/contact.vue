<script setup lang="ts">
const businessBrandingStore = useBusinessBrandingStore()
const { business } = storeToRefs(businessBrandingStore)

// Get social links from business data with fallback to runtime config
const config = useRuntimeConfig()
const socialLinks = computed(() => ({
  facebook: business.value?.social?.facebook || config.public.facebookUrl as string,
  whatsapp: business.value?.social?.whatsapp || config.public.whatsappUrl as string
}))

const openLink = (url: string) => {
  window.open(url, '_blank')
}

// Page metadata - dynamic based on business name
const businessName = computed(() => business.value?.name || 'INDOORSHOPPING')

// Server-side optimized SEO
if (import.meta.server) {
  useSeoMeta({
    title: () => `Contact Us - ${businessName.value}`,
    description: () => `Get in touch with ${businessName.value} through Facebook or WhatsApp.`,
    ogTitle: () => `Contact Us - ${businessName.value}`,
    ogDescription: () => `Get in touch with ${businessName.value} through Facebook or WhatsApp.`,
    ogType: 'website',
    twitterCard: 'summary_large_image',
    twitterTitle: () => `Contact Us - ${businessName.value}`,
    twitterDescription: () => `Get in touch with ${businessName.value} through Facebook or WhatsApp.`,
  })
}

definePageMeta({
  layout: 'default'
})
</script>

<template>
  <div>
    <!-- Page Header -->
    <section class="py-12 lg:py-16 bg-luxury-surface dark:bg-luxury-dark-surface transition-colors duration-200">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center">
          <h1 class="text-4xl sm:text-5xl font-bold tracking-luxury text-luxury-text dark:text-luxury-dark-text mb-4">
            Contact Us
          </h1>
          <p class="text-lg text-luxury-text-muted dark:text-luxury-dark-text-muted max-w-2xl mx-auto">
            Get in touch with {{ business?.name || 'us' }} through your preferred platform
          </p>
        </div>
      </div>
    </section>

    <!-- Contact Cards Section -->
    <section class="py-16 lg:py-24 bg-luxury-bg dark:bg-luxury-dark-bg transition-colors duration-200">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <!-- Facebook Card -->
          <UiBaseCard
            v-if="socialLinks.facebook"
            hover
            class="cursor-pointer group"
            @click="openLink(socialLinks.facebook)"
          >
            <div class="flex flex-col items-center text-center space-y-6 py-8">
              <!-- Facebook Icon -->
              <div class="relative">
                <div class="absolute inset-0 bg-blue-600 opacity-0 group-hover:opacity-10 rounded-full transition-opacity duration-300 blur-xl"></div>
                <div class="relative flex items-center justify-center w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-luxury-surface dark:bg-luxury-dark-surface border-2 border-luxury-border dark:border-luxury-dark-border group-hover:border-blue-600 dark:group-hover:border-blue-500 transition-all duration-300">
                  <!-- Facebook SVG Icon -->
                  <svg viewBox="0 0 24 24" class="w-12 h-12 sm:w-14 sm:h-14 text-luxury-text dark:text-luxury-dark-text group-hover:text-blue-600 dark:group-hover:text-blue-500 transition-colors duration-300" fill="currentColor">
                    <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
                  </svg>
                </div>
              </div>

              <!-- Card Content -->
              <div class="space-y-3">
                <h3 class="text-2xl sm:text-3xl font-bold text-luxury-text dark:text-luxury-dark-text">
                  Facebook
                </h3>
                <p class="text-luxury-text-muted dark:text-luxury-dark-text-muted max-w-xs">
                  Follow us on Facebook for updates and promotions
                </p>
              </div>

              <!-- Action Button -->
              <UiLuxuryButton variant="outline" class="mt-2 group-hover:border-blue-600 dark:group-hover:border-blue-500">
                <span>Follow Us</span>
                <UiIcon name="arrow-up-right" :size="18" class="ml-2" />
              </UiLuxuryButton>
            </div>
          </UiBaseCard>

          <!-- WhatsApp Card -->
          <UiBaseCard
            v-if="socialLinks.whatsapp"
            hover
            class="cursor-pointer group"
            @click="openLink(socialLinks.whatsapp)"
          >
            <div class="flex flex-col items-center text-center space-y-6 py-8">
              <!-- WhatsApp Icon -->
              <div class="relative">
                <div class="absolute inset-0 bg-green-600 opacity-0 group-hover:opacity-10 rounded-full transition-opacity duration-300 blur-xl"></div>
                <div class="relative flex items-center justify-center w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-luxury-surface dark:bg-luxury-dark-surface border-2 border-luxury-border dark:border-luxury-dark-border group-hover:border-green-600 dark:group-hover:border-green-500 transition-all duration-300">
                  <!-- WhatsApp SVG Icon -->
                  <svg viewBox="0 0 24 24" class="w-12 h-12 sm:w-14 sm:h-14 text-luxury-text dark:text-luxury-dark-text group-hover:text-green-600 dark:group-hover:text-green-500 transition-colors duration-300" fill="currentColor">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                  </svg>
                </div>
              </div>

              <!-- Card Content -->
              <div class="space-y-3">
                <h3 class="text-2xl sm:text-3xl font-bold text-luxury-text dark:text-luxury-dark-text">
                  WhatsApp
                </h3>
                <p class="text-luxury-text-muted dark:text-luxury-dark-text-muted max-w-xs">
                  Chat with us on WhatsApp for instant support
                </p>
              </div>

              <!-- Action Button -->
              <UiLuxuryButton variant="outline" class="mt-2 group-hover:border-green-600 dark:group-hover:border-green-500">
                <span>Chat Now</span>
                <UiIcon name="arrow-up-right" :size="18" class="ml-2" />
              </UiLuxuryButton>
            </div>
          </UiBaseCard>
        </div>
      </div>
    </section>
  </div>
</template>
