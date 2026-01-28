<script setup lang="ts">
interface Attribute {
  key: string
  value: string
}

interface Props {
  attributes: Attribute[]
}

defineProps<Props>()
</script>

<template>
  <div class="space-y-1">
    <div
      v-for="attr in attributes"
      :key="attr.key"
      class="flex justify-between items-center text-sm"
    >
      <span class="text-luxury-text-muted dark:text-luxury-dark-text-muted capitalize">
        {{ attr.key }}:
      </span>
      <span class="text-luxury-text dark:text-luxury-dark-text font-medium">
        {{ attr.value }}
      </span>
    </div>
  </div>
</template>
