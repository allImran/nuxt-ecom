<script setup lang="ts">
interface MediaItem {
  type: 'image' | 'video'
  url: string
  youtubeId?: string
}

interface Props {
  media: MediaItem[]
  selectedIndex?: number
  loading?: boolean
  getImageUrl: (path: string) => string
}

defineProps<Props>()

const emit = defineEmits<{
  selectMedia: [index: number]
}>()
</script>

<template>
  <div class="space-y-4">
    <!-- Main Display -->
    <ProductMediaGalleryMain
      :media="media[selectedIndex] || null"
      :image-url="media[selectedIndex] && media[selectedIndex].type === 'image' ? getImageUrl(media[selectedIndex].url) : undefined"
      :loading="loading"
    />

    <!-- Thumbnails -->
    <ProductMediaGalleryThumbnails>
      <ProductMediaThumbnail
        v-for="(item, index) in media"
        :key="index"
        :type="item.type"
        :url="item.url"
        :image-url="item.type === 'image' ? getImageUrl(item.url) : undefined"
        :youtube-id="item.youtubeId"
        :active="index === selectedIndex"
        @click="emit('selectMedia', index)"
      />
    </ProductMediaGalleryThumbnails>
  </div>
</template>
