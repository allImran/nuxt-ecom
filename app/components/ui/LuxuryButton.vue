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
      <UiIcon name="loader-2" :size="20" class="animate-spin" />
    </span>
    <span :class="{ 'opacity-0': loading }" class="flex items-center gap-2">
      <slot />
    </span>
  </button>
</template>
