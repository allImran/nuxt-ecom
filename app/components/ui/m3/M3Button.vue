<script setup lang="ts">
interface Props {
  variant?: 'filled' | 'outlined' | 'text' | 'elevated'
  type?: 'button' | 'submit' | 'reset'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  loading?: boolean
  icon?: string
  block?: boolean
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'filled',
  type: 'button',
  size: 'md',
  disabled: false,
  loading: false,
  block: false
})

const buttonClasses = computed(() => {
  const variants = {
    filled: 'bg-primary text-on-primary shadow-md hover:shadow-lg active:scale-95',
    outlined: 'border border-outline-variant text-on-surface hover:bg-surface-container-low',
    text: 'text-primary hover:bg-primary/10',
    elevated: 'bg-surface-container-low text-primary shadow-sm hover:shadow-md'
  }

  const sizes = {
    sm: 'px-3 py-1.5 text-body-md rounded-md',
    md: 'px-6 py-3 text-body-lg rounded-full',
    lg: 'px-8 py-4 text-h3 rounded-full'
  }

  const base = 'font-semibold inline-flex items-center justify-center gap-2 transition-all duration-200'
  const disabledClass = props.disabled || props.loading ? 'opacity-60 cursor-not-allowed' : ''

  return `${base} ${variants[props.variant]} ${sizes[props.size]} ${disabledClass} ${props.block ? 'w-full' : ''}`
})
</script>

<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    :class="buttonClasses"
  >
    <span v-if="loading" class="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
    <span v-if="icon && !loading" class="material-symbols-outlined text-[20px]">{{ icon }}</span>
    <slot />
  </button>
</template>
