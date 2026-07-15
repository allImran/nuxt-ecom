<script setup lang="ts">
interface Props {
  variant?: 'horizontal' | 'vertical'
}

withDefaults(defineProps<Props>(), {
  variant: 'horizontal'
})

const { t } = useI18n()

const menuItems = computed(() => [
  { name: t('nav.home'), path: '/' },
  { name: t('nav.products'), path: '/products' },
  { name: t('nav.about'), path: '/about' },
  { name: t('nav.contact'), path: '/contact' }
])

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
      class="group text-sm font-medium transition-colors relative whitespace-nowrap"
      :class="[
        variant === 'horizontal' ? 'py-1' : '',
        currentPath === item.path
          ? 'text-luxury-gold'
          : 'text-luxury-text dark:text-luxury-dark-text hover:text-luxury-gold'
      ]"
    >
      {{ item.name }}
      <span
        v-if="variant === 'horizontal'"
        class="absolute -bottom-0.5 left-0 h-0.5 rounded-full bg-luxury-gold transition-all duration-300"
        :class="currentPath === item.path ? 'w-full' : 'w-0 group-hover:w-full'"
      />
    </NuxtLink>
  </nav>
</template>
