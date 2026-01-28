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
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-8 w-8 text-luxury-gold"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fill-rule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
          clip-rule="evenodd"
        />
      </svg>
    </div>
  </button>
</template>
