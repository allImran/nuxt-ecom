<script setup lang="ts">
interface Segment {
  value: string
  label: string
  disabled?: boolean
}

interface Props {
  modelValue: string
  segments: Segment[]
  class?: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

function isActive(value: string): boolean {
  return props.modelValue === value
}

function selectSegment(value: string) {
  const segment = props.segments.find(s => s.value === value)
  if (!segment?.disabled) {
    emit('update:modelValue', value)
  }
}
</script>

<template>
  <div :class="props.class" class="flex p-1 rounded-lg">
    <button
      v-for="segment in segments"
      :key="segment.value"
      type="button"
      :disabled="segment.disabled"
      class="px-4 py-1.5 rounded-md text-body-md font-semibold transition-all flex-1"
      :class="isActive(segment.value)
        ? 'bg-white text-primary shadow-sm'
        : 'text-on-surface-variant hover:text-on-surface'"
      @click="selectSegment(segment.value)"
    >
      {{ segment.label }}
    </button>
  </div>
</template>
