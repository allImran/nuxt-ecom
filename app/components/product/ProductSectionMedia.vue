<script setup lang="ts">
interface Props {
  filePaths: string[]
  getImageUrl: (path: string) => string
}

defineProps<Props>()
</script>

<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
    <div
      v-for="(path, index) in filePaths"
      :key="index"
      class="aspect-video bg-luxury-surface dark:bg-luxury-dark-surface rounded-lg overflow-hidden"
    >
      <img
        :src="getImageUrl(path)"
        alt=""
        loading="lazy"
        class="w-full h-full object-cover"
      />
    </div>
  </div>
</template>
