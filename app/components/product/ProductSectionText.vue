<script setup lang="ts">
interface Props {
  content?: string
}

defineProps<Props>()
</script>

<template>
  <div
    v-if="content"
    class="prose prose-sm max-w-none dark:prose-invert"
    v-html="content"
  />
</template>
