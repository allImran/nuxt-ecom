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
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-20 w-20"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="1"
          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
    </div>
  </div>
</template>
