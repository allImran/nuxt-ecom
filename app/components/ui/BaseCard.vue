<script setup lang="ts">
interface Props {
  variant?: 'default' | 'dashed'
  hover?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  hover: false
})
</script>

<template>
  <div 
    class="rounded-luxury transition-all duration-300 p-6 flex flex-col relative"
    :class="[
      variant === 'default' 
        ? 'bg-luxury-surface dark:bg-luxury-dark-surface border border-luxury-border dark:border-luxury-dark-border shadow-luxury dark:shadow-luxury-dark' 
        : 'bg-luxury-surface/50 dark:bg-luxury-dark-surface/50 border-2 border-dashed border-luxury-border dark:border-luxury-dark-border',
      hover 
        ? 'hover:border-luxury-gold dark:hover:border-luxury-gold group cursor-pointer' 
        : '',
      variant === 'dashed' && hover
        ? 'hover:bg-luxury-surface dark:hover:bg-luxury-dark-surface'
        : ''
    ]"
  >
    <slot />
  </div>
</template>
