<script setup lang="ts">
interface MediaItem {
  type: 'image' | 'video'
  url: string
  youtubeId?: string
}

interface Props {
  media: MediaItem | null
  imageUrl?: string
  loading?: boolean
}

defineProps<Props>()
</script>

<template>
  <div class="w-full aspect-square bg-luxury-surface dark:bg-luxury-dark-surface rounded-lg overflow-hidden">
    <div
      v-if="loading"
      class="w-full h-full animate-pulse bg-luxury-border dark:bg-luxury-dark-border"
    />
    <iframe
      v-else-if="media?.type === 'video' && media.youtubeId"
      :src="`https://www.youtube.com/embed/${media.youtubeId}`"
      class="w-full h-full"
      frameborder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen
    />
    <img
      v-else-if="media?.type === 'image' && imageUrl"
      :src="imageUrl"
      alt="Product image"
      class="w-full h-full object-cover"
    />
    <div
      v-else
      class="w-full h-full flex items-center justify-center text-luxury-text-muted dark:text-luxury-dark-text-muted"
    >
      <UiIcon name="image" :size="80" />
    </div>
  </div>
</template>
