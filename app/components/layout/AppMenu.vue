<script setup lang="ts">
interface Props {
  variant?: 'horizontal' | 'vertical'
}

withDefaults(defineProps<Props>(), {
  variant: 'horizontal'
})

const menuItems = [
  { name: 'Home', path: '/' },
  { name: 'Products', path: '/products' },
  { name: 'About', path: '/about' },
  { name: 'Contact', path: '/contact' }
]

const currentPath = computed(() => useRoute().path)
</script>

<template>
  <nav :class="[
    'flex',
    variant === 'vertical' ? 'flex-col space-y-3' : 'items-center space-x-8'
  ]">
    <NuxtLink
      v-for="item in menuItems"
      :key="item.path"
      :to="item.path"
      class="text-sm font-medium transition-colors relative whitespace-nowrap"
      :class="[
        currentPath === item.path
          ? 'text-luxury-gold'
          : 'text-luxury-text dark:text-luxury-dark-text hover:text-luxury-gold'
      ]"
    >
      {{ item.name }}
      <span
        v-if="currentPath === item.path && variant === 'horizontal'"
        class="absolute -bottom-1 left-0 right-0 h-0.5 bg-luxury-gold"
      />
    </NuxtLink>
  </nav>
</template>
