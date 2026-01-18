<template>
  <div class="flex h-screen bg-luxury-bg dark:bg-luxury-dark-bg overflow-hidden text-luxury-text dark:text-luxury-dark-text">
    <AdminSidebar />

    <!-- Main Content -->
    <main class="flex-1 overflow-auto bg-luxury-bg dark:bg-luxury-dark-bg transition-colors duration-200">
      <div class="container mx-auto p-6">
        <slot />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
// AdminLayout logic is now in AdminSidebar or handled by slot content for specific page logic
</script>
