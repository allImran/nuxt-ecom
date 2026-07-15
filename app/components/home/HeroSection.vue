<script setup lang="ts">
const businessBrandingStore = useBusinessBrandingStore()
const { business } = storeToRefs(businessBrandingStore)

// Small eyebrow above the headline. Prefer a warm, branded welcome when we know
// the business name; fall back to a neutral collection label otherwise.
const eyebrow = computed(() =>
  business.value?.name ? `Welcome to ${business.value.name}` : 'Curated Luxury Collection'
)

const scrollToProducts = () => {
  const element = document.getElementById('products-section')
  element?.scrollIntoView({ behavior: 'smooth' })
}
</script>

<template>
  <section class="relative flex items-center overflow-hidden min-h-[88vh] lg:min-h-screen transition-colors duration-200">
    <!-- Background Image -->
    <div class="absolute inset-0 z-0">
      <img
        src="/cover.webp"
        alt=""
        aria-hidden="true"
        width="1920"
        height="1080"
        fetchpriority="high"
        decoding="async"
        class="w-full h-full object-cover scale-105 blur-xs"
      />
    </div>

    <!-- Readability + seamless fade into the products section below -->
    <div class="absolute inset-0 bg-linear-to-b from-luxury-bg/85 via-luxury-bg/60 to-luxury-bg dark:from-luxury-dark-bg/85 dark:via-luxury-dark-bg/65 dark:to-luxury-dark-bg" />

    <!-- Decorative Elements -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none z-10">
      <div class="absolute -top-40 -right-40 w-80 h-80 bg-luxury-gold/10 rounded-full blur-3xl" />
      <div class="absolute -bottom-40 -left-40 w-96 h-96 bg-luxury-gold/10 rounded-full blur-3xl" />
    </div>

    <div class="container mx-auto px-4 sm:px-6 lg:px-8 relative z-20 py-24 lg:py-32">
      <div class="max-w-4xl mx-auto text-center">
        <!-- Eyebrow Badge -->
        <div class="inline-flex items-center gap-2 px-4 py-1.5 mb-8 rounded-full border border-luxury-gold/30 bg-luxury-gold/10 backdrop-blur-sm animate-fade-up">
          <span class="w-1.5 h-1.5 rounded-full bg-luxury-gold" />
          <span class="text-xs font-medium uppercase tracking-luxury text-luxury-gold">
            {{ eyebrow }}
          </span>
        </div>

        <!-- Heading -->
        <h1
          class="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-luxury text-luxury-text dark:text-luxury-dark-text mb-6 leading-[1.08] animate-fade-up"
          style="animation-delay: 80ms"
        >
          Discover Premium
          <span class="block mt-2 text-luxury-gold">Luxury Products</span>
        </h1>

        <!-- Description -->
        <p
          class="text-lg sm:text-xl text-luxury-text-muted dark:text-luxury-dark-text-muted mb-10 max-w-2xl mx-auto leading-relaxed animate-fade-up"
          style="animation-delay: 160ms"
        >
          {{ business?.slogan || 'Experience the finest selection of curated products. Quality meets elegance in every piece we offer.' }}
        </p>

        <!-- CTA Buttons -->
        <div
          class="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-up"
          style="animation-delay: 240ms"
        >
          <UiLuxuryButton
            @click="scrollToProducts"
            variant="primary"
            class="w-full sm:w-auto px-8 py-4 text-base"
          >
            Shop Now
          </UiLuxuryButton>
          <NuxtLink
            to="/about"
            class="w-full sm:w-auto px-8 py-4 text-base font-medium text-luxury-text dark:text-luxury-dark-text border-2 border-luxury-border dark:border-luxury-dark-border rounded-luxury hover:border-luxury-gold hover:text-luxury-gold text-center transition-all duration-300"
          >
            Learn More
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Scroll cue -->
    <button
      type="button"
      @click="scrollToProducts"
      aria-label="Scroll to products"
      class="hidden md:flex absolute bottom-8 left-1/2 -translate-x-1/2 z-20 items-center justify-center w-10 h-10 rounded-full border border-luxury-border dark:border-luxury-dark-border text-luxury-text-muted dark:text-luxury-dark-text-muted hover:text-luxury-gold hover:border-luxury-gold transition-colors duration-300 animate-bounce"
    >
      <UiIcon name="chevron-down" :size="20" />
    </button>
  </section>
</template>
