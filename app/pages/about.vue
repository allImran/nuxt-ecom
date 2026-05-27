<script setup lang="ts">
// Page metadata
const { t } = useI18n()

// Server-side optimized SEO
if (import.meta.server) {
  useSeoMeta({
    title: `INDOORSHOPPING - ${t('about.title')}`,
    description: t('about.hero.subtitle'),
    ogTitle: `INDOORSHOPPING - ${t('about.title')}`,
    ogDescription: t('about.hero.subtitle'),
    ogType: 'website',
    twitterCard: 'summary_large_image',
    twitterTitle: `INDOORSHOPPING - ${t('about.title')}`,
    twitterDescription: t('about.hero.subtitle'),
  })
}

// Define layout for this page
definePageMeta({
  layout: 'default'
})
</script>

<template>
  <div>
    <!-- Hero Section -->
    <section class="relative bg-linear-to-br from-luxury-surface to-luxury-bg dark:from-luxury-dark-surface dark:to-luxury-dark-bg py-16 lg:py-24 transition-colors duration-200">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="max-w-4xl mx-auto text-center">
          <!-- Heading -->
          <h1 class="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-luxury text-luxury-text dark:text-luxury-dark-text mb-4">
            {{ $t('about.hero.title') }}
          </h1>

          <!-- Subtitle -->
          <p class="text-lg sm:text-xl text-luxury-text-muted dark:text-luxury-dark-text-muted mb-8 max-w-2xl mx-auto leading-relaxed">
            {{ $t('about.hero.subtitle') }}
          </p>

          <!-- Decorative Line -->
          <div class="flex items-center justify-center gap-4">
            <div class="h-px w-16 bg-linear-to-r from-transparent to-luxury-gold" />
            <div class="w-2 h-2 rounded-full bg-luxury-gold" />
            <div class="h-px w-16 bg-linear-to-l from-transparent to-luxury-gold" />
          </div>
        </div>
      </div>

      <!-- Decorative Elements -->
      <div class="absolute inset-0 overflow-hidden pointer-events-none">
        <div class="absolute -top-40 -right-40 w-80 h-80 bg-luxury-gold/5 rounded-full blur-3xl" />
        <div class="absolute -bottom-40 -left-40 w-80 h-80 bg-luxury-gold/5 rounded-full blur-3xl" />
      </div>
    </section>

    <!-- Mission Section -->
    <section class="py-16 lg:py-20 bg-luxury-bg dark:bg-luxury-dark-bg transition-colors duration-200">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="max-w-3xl mx-auto">
          <UiBaseCard>
            <!-- Section Title -->
            <h2 class="text-3xl font-bold text-luxury-text dark:text-luxury-dark-text mb-6 text-center">
              {{ $t('about.mission.title') }}
            </h2>

            <!-- Mission Description -->
            <p class="text-lg text-luxury-text-muted dark:text-luxury-dark-text-muted leading-relaxed text-center">
              {{ $t('about.mission.description') }}
            </p>
          </UiBaseCard>
        </div>
      </div>
    </section>

    <!-- Philosophy Section -->
    <section class="py-16 lg:py-20 bg-luxury-surface dark:bg-luxury-dark-surface transition-colors duration-200">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="max-w-6xl mx-auto">
          <!-- Section Title -->
          <h2 class="text-3xl font-bold text-luxury-text dark:text-luxury-dark-text mb-4 text-center">
            {{ $t('about.philosophy.title') }}
          </h2>

          <!-- Philosophy Description -->
          <p class="text-lg text-luxury-text-muted dark:text-luxury-dark-text-muted mb-12 max-w-3xl mx-auto leading-relaxed text-center">
            {{ $t('about.philosophy.description') }}
          </p>

          <!-- Philosophy Items -->
         
        </div>
      </div>
    </section>

    <!-- Journey Section -->
    <section class="py-16 lg:py-20 bg-luxury-bg dark:bg-luxury-dark-bg transition-colors duration-200">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8">
        <div class="max-w-4xl mx-auto">
          <UiBaseCard>
            <!-- Section Title -->
            <h2 class="text-3xl font-bold text-luxury-text dark:text-luxury-dark-text mb-6 text-center">
              {{ $t('about.journey.title') }}
            </h2>

            <!-- Journey Description -->
            <p class="text-lg text-luxury-text-muted dark:text-luxury-dark-text-muted leading-relaxed text-center">
              {{ $t('about.journey.description') }}
            </p>

            <!-- Decorative Element -->
            <div class="flex items-center justify-center mt-8 gap-4">
              <div class="h-px w-20 bg-linear-to-r from-transparent to-luxury-gold/50" />
              <div class="flex items-center gap-2">
                <div class="w-1.5 h-1.5 rounded-full bg-luxury-gold" />
                <div class="w-1.5 h-1.5 rounded-full bg-luxury-gold" />
                <div class="w-1.5 h-1.5 rounded-full bg-luxury-gold" />
              </div>
              <div class="h-px w-20 bg-linear-to-l from-transparent to-luxury-gold/50" />
            </div>
          </UiBaseCard>
        </div>
      </div>
    </section>
  </div>
</template>
