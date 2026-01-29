<script setup lang="ts">
const themeStore = useThemeStore()
const { isDark } = storeToRefs(themeStore)

const isMobileMenuOpen = ref(false)

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
}

// Close menu on route change
const route = useRoute()
watch(() => route.path, () => {
  closeMobileMenu()
})
</script>

<template>
  <header class="sticky top-0 z-50 w-full backdrop-blur-md bg-luxury-bg/80 dark:bg-luxury-dark-bg/80 border-b border-luxury-border dark:border-luxury-dark-border transition-colors duration-200">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <!-- Logo -->
        <div class="flex-shrink-0">
          <NuxtLink to="/" class="flex items-center space-x-2">
            <span class="text-xl font-bold tracking-luxury text-luxury-text dark:text-luxury-dark-text">
              URBAN<span class="text-luxury-gold">EASE</span>
            </span>
          </NuxtLink>
        </div>

        <!-- Desktop Navigation -->
        <div class="hidden md:block">
          <LayoutAppMenu variant="horizontal" />
        </div>

        <!-- Theme Toggle & Auth -->
        <div class="flex items-center space-x-4">
          <!-- Theme Toggle -->
          <button
            @click="themeStore.toggleTheme"
            class="p-2 rounded-lg text-luxury-text dark:text-luxury-dark-text hover:bg-luxury-surface dark:hover:bg-luxury-dark-surface transition-colors"
            aria-label="Toggle theme"
          >
            <UiIcon v-if="isDark" name="sun" :size="20" />
            <UiIcon v-else name="moon" :size="20" />
          </button>

          <!-- Auth Links (Desktop) -->
          <div class="hidden md:flex items-center space-x-3">
            <NuxtLink
              to="/login"
              class="text-sm font-medium text-luxury-text dark:text-luxury-dark-text hover:text-luxury-gold transition-colors"
            >
              Login
            </NuxtLink>
            <NuxtLink
              to="/signup"
              class="text-sm font-medium px-4 py-2 rounded-luxury bg-luxury-gold hover:bg-luxury-gold-hover text-white transition-colors"
            >
              Sign Up
            </NuxtLink>
          </div>

          <!-- Mobile Menu Button -->
          <button
            @click="toggleMobileMenu"
            class="md:hidden p-2 rounded-lg text-luxury-text dark:text-luxury-dark-text hover:bg-luxury-surface dark:hover:bg-luxury-dark-surface transition-colors focus:outline-none"
            aria-label="Open mobile menu"
          >
            <UiIcon v-if="!isMobileMenuOpen" name="menu" :size="24" />
            <UiIcon v-else name="x" :size="24" />
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile Drawer (Backdrop & Panel) -->
    <Teleport to="body">
      <div
        v-if="isMobileMenuOpen"
        class="fixed inset-0 z-[100] md:hidden"
      >
        <!-- Backdrop -->
        <transition
          enter-active-class="transition duration-300 ease-out"
          enter-from-class="opacity-0"
          enter-to-class="opacity-100"
          leave-active-class="transition duration-200 ease-in"
          leave-from-class="opacity-100"
          leave-to-class="opacity-0"
        >
          <div
            v-if="isMobileMenuOpen"
            class="fixed inset-0 bg-black/50 backdrop-blur-sm"
            @click="closeMobileMenu"
          />
        </transition>

        <!-- Panel -->
        <transition
          enter-active-class="transition duration-300 ease-out transform"
          enter-from-class="translate-x-full"
          enter-to-class="translate-x-0"
          leave-active-class="transition duration-200 ease-in transform"
          leave-from-class="translate-x-0"
          leave-to-class="translate-x-full"
        >
          <div
            v-if="isMobileMenuOpen"
            class="fixed right-0 top-0 h-full w-64 max-w-xs bg-luxury-bg dark:bg-luxury-dark-bg shadow-2xl overflow-y-auto"
          >
            <div class="p-6">
              <div class="flex items-center justify-between mb-8">
                <span class="text-lg font-bold tracking-luxury text-luxury-text dark:text-luxury-dark-text">
                  MENU
                </span>
                <button
                  @click="closeMobileMenu"
                  class="p-2 -mr-2 rounded-lg text-luxury-text dark:text-luxury-dark-text hover:bg-luxury-surface dark:hover:bg-luxury-dark-surface"
                >
                  <UiIcon name="x" :size="24" />
                </button>
              </div>

              <div class="space-y-6">
                <LayoutAppMenu variant="vertical" />

                <div class="pt-6 border-t border-luxury-border dark:border-luxury-dark-border space-y-4">
                  <NuxtLink
                    to="/login"
                    class="block text-center text-sm font-medium text-luxury-text dark:text-luxury-dark-text hover:text-luxury-gold transition-colors py-2"
                  >
                    Login
                  </NuxtLink>
                  <NuxtLink
                    to="/signup"
                    class="block text-center text-sm font-medium px-4 py-2 rounded-luxury bg-luxury-gold hover:bg-luxury-gold-hover text-white transition-colors shadow-luxury"
                  >
                    Sign Up
                  </NuxtLink>
                </div>
              </div>
            </div>
          </div>
        </transition>
      </div>
    </Teleport>
  </header>
</template>

