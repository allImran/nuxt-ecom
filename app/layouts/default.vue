<template>
  <div class="min-h-screen flex flex-col bg-luxury-bg dark:bg-luxury-dark-bg text-luxury-text dark:text-luxury-dark-text transition-colors duration-200">
    <!-- SEO Meta Tags for i18n -->
    <SeoI18nMetaTags />

    <!-- Header -->
    <LayoutAppHeader />

    <!-- Main Content -->
    <main class="flex-1 w-full">
      <slot />
    </main>

    <!-- Footer -->
    <LayoutAppFooter />
  </div>
</template>

<script setup lang="ts">
// Default layout for public pages
</script>
