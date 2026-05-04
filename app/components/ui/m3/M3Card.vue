<script setup lang="ts">
interface Props {
  variant?: 'elevated' | 'filled' | 'outlined'
  padding?: 'none' | 'sm' | 'md' | 'lg'
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'filled',
  padding: 'lg'
})

const cardClasses = computed(() => {
  const variants = {
    elevated: 'bg-white rounded-xl shadow-lg border-0',
    filled: 'bg-white rounded-xl shadow-sm border border-outline-variant/30',
    outlined: 'bg-transparent rounded-xl border border-outline-variant'
  }
  const paddings = {
    none: '',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-card-padding'
  }
  return `${variants[props.variant]} ${paddings[props.padding]}`
})
</script>

<template>
  <div :class="[cardClasses, props.class]">
    <slot />
  </div>
</template>
