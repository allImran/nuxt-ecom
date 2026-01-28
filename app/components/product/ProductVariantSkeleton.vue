<script setup lang="ts">
</script>

<template>
  <div class="space-y-3">
    <!-- Title skeleton -->
    <div class="h-6 w-32 bg-luxury-border dark:bg-luxury-dark-border rounded animate-pulse" />

    <!-- Variant items skeleton -->
    <div class="space-y-3">
      <div
        v-for="i in 2"
        :key="i"
        class="h-20 bg-luxury-border dark:bg-luxury-dark-border rounded-lg animate-pulse"
      />
    </div>
  </div>
</template>
