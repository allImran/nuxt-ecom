<script setup lang="ts">
import * as LucideIcons from 'lucide-vue-next'

interface Props {
  name: string
  size?: number | string
  color?: string
  strokeWidth?: number
  absoluteStrokeWidth?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  size: 24,
  strokeWidth: 2,
  absoluteStrokeWidth: false
})

// Get the icon component dynamically
const iconComponent = computed(() => {
  // Convert kebab-case to PascalCase (e.g., trash-2 -> Trash2)
  const iconName = props.name
    .split('-')
    .map(part => part.charAt(0).toUpperCase() + part.slice(1))
    .join('')
  return (LucideIcons as Record<string, unknown>)[iconName]
})
</script>

<template>
  <component
    :is="iconComponent"
    v-if="iconComponent"
    :size="typeof size === 'number' ? size : undefined"
    :class="typeof size === 'string' ? size : undefined"
    :color="color"
    :stroke-width="strokeWidth"
    :absolute-stroke-width="absoluteStrokeWidth"
  />
</template>
