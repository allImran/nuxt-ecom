<script setup lang="ts">

import { useThemeStore } from '@/stores/theme'

onMounted(() => {
  useThemeStore()
})

</script>

<template>
  <NuxtLoadingIndicator color="#D4AF37" :height="3" :throttle="0" />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
