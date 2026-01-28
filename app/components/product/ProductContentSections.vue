<script setup lang="ts">
import type { ProductSection } from '~/network/public'

interface Props {
  sections?: ProductSection[]
  getImageUrl: (path: string) => string
}

defineProps<Props>()
</script>

<template>
  <div v-if="sections && sections.length > 0" class="mt-12 space-y-8">
    <section
      v-for="(section, index) in sections"
      :key="index"
      class="border-t border-luxury-border dark:border-luxury-dark-border pt-8"
    >
      <ProductSectionText
        v-if="section.type === 'text'"
        :content="section.content"
      />
      <ProductSectionMedia
        v-else-if="section.type === 'media' && section.file_paths"
        :file-paths="section.file_paths"
        :get-image-url="getImageUrl"
      />
    </section>
  </div>
</template>
