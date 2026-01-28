<script setup lang="ts">
interface Props {
  href?: string
  last?: boolean
}

defineProps<Props>()
</script>

<template>
  <li class="flex items-center">
    <component
      :is="href ? NuxtLink : 'span'"
      :href="href"
      :class="[
        'text-sm font-medium tracking-luxury uppercase',
        last
          ? 'text-luxury-text dark:text-luxury-dark-text'
          : 'text-luxury-text-muted dark:text-luxury-dark-text-muted hover:text-luxury-gold dark:hover:text-luxury-gold transition-colors'
      ]"
    >
      <slot />
    </component>
    <span
      v-if="!last"
      class="mx-3 text-luxury-text-muted dark:text-luxury-dark-text-muted"
    >
      /
    </span>
  </li>
</template>
