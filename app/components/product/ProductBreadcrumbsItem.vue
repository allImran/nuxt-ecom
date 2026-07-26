<script setup lang="ts">
interface Props {
  href?: string
  last?: boolean
}

withDefaults(defineProps<Props>(), {
  last: false
})
</script>

<template>
  <li class="flex items-center">
    <!-- Links get a little padding so the tap target is comfortable on touch. -->
    <NuxtLink
      v-if="href"
      :to="href"
      :class="[
        'inline-flex items-center gap-1.5 -mx-1 px-1 py-1 rounded text-sm font-medium tracking-luxury uppercase',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-luxury-gold',
        last
          ? 'text-luxury-text dark:text-luxury-dark-text'
          : 'text-luxury-text-muted dark:text-luxury-dark-text-muted hover:text-luxury-gold dark:hover:text-luxury-gold transition-colors'
      ]"
    >
      <slot />
    </NuxtLink>
    <span
      v-else
      :class="[
        'inline-flex items-center gap-1.5 text-sm font-medium tracking-luxury uppercase',
        last
          ? 'text-luxury-text dark:text-luxury-dark-text'
          : 'text-luxury-text-muted dark:text-luxury-dark-text-muted'
      ]"
    >
      <slot />
    </span>
    <span
      v-if="!last"
      class="mx-3 text-luxury-text-muted dark:text-luxury-dark-text-muted"
    >
      /
    </span>
  </li>
</template>
