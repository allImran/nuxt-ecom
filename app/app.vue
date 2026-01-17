<script setup lang="ts">

import { useThemeStore } from '@/stores/theme'

onMounted(() => {
  useThemeStore()
})

</script>

<template>
  <NuxtPage />
</template>
