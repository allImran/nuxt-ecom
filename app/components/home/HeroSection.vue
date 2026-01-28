<script setup lang="ts">
const scrollToProducts = () => {
  const element = document.getElementById('products-section')
  element?.scrollIntoView({ behavior: 'smooth' })
}
</script>

<template>
  <section class="relative bg-gradient-to-br from-luxury-surface to-luxury-bg dark:from-luxury-dark-surface dark:to-luxury-dark-bg py-20 lg:py-32 transition-colors duration-200">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <div class="max-w-4xl mx-auto text-center">
        <!-- Welcome Badge -->
        <div class="inline-flex items-center px-32 py-2 rounded-full bg-luxury-gold/10 border border-luxury-gold/30 mb-6">
          <span class="text-sm font-medium text-luxury-gold tracking-wide">
            Welcome to LuxeStore
          </span>
        </div>

        <!-- Heading -->
        <h1 class="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-luxury text-luxury-text dark:text-luxury-dark-text mb-6">
          Discover Premium
          <span class="block text-luxury-gold mt-2">Luxury Products</span>
        </h1>

        <!-- Description -->
        <p class="text-lg sm:text-xl text-luxury-text-muted dark:text-luxury-dark-text-muted mb-10 max-w-2xl mx-auto leading-relaxed">
          Experience the finest selection of curated products. Quality meets elegance in every piece we offer.
        </p>

        <!-- CTA Buttons -->
        <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
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

    <!-- Decorative Elements -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute -top-40 -right-40 w-80 h-80 bg-luxury-gold/5 rounded-full blur-3xl" />
      <div class="absolute -bottom-40 -left-40 w-80 h-80 bg-luxury-gold/5 rounded-full blur-3xl" />
    </div>
  </section>
</template>
