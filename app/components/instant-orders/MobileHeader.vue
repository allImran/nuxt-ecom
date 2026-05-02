<script setup lang="ts">
interface Props {
  businessId: string
  showSearch?: boolean
  showFilters?: boolean
  searchQuery?: string
  statusFilter?: string
}

const props = withDefaults(defineProps<Props>(), {
  showSearch: false,
  showFilters: false,
  searchQuery: '',
  statusFilter: ''
})

const emit = defineEmits<{
  'back-click': []
  'search-click': []
  'filters-click': []
  'update:searchQuery': [value: string]
  'update:statusFilter': [value: string]
}>()

const router = useRouter()
</script>

<template>
  <header class="fixed top-0 left-0 w-full z-50 bg-luxury-bg dark:bg-luxury-dark-bg border-b border-luxury-border dark:border-luxury-dark-border flex items-center justify-between px-4 py-3 h-16">
    <div class="flex items-center gap-3">
      <button
        @click="emit('back-click')"
        class="p-2 -ml-2 hover:bg-luxury-border dark:hover:bg-luxury-dark-border/50 rounded-full transition-opacity active:opacity-70"
      >
        <UiIcon name="arrow-left" :size="20" class="text-luxury-accent dark:text-luxury-dark-accent" />
      </button>
      <h1 class="font-manrope text-sm font-semibold tracking-tight text-luxury-text dark:text-luxury-dark-text">
        Orders
      </h1>
    </div>
    <div class="flex items-center gap-2">
      <button
        @click="emit('search-click')"
        class="p-2 hover:bg-luxury-border dark:hover:bg-luxury-dark-border/50 rounded-full transition-colors"
      >
        <UiIcon name="search" :size="20" class="text-luxury-text-muted dark:text-luxury-dark-text-muted" />
      </button>
      <button
        @click="emit('filters-click')"
        class="p-2 hover:bg-luxury-border dark:hover:bg-luxury-dark-border/50 rounded-full transition-colors"
      >
        <UiIcon name="sliders-horizontal" :size="20" class="text-luxury-text-muted dark:text-luxury-dark-text-muted" />
      </button>
    </div>
  </header>

    <slot />
</template>
