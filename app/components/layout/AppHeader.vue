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
            <UiIcon v-if="isDark" name="sun" :size="20" />
            <UiIcon v-else name="moon" :size="20" />
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
            <UiIcon name="menu" :size="24" />
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
