<script setup lang="ts">

import { useThemeStore } from '@/stores/theme'

onMounted(() => {
  useThemeStore()
})

</script>

<template>
  <NuxtLoadingIndicator color="blue" :height="4" :throttle="0" />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
