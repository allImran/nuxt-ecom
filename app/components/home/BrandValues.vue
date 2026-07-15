<script setup lang="ts">
// Brand ethos band shown beneath the product showcase. Uses neutral, aesthetic
// values (no operational promises like shipping/returns that may not apply to a
// given deployment) so it stays truthful for every business using the storefront.
const values = [
  {
    icon: 'sparkles',
    title: 'Curated Selection',
    description: 'Every piece is hand-picked for its quality, character, and lasting appeal.',
  },
  {
    icon: 'gem',
    title: 'Timeless Craftsmanship',
    description: 'Refined design and fine materials made to be enjoyed for years, not seasons.',
  },
  {
    icon: 'shield-check',
    title: 'Shop with Confidence',
    description: 'Thoughtful service and genuine support from first browse to final delivery.',
  },
] as const
</script>

<template>
  <section class="py-16 lg:py-24 bg-luxury-surface dark:bg-luxury-dark-surface border-y border-luxury-border dark:border-luxury-dark-border transition-colors duration-200">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="text-center mb-12 lg:mb-16">
        <div class="inline-flex items-center gap-3 mb-4">
          <span class="h-px w-8 bg-luxury-gold/40" />
          <span class="text-xs font-medium uppercase tracking-luxury text-luxury-gold">
            Our Philosophy
          </span>
          <span class="h-px w-8 bg-luxury-gold/40" />
        </div>
        <h2 class="text-3xl sm:text-4xl font-bold tracking-luxury text-luxury-text dark:text-luxury-dark-text mb-4">
          Crafted with intention
        </h2>
        <p class="text-luxury-text-muted dark:text-luxury-dark-text-muted max-w-2xl mx-auto">
          The objects you surround yourself with should reflect a commitment to quality and a passion for refined living.
        </p>
      </div>

      <!-- Value triad -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 max-w-5xl mx-auto">
        <div
          v-for="value in values"
          :key="value.title"
          class="text-center px-2"
        >
          <div class="inline-flex items-center justify-center w-14 h-14 mb-5 rounded-full bg-luxury-gold/10 text-luxury-gold ring-1 ring-luxury-gold/20">
            <UiIcon :name="value.icon" :size="26" :stroke-width="1.75" />
          </div>
          <h3 class="text-lg font-semibold text-luxury-text dark:text-luxury-dark-text mb-2">
            {{ value.title }}
          </h3>
          <p class="text-sm leading-relaxed text-luxury-text-muted dark:text-luxury-dark-text-muted max-w-xs mx-auto">
            {{ value.description }}
          </p>
        </div>
      </div>
    </div>
  </section>
</template>
