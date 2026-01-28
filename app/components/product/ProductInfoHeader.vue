<script setup lang="ts">
interface Props {
  name?: string
  category?: string
}

defineProps<Props>()
</script>

<template>
  <div class="space-y-2">
    <h1 class="text-3xl sm:text-4xl font-bold tracking-luxury text-luxury-text dark:text-luxury-dark-text">
      {{ name || 'Product Name' }}
    </h1>
    <p v-if="category" class="text-sm font-medium text-luxury-gold uppercase tracking-luxury">
      {{ category }}
    </p>
  </div>
</template>
