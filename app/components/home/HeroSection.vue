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

// --- Pointer parallax --------------------------------------------------------
// A single pointer source for the whole hero: eases normalised cursor position
// (-1..1) toward its target each frame (buttery motion), then writes it to CSS
// vars on the section (for the background + orbs) and passes it to the particle
// layer. Only enabled on fine-pointer, non-reduced-motion devices; touch just
// gets the ambient particle drift.
const sectionRef = ref<HTMLElement | null>(null)
const px = ref(0)
const py = ref(0)

let targetX = 0
let targetY = 0
let parallaxRaf = 0
let parallaxActive = false

const onPointerMove = (e: MouseEvent) => {
  const el = sectionRef.value
  if (!el) return
  const rect = el.getBoundingClientRect()
  targetX = ((e.clientX - rect.left) / rect.width) * 2 - 1
  targetY = ((e.clientY - rect.top) / rect.height) * 2 - 1
}

const tick = () => {
  // Lerp toward the target for smooth easing.
  px.value += (targetX - px.value) * 0.06
  py.value += (targetY - py.value) * 0.06
  const el = sectionRef.value
  if (el) {
    el.style.setProperty('--hero-px', px.value.toFixed(4))
    el.style.setProperty('--hero-py', py.value.toFixed(4))
  }
  parallaxRaf = requestAnimationFrame(tick)
}

onMounted(() => {
  const finePointer = window.matchMedia('(pointer: fine)').matches
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (!finePointer || reduceMotion) return
  parallaxActive = true
  window.addEventListener('mousemove', onPointerMove, { passive: true })
  parallaxRaf = requestAnimationFrame(tick)
})

onBeforeUnmount(() => {
  if (!parallaxActive) return
  window.removeEventListener('mousemove', onPointerMove)
  if (parallaxRaf) cancelAnimationFrame(parallaxRaf)
})
</script>

<template>
  <!-- Heights subtract the sticky 4rem header so the section ends at the fold
       instead of 64px below it — otherwise the scroll cue is cropped off. -->
  <section
    ref="sectionRef"
    class="relative flex items-center overflow-hidden min-h-[calc(88vh-4rem)] lg:min-h-[calc(100vh-4rem)] transition-colors duration-200"
  >
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
        class="hero-parallax-bg w-full h-full object-cover scale-110 blur-xs"
      />
    </div>

    <!-- Readability + seamless fade into the products section below -->
    <div class="absolute inset-0 bg-linear-to-b from-luxury-bg/85 via-luxury-bg/60 to-luxury-bg dark:from-luxury-dark-bg/85 dark:via-luxury-dark-bg/65 dark:to-luxury-dark-bg" />

    <!-- Decorative Elements -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none z-10">
      <div class="hero-orb-1 absolute -top-40 -right-40 w-80 h-80 bg-luxury-gold/10 rounded-full blur-3xl" />
      <div class="hero-orb-2 absolute -bottom-40 -left-40 w-96 h-96 bg-luxury-gold/10 rounded-full blur-3xl" />
      <!-- Interactive gold "luxury dust" -->
      <HomeHeroParticles :px="px" :py="py" />
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
      class="hidden md:flex absolute bottom-12 left-1/2 -translate-x-1/2 z-20 items-center justify-center w-10 h-10 rounded-full border border-luxury-border dark:border-luxury-dark-border text-luxury-text-muted dark:text-luxury-dark-text-muted hover:text-luxury-gold hover:border-luxury-gold transition-colors duration-300 animate-bounce"
    >
      <UiIcon name="chevron-down" :size="20" />
    </button>
  </section>
</template>

<style scoped>
/* Subtle pointer parallax driven by the --hero-px/--hero-py CSS vars set in
 * script. Layers move at different depths (bg least, orbs most) for a soft 3D
 * feel. The eased transition keeps it smooth even between rAF writes. */
.hero-parallax-bg {
  transform: translate3d(calc(var(--hero-px, 0) * 10px), calc(var(--hero-py, 0) * 10px), 0) scale(1.1);
  transition: transform 0.25s ease-out;
  will-change: transform;
}
.hero-orb-1 {
  transform: translate3d(calc(var(--hero-px, 0) * 24px), calc(var(--hero-py, 0) * 24px), 0);
  transition: transform 0.35s ease-out;
  will-change: transform;
}
.hero-orb-2 {
  transform: translate3d(calc(var(--hero-px, 0) * -18px), calc(var(--hero-py, 0) * -18px), 0);
  transition: transform 0.35s ease-out;
  will-change: transform;
}

@media (prefers-reduced-motion: reduce) {
  .hero-parallax-bg {
    transform: scale(1.1);
  }
  .hero-orb-1,
  .hero-orb-2 {
    transform: none;
  }
}
</style>
