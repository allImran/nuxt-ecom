<script setup lang="ts">
const themeStore = useThemeStore()
const { isDark } = storeToRefs(themeStore)
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
            <svg v-if="isDark" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          </button>

          <!-- Auth Links -->
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
          <button class="md:hidden p-2 rounded-lg text-luxury-text dark:text-luxury-dark-text">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Mobile Navigation -->
      <div class="md:hidden py-3 border-t border-luxury-border dark:border-luxury-dark-border">
        <LayoutAppMenu variant="vertical" />
      </div>
    </div>
  </header>
</template>
