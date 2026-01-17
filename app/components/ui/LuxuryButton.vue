<script setup lang="ts">
interface Props {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  type?: 'button' | 'submit' | 'reset'
  block?: boolean
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  type: 'button',
  block: false,
  loading: false
})

const variantClasses = computed(() => {
  switch (props.variant) {
    case 'primary':
      return 'bg-luxury-gold hover:bg-luxury-gold-hover text-white shadow-md hover:shadow-lg'
    case 'secondary':
      return 'bg-luxury-surface dark:bg-luxury-dark-surface text-luxury-text dark:text-luxury-dark-text border border-luxury-border dark:border-luxury-dark-border hover:bg-gray-50 dark:hover:bg-white/5'
    case 'outline':
      return 'bg-transparent border border-luxury-gold text-luxury-gold hover:bg-luxury-gold hover:text-white'
    case 'ghost':
      return 'bg-transparent text-luxury-text-muted hover:text-luxury-gold'
    default:
      return 'bg-luxury-gold text-white'
  }
})
</script>

<template>
  <button
    :type="type"
    :disabled="loading"
    class="relative overflow-hidden transition-all duration-300 rounded-luxury px-8 py-3 font-medium tracking-wide flex items-center justify-center gap-2 group"
    :class="[
      variantClasses,
      block ? 'w-full' : '',
      loading ? 'opacity-80 cursor-wait' : ''
    ]"
  >
    <span v-if="loading" class="absolute inset-0 flex items-center justify-center bg-inherit">
      <svg class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    </span>
    <span :class="{ 'opacity-0': loading }" class="flex items-center gap-2">
      <slot />
    </span>
  </button>
</template>
