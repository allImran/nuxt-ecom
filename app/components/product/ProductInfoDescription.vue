<script setup lang="ts">
interface Props {
  description?: string | null
}

defineProps<Props>()
</script>

<template>
  <p v-if="description" class="text-luxury-text-muted dark:text-luxury-dark-text-muted leading-relaxed">
    {{ description }}
  </p>
</template>
