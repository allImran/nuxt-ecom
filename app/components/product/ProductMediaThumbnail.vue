<script setup lang="ts">
interface Props {
  type: 'image' | 'video'
  url: string
  imageUrl?: string
  youtubeId?: string
  active?: boolean
}

defineProps<Props>()

const emit = defineEmits<{
  click: []
}>()
</script>

<template>
  <button
    :class="[
      'relative w-20 h-20 lg:w-full lg:aspect-square rounded-lg overflow-hidden border-2 transition-all duration-300 shrink-0',
      active
        ? 'border-luxury-gold'
        : 'border-luxury-border dark:border-luxury-dark-border hover:border-luxury-gold-muted'
    ]"
    @click="emit('click')"
  >
    <img
      v-if="type === 'image' && imageUrl"
      :src="imageUrl"
      alt=""
      loading="lazy"
      class="w-full h-full object-cover"
    />
    <div
      v-else-if="type === 'video' && youtubeId"
      class="w-full h-full flex items-center justify-center bg-luxury-surface dark:bg-luxury-dark-surface"
    >
      <UiIcon name="play-circle" :size="32" class="text-luxury-gold" />
    </div>
  </button>
</template>
