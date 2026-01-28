<script setup lang="ts">
</script>

<template>
  <div class="space-y-4">
    <!-- Main display skeleton -->
    <div class="w-full aspect-square bg-luxury-border dark:bg-luxury-dark-border rounded-lg animate-pulse" />

    <!-- Thumbnails skeleton -->
    <div class="flex lg:flex-col gap-3">
      <div
        v-for="i in 4"
        :key="i"
        class="w-20 h-20 bg-luxury-border dark:bg-luxury-dark-border rounded-lg animate-pulse"
      />
    </div>
  </div>
</template>
