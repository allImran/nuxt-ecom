<script setup lang="ts">
interface Props {
  price?: string | null
  loading?: boolean
}

defineProps<Props>()
</script>

<template>
  <div v-if="loading" class="h-8 w-32 animate-pulse bg-luxury-border dark:bg-luxury-dark-border rounded" />
  <p v-else-if="price" class="text-3xl font-bold text-luxury-gold">
    {{ price }}
  </p>
  <p v-else class="text-lg text-luxury-text-muted dark:text-luxury-dark-text-muted">
    Contact for pricing
  </p>
</template>
